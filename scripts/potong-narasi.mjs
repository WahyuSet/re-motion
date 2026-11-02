// Potong satu file narasi TTS utuh menjadi audio per scene.
//
// Pakai: node scripts/potong-narasi.mjs borobudur "D:\Downloads\narasi borobudur.mp3"
// Hasil: public/audio/<slug>/01.wav, 02.wav, ... (satu per scene yang punya narasi)
// Opsi:  --metode whisper|jeda   (default whisper, otomatis jatuh ke jeda kalau Whisper tidak tersedia)
//        --model small           (model faster-whisper)
//        --noise -35             (dB, batas dianggap hening)   --min-silence 0.25   (detik)
//
// Metode whisper: audio ditranskrip dengan timestamp per kata (faster-whisper, Python), dicocokkan
//   dengan teks narasi tiap scene, lalu titik potong digeser ke jeda hening terdekat. Tidak bergantung
//   pada panjang jeda antar paragraf.
// Metode jeda: N-1 jeda hening TERPANJANG dianggap batas scene. Hanya andal kalau TTS memberi jeda
//   antar paragraf yang jelas lebih panjang dari jeda antar kalimat.

import {execFile} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {parseArgs, promisify} from 'node:util';
import {ffmpeg} from './lib/ffmpeg.mjs';
import {loadScript} from './lib/load-script.mjs';

const run = promisify(execFile);

const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {
    metode: {type: 'string', default: 'whisper'},
    model: {type: 'string', default: 'small'},
    noise: {type: 'string', default: '-35'},
    'min-silence': {type: 'string', default: '0.25'},
  },
});

const [slug, input] = positionals;
if (!slug || !input) {
  console.error('Pakai: node scripts/potong-narasi.mjs <slug> <file-audio>');
  process.exit(1);
}

const PAD_BEFORE = 0.05;
const PAD_AFTER = 0.1;

const detectSilences = async () => {
  const log = await ffmpeg([
    '-i',
    input,
    '-af',
    `silencedetect=noise=${values.noise}dB:d=${values['min-silence']}`,
    '-f',
    'null',
    '-',
  ]);
  const duration = log.match(/Duration: (\d+):(\d+):([\d.]+)/);
  if (!duration) throw new Error('Durasi audio tidak terbaca. Pastikan file audionya valid.');
  const total = Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]);

  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  // Hening di ujung file tidak punya silence_end
  const silences = starts.map((start, i) => ({start, end: ends[i] ?? total}));
  return {total, silences};
};

// ---- Metode jeda -------------------------------------------------------------------------------

const cutsBySilence = (interior, needed) => {
  if (interior.length < needed) {
    throw new Error(
      `Butuh ${needed} jeda antar paragraf, tapi hanya ketemu ${interior.length} jeda. ` +
        'Generate ulang TTS dengan jeda lebih panjang antar paragraf, atau coba --min-silence 0.15 / --noise -30.',
    );
  }
  const byLength = [...interior].sort((a, b) => b.end - b.start - (a.end - a.start));
  const boundaries = byLength.slice(0, needed).sort((a, b) => a.start - b.start);
  const shortestBoundary = Math.min(...boundaries.map((s) => s.end - s.start));
  const longestOther = Math.max(0, ...byLength.slice(needed).map((s) => s.end - s.start));

  const notes = [`Jeda batas scene terpendek ${shortestBoundary.toFixed(2)} dtk, jeda lain terpanjang ${longestOther.toFixed(2)} dtk.`];
  if (longestOther > 0 && shortestBoundary / longestOther < 1.3) {
    notes.push('⚠ Jeda antar paragraf hampir sama dengan jeda antar kalimat, potongan bisa meleset. Coba --metode whisper.');
  }
  return {cuts: boundaries.map((s) => ({prevEnd: s.start, nextStart: s.end})), notes};
};

// ---- Metode whisper ----------------------------------------------------------------------------

const normalize = (word) =>
  word
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]/gu, '');


const similarity = (a, b) => {
  if (a === b) return 2;
  let prefix = 0;
  while (prefix < a.length && a[prefix] === b[prefix]) prefix++;
  return prefix >= 4 || (prefix >= 2 && (a.startsWith(b) || b.startsWith(a))) ? 1 : -1;
};

// Needleman-Wunsch: pasangkan kata naskah dengan kata hasil transkrip, toleran terhadap salah dengar
// (misalnya "1814" vs "seribu delapan ratus empat belas").
const align = (scriptTokens, heard) => {
  const n = scriptTokens.length;
  const m = heard.length;
  const GAP = -1;
  const score = Array.from({length: n + 1}, (_, i) => new Float64Array(m + 1).fill(0).map((_, j) => (i + j) * GAP));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      score[i][j] = Math.max(
        score[i - 1][j - 1] + similarity(scriptTokens[i - 1], heard[j - 1].token),
        score[i - 1][j] + GAP,
        score[i][j - 1] + GAP,
      );
    }
  }
  const pairs = new Map();
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    const s = similarity(scriptTokens[i - 1], heard[j - 1].token);
    if (score[i][j] === score[i - 1][j - 1] + s) {
      if (s > 0) pairs.set(i - 1, j - 1);
      i--;
      j--;
    } else if (score[i][j] === score[i - 1][j] + GAP) {
      i--;
    } else {
      j--;
    }
  }
  return pairs;
};

const findPython = async () => {
  for (const cmd of [process.env.PYTHON, 'python', 'py', 'python3'].filter(Boolean)) {
    try {
      await run(cmd, ['-c', 'import faster_whisper']);
      return cmd;
    } catch {}
  }
  return null;
};

const transcribe = async (python, scenes) => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'narasi-'));
  const scriptFile = path.join(tmp, 'naskah.txt');
  const outFile = path.join(tmp, 'kata.json');
  await fs.writeFile(scriptFile, scenes.map((s) => s.narasi).join('\n\n'));
  console.log(`Transkrip audio dengan faster-whisper (${values.model}) ...`);
  await run(python, [path.resolve('scripts/lib/transkrip.py'), input, outFile, scriptFile, values.model], {
    maxBuffer: 64 * 1024 * 1024,
  });
  const words = JSON.parse(await fs.readFile(outFile, 'utf8'));
  await fs.rm(tmp, {recursive: true, force: true});
  return words;
};

const cutsByWhisper = async (python, scenes, silences) => {
  const words = await transcribe(python, scenes);
  const heard = words.map((w) => ({...w, token: normalize(w.word)})).filter((w) => w.token);

  // Kata naskah persis seperti di `narasi` (split spasi), supaya indeksnya cocok dengan subtitle di video.
  const scriptTokens = [];
  const sceneOf = [];
  const wordOf = [];
  scenes.forEach((s, k) => {
    s.narasi.split(/\s+/).forEach((word, w) => {
      const token = normalize(word);
      if (!token) return;
      scriptTokens.push(token);
      sceneOf.push(k);
      wordOf.push(w);
    });
  });

  const pairs = align(scriptTokens, heard);
  const matchRate = pairs.size / scriptTokens.length;

  const anchorsOf = (k) =>
    [...pairs.entries()].filter(([si]) => sceneOf[si] === k).sort((a, b) => a[0] - b[0]).map(([, hi]) => heard[hi]);

  const cuts = [];
  for (let k = 1; k < scenes.length; k++) {
    const prev = anchorsOf(k - 1);
    const next = anchorsOf(k);
    if (!prev.length || !next.length) {
      throw new Error(`Narasi scene ${k} atau ${k + 1} tidak terdengar di audio. Pastikan audio sesuai naskah terbaru.`);
    }
    const prevEnd = prev[prev.length - 1].end;
    const nextStart = next[0].start;
    // Geser titik potong ke jeda hening yang paling panjang di sekitar pergantian kalimat
    const nearby = silences.filter((s) => s.end > prevEnd - 0.3 && s.start < nextStart + 0.3);
    const best = nearby.sort((a, b) => b.end - b.start - (a.end - a.start))[0];
    cuts.push(best ? {prevEnd: best.start, nextStart: best.end} : {prevEnd, nextStart});
  }

  // Kata yang terdengar di tiap potongan, buat dicek manusia. Pakai titik tengah kata karena
  // timestamp awal kata dari Whisper sering sedikit terlalu awal.
  const heardText = (from, to) =>
    words
      .filter((w) => (w.start + w.end) / 2 >= from && (w.start + w.end) / 2 < to)
      .map((w) => w.word)
      .join(' ');

  const notes = [`Kecocokan transkrip dengan naskah: ${Math.round(matchRate * 100)}% kata.`];
  if (matchRate < 0.6) {
    notes.push('⚠ Kecocokan rendah. Pastikan audio dibuat dari naskah-full.txt terbaru, atau coba --model medium.');
  }
  // Waktu absolut tiap kata naskah (null kalau tidak tercocokkan, diisi interpolasi nanti)
  const wordTimes = scenes.map((s) => s.narasi.split(/\s+/).map(() => null));
  for (const [si, hi] of pairs) {
    wordTimes[sceneOf[si]][wordOf[si]] = {start: heard[hi].start, end: heard[hi].end};
  }

  return {cuts, notes, heardText, wordTimes};
};

// Isi kata yang tidak tercocokkan dengan membagi rata waktu di antara tetangganya,
// lalu ubah ke detik relatif terhadap awal potongan audio scene itu.
const relativeTimes = (times, segStart, segEnd) => {
  const out = times.map((t) => (t ? {...t} : null));
  let i = 0;
  while (i < out.length) {
    if (out[i]) {
      i++;
      continue;
    }
    let j = i;
    while (j < out.length && !out[j]) j++;
    const from = i === 0 ? segStart : out[i - 1].end;
    const to = j === out.length ? segEnd : out[j].start;
    const step = Math.max(0, to - from) / (j - i);
    for (let k = i; k < j; k++) out[k] = {start: from + step * (k - i), end: from + step * (k - i + 1)};
    i = j;
  }
  const clamp = (v) => Math.min(segEnd - segStart, Math.max(0, v - segStart));
  return out.map((t) => [Number(clamp(t.start).toFixed(3)), Number(clamp(t.end).toFixed(3))]);
};

// ---- Main --------------------------------------------------------------------------------------

const main = async () => {
  const script = await loadScript(slug);
  const scenes = script.scenes.map((scene, i) => ({i, narasi: scene.narasi?.trim()})).filter((s) => s.narasi);
  if (!scenes.length) throw new Error(`Tidak ada scene dengan narasi di src/data/${slug}.ts`);

  const {total, silences} = await detectSilences();

  // Hening di awal & akhir file bukan batas scene
  const leading = silences.find((s) => s.start < 0.05);
  const trailing = silences.find((s) => s.end > total - 0.05);
  const interior = silences.filter((s) => s !== leading && s !== trailing);

  let method = values.metode;
  let python = null;
  if (method === 'whisper') {
    python = await findPython();
    if (!python) {
      console.log('⚠ Python + faster-whisper tidak ditemukan, pakai metode jeda.');
      method = 'jeda';
    }
  }

  const {cuts, notes, heardText, wordTimes} =
    method === 'whisper' ? await cutsByWhisper(python, scenes, interior) : cutsBySilence(interior, scenes.length - 1);

  const contentStart = leading ? leading.end : 0;
  const contentEnd = trailing ? trailing.start : total;
  const segments = scenes.map((scene, k) => ({
    ...scene,
    start: Math.max(0, (k === 0 ? contentStart : cuts[k - 1].nextStart) - PAD_BEFORE),
    end: Math.min(total, (k === scenes.length - 1 ? contentEnd : cuts[k].prevEnd) + PAD_AFTER),
  }));

  const outDir = path.resolve('public/audio', slug);
  await fs.mkdir(outDir, {recursive: true});
  for (const f of await fs.readdir(outDir)) {
    if (/^\d{2}\.(mp3|wav|m4a)$/.test(f)) await fs.rm(path.join(outDir, f));
  }

  const totalWords = segments.reduce((sum, s) => sum + s.narasi.split(/\s+/).length, 0);
  const totalSpeech = segments.reduce((sum, s) => sum + (s.end - s.start), 0);
  let suspicious = 0;

  console.log(`\nMetode ${method}. Audio ${total.toFixed(1)} detik, ${silences.length} jeda terdeteksi.\n`);
  console.log(`Scene  Mulai   Durasi  Cocok  ${heardText ? 'Terdengar di awal potongan' : 'Awal narasi'}`);
  for (const s of segments) {
    const no = String(s.i + 1).padStart(2, '0');
    await ffmpeg(['-y', '-i', input, '-ss', s.start.toFixed(3), '-to', s.end.toFixed(3), '-c:a', 'pcm_s16le', path.join(outDir, `${no}.wav`)]);

    // Bandingkan porsi durasi dengan porsi jumlah kata. Selisih besar = kemungkinan salah potong.
    const expected = s.narasi.split(/\s+/).length / totalWords;
    const actual = (s.end - s.start) / totalSpeech;
    const ratio = actual / expected;
    const ok = ratio > 0.65 && ratio < 1.5;
    if (!ok) suspicious++;
    const preview = heardText ? heardText(s.start, s.end) : s.narasi;
    console.log(
      `${no}     ${s.start.toFixed(1).padStart(5)}s  ${(s.end - s.start).toFixed(1).padStart(5)}s  ${ok ? ' ok ' : ' ⚠  '}  ${preview.slice(0, 50)}...`,
    );
  }

  console.log('');
  for (const note of notes) console.log(note);
  if (suspicious) {
    console.log(`⚠ ${suspicious} scene durasinya tidak sebanding dengan jumlah katanya. Kemungkinan ada potongan yang meleset.`);
  }

  // Timing per kata untuk subtitle & animasi yang sinkron dengan suara. Tanpa file ini video
  // memperkirakan timing dari panjang audio.
  const kataPath = path.join(outDir, 'kata.json');
  if (wordTimes) {
    const kata = Object.fromEntries(segments.map((s, k) => [s.i, relativeTimes(wordTimes[k], s.start, s.end)]));
    await fs.writeFile(kataPath, JSON.stringify(kata));
  } else {
    await fs.rm(kataPath, {force: true});
  }

  console.log(`\nTersimpan di public/audio/${slug}/. Tambahkan di src/data/${slug}.ts:`);
  console.log(`  narasiAudio: 'audio/${slug}',\n  narasiExt: 'wav',`);
};

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  // exitCode (bukan process.exit) supaya koneksi jaringan sempat ditutup; process.exit bisa crash di Node Windows
  process.exitCode = 1;
});
