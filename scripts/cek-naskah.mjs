// Periksa naskah src/data/<slug>.ts terhadap semua aturan di SKILL.md, lengkap dengan cara memperbaikinya.
//
// Pakai: node scripts/cek-naskah.mjs borobudur
// Keluar dengan kode 1 kalau ada ERROR. PERINGATAN boleh dibiarkan kalau memang disengaja.
// RITME = peringatan tempo visual (durasi shot, foto berulang, gerak kamera, variasi scene).

import fs from 'node:fs/promises';
import path from 'node:path';
import {ALL_FORMATS, FilePathSource, Input} from 'mediabunny';
import {importTs, loadScript} from './lib/load-script.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('Pakai: node scripts/cek-naskah.mjs <slug>');
  process.exit(1);
}

const errors = [];
const warnings = [];
const tanpaDi = [];
const err = (where, msg, fix) => errors.push({where, msg, fix});
const warn = (where, msg, fix) => warnings.push({where, msg, fix});

const exists = (p) => fs.access(path.resolve('public', p)).then(() => true, () => false);
const normalize = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const wordsOf = (text) => text.trim().split(/\s+/);
const plain = (text) => text.replace(/\*/g, '');

let script;
try {
  script = await loadScript(slug);
} catch (e) {
  console.error(`✗ src/data/${slug}.ts tidak bisa dibaca: ${e.message}`);
  if (/^Foto ".*" tidak ada/.test(e.message)) {
    console.error(
      `  Perbaiki: nama file di foto('...') salah atau fotonya sudah dihapus. Lihat daftar file yang ada: ls public/photos/${slug}/ lalu salin namanya persis (termasuk nomor di depan).`,
    );
  } else {
    console.error('  Perbaiki: cek salah ketik (koma, kurung, tanda kutip). Jalankan npx tsc untuk melihat baris yang salah.');
  }
  process.exit(1);
}

const daftar = await fs.readFile('src/data/daftar.ts', 'utf8');
if (!daftar.includes(`'./${slug}'`)) {
  err('daftar.ts', 'Video belum terdaftar, tidak akan muncul di Studio/render.', `Jalankan node scripts/buat-video.mjs untuk video baru, atau tambahkan import & entri ${slug} di src/data/daftar.ts.`);
}

const scenes = script.scenes ?? [];
// Short (9:16) punya batas lebih ketat: lebih sedikit kata, judul lebih pendek, layar lebih sempit
const short = script.format === 'short';
const R = short
  ? {narasiMin: 6, narasiMax: 26, narasiIdeal: '12–20 kata (±5–8 detik)', judulMax: 4, tagMax: 26}
  : {narasiMin: 8, narasiMax: 40, narasiIdeal: '15–25 kata (±6–10 detik)', judulMax: 5, tagMax: 40};

if (scenes.length < 3) err('naskah', `Hanya ${scenes.length} scene.`, short ? 'Buat 4–8 scene: title (hook), beberapa photo/fact, outro.' : 'Buat minimal 6 scene: title, beberapa photo/fact, outro.');
if (short && (scenes.length < 4 || scenes.length > 8)) warn('naskah', `Short berisi ${scenes.length} scene.`, 'Short 30–60 detik idealnya 4–8 scene.');
if (scenes[0]?.type !== 'title') warn('scene 1', 'Scene pertama bukan type "title".', 'Mulai video dengan scene title.');
if (scenes.at(-1)?.type !== 'outro') warn(`scene ${scenes.length}`, 'Scene terakhir bukan type "outro".', 'Tutup video dengan scene outro.');

const transitions = scenes.slice(1).map((s) => s.transition ?? 'dorong');
for (const t of ['zoom', 'whip']) {
  const n = transitions.filter((x) => x === t).length;
  if (n > 1) warn('transisi', `Transisi '${t}' dipakai ${n} kali.`, `Maksimal 1 kali per video. Ganti sisanya dengan 'dorong' atau 'kartu'.`);
}
const stempelCount = scenes.filter((s) => s.stempel).length;
if (stempelCount > 2) warn('stempel', `Stempel dipakai ${stempelCount} kali.`, 'Maksimal 2 per video, hanya untuk momen paling penting.');

// Area aman short dalam persen layar 1080×1920 (lihat src/lib/safe.ts)
const {SAFE_SHORT, FORMAT_SIZE} = await importTs('src/lib/safe.ts');
const SW = FORMAT_SIZE.short.width;
const SH = FORMAT_SIZE.short.height;
const inSafeZone = (x, y) =>
  x >= (SAFE_SHORT.left / SW) * 100 &&
  x <= 100 - (SAFE_SHORT.right / SW) * 100 &&
  y >= (SAFE_SHORT.top / SH) * 100 &&
  y <= 100 - (SAFE_SHORT.bottom / SH) * 100;
const SAFE_HINT = `Taruh di x ${Math.ceil((SAFE_SHORT.left / SW) * 100)}–${Math.floor(100 - (SAFE_SHORT.right / SW) * 100)}%, y ${Math.ceil((SAFE_SHORT.top / SH) * 100)}–${Math.floor(100 - (SAFE_SHORT.bottom / SH) * 100)}% (di luar itu tertutup tombol & caption aplikasi).`;

let kataJson = null;
if (script.narasiAudio) {
  try {
    kataJson = JSON.parse(await fs.readFile(path.resolve('public', script.narasiAudio, 'kata.json'), 'utf8'));
  } catch {
    warn('audio', 'kata.json tidak ada, subtitle memakai perkiraan waktu.', `Jalankan ulang: node scripts/potong-narasi.mjs ${slug} "<file audio>"`);
  }
}

for (const [i, scene] of scenes.entries()) {
  const where = `scene ${i + 1} (${scene.type})`;
  const narasi = scene.narasi ?? '';
  const json = JSON.stringify(scene);

  if (/TODO/.test(json)) err(where, 'Masih ada teks TODO.', 'Ganti semua TODO di scene ini dengan isi sebenarnya.');

  // --- Narasi ---
  if (!narasi.trim()) {
    err(where, 'Tidak punya narasi.', 'Tulis narasi 15–25 kata. Setiap scene wajib punya narasi (1 paragraf audio = 1 scene).');
  } else {
    const n = wordsOf(narasi).length;
    if (n < R.narasiMin || n > R.narasiMax) warn(where, `Narasi ${n} kata.`, `Idealnya ${R.narasiIdeal}.`);
    if (/\d/.test(plain(narasi))) err(where, 'Narasi berisi angka (digit).', 'Tulis angka dengan huruf, contoh 1814 -> "seribu delapan ratus empat belas".');
    if (/\b(dll|dsb|yg|thn|abd|M)\./.test(narasi)) err(where, 'Narasi berisi singkatan.', 'Tulis lengkap, contoh "M." -> "Masehi".');
    if (/[()]/.test(narasi)) warn(where, 'Narasi berisi tanda kurung.', 'TTS membacanya janggal; ubah jadi kalimat biasa.');
    if ((narasi.match(/\*/g) ?? []).length % 2 !== 0) err(where, 'Jumlah tanda * ganjil.', 'Setiap *bintang* harus berpasangan: *kata kunci*.');
  }

  // --- Shot ---
  const shots = scene.shots ?? (scene.photo ? [{photo: scene.photo, credit: scene.credit}] : []);
  if (shots.length === 0) {
    err(where, 'Tidak ada foto (shots kosong).', "Isi 2–4 shot dengan {...foto('NN-nama.jpg')} dari folder foto yang dipakai fotoDari(...) di atas naskah.");
  } else if (shots.length === 1) {
    warn(where, 'Hanya 1 shot, akan terlihat seperti slideshow.', 'Tambah jadi 2–4 shot (1 foto per ±3 detik narasi).');
  } else if (shots.length > 5) {
    warn(where, `${shots.length} shot, terlalu cepat berganti.`, 'Maksimal 4 shot per scene.');
  }
  let lastDiIndex = 0;
  if (shots.length > 1 && !shots.slice(1).some((x) => x.di)) tanpaDi.push(i + 1);
  for (const [k, shot] of shots.entries()) {
    const sw = `${where}, shot ${k + 1}`;
    if (!shot.photo) {
      err(sw, 'Shot tanpa foto.', "Tulis shot sebagai {...foto('NN-nama.jpg')}.");
      continue;
    }
    if (!(await exists(shot.photo))) err(sw, `File public/${shot.photo} tidak ada.`, 'Cek nama file di folder foto (ls public/photos/<slug>/), salin persis.');
    if (shot.di) {
      const key = normalize(shot.di.split(' ')[0]);
      const idx = wordsOf(narasi).findIndex((w, wi) => wi >= lastDiIndex && normalize(w) === key);
      if (k === 0) {
        warn(sw, 'di di shot pertama diabaikan (shot pertama selalu mulai di awal scene).', 'Hapus di dari shot pertama.');
      } else if (idx < 0) {
        err(sw, `di "${shot.di}" tidak ada di narasi, atau letaknya sebelum di shot sebelumnya.`, 'Isi di dengan satu kata dari narasi scene ini; urutan di harus sama dengan urutan shot.');
      } else {
        lastDiIndex = idx + 1;
      }
    }
    if (!shot.credit) err(sw, 'Shot tanpa kredit foto.', "Selalu pakai ...foto('nama.jpg'), jangan tulis path foto manual.");
    for (const a of shot.anotasi ?? []) {
      if ([a.x, a.y, a.w ?? 10, a.h ?? 10].some((v) => typeof v !== 'number' || v < 0 || v > 100)) {
        err(sw, 'Koordinat anotasi di luar 0–100.', 'x, y, w, h dalam persen gambar (0–100). Cari dengan node scripts/grid-foto.mjs.');
      }
      if ((shot.layout ?? 'full') === 'full') {
        warn(
          sw,
          'Anotasi di shot layout full.',
          short
            ? "Di short, foto full digeser (pan) melintasi layar, jadi anotasi PASTI meleset. Wajib pakai layout: 'print' untuk shot beranotasi."
            : "Foto full terpotong sesuai layar, anotasi bisa meleset. Lebih akurat pakai layout: 'print'.",
        );
      }
      if (a.label && a.label.length > 24) warn(sw, `Label anotasi "${a.label}" terlalu panjang.`, 'Maksimal ±24 huruf.');
    }
    if (shot.tag && shot.tag.length > R.tagMax) warn(sw, `Tag "${shot.tag}" terlalu panjang.`, `Maksimal ±${R.tagMax} huruf.`);
  }

  // --- Lapisan layout ---
  if (scene.tag && scene.tag.length > R.tagMax) warn(where, `Tag "${scene.tag}" terlalu panjang.`, `Maksimal ±${R.tagMax} huruf.`);
  if (scene.judul) {
    const n = wordsOf(plain(scene.judul)).length;
    if (n > R.judulMax) err(where, `Judul ${n} kata.`, `Judul maksimal ${R.judulMax} kata. Ringkas, sisanya biar dibawa narasi/subtitle.`);
    if (!scene.judul.includes('*')) warn(where, 'Judul tanpa *stabilo*.', 'Tandai 1 frasa kunci: "Dibangun *abad ke-9*".');
    if (scene.type !== 'photo') warn(where, 'Judul dipakai di luar scene photo.', 'Judul hanya untuk scene photo (fact sudah ada angka, title sudah ada judul besar).');
  }
  if (scene.judulDi && !wordsOf(narasi).some((w) => normalize(w) === normalize(scene.judulDi))) {
    err(where, `judulDi "${scene.judulDi}" tidak ada di narasi.`, 'Isi judulDi dengan satu kata yang persis ada di narasi scene ini.');
  }
  if (scene.stempel?.di && !wordsOf(narasi).some((w) => normalize(w) === normalize(scene.stempel.di))) {
    err(where, `stempel.di "${scene.stempel.di}" tidak ada di narasi.`, 'Isi stempel.di dengan satu kata yang persis ada di narasi scene ini.');
  }
  if (scene.type === 'photo' && !scene.tag && !scene.judul && !shots.some((s) => s.tag || s.anotasi?.length)) {
    warn(where, 'Scene photo tanpa lapisan (tag/judul/anotasi).', 'Tambah minimal tag atau judul supaya tidak terlihat seperti slideshow.');
  }

  // --- Aturan per jenis scene ---
  if (short && scene.type === 'title' && i === 0 && narasi) {
    const hook = wordsOf(plain(narasi).split(/[.!?]/)[0] ?? '').length;
    if (hook > 12) warn(where, `Kalimat pertama (hook) ${hook} kata.`, 'Penonton short memutuskan lanjut atau skip dalam 2 detik: buka dengan kalimat ≤12 kata (pertanyaan/fakta mengejutkan).');
  }
  if (scene.type === 'title' && narasi && !narasi.includes('*')) {
    err(where, 'Narasi title tanpa *bintang*.', `Judul besar muncul saat kata berbintang diucapkan. Bungkus nama judul: "Inilah *${scene.title}*."`);
  }
  if (scene.type === 'fact') {
    if (!narasi.includes('*')) err(where, 'Narasi fact tanpa *bintang*.', 'Bungkus angka yang diucapkan dengan bintang: "*dua ribu enam ratus tujuh puluh dua* panel".');
    if (!scene.value) err(where, 'value kosong atau 0.', 'Isi value dengan angka faktanya (contoh 2672).');
    if (scene.tag) warn(where, 'Tag scene di scene fact bertabrakan dengan badge angka di kiri atas.', 'Pindahkan ke tag per shot (kanan atas).');
    if (scene.value >= 1000 && scene.value <= 2100 && scene.format !== 'year') warn(where, `${scene.value} terlihat seperti tahun.`, "Kalau tahun, tambahkan format: 'year' (supaya tidak jadi 1.814).");
    if (scene.ulang && !(await exists(scene.ulang.photo))) err(where, `ulang.photo public/${scene.ulang.photo} tidak ada.`, 'Salin path persis dari public/photos/<slug>/.');
  }

  if (short && scene.stempel && !inSafeZone(scene.stempel.x ?? 50, scene.stempel.y ?? 40)) {
    warn(where, 'Stempel di luar area aman short.', SAFE_HINT);
  }
  for (const p of scene.props ?? []) {
    if (!(await exists(p.src))) err(where, `Props public/${p.src} tidak ada.`, 'Generate dulu (scripts/generate-props.mjs) atau perbaiki nama file.');
    if (short && !inSafeZone(p.x, p.y)) warn(where, `Props ${p.src} di luar area aman short.`, SAFE_HINT);
    if (p.di && !wordsOf(narasi).some((w) => normalize(w) === normalize(p.di.split(' ')[0]))) {
      err(where, `Props di "${p.di}" tidak ada di narasi.`, 'Isi di dengan kata dari narasi scene ini yang menyebut benda itu.');
    }
  }

  // --- Audio ---
  if (script.narasiAudio && narasi) {
    const file = `${script.narasiAudio}/${String(i + 1).padStart(2, '0')}.${script.narasiExt ?? 'mp3'}`;
    if (!(await exists(file))) err(where, `Audio public/${file} tidak ada.`, `Potong ulang audio: node scripts/potong-narasi.mjs ${slug} "<file audio>", dan pastikan narasiExt sesuai.`);
    const timing = kataJson?.[String(i)];
    if (kataJson && (!timing || timing.length !== wordsOf(narasi).length)) {
      err(where, 'Jumlah kata narasi tidak cocok dengan kata.json.', 'Teks narasi diubah setelah audio dibuat. Ekspor ulang (narasi.mjs), minta TTS baru, lalu potong ulang.');
    }
  }
}

// --- RITME: durasi shot, foto berulang, gerak kamera, variasi scene (hanya peringatan) ---
// Durasi scene & waktu shot dihitung dengan rumus yang sama dengan video (src/lib/kata.ts).
const ritme = [];
const rit = (where, msg, fix) => ritme.push({where, msg, fix});
const {sceneWords, shotStarts, transitionFrames, narasiDuration, estimateSeconds, spreadWords} = await importTs('src/lib/kata.ts');
const {shotMove} = await importTs('src/lib/motion.ts');
const FPS = 30;
const RITME = short ? {min: 1, max: 5} : {min: 1.5, max: 7};
const namaFoto = (p) => p.split('/').pop();
const fmt = (s) => s.toFixed(1).replace('.', ',');

const audioSeconds = async (file) => {
  const input = new Input({formats: ALL_FORMATS, source: new FilePathSource(path.resolve('public', file))});
  try {
    return await input.computeDuration();
  } catch {
    return null;
  } finally {
    input.dispose();
  }
};

// Semua shot berurutan sepanjang video
const urutan = [];
for (const [i, scene] of scenes.entries()) {
  const shots = (scene.shots ?? (scene.photo ? [{photo: scene.photo}] : [])).filter((s) => s.photo);
  let duration = scene.duration;
  let words = [];
  if (scene.narasi) {
    const file = script.narasiAudio ? `${script.narasiAudio}/${String(i + 1).padStart(2, '0')}.${script.narasiExt ?? 'mp3'}` : null;
    const seconds = (file && (await audioSeconds(file))) ?? estimateSeconds(scene.narasi);
    const next = i + 1 < scenes.length ? transitionFrames(scenes[i + 1].transition) : 0;
    duration = narasiDuration(scene.duration, seconds, FPS, next);
    words = sceneWords({narasi: scene.narasi, kata: kataJson?.[String(i)] ?? spreadWords(scene.narasi, seconds)}, FPS);
  }
  const starts = shotStarts(shots, words, duration);
  shots.forEach((shot, k) => {
    const to = k === shots.length - 1 ? duration : starts[k + 1];
    urutan.push({
      scene: i + 1,
      where: `scene ${i + 1} (${scene.type}), shot ${k + 1}`,
      shot,
      layout: shot.layout ?? 'full',
      move: shotMove(shot, k, short),
      detik: (to - starts[k]) / FPS,
    });
  });
}

for (const x of urutan) {
  if (x.detik < RITME.min) {
    rit(x.where, `Shot hanya tampil ${fmt(x.detik)} dtk, terlalu cepat.`, `Minimal ±${fmt(RITME.min)} dtk. Hapus shot ini, atau pindahkan di ke kata yang lebih jauh dari di shot sebelumnya/berikutnya.`);
  } else if (x.detik > RITME.max) {
    rit(x.where, `Shot diam ${fmt(x.detik)} dtk, terlalu lama.`, `Maksimal ±${RITME.max} dtk. Tambah shot baru dengan di: '<kata>' di tengah bagian narasi ini (1 foto per ±3 detik).`);
  }
}

const pemakaian = new Map();
for (const x of urutan) pemakaian.set(x.shot.photo, [...(pemakaian.get(x.shot.photo) ?? []), x.scene]);
for (const [photo, list] of pemakaian) {
  if (list.length > 3) {
    rit('video', `Foto ${namaFoto(photo)} dipakai ${list.length} kali (scene ${[...new Set(list)].join(', ')}).`, 'Maksimal 3 kali per video. Ganti sebagian dengan foto lain (cari-foto dengan kata kunci baru).');
  }
  const uniq = [...new Set(list)];
  for (let k = 1; k < uniq.length; k++) {
    if (uniq[k] === uniq[k - 1] + 1) {
      rit(`scene ${uniq[k - 1]}–${uniq[k]}`, `Foto ${namaFoto(photo)} dipakai di dua scene berturut-turut.`, 'Ganti fotonya di salah satu scene supaya penonton melihat gambar baru.');
    }
  }
}

for (let k = 1; k < urutan.length; k++) {
  const [a, b] = [urutan[k - 1], urutan[k]];
  if (a.layout === 'full' && b.layout === 'full' && a.move === b.move) {
    rit(b.where, `Gerak kamera '${b.move}' sama dengan shot sebelumnya.`, "Isi move berbeda (push-in, pull-out, pan-left, pan-right, tilt-up, tilt-down), atau kosongkan move supaya dipilih bergantian.");
  }
}
for (let k = 0; k < urutan.length; ) {
  let j = k;
  while (j < urutan.length && urutan[j].layout === 'print') j++;
  if (j - k > 3) {
    rit(`${urutan[k].where} s.d. ${urutan[j - 1].where}`, `${j - k} shot print berturut-turut.`, "Maksimal 3. Selingi dengan shot full (foto memenuhi layar).");
  }
  k = Math.max(j, k + 1);
}

for (let k = 0; k < scenes.length; ) {
  let j = k;
  while (j < scenes.length && scenes[j].type === scenes[k].type) j++;
  if (j - k >= 5) {
    rit(`scene ${k + 1}–${j}`, `${j - k} scene ${scenes[k].type} berturut-turut.`, 'Terasa monoton. Sisipkan scene fact (angka/tahun) di tengahnya.');
  }
  k = j;
}

const totalDetik = urutan.reduce((sum, x) => sum + x.detik, 0);
const ringkasanRitme = urutan.length
  ? `Ritme: ${urutan.length} shot, rata-rata ${fmt(totalDetik / urutan.length)} dtk/shot (${fmt(Math.min(...urutan.map((x) => x.detik)))}–${fmt(Math.max(...urutan.map((x) => x.detik)))} dtk), ${pemakaian.size} foto unik dari ${urutan.length} shot.`
  : null;

for (const [label, list, icon] of [['ERROR', errors, '✗'], ['PERINGATAN', warnings, '⚠'], ['RITME', ritme, '⚠']]) {
  if (!list.length) continue;
  console.log(`\n${label} (${list.length})`);
  for (const {where, msg, fix} of list) {
    console.log(`${icon} [${where}] ${msg}\n    Perbaiki: ${fix}`);
  }
}

// Perkiraan durasi total: panjang narasi (kata.json kalau ada, kalau tidak ±2,4 kata/detik) + jeda per scene
const estSeconds = scenes.reduce((sum, scene, i) => {
  const words = wordsOf(scene.narasi ?? '').length;
  const spoken = kataJson?.[String(i)]?.at(-1)?.[1] ?? words / 2.4;
  return sum + spoken + 0.7;
}, 0);
if (short) {
  if (estSeconds > 180) err('durasi', `Perkiraan durasi ±${Math.round(estSeconds)} detik.`, 'Batas YouTube Shorts 3 menit. Kurangi scene atau perpendek narasi.');
  else if (estSeconds > 60) warn('durasi', `Perkiraan durasi ±${Math.round(estSeconds)} detik.`, 'Target short 30–60 detik. Perpendek narasi atau kurangi scene.');
  else if (estSeconds < 25) warn('durasi', `Perkiraan durasi ±${Math.round(estSeconds)} detik.`, 'Target short 30–60 detik. Tambah satu scene isi.');
}

if (tanpaDi.length) {
  console.log(
    `\nSaran: scene ${tanpaDi.join(', ')} belum mengikat shot ke narasi. Tambahkan di: '<kata>' pada shot ke-2 dst. supaya foto muncul saat isinya diucapkan, lalu cek dengan node scripts/storyboard.mjs ${slug}.`,
  );
}

if (ringkasanRitme) console.log(`\n${ringkasanRitme}`);

console.log(
  `\n${errors.length ? '✗ GAGAL' : '✓ LULUS'}: ${short ? 'short 9:16, ' : ''}${scenes.length} scene, ±${Math.round(estSeconds)} detik, ${errors.length} error, ${warnings.length} peringatan, ${ritme.length} catatan ritme.`,
);
if (errors.length) process.exitCode = 1;
