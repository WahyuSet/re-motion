// Cadangan kalau Flow salah eja merek: tempel label merah-kuning "<PRODUK> OKE SINI" ke prop PNG.
// Generate dulu kemasan dengan label KOSONG ("blank red and yellow front label, no text"), lalu:
//
//   node scripts/label-merek.mjs public/props/<slug>-kemasan.png "MICIN OKE SINI"
//   node scripts/label-merek.mjs <png> "AIR OKE SINI" --x 0.5 --y 0.45 --w 0.62 --h 0.32
//
// --x/--y = pusat label, --w/--h = ukuran label; semuanya pecahan lebar/tinggi gambar (0..1).
// File asli disalin ke public/props/_raw/<nama>-sebelum-label.png sebelum ditimpa.

import fs from 'node:fs/promises';
import path from 'node:path';
import {parseArgs} from 'node:util';
import sharp from 'sharp';

const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {
    x: {type: 'string', default: '0.5'},
    y: {type: 'string', default: '0.45'},
    w: {type: 'string', default: '0.62'},
    h: {type: 'string', default: '0.32'},
  },
});

const [file, teks] = positionals;
if (!file || !teks) {
  console.error('Pakai: node scripts/label-merek.mjs <prop.png> "<PRODUK> OKE SINI" [--x 0.5 --y 0.45 --w 0.62 --h 0.32]');
  process.exit(1);
}
const merek = teks.trim().toUpperCase();
if (!/ OKE SINI$/.test(merek)) {
  console.error(`Merek harus diakhiri "OKE SINI" (dapat: "${merek}").`);
  process.exit(1);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const {width: W, height: H} = await sharp(file).metadata();
const lw = Math.round(W * Number(values.w));
const lh = Math.round(H * Number(values.h));
const lx = Math.round(W * Number(values.x) - lw / 2);
const ly = Math.round(H * Number(values.y) - lh / 2);

// Baris: kata produk di atas, "OKE SINI" di bawah (sama dengan gaya label "MICIN OKE SINI").
const produk = merek.replace(/ OKE SINI$/, '');
const baris = [produk, 'OKE SINI'];
const terpanjang = Math.max(...baris.map((b) => b.length));
const font = Math.floor(Math.min((lw * 0.88) / (terpanjang * 0.56), (lh * 0.8) / (baris.length * 1.02)));
const stroke = Math.max(3, Math.round(font * 0.12));
const tinggiTeks = font * 1.05 * baris.length;
const yAwal = ly + (lh - tinggiTeks) / 2 + font * 0.85;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="${Math.round(lh * 0.06)}" fill="#d32f2f"/>
  <rect x="${lx + lw * 0.04}" y="${ly + lh * 0.06}" width="${lw * 0.92}" height="${lh * 0.88}" rx="${Math.round(lh * 0.05)}" fill="none" stroke="#ffd600" stroke-width="${Math.max(3, Math.round(lh * 0.025))}"/>
  ${baris
    .map(
      (b, i) =>
        `<text x="${lx + lw / 2}" y="${yAwal + i * font * 1.05}" text-anchor="middle" font-family="Arial Black, Impact, Arial, sans-serif" font-weight="900" font-size="${font}" fill="#ffd600" stroke="#8e0000" stroke-width="${stroke}" paint-order="stroke">${esc(b)}</text>`,
    )
    .join('\n  ')}
</svg>`;

const raw = path.join(path.dirname(file), '_raw', `${path.basename(file, '.png')}-sebelum-label.png`);
await fs.mkdir(path.dirname(raw), {recursive: true});
await fs.copyFile(file, raw);
const hasil = await sharp(file).composite([{input: Buffer.from(svg), top: 0, left: 0}]).png().toBuffer();
await fs.writeFile(file, hasil);
console.log(`Label "${merek}" ditempel ke ${file} (asli: ${raw}). Buka PNG-nya untuk cek posisi; atur --x --y --w --h kalau meleset.`);
