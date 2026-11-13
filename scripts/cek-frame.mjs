// Render frame kunci setiap scene dan gabungkan jadi SATU lembar kontak bernomor, untuk dicek dengan mata.
// Durasi scene diambil dari audio narasi (sama persis dengan hasil render).
//
// Pakai: node scripts/cek-frame.mjs borobudur            (2 frame per scene: ±35% dan ±85% durasi scene)
//       node scripts/cek-frame.mjs borobudur --rapat    (explainer: + frame tiap item masuk dan serah-terima)
// Hasil: out/cek/<slug>-lembar.jpg
//        out/cek/<slug>-NN-<persen>.png  (frame satuan; mode --rapat: <slug>-NN-f<frame>.png)

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {bukaKomposisi, tutup, waktuScene} from './lib/komposisi.mjs';
import {importTs} from './lib/load-script.mjs';
import {frameRapat} from './lib/frame-rapat.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('Pakai: node scripts/cek-frame.mjs <slug>');
  process.exit(1);
}

const {SAFE_SHORT} = await importTs('src/lib/safe.ts');
const POINTS = [0.35, 0.85];
const rapat = process.argv.includes('--rapat');
const {waktuItem} = rapat ? await importTs('src/explainer/timing.ts') : {};

const outDir = path.resolve('out/cek');
await fs.mkdir(outDir, {recursive: true});

try {
  const {composition, renderFrame} = await bukaKomposisi(slug);
  const waktu = await waktuScene(composition);

  const shots = waktu.flatMap(({index, start, scene, words}) => {
    const lokal = rapat ? frameRapat(scene, words, waktuItem) : POINTS.map((p) => Math.round(scene.duration * p));
    return lokal.map((f) => ({scene: index + 1, type: scene.type, percent: Math.round((f / scene.duration) * 100), frame: start + f}));
  });

  console.log(`${waktu.length} scene, ${composition.durationInFrames} frame. Render ${shots.length} frame ...`);
  for (const s of shots) {
    s.file = path.join(outDir, `${slug}-${String(s.scene).padStart(2, '0')}-${rapat ? `f${String(s.frame).padStart(5, '0')}` : s.percent}.png`);
    await renderFrame(s.frame, s.file);
  }

  // Ukuran kotak mengikuti orientasi video. Video short: garis merah = area yang tertutup tombol/caption aplikasi.
  const vertical = composition.height > composition.width;
  const W = vertical ? 360 : 640;
  const H = vertical ? 640 : 360;
  const cols = vertical ? 4 : 2;
  const k = W / composition.width;
  const safeOverlay = vertical
    ? `<rect x="0" y="0" width="${W}" height="${SAFE_SHORT.top * k}" fill="rgba(255,40,40,0.22)"/>` +
      `<rect x="0" y="${H - SAFE_SHORT.bottom * k}" width="${W}" height="${SAFE_SHORT.bottom * k}" fill="rgba(255,40,40,0.22)"/>` +
      `<rect x="${W - SAFE_SHORT.right * k}" y="0" width="${SAFE_SHORT.right * k}" height="${H}" fill="rgba(255,40,40,0.22)"/>` +
      `<rect x="0" y="0" width="${SAFE_SHORT.left * k}" height="${H}" fill="rgba(255,40,40,0.22)"/>`
    : '';
  const rows = Math.ceil(shots.length / cols);
  const tiles = await Promise.all(
    shots.map(async (s, n) => {
      const label = Buffer.from(
        `<svg width="${W}" height="${H}">${safeOverlay}<rect width="${W}" height="34" fill="rgba(0,0,0,0.75)"/>` +
          `<text x="10" y="24" font-family="Arial" font-size="${vertical ? 17 : 20}" fill="#ffd54a">Scene ${s.scene} (${s.type}) · ${s.percent}% · frame ${s.frame}</text></svg>`,
      );
      const img = await sharp(s.file).resize(W, H).composite([{input: label}]).toBuffer();
      return {input: img, left: (n % cols) * (W + 8), top: Math.floor(n / cols) * (H + 8)};
    }),
  );
  const sheet = path.join(outDir, `${slug}-lembar.jpg`);
  await sharp({create: {width: cols * (W + 8), height: rows * (H + 8), channels: 3, background: '#000'}})
    .composite(tiles)
    .jpeg({quality: 82})
    .toFile(sheet);

  console.log(`\nLembar kontak: out/cek/${slug}-lembar.jpg`);
  console.log('Cek tiap kotak: subtitle terbaca? tag/judul tidak tertutup? anotasi menunjuk objek yang benar? tidak ada layar hitam/kosong?');
  if (vertical) console.log('Video short: tidak boleh ada teks/objek penting di area merah (tertutup tombol & caption aplikasi).');
} finally {
  await tutup();
}
