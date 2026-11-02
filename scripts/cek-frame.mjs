// Render frame kunci setiap scene dan gabungkan jadi SATU lembar kontak bernomor, untuk dicek dengan mata.
// Durasi scene diambil dari audio narasi (sama persis dengan hasil render).
//
// Pakai: node scripts/cek-frame.mjs borobudur
// Hasil: out/cek/<slug>-lembar.jpg  (2 frame per scene: ±35% dan ±85% durasi scene)
//        out/cek/<slug>-NN-<persen>.png  (frame satuan, kalau perlu dilihat lebih detail)

import fs from 'node:fs/promises';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import sharp from 'sharp';

const slug = process.argv[2];
if (!slug) {
  console.error('Pakai: node scripts/cek-frame.mjs <slug>');
  process.exit(1);
}

const id = slug
  .split('-')
  .map((w) => w[0].toUpperCase() + w.slice(1))
  .join('');

// Sama dengan TRANSITION_FRAMES di src/HistoryVideo.tsx
const TRANSITION_FRAMES = 18;
const POINTS = [0.35, 0.85];

const outDir = path.resolve('out/cek');
await fs.mkdir(outDir, {recursive: true});

console.log('Bundle project ...');
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome');

try {
  const composition = await selectComposition({serveUrl, id, inputProps: {}, puppeteerInstance: browser});
  const scenes = composition.props.script.scenes;

  let start = 0;
  const shots = [];
  for (const [i, scene] of scenes.entries()) {
    if (i > 0) start -= scene.transition === 'none' ? 0 : TRANSITION_FRAMES;
    for (const p of POINTS) {
      shots.push({scene: i + 1, type: scene.type, percent: Math.round(p * 100), frame: start + Math.round(scene.duration * p)});
    }
    start += scene.duration;
  }

  console.log(`${scenes.length} scene, ${composition.durationInFrames} frame. Render ${shots.length} frame ...`);
  for (const s of shots) {
    s.file = path.join(outDir, `${slug}-${String(s.scene).padStart(2, '0')}-${s.percent}.png`);
    await renderStill({composition, serveUrl, output: s.file, frame: s.frame, inputProps: {}, puppeteerInstance: browser});
  }

  const W = 640;
  const H = 360;
  const cols = 2;
  const rows = Math.ceil(shots.length / cols);
  const tiles = await Promise.all(
    shots.map(async (s, n) => {
      const label = Buffer.from(
        `<svg width="${W}" height="${H}"><rect width="${W}" height="34" fill="rgba(0,0,0,0.75)"/>` +
          `<text x="10" y="24" font-family="Arial" font-size="20" fill="#ffd54a">Scene ${s.scene} (${s.type}) · ${s.percent}% · frame ${s.frame}</text></svg>`,
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
} finally {
  await browser.close({silent: true});
}
