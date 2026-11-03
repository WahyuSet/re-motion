// Storyboard untuk disetujui user SEBELUM render: setiap scene menampilkan cuplikan setiap shot,
// waktu tampilnya, dan kata-kata narasi yang diucapkan selama shot itu tampil.
// Timing dihitung dengan modul yang sama dengan video (src/lib/kata.ts), jadi persis sama dengan hasil render.
//
// Pakai: node scripts/storyboard.mjs gunung-kawi
// Hasil: out/storyboard/<slug>-1.jpg, -2.jpg, ...  (4 scene per halaman, untuk dikirim ke user)
//        out/storyboard/<slug>.md                  (versi teks: scene, narasi, shot, kata per shot)

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {bukaKomposisi, idDari, modulKata, tutup, waktuScene} from './lib/komposisi.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('Pakai: node scripts/storyboard.mjs <slug>');
  process.exit(1);
}

const id = idDari(slug);
const FPS = 30;
const SCENES_PER_PAGE = 4;

const {SHOT_OVERLAP} = await modulKata();

const outDir = path.resolve('out/storyboard');
const frameDir = path.join(outDir, 'frame');
await fs.mkdir(frameDir, {recursive: true});

const time = (frame) => {
  const s = Math.max(0, frame) / FPS;
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};
const xml = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = (t) => t.replace(/\*/g, '');
/** Lama shot tampil, contoh '3,2 dtk' (cocokkan dengan catatan RITME di cek-naskah) */
const detik = (x) => `${((x.to - x.from) / FPS).toFixed(1).replace('.', ',')} dtk`;

// Bungkus teks ke beberapa baris berdasarkan perkiraan lebar huruf.
const wrap = (text, maxChars, maxLines) => {
  const lines = [];
  let line = '';
  for (const w of text.split(/\s+/)) {
    if ((line + ' ' + w).trim().length > maxChars) {
      lines.push(line.trim());
      line = w;
    } else {
      line += ' ' + w;
    }
  }
  if (line.trim()) lines.push(line.trim());
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] += ' …';
  }
  return lines;
};

const board = [];
let vertical = false;
try {
  const {composition, renderFrame} = await bukaKomposisi(slug);
  vertical = composition.height > composition.width;

  for (const {index, start: sceneStart, end, scene, shots, words, shotStarts: starts} of await waktuScene(composition)) {
    const shotInfo = shots.map((shot, k) => {
      const from = starts[k];
      const to = k === shots.length - 1 ? scene.duration : starts[k + 1];
      const spoken = words.filter((w) => w.start >= from - 2 && w.start < to - 2).map((w) => w.word);
      // Ambil cuplikan setelah foto selesai masuk, sekitar 55% durasi shot (timeline 1 shot / chapter bernarasi / rute: 80% supaya elemen sudah muncul)
      const p = ((scene.type === 'timeline' || (scene.type === 'chapter' && scene.narasi)) && shots.length === 1) || shot.rute ? 0.8 : 0.55;
      const frame = sceneStart + from + Math.round(Math.max(SHOT_OVERLAP + 8, (to - from) * p));
      return {k: k + 1, shot, from: sceneStart + from, to: sceneStart + to, frame, spoken};
    });
    board.push({n: index + 1, scene, start: sceneStart, end, shots: shotInfo});
  }

  const total = board.reduce((n, b) => n + b.shots.length, 0);
  console.log(`${board.length} scene, ${total} shot. Render cuplikan ...`);
  for (const b of board) {
    for (const s of b.shots) {
      s.file = path.join(frameDir, `${slug}-${String(b.n).padStart(2, '0')}-${s.k}.png`);
      await renderFrame(s.frame, s.file);
    }
  }
} finally {
  await tutup();
}

// ---- Halaman gambar ----
const W = 1900;
// Ukuran cuplikan mengikuti orientasi video (short: tegak, sampai 6 shot per baris)
const THUMB_W = vertical ? 270 : 456;
const THUMB_H = vertical ? 480 : 256;
const MAX_THUMBS = vertical ? 6 : 4;
const CAPTION_CHARS = vertical ? 24 : 44;
const GAP = 12;
const PAD = 20;

const infoShot = (shot) => {
  const pin = (shot.anotasi ?? []).filter((a) => a.bentuk === 'pin').length;
  const ling = (shot.anotasi ?? []).length - pin;
  return [
    shot.di && `di "${shot.di}"`,
    shot.layout === 'print' && 'print',
    pin && `${pin} pin`,
    ling && `${ling} anotasi`,
    shot.rute && `rute${shot.rute.label ? ` "${shot.rute.label}"` : ''}`,
  ]
    .filter(Boolean)
    .join(' · ');
};

const renderBlock = async (b) => {
  const s = b.scene;
  const bab = s.bab ?? (s.type === 'chapter' ? `Bab ${s.nomor}: ${plain(s.judul ?? '')}` : '');
  const header = `Scene ${b.n} · ${s.type} · ${time(b.start)}–${time(b.end)}${b.n > 1 ? ` · transisi: ${s.transition ?? 'dorong'}` : ''}${bab ? `   ▸ BAB: ${bab}` : ''}`;
  const sub = [
    s.tag && `tag: ${s.tag}`,
    s.judul && s.type !== 'chapter' && `judul: ${plain(s.judul)}`,
    s.type === 'fact' && `angka: ${s.value}${s.suffix ?? ''} (${s.label})`,
    s.type === 'timeline' && `titik: ${(s.titik ?? []).map((t) => `${t.tahun} ${t.label}`).join(' → ')}`,
    s.type === 'kutipan' && `kutipan (${s.sumber}): "${plain(s.teks ?? '').slice(0, 60)}${plain(s.teks ?? '').length > 60 ? '…' : ''}"`,
    s.stempel && `stempel: ${s.stempel.teks}`,
  ]
    .filter(Boolean)
    .join('   ·   ');
  const narasi = s.narasi ? wrap(`“${plain(s.narasi)}”`, 120, 3) : ['(tanpa narasi)'];
  const top = 46 + (sub ? 30 : 0) + narasi.length * 32 + 12;
  const captionLines = b.shots.map((x) =>
    wrap(`“${x.spoken.join(' ')}”`, CAPTION_CHARS, vertical ? 4 : 3),
  );
  const captionH = 30 + Math.max(...captionLines.map((l) => l.length), 1) * 26 + 26 + 22;
  const H = top + THUMB_H + captionH + PAD;

  let svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${W}" height="${H}" fill="#1b1713"/><rect width="${W}" height="2" fill="#3a3128"/>`;
  svg += `<text x="${PAD}" y="34" font-family="Arial" font-size="26" font-weight="bold" fill="#ffd54a">${xml(header)}</text>`;
  if (sub) svg += `<text x="${PAD}" y="66" font-family="Arial" font-size="20" fill="#cbbfa8">${xml(sub)}</text>`;
  narasi.forEach((line, li) => {
    svg += `<text x="${PAD}" y="${46 + (sub ? 30 : 0) + 26 + li * 32}" font-family="Arial" font-size="24" font-style="italic" fill="#f3ead7">${xml(line)}</text>`;
  });
  b.shots.forEach((x, k) => {
    const left = PAD + k * (THUMB_W + GAP);
    const cy = top + THUMB_H + 26;
    const info = infoShot(x.shot);
    // di/print/pin/rute di baris abu-abu bawah, supaya label tidak melewati lebar cuplikan
    const label = `Shot ${x.k} · ${time(x.from)} (${detik(x)})`;
    svg += `<text x="${left}" y="${cy}" font-family="Arial" font-size="19" font-weight="bold" fill="#ffd54a">${xml(label)}</text>`;
    captionLines[k].forEach((line, li) => {
      svg += `<text x="${left}" y="${cy + 26 + li * 26}" font-family="Arial" font-size="19" fill="#f3ead7">${xml(line)}</text>`;
    });
    const name = x.shot.photo.split('/').pop().replace(/\.jpg$/, '');
    const nameY = cy + 26 + captionLines[k].length * 26;
    svg += `<text x="${left}" y="${nameY}" font-family="Arial" font-size="16" fill="#8f8473">${xml(name.slice(0, vertical ? 30 : 52))}</text>`;
    if (info) {
      svg += `<text x="${left}" y="${nameY + 22}" font-family="Arial" font-size="16" fill="#8f8473">${xml(info)}</text>`;
    }
  });
  svg += '</svg>';

  const thumbs = await Promise.all(
    b.shots.slice(0, MAX_THUMBS).map(async (x, k) => ({
      input: await sharp(x.file).resize(THUMB_W, THUMB_H).toBuffer(),
      left: PAD + k * (THUMB_W + GAP),
      top,
    })),
  );
  return {buffer: await sharp(Buffer.from(svg)).composite(thumbs).png().toBuffer(), height: H};
};

const pages = [];
for (let p = 0; p < board.length; p += SCENES_PER_PAGE) {
  const blocks = await Promise.all(board.slice(p, p + SCENES_PER_PAGE).map(renderBlock));
  const height = blocks.reduce((h, b) => h + b.height, 0);
  let y = 0;
  const layers = blocks.map((b) => {
    const layer = {input: b.buffer, left: 0, top: y};
    y += b.height;
    return layer;
  });
  const file = path.join(outDir, `${slug}-${pages.length + 1}.jpg`);
  await sharp({create: {width: W, height, channels: 3, background: '#1b1713'}}).composite(layers).jpeg({quality: 82}).toFile(file);
  pages.push(file);
}

// ---- Versi teks ----
const md = [`# Storyboard ${id}`, '', `Total ${time(board.at(-1).end)}, ${board.length} scene.`, ''];
for (const b of board) {
  const s = b.scene;
  md.push(`## Scene ${b.n} (${s.type}) ${time(b.start)}–${time(b.end)}`);
  if (s.bab) md.push(`- Bab (chapter YouTube): ${s.bab}`);
  else if (s.type === 'chapter') md.push(`- Kartu bab ${s.nomor} (chapter YouTube): ${plain(s.judul ?? '')}`);
  if (s.tag) md.push(`- Tag: ${s.tag}`);
  if (s.judul && s.type !== 'chapter') md.push(`- Judul: ${plain(s.judul)}`);
  if (s.type === 'fact') md.push(`- Angka: ${s.value}${s.suffix ?? ''} — ${s.label}`);
  if (s.type === 'timeline') md.push(`- Garis waktu: ${(s.titik ?? []).map((t) => `${t.tahun} ${t.label}${t.di ? ` (di "${t.di}")` : ''}`).join(' → ')}`);
  if (s.type === 'kutipan') md.push(`- Kutipan (${s.sumber}): "${plain(s.teks ?? '')}"`);
  if (s.stempel) md.push(`- Stempel: ${s.stempel.teks}`);
  md.push(`- Narasi: ${s.narasi ? plain(s.narasi) : '(tanpa narasi)'}`);
  for (const x of b.shots) {
    const info = infoShot(x.shot);
    md.push(`  - Shot ${x.k} (${time(x.from)}, ${detik(x)}${info ? `, ${info}` : ''}): ${x.shot.photo.split('/').pop()} — kata: "${x.spoken.join(' ')}"`);
  }
  md.push('');
}
await fs.writeFile(path.join(outDir, `${slug}.md`), md.join('\n'));

console.log(`\nStoryboard (${pages.length} halaman):`);
for (const p of pages) console.log(`  ${path.relative(process.cwd(), p)}`);
console.log(`  out/storyboard/${slug}.md`);
console.log('Kirim halaman-halaman ini ke user dan tunggu persetujuan sebelum render.');
