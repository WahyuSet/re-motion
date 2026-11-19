// Render klip 3D Blender (headless) dari rencana JSON -> public/klip/<slug>/<nama>.mp4
//
// Modul OPSIONAL: hanya dipakai kalau user meminta klip 3D. Engine explainer tetap utama;
// klip dipasang ke scene lewat `latarVideo: 'klip/<slug>/<nama>.mp4'`.
//
// Pakai: npm run blender -- <slug>                 rencana di src/explainer/data/<slug>.blender.json
//        npm run blender -- path/ke/rencana.json   rencana di file lain (contoh: scripts/blender/contoh.blender.json)
//        npm run blender -- <slug> --klip 01       hanya satu klip
// Blender dicari di env BLENDER, PATH, lalu C:\Program Files\Blender Foundation\.

import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const iKlip = args.indexOf('--klip');
const hanyaKlip = iKlip >= 0 ? args[iKlip + 1] : null;
// --uji: render tiap frame ke-15 di resolusi 30% lalu susun jadi lembar kontak (cek komposisi sebelum render penuh)
const uji = args.includes('--uji');

if (!target) {
  console.error('Pakai: npm run blender -- <slug | rencana.json> [--klip <nama>]');
  process.exit(1);
}

const fileRencana = target.endsWith('.json') ? path.resolve(target) : path.resolve(`src/explainer/data/${target}.blender.json`);
if (!fs.existsSync(fileRencana)) {
  console.error(`✗ Rencana tidak ditemukan: ${path.relative('.', fileRencana)}`);
  process.exit(1);
}
const rencana = JSON.parse(fs.readFileSync(fileRencana, 'utf8'));
const slug = rencana.slug ?? target;
const fps = rencana.fps ?? 30;

const cariBlender = () => {
  if (process.env.BLENDER && fs.existsSync(process.env.BLENDER)) return process.env.BLENDER;
  try {
    const hasil = execFileSync(process.platform === 'win32' ? 'where' : 'which', ['blender'], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).split(/\r?\n/)[0].trim();
    if (hasil) return hasil;
  } catch {}
  const root = 'C:\\Program Files\\Blender Foundation';
  if (fs.existsSync(root)) {
    const versi = fs
      .readdirSync(root)
      .filter((d) => fs.existsSync(path.join(root, d, 'blender.exe')))
      .sort((a, b) => b.localeCompare(a, undefined, {numeric: true}));
    if (versi.length) return path.join(root, versi[0], 'blender.exe');
  }
  return null;
};

const blender = cariBlender();
if (!blender) {
  console.error('✗ Blender tidak ditemukan. Install (winget install BlenderFoundation.Blender) atau isi env BLENDER.');
  process.exit(1);
}

const pyScript = path.resolve('scripts/blender/bangun-adegan.py');
const daftarKlip = rencana.klip.filter((k) => !hanyaKlip || k.nama === hanyaKlip);
if (!daftarKlip.length) {
  console.error(`✗ Klip "${hanyaKlip}" tidak ada di rencana.`);
  process.exit(1);
}

const outKlip = path.resolve('public/klip', slug);
if (daftarKlip.some((k) => !k.gambar)) fs.mkdirSync(outKlip, {recursive: true});
console.log(`Blender: ${blender}`);

for (const k of daftarKlip) {
  const folderFrame = path.resolve('out/blender', slug, k.nama);
  fs.rmSync(folderFrame, {recursive: true, force: true});
  const mulai = Date.now();
  const r = spawnSync(blender, ['-b', '--factory-startup', '-P', pyScript, '--', fileRencana, folderFrame, k.nama, ...(uji ? ['uji'] : [])], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const detikRender = (Date.now() - mulai) / 1000;
  if (r.status !== 0) {
    console.error(r.stdout?.split(/\r?\n/).slice(-20).join('\n'));
    console.error(r.stderr);
    console.error(`✗ Render klip ${k.nama} gagal (kode ${r.status}).`);
    process.exit(1);
  }
  if (uji) {
    const {default: sharp} = await import('sharp');
    const frames = fs.readdirSync(folderFrame).filter((f) => f.endsWith('.png')).sort();
    const kecil = await Promise.all(frames.map((f) => sharp(path.join(folderFrame, f)).resize(216).png().toBuffer()));
    const {height} = await sharp(kecil[0]).metadata();
    const kolom = Math.min(6, kecil.length);
    const baris = Math.ceil(kecil.length / kolom);
    const lembar = path.resolve('out/blender', slug, `${k.nama}-uji.jpg`);
    await sharp({create: {width: kolom * 220, height: baris * (height + 4), channels: 3, background: '#ffffff'}})
      .composite(kecil.map((input, i) => ({input, left: (i % kolom) * 220, top: Math.floor(i / kolom) * (height + 4)})))
      .jpeg()
      .toFile(lembar);
    console.log(`✓ uji ${k.nama}: ${frames.length} frame -> ${path.relative('.', lembar).replaceAll('\\', '/')} (${detikRender.toFixed(1)} dtk)`);
    continue;
  }
  if (k.gambar) {
    // Prop cutout: ambil frame terakhir (latar bening), pangkas sisi kosongnya, simpan di public/<gambar>
    const {default: sharp} = await import('sharp');
    const frames = fs.readdirSync(folderFrame).filter((f) => f.endsWith('.png')).sort();
    const tujuan = path.resolve('public', k.gambar);
    fs.mkdirSync(path.dirname(tujuan), {recursive: true});
    await sharp(path.join(folderFrame, frames.at(-1))).trim().png().toFile(tujuan);
    console.log(`✓ public/${k.gambar} (prop PNG transparan), render ${detikRender.toFixed(1)} dtk`);
    continue;
  }
  const mp4 = path.join(outKlip, `${k.nama}.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(folderFrame, '%05d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', mp4]);
  console.log(
    `✓ ${path.relative('.', mp4).replaceAll('\\', '/')}: ${k.durasi} dtk klip, render ${detikRender.toFixed(1)} dtk (${(detikRender / k.durasi).toFixed(1)} dtk per detik klip)`,
  );
}
console.log(`\nPasang di naskah: latarVideo: 'klip/${slug}/<nama>.mp4'`);
