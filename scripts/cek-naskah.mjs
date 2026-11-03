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
  if (/^(Foto|Video) ".*" tidak ada/.test(e.message)) {
    console.error(
      `  Perbaiki: nama file di foto('...') / video('...') salah atau filenya sudah dihapus. Lihat daftar file di public/photos/${slug}/ atau public/videos/${slug}/ lalu salin namanya persis.`,
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

// --- SFX & Grain ---
if (script.grain !== undefined && (typeof script.grain !== 'number' || script.grain < 0 || script.grain > 1)) {
  err('grain', `Nilai grain (${script.grain}) di luar 0–1.`, 'Isi grain antara 0 (tanpa bintik film) sampai 1 (default).');
}
if (script.sfx !== false) {
  for (const sfxName of ['whoosh', 'dum', 'tik', 'pop', 'swell']) {
    const sfxPath = `sfx/${sfxName}.wav`;
    if (!(await exists(sfxPath))) {
      err('sfx', `File public/${sfxPath} tidak ada.`, 'Jalankan node scripts/buat-sfx.mjs untuk membuat file efek suara.');
    }
  }
}

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
    if (scene.type !== 'chapter') {
      err(where, 'Tidak punya narasi.', 'Tulis narasi 15–25 kata. Setiap scene wajib punya narasi (kecuali kartu chapter).');
    }
  } else {
    const n = wordsOf(narasi).length;
    if ((scene.type !== 'chapter' && n < R.narasiMin) || n > R.narasiMax) warn(where, `Narasi ${n} kata.`, `Idealnya ${R.narasiIdeal}.`);
    if (/\d/.test(plain(narasi))) err(where, 'Narasi berisi angka (digit).', 'Tulis angka dengan huruf, contoh 1814 -> "seribu delapan ratus empat belas".');
    if (/\b(dll|dsb|yg|thn|abd|M)\./.test(narasi)) err(where, 'Narasi berisi singkatan.', 'Tulis lengkap, contoh "M." -> "Masehi".');
    if (/[()]/.test(narasi)) warn(where, 'Narasi berisi tanda kurung.', 'TTS membacanya janggal; ubah jadi kalimat biasa.');
    if ((narasi.match(/\*/g) ?? []).length % 2 !== 0) err(where, 'Jumlah tanda * ganjil.', 'Setiap *bintang* harus berpasangan: *kata kunci*.');
  }

  // --- Shot ---
  const shots = scene.shots ?? (scene.photo ? [{photo: scene.photo, credit: scene.credit}] : []);
  if (shots.length === 0) {
    err(where, 'Tidak ada foto (shots kosong).', "Isi 2–4 shot dengan {...foto('NN-nama.jpg')} dari folder foto yang dipakai fotoDari(...) di atas naskah.");
  } else if (shots.length === 1 && !['chapter', 'timeline', 'outro'].includes(scene.type) && !shots[0].rute) {
    warn(where, 'Hanya 1 shot, akan terlihat seperti slideshow.', 'Tambah jadi 2–4 shot (1 foto per ±3 detik narasi).');
  } else if (shots.length > 5) {
    warn(where, `${shots.length} shot, terlalu cepat berganti.`, 'Maksimal 4 shot per scene.');
  }
  let lastDiIndex = 0;
  if (narasi && shots.length > 1 && !shots.slice(1).some((x) => x.di)) tanpaDi.push(i + 1);
  for (const [k, shot] of shots.entries()) {
    const sw = `${where}, shot ${k + 1}`;
    const media = shot.video ?? shot.photo;
    if (!media) {
      err(sw, 'Shot tanpa foto/video.', "Tulis shot sebagai {...foto('NN-nama.jpg')} atau {...video('NN-nama.mp4')}.");
      continue;
    }
    if (!(await exists(media))) err(sw, `File public/${media} tidak ada.`, 'Cek nama file di folder photos/ atau videos/ (ls public/photos/<slug>/), salin persis.');
    if (shot.mulai !== undefined && (typeof shot.mulai !== 'number' || shot.mulai < 0)) {
      err(sw, `mulai (${shot.mulai}) harus berupa angka ≥ 0.`, 'Isi mulai dalam detik (contoh mulai: 4), atau hapus field mulai.');
    }
    if (shot.rute && shot.video && !shot.photo) {
      err(sw, 'rute hanya bisa dipasang pada shot foto peta.', "Pakai foto peta (...foto('peta.jpg')) dengan layout: 'print' untuk menggambar rute.");
    }
    if (shot.di) {
      const keys = shot.di.trim().split(/\s+/).map(normalize).filter(Boolean);
      const normWords = wordsOf(narasi).map(normalize);
      const matches = [];
      for (let wi = lastDiIndex; wi <= normWords.length - keys.length; wi++) {
        if (keys.every((key, j) => normWords[wi + j] === key)) matches.push(wi);
      }
      const idx = matches[0] ?? -1;
      if (k === 0) {
        warn(sw, 'di di shot pertama diabaikan (shot pertama selalu mulai di awal scene).', 'Hapus di dari shot pertama.');
      } else if (idx < 0) {
        err(sw, `di "${shot.di}" tidak ada di narasi, atau letaknya sebelum di shot sebelumnya.`, 'Isi di dengan kata/frasa dari narasi scene ini; urutan di harus sama dengan urutan shot.');
      } else {
        if (matches.length > 1) {
          warn(
            sw,
            `di "${shot.di}" muncul ${matches.length} kali di sisa narasi (dipakai kemunculan pertama, kata ke-${idx + 1}).`,
            'Jika maksudnya kemunculan berikutnya, tulis 2 kata berurutan (contoh di: "angka satu").',
          );
        }
        lastDiIndex = idx + 1;
      }
    }
    if (!shot.credit) err(sw, 'Shot tanpa kredit.', "Selalu pakai ...foto('nama.jpg') atau ...video('nama.mp4'), jangan tulis path manual.");
    for (const a of shot.anotasi ?? []) {
      if (a.bentuk && a.bentuk !== 'lingkaran' && a.bentuk !== 'pin') {
        err(sw, `bentuk anotasi "${a.bentuk}" tidak dikenal.`, "Pakai 'lingkaran' (default) atau 'pin'.");
      }
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
    if (shot.rute) {
      const r = shot.rute;
      if ((shot.layout ?? 'full') !== 'print') {
        err(sw, "rute hanya tampil di shot layout 'print'.", "Tambahkan layout: 'print' pada shot peta ini.");
      }
      const titik = r.titik ?? [];
      if (titik.length < 2 || titik.length > 8) {
        err(sw, `rute.titik berisi ${titik.length} titik.`, 'Isi 2–8 titik dari awal sampai ujung rute (persen gambar, cari dengan grid-foto.mjs).');
      }
      if (titik.some((p) => [p?.x, p?.y].some((v) => typeof v !== 'number' || v < 0 || v > 100))) {
        err(sw, 'Koordinat rute.titik di luar 0–100.', 'x dan y tiap titik dalam persen gambar (0–100). Cari dengan node scripts/grid-foto.mjs.');
      }
      if (r.di && !wordsOf(narasi).some((w) => normalize(w) === normalize(r.di.split(' ')[0]))) {
        err(sw, `rute.di "${r.di}" tidak ada di narasi.`, 'Isi rute.di dengan satu kata dari narasi scene ini.');
      }
      if (r.label && r.label.length > 24) warn(sw, `Label rute "${r.label}" terlalu panjang.`, 'Maksimal ±24 huruf.');
    }
    if (shot.tag && shot.tag.length > R.tagMax) warn(sw, `Tag "${shot.tag}" terlalu panjang.`, `Maksimal ±${R.tagMax} huruf.`);
  }

  // --- Lapisan layout ---
  if (scene.tag && scene.tag.length > R.tagMax) warn(where, `Tag "${scene.tag}" terlalu panjang.`, `Maksimal ±${R.tagMax} huruf.`);
  if (scene.judul) {
    const n = wordsOf(plain(scene.judul)).filter(Boolean).length;
    if (n > R.judulMax) err(where, `Judul ${n} kata.`, `Judul maksimal ${R.judulMax} kata. Ringkas, sisanya biar dibawa narasi/subtitle.`);
    if ((scene.judul.match(/\*/g) ?? []).length % 2 !== 0) err(where, 'Jumlah tanda * di judul ganjil.', 'Setiap *bintang* harus berpasangan.');
    else if (!scene.judul.includes('*')) warn(where, 'Judul tanpa *stabilo*.', 'Tandai 1 frasa kunci: "Dibangun *abad ke-9*".');
    if (scene.type !== 'photo' && scene.type !== 'chapter') warn(where, 'Judul dipakai di luar scene photo/chapter.', 'Judul hanya untuk scene photo atau chapter.');
  }
  if (scene.judulDi && !wordsOf(narasi).some((w) => normalize(w) === normalize(scene.judulDi))) {
    err(where, `judulDi "${scene.judulDi}" tidak ada di narasi.`, 'Isi judulDi dengan satu kata yang persis ada di narasi scene ini.');
  }
  if (scene.stempel?.di && !wordsOf(narasi).some((w) => normalize(w) === normalize(scene.stempel.di))) {
    err(where, `stempel.di "${scene.stempel.di}" tidak ada di narasi.`, 'Isi stempel.di dengan satu kata yang persis ada di narasi scene ini.');
  }
  if (scene.type === 'photo' && !scene.tag && !scene.judul && !shots.some((s) => s.tag || s.anotasi?.length || s.rute)) {
    warn(where, 'Scene photo tanpa lapisan (tag/judul/anotasi/rute).', 'Tambah minimal tag atau judul supaya tidak terlihat seperti slideshow.');
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
  if (scene.type === 'chapter') {
    if (typeof scene.nomor !== 'number' || scene.nomor < 1) err(where, 'nomor bab wajib angka ≥ 1.', 'Isi nomor: 1, 2, dst.');
    if (!plain(scene.judul ?? '').trim()) err(where, 'chapter tanpa judul.', "Isi judul bab pendek (maks. 5 kata), contoh judul: 'Mitos *batalion Inggris*'.");
    if (narasi && !narasi.includes('*')) warn(where, 'Narasi chapter tanpa *bintang*.', 'Bungkus kata yang memicu munculnya judul bab dengan *bintang*, atau kosongkan narasi untuk kartu bab singkat.');
    if (short) warn(where, 'Scene chapter dipakai di video short.', 'Short 30–60 detik tidak perlu kartu bab; langsung masuk ke isi.');
  }
  if (scene.type === 'timeline') {
    const titik = scene.titik ?? [];
    if (titik.length < 2 || titik.length > 6) {
      err(where, `Timeline berisi ${titik.length} titik.`, 'Isi 2–6 titik supaya garis waktu terbaca jelas.');
    }
    let lastTahun = -Infinity;
    let lastTitikDi = 0;
    for (const [k, t] of titik.entries()) {
      const tw = `${where}, titik ${k + 1}`;
      if (typeof t.tahun !== 'number') err(tw, 'tahun wajib berupa angka.', 'Isi tahun sebagai angka, contoh tahun: 1811.');
      else if (t.tahun <= lastTahun) err(tw, `Tahun ${t.tahun} tidak naik dari titik sebelumnya (${lastTahun}).`, 'Urutkan titik dari tahun paling tua ke paling muda (tahun naik).');
      else lastTahun = t.tahun;
      if (!t.label?.trim()) err(tw, 'label titik kosong.', "Isi keterangan pendek, contoh label: 'Inggris menyerbu Jawa'.");
      else if (t.label.length > 28) warn(tw, `Label titik "${t.label}" terlalu panjang (${t.label.length} huruf).`, 'Maksimal ±28 huruf supaya tidak bertabrakan dengan titik sebelah.');
      if (t.di) {
        const key = normalize(t.di.split(' ')[0]);
        const idx = wordsOf(narasi).findIndex((w, wi) => wi >= lastTitikDi && normalize(w) === key);
        if (idx < 0) {
          err(tw, `di "${t.di}" tidak ada di narasi, atau letaknya sebelum di titik sebelumnya.`, 'Isi di dengan satu kata dari narasi scene ini; urutan di harus sesuai urutan titik.');
        } else {
          lastTitikDi = idx + 1;
        }
      }
    }
  }
  if (scene.type === 'kutipan') {
    const teks = plain(scene.teks ?? '').trim();
    const maksKata = short ? 20 : 30;
    if (!teks) err(where, 'teks kutipan kosong.', 'Isi teks kutipan tanpa tanda kutip.');
    else if (wordsOf(teks).length > maksKata) err(where, `Teks kutipan ${wordsOf(teks).length} kata.`, `Maksimal ${maksKata} kata supaya muat di layar.`);
    if (((scene.teks ?? '').match(/\*/g) ?? []).length % 2 !== 0) err(where, 'Jumlah tanda * di teks kutipan ganjil.', 'Setiap *bintang* harus berpasangan.');
    if (!scene.sumber?.trim()) err(where, 'sumber kutipan kosong.', "Wajib sebutkan siapa & kapan, contoh sumber: 'Raffles, 1817'.");
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

  // --- Bab (chapter YouTube) ---
  if (scene.bab !== undefined) {
    if (!String(scene.bab).trim()) err(where, 'bab kosong.', "Isi judul bab pendek, contoh bab: 'Asal-usul pesarean', atau hapus field bab.");
    else if (scene.bab.length > 50) warn(where, `Judul bab "${scene.bab}" terlalu panjang.`, 'Maksimal ±50 huruf supaya chapter terbaca di YouTube.');
    if (short) warn(where, 'bab dipakai di video short.', 'YouTube Shorts tidak menampilkan chapter. Hapus field bab.');
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

// --- Musik latar ---
if (script.music) {
  if (!(await exists(script.music))) {
    err('music', `File public/${script.music} tidak ada.`, `Unduh musik dengan node scripts/cari-musik.mjs "<kata kunci>" --slug ${slug}, atau perbaiki path music.`);
  } else {
    const durasiMusik = await audioSeconds(script.music);
    if (durasiMusik === null) {
      err('music', `File musik public/${script.music} tidak bisa dibaca durasinya.`, 'Pastikan file musik valid (MP3/WAV/OGG).');
    }
    const creditsFile = path.resolve('public', path.posix.dirname(script.music), 'credits.json');
    const credits = JSON.parse(await fs.readFile(creditsFile, 'utf8').catch(() => '{}'));
    if (!credits[path.posix.basename(script.music)]) {
      warn(
        'music',
        `Musik ${script.music} belum punya data kredit di credits.json.`,
        `Unduh musik lewat node scripts/cari-musik.mjs "<kata kunci>" --slug ${slug} supaya lisensi & kredit ikut masuk deskripsi YouTube.`,
      );
    }
  }
}

// Semua shot berurutan sepanjang video
const urutan = [];
/** Frame mulai & durasi tiap scene di video (untuk chapter) */
const waktuScene = [];
for (const [i, scene] of scenes.entries()) {
  const shots = (scene.shots ?? (scene.photo ? [{photo: scene.photo}] : [])).filter((s) => s.photo || s.video);
  let duration = scene.duration;
  let words = [];
  if (scene.narasi) {
    const file = script.narasiAudio ? `${script.narasiAudio}/${String(i + 1).padStart(2, '0')}.${script.narasiExt ?? 'mp3'}` : null;
    const seconds = (file && (await audioSeconds(file))) ?? estimateSeconds(scene.narasi);
    const next = i + 1 < scenes.length ? transitionFrames(scenes[i + 1].transition) : 0;
    duration = narasiDuration(scene.duration, seconds, FPS, next);
    words = sceneWords({narasi: scene.narasi, kata: kataJson?.[String(i)] ?? spreadWords(scene.narasi, seconds)}, FPS);
  }
  const prev = waktuScene.at(-1);
  waktuScene.push({start: prev ? prev.start + prev.duration - transitionFrames(scene.transition) : 0, duration});
  const starts = shotStarts(shots, words, duration);
  shots.forEach((shot, k) => {
    const to = k === shots.length - 1 ? duration : starts[k + 1];
    urutan.push({
      scene: i + 1,
      sceneType: scene.type,
      where: `scene ${i + 1} (${scene.type}), shot ${k + 1}`,
      shot,
      media: shot.video ?? shot.photo,
      layout: shot.layout ?? 'full',
      move: shotMove(shot, k, short),
      detik: (to - starts[k]) / FPS,
    });
  });
}

// --- Validasi footage video arsip (durasi klip vs durasi shot + mulai, kredit) ---
const videoCreditsCache = new Map();
let adaVideo = false;
for (const x of urutan) {
  if (!x.shot.video) continue;
  adaVideo = true;
  if (!(await exists(x.shot.video))) continue;
  const folder = path.posix.dirname(x.shot.video);
  if (!videoCreditsCache.has(folder)) {
    const cFile = path.resolve('public', folder, 'credits.json');
    videoCreditsCache.set(folder, JSON.parse(await fs.readFile(cFile, 'utf8').catch(() => '{}')));
  }
  const entry = videoCreditsCache.get(folder)[path.posix.basename(x.shot.video)];
  if (!entry) {
    err(x.where, `Video ${x.shot.video} belum punya data di credits.json.`, `Unduh lewat node scripts/cari-video.mjs "<kata kunci>" --slug ${slug}.`);
  }
  const durasiKlip = (await audioSeconds(x.shot.video)) ?? entry?.durasi ?? null;
  if (durasiKlip === null) {
    err(x.where, `Durasi video public/${x.shot.video} tidak bisa dibaca.`, 'Pastikan file MP4 valid.');
  } else {
    const mulai = x.shot.mulai ?? 0;
    if (mulai + x.detik > durasiKlip + 0.1) {
      err(
        x.where,
        `Pemakaian video (${fmt(mulai + x.detik)} dtk: mulai ${fmt(mulai)} dtk + tampil ${fmt(x.detik)} dtk) melebihi durasi klip (${fmt(durasiKlip)} dtk).`,
        'Kurangi mulai, perpendek durasi tampil shot dengan di, atau pilih klip yang lebih panjang.',
      );
    }
  }
}
if (adaVideo) {
  warn('video', 'Naskah memakai footage video arsip.', 'Pastikan sudah cek _contact-sheet.jpg di public/videos/ bahwa klip tidak berwatermark stasiun TV/arsip.');
}

for (const x of urutan) {
  if (x.detik < RITME.min) {
    rit(x.where, `Shot hanya tampil ${fmt(x.detik)} dtk, terlalu cepat.`, `Minimal ±${fmt(RITME.min)} dtk. Hapus shot ini, atau pindahkan di ke kata yang lebih jauh dari di shot sebelumnya/berikutnya.`);
  } else if (x.detik > RITME.max && x.sceneType !== 'timeline') {
    rit(x.where, `Shot diam ${fmt(x.detik)} dtk, terlalu lama.`, `Maksimal ±${RITME.max} dtk. Tambah shot baru dengan di: '<kata>' di tengah bagian narasi ini (1 foto per ±3 detik).`);
  }
}

const pemakaian = new Map();
for (const x of urutan) pemakaian.set(x.media, [...(pemakaian.get(x.media) ?? []), x.scene]);
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
    rit(`scene ${k + 1}–${j}`, `${j - k} scene ${scenes[k].type} berturut-turut.`, 'Terasa monoton. Sisipkan scene fact (angka/tahun), chapter (kartu bab), timeline (garis waktu), atau kutipan di tengahnya.');
  }
  k = j;
}

// --- Paket YouTube: youtube, thumbnail, aturan chapter ---
if (script.youtube) {
  const judul = script.youtube.judul?.trim() ?? '';
  if (!judul) err('youtube', 'youtube.judul kosong.', "Isi judul video YouTube, contoh youtube: {judul: 'Sejarah Gunung Kawi, Tempat Bertemunya Banyak Tradisi'}.");
  else if (judul.length > 100) err('youtube', `Judul YouTube ${judul.length} huruf.`, 'YouTube menolak judul lebih dari 100 huruf. Ringkas.');
  else if (judul.length > 60) warn('youtube', `Judul YouTube ${judul.length} huruf.`, 'Ideal ≤60 huruf supaya tidak terpotong di hasil pencarian.');
  const tagsTxt = (script.youtube.tags ?? []).join(', ');
  if (tagsTxt.length > 500) err('youtube', `Tags ${tagsTxt.length} huruf.`, 'Batas kolom Tags YouTube 500 huruf. Kurangi jumlah tags.');
  if (!script.youtube.tags?.length) warn('youtube', 'youtube.tags kosong.', "Isi 5–10 kata kunci, contoh tags: ['gunung kawi', 'sejarah malang']. 3 tag pertama jadi hashtag.");
  if (/[<>]/.test(script.youtube.deskripsi ?? '')) warn('youtube', 'Deskripsi berisi tanda < atau >.', 'YouTube tidak mengizinkan tanda itu; paket-youtube akan membuangnya.');
  if ((script.youtube.deskripsi ?? '').length > 3000) warn('youtube', 'Deskripsi lebih dari 3000 huruf.', 'Batas YouTube 5000 huruf termasuk chapter & kredit foto yang ditambahkan otomatis. Ringkas.');
}
if (script.thumbnail) {
  const t = script.thumbnail;
  const n = wordsOf(plain(t.judul ?? '')).filter(Boolean).length;
  if (!n) err('thumbnail', 'thumbnail.judul kosong.', "Isi judul thumbnail ≤5 kata, contoh judul: 'Satu gunung, *banyak tradisi*'.");
  else if (n > 5) err('thumbnail', `Judul thumbnail ${n} kata.`, 'Maksimal 5 kata supaya terbaca di ukuran kecil.');
  if (((t.judul ?? '').match(/\*/g) ?? []).length % 2 !== 0) err('thumbnail', 'Jumlah tanda * di judul thumbnail ganjil.', 'Bungkus frasa kunci berpasangan: *banyak tradisi*.');
  else if (n && !t.judul.includes('*')) warn('thumbnail', 'Judul thumbnail tanpa *stabilo*.', 'Tandai 1 frasa kunci dengan *bintang* supaya mencolok.');
  if (!t.photo) err('thumbnail', 'thumbnail tanpa foto.', "Tulis thumbnail: {judul: '...', ...foto('NN-nama.jpg')}.");
  else if (!(await exists(t.photo))) err('thumbnail', `File public/${t.photo} tidak ada.`, 'Cek nama file di folder foto, salin persis.');
  else if (!t.credit) err('thumbnail', 'Foto thumbnail tanpa kredit.', "Selalu pakai ...foto('nama.jpg'), jangan tulis path foto manual.");
  if (t.sub && t.sub.length > R.tagMax) warn('thumbnail', `thumbnail.sub "${t.sub}" terlalu panjang.`, `Maksimal ±${R.tagMax} huruf.`);
}
const judulBab = (s) => s.bab ?? (s.type === 'chapter' ? plain(s.judul ?? '').trim() : undefined);
const bab = scenes.map((s, i) => (judulBab(s) ? i : -1)).filter((i) => i >= 0);
if (bab.length && !short) {
  if (bab[0] !== 0) err(`scene ${bab[0] + 1}`, 'Bab pertama tidak di scene 1.', "YouTube hanya menampilkan chapter kalau chapter pertama di 0:00. Tambahkan bab: '<judul>' di scene 1.");
  if (bab.length < 3) err('bab', `Hanya ${bab.length} bab.`, 'YouTube butuh minimal 3 chapter. Tambah bab atau scene chapter di bagian cerita baru.');
  const akhir = waktuScene.length ? waktuScene.at(-1).start + waktuScene.at(-1).duration : 0;
  bab.forEach((i, k) => {
    const detik = ((k + 1 < bab.length ? waktuScene[bab[k + 1]].start : akhir) - waktuScene[i].start) / FPS;
    if (detik < 10) err(`scene ${i + 1}`, `Bab "${judulBab(scenes[i])}" hanya ${fmt(detik)} detik.`, 'Setiap chapter YouTube minimal 10 detik. Pindahkan bab berikutnya ke scene yang lebih jauh, atau gabungkan.');
  });
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
  if (!scene.narasi?.trim()) return sum + scene.duration / FPS;
  const words = wordsOf(scene.narasi).length;
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
