// Buat pratinjau foto dengan garis grid tiap 10%, untuk menentukan koordinat anotasi (x, y dalam persen).
//
// Pakai: node scripts/grid-foto.mjs public/photos/borobudur/30-peta-jawa.jpg
// Hasil: out/grid/<nama>.jpg  -> buka/lihat, baca posisi objek pada angka grid (kiri = x, atas = y).

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const src = process.argv[2];
if (!src) {
  console.error('Pakai: node scripts/grid-foto.mjs <path foto>');
  process.exit(1);
}

const resized = await sharp(src).resize({width: 1200}).toBuffer({resolveWithObject: true});
const {width, height} = resized.info;

let svg = `<svg width="${width}" height="${height}">`;
for (let i = 1; i < 10; i++) {
  const x = (width * i) / 10;
  const y = (height * i) / 10;
  svg += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="cyan" stroke-width="1.5" opacity="0.8"/>`;
  svg += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="cyan" stroke-width="1.5" opacity="0.8"/>`;
  svg += `<text x="${x + 4}" y="20" fill="cyan" font-size="18" font-family="Arial" font-weight="bold">x${i * 10}</text>`;
  svg += `<text x="4" y="${y - 4}" fill="cyan" font-size="18" font-family="Arial" font-weight="bold">y${i * 10}</text>`;
}
svg += '</svg>';

const outDir = path.resolve('out/grid');
await fs.mkdir(outDir, {recursive: true});
const out = path.join(outDir, `${path.parse(src).name}.jpg`);
await sharp(resized.data).composite([{input: Buffer.from(svg)}]).jpeg({quality: 85}).toFile(out);
console.log(`Grid: ${path.relative(process.cwd(), out)}`);
console.log("Pakai di shot layout: 'print' -> anotasi: [{x: <kolom>, y: <baris>, w: 8, h: 8, label: '...'}]");
