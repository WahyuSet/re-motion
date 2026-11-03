// Paket upload YouTube: thumbnail, judul, deskripsi (chapter + kredit + hashtag), tags, dan subtitle SRT.
// Waktu chapter & subtitle diambil dari komposisi (sama persis dengan hasil render).
//
// Pakai: node scripts/paket-youtube.mjs gunung-kawi
// Hasil: out/youtube/<slug>/
//   thumbnail.jpg        1280×720 (short: cover 1080×1920), dari Still <Id>Thumb
//   thumbnail-kecil.jpg  320×180 (short: 180×320) untuk cek keterbacaan di ukuran kecil
//   judul.txt            kolom Judul
//   deskripsi.txt        kolom Deskripsi (paragraf, chapter, kredit foto, hashtag)
//   tags.txt             kolom Tags (dipisah koma)
//   subtitle.id.srt      unggah di menu Subtitel, bahasa Indonesia

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {bukaKomposisi, idDari, tutup, waktuScene} from './lib/komposisi.mjs';
import {kreditFoto} from './lib/kredit.mjs';
import {loadScript} from './lib/load-script.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('Pakai: node scripts/paket-youtube.mjs <slug>');
  process.exit(1);
}

/** Batas YouTube */
const MAKS = {judul: 100, deskripsi: 5000, tags: 500};
/** Potongan subtitle: maks. kata & huruf per baris */
const SRT_KATA = 6;
const SRT_HURUF = 42;
const BAB_MIN_DETIK = 10;

const script = await loadScript(slug);
if (!script.youtube?.judul) {
  console.error(`✗ Naskah belum punya youtube.judul.`);
  console.error(`  Perbaiki: tambahkan di src/data/${slug}.ts (di atas scenes): youtube: {judul: '...', deskripsi: '...', tags: ['...']}`);
  process.exit(1);
}

const short = script.format === 'short';
const outDir = path.resolve('out/youtube', slug);
await fs.rm(outDir, {recursive: true, force: true});
await fs.mkdir(outDir, {recursive: true});
const peringatan = [];
const hasil = [];

const jam = (detik) => {
  const s = Math.floor(detik);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const mmss = `${h ? String(m).padStart(2, '0') : m}:${String(s % 60).padStart(2, '0')}`;
  return h ? `${h}:${mmss}` : mmss;
};
const srtWaktu = (detik) => {
  const ms = Math.max(0, Math.round(detik * 1000));
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

try {
  const {composition} = await bukaKomposisi(slug);
  const fps = composition.fps;
  const waktu = await waktuScene(composition);

  // ---- Chapter ----
  const judulBab = (s) => s.bab ?? (s.type === 'chapter' ? s.judul?.replace(/\*/g, '').trim() : undefined);
  const bab = waktu
    .map((w) => ({judul: judulBab(w.scene), detik: Math.max(0, w.start) / fps, scene: w.index + 1}))
    .filter((b) => b.judul);
  let chapter = [];
  if (bab.length) {
    const durasiBab = bab.map((b, i) => (i + 1 < bab.length ? bab[i + 1].detik : composition.durationInFrames / fps) - b.detik);
    const masalah = [
      short && 'video short tidak mendukung chapter',
      bab[0].scene !== 1 && `bab pertama ada di scene ${bab[0].scene}, harus di scene 1`,
      bab.length < 3 && `hanya ${bab.length} bab, minimal 3`,
      durasiBab.some((d) => d < BAB_MIN_DETIK) && `ada bab yang kurang dari ${BAB_MIN_DETIK} detik`,
    ].filter(Boolean);
    if (masalah.length) {
      peringatan.push(`Chapter tidak dimasukkan ke deskripsi (${masalah.join('; ')}). Cek dengan: node scripts/cek-naskah.mjs ${slug}`);
    } else {
      chapter = bab.map((b) => `${jam(b.detik)} ${b.judul}`);
    }
  }

  // ---- Teks ----
  const {entries, musik, missing, baris: kredit} = await kreditFoto(script);
  if (missing.length) peringatan.push(`${missing.length} foto/musik tanpa data kredit: ${missing.join(', ')}`);
  const tags = script.youtube.tags ?? [];
  const hashtag = tags
    .slice(0, 3)
    .map((t) => `#${t.replace(/[^\p{L}\p{N}]/gu, '')}`)
    .filter((t) => t.length > 1);

  const deskripsi = [
    script.youtube.deskripsi?.trim(),
    chapter.length && ['Bab:', ...chapter].join('\n'),
    kredit.join('\n'),
    hashtag.length && hashtag.join(' '),
  ]
    .filter(Boolean)
    .join('\n\n')
    .replace(/[<>]/g, '');
  const judul = script.youtube.judul.trim();
  const tagsTxt = tags.join(', ');

  if (judul.length > MAKS.judul) peringatan.push(`Judul ${judul.length} huruf, YouTube menolak lebih dari ${MAKS.judul}.`);
  if (deskripsi.length > MAKS.deskripsi) peringatan.push(`Deskripsi ${deskripsi.length} huruf, batas YouTube ${MAKS.deskripsi}.`);
  if (tagsTxt.length > MAKS.tags) peringatan.push(`Tags ${tagsTxt.length} huruf, batas YouTube ${MAKS.tags}. Kurangi tags.`);
  if (!tags.length) peringatan.push('youtube.tags kosong: deskripsi tanpa hashtag, tags.txt kosong.');

  await fs.writeFile(path.join(outDir, 'judul.txt'), judul);
  await fs.writeFile(path.join(outDir, 'deskripsi.txt'), deskripsi);
  await fs.writeFile(path.join(outDir, 'tags.txt'), tagsTxt);
  hasil.push(
    `judul.txt (${judul.length} huruf)`,
    `deskripsi.txt (${chapter.length} chapter, ${entries.length} kredit foto${musik ? ', 1 kredit musik' : ''})`,
    `tags.txt (${tags.length} tag)`,
  );

  // ---- Subtitle: teks naskah (bukan transkrip), dipotong per ≤6 kata / ≤42 huruf, pecah di akhir kalimat ----
  const kataJsonAda = script.narasiAudio
    ? await fs.access(path.resolve('public', script.narasiAudio, 'kata.json')).then(() => true, () => false)
    : false;
  if (!kataJsonAda) peringatan.push('Belum ada audio narasi + kata.json: timing subtitle masih PERKIRAAN. Buat ulang paket setelah langkah 7.');

  const cue = [];
  for (const w of waktu) {
    let isi = [];
    const kirim = () => {
      if (!isi.length) return;
      cue.push({mulai: (w.start + isi[0].start) / fps, selesai: (w.start + isi.at(-1).end) / fps, teks: isi.map((x) => x.word).join(' ')});
      isi = [];
    };
    for (const kata of w.words) {
      const teks = [...isi, kata].map((x) => x.word).join(' ');
      if (isi.length && (isi.length >= SRT_KATA || teks.length > SRT_HURUF)) kirim();
      isi.push(kata);
      if (/[.!?]$/.test(kata.word) || (/[,;:]$/.test(kata.word) && isi.length >= 3)) kirim();
    }
    kirim();
  }
  for (let i = 0; i < cue.length; i++) {
    const berikut = cue[i + 1]?.mulai ?? Infinity;
    // Tahan sebentar setelah kata terakhir supaya sempat terbaca, tapi jangan menimpa potongan berikutnya
    cue[i].selesai = Math.min(Math.max(cue[i].selesai + 0.25, cue[i].mulai + 0.8), berikut);
  }
  const srt = cue.map((c, i) => `${i + 1}\n${srtWaktu(c.mulai)} --> ${srtWaktu(c.selesai)}\n${c.teks}\n`).join('\n');
  await fs.writeFile(path.join(outDir, 'subtitle.id.srt'), srt);
  hasil.push(`subtitle.id.srt (${cue.length} potongan${kataJsonAda ? '' : ', timing perkiraan'})`);

  // ---- Thumbnail ----
  if (script.thumbnail) {
    const {renderFrame} = await bukaKomposisi(`${idDari(slug)}Thumb`);
    const file = path.join(outDir, 'thumbnail.jpg');
    await renderFrame(0, file, {imageFormat: 'jpeg', jpegQuality: 90});
    const {size} = await fs.stat(file);
    if (size > 2 * 1024 * 1024) peringatan.push(`thumbnail.jpg ${(size / 1048576).toFixed(1)} MB, batas YouTube 2 MB.`);
    await sharp(file)
      .resize(short ? 180 : 320, short ? 320 : 180)
      .jpeg({quality: 90})
      .toFile(path.join(outDir, 'thumbnail-kecil.jpg'));
    hasil.push(`thumbnail.jpg (${short ? '1080×1920 cover' : '1280×720'}, ${Math.round(size / 1024)} KB)`, 'thumbnail-kecil.jpg (cek: judul masih terbaca?)');
  } else {
    peringatan.push(`Naskah belum punya thumbnail: thumbnail.jpg tidak dibuat. Tambahkan thumbnail: {judul: '...', ...foto('NN-nama.jpg')} di src/data/${slug}.ts.`);
  }
} finally {
  await tutup();
}

console.log(`\nPaket YouTube: out/youtube/${slug}/`);
for (const h of hasil) console.log(`  ${h}`);
if (peringatan.length) {
  console.log(`\nPERINGATAN (${peringatan.length})`);
  for (const p of peringatan) console.log(`⚠ ${p}`);
}
console.log('\nLihat thumbnail.jpg dan thumbnail-kecil.jpg dengan Read: judul harus terbaca jelas di versi kecil.');
