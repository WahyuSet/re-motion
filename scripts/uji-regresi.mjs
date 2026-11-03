// Uji regresi visual: pastikan perubahan engine tidak mengubah tampilan video yang sudah ada.
//
// Pakai: npm run uji -- --simpan          simpan frame acuan (jalankan SEBELUM mengubah engine)
//        npm run uji                      render ulang frame yang sama, bandingkan pixel per pixel
//        npm run uji -- Borobudur ...     hanya komposisi tertentu (id atau slug)
//
// Default: semua video di src/data/daftar.ts yang naskahnya sudah di-commit ke git
// (video yang masih dikerjakan, misalnya oleh agent lain, otomatis dilewati).
// Hasil: out/baseline/<Id>-<frame>.png + out/baseline/daftar.json (acuan)
//        out/uji/<Id>-<frame>.png, dan <Id>-<frame>-beda.png kalau ada pixel beda (merah = beda)
// Keluar dengan kode 1 kalau ada frame yang beda atau durasi berubah.

import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {bukaKomposisi, idDari, slugDari, tutup} from './lib/komposisi.mjs';

const args = process.argv.slice(2);
const simpan = args.includes('--simpan');
const pilihan = args.filter((a) => !a.startsWith('--')).map((a) => (/[A-Z]/.test(a[0]) ? a : idDari(a)));

/** Posisi frame acuan, dalam proporsi durasi komposisi */
const TITIK = [0.05, 0.27, 0.5, 0.73, 0.95];

const baseDir = path.resolve('out/baseline');
const ujiDir = path.resolve('out/uji');
const daftarFile = path.join(baseDir, 'daftar.json');

const tercatatGit = (file) => {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', file], {stdio: 'ignore'});
    return true;
  } catch {
    return false;
  }
};

const idTerdaftar = async () => {
  const daftar = await fs.readFile('src/data/daftar.ts', 'utf8');
  return [...daftar.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
};

// Jumlah pixel yang berbeda + gambar penanda (pixel beda merah di atas versi acuan yang diredupkan)
const bandingkan = async (fileA, fileB, fileBeda) => {
  const a = await sharp(fileA).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const b = await sharp(fileB).removeAlpha().raw().toBuffer({resolveWithObject: true});
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
    return {beda: a.info.width * a.info.height, ukuran: `${a.info.width}×${a.info.height} -> ${b.info.width}×${b.info.height}`};
  }
  const pixels = a.info.width * a.info.height;
  const mark = Buffer.alloc(pixels * 3);
  let beda = 0;
  let maks = 0;
  for (let p = 0; p < pixels; p++) {
    const i = p * 3;
    const d = Math.max(Math.abs(a.data[i] - b.data[i]), Math.abs(a.data[i + 1] - b.data[i + 1]), Math.abs(a.data[i + 2] - b.data[i + 2]));
    if (d > 0) {
      beda++;
      maks = Math.max(maks, d);
      mark[i] = 255;
    } else {
      mark[i] = mark[i + 1] = mark[i + 2] = a.data[i + 1] >> 2;
    }
  }
  if (beda) await sharp(mark, {raw: {width: a.info.width, height: a.info.height, channels: 3}}).png().toFile(fileBeda);
  return {beda, maks, persen: (beda / pixels) * 100};
};

const fmtDurasi = (frames, fps) => `${frames} frame (${(frames / fps).toFixed(1)} dtk)`;

try {
  if (simpan) {
    let ids = pilihan.length ? pilihan : await idTerdaftar();
    if (!pilihan.length) {
      const lewati = ids.filter((id) => !tercatatGit(`src/data/${slugDari(id)}.ts`));
      ids = ids.filter((id) => !lewati.includes(id));
      if (lewati.length) console.log(`Dilewati (naskah belum di-commit): ${lewati.join(', ')}`);
    }
    await fs.rm(baseDir, {recursive: true, force: true});
    await fs.mkdir(baseDir, {recursive: true});
    const catatan = {dibuat: new Date().toISOString(), komposisi: []};
    for (const id of ids) {
      const {composition, renderFrame} = await bukaKomposisi(id);
      const frames = TITIK.map((t) => Math.min(composition.durationInFrames - 1, Math.round(composition.durationInFrames * t)));
      process.stdout.write(`${id}: ${fmtDurasi(composition.durationInFrames, composition.fps)}, frame ${frames.join(', ')} ... `);
      for (const frame of frames) await renderFrame(frame, path.join(baseDir, `${id}-${frame}.png`));
      console.log('tersimpan');
      catatan.komposisi.push({id, width: composition.width, height: composition.height, fps: composition.fps, durasi: composition.durationInFrames, frames});
    }
    await fs.writeFile(daftarFile, JSON.stringify(catatan, null, 2));
    console.log(`\nAcuan tersimpan: out/baseline/ (${catatan.komposisi.length} komposisi, ${catatan.komposisi.length * TITIK.length} frame).`);
    console.log('Setelah mengubah engine, jalankan: npm run uji');
  } else {
    let catatan;
    try {
      catatan = JSON.parse(await fs.readFile(daftarFile, 'utf8'));
    } catch {
      console.error('✗ Belum ada acuan (out/baseline/daftar.json). Jalankan dulu SEBELUM mengubah engine: npm run uji -- --simpan');
      process.exit(1);
    }
    const daftar = pilihan.length ? catatan.komposisi.filter((k) => pilihan.includes(k.id)) : catatan.komposisi;
    for (const id of pilihan) if (!daftar.some((k) => k.id === id)) console.log(`⚠ ${id} tidak ada di acuan, dilewati.`);
    await fs.rm(ujiDir, {recursive: true, force: true});
    await fs.mkdir(ujiDir, {recursive: true});

    let gagal = 0;
    for (const acuan of daftar) {
      const {composition, renderFrame} = await bukaKomposisi(acuan.id);
      const durasiOk = composition.durationInFrames === acuan.durasi;
      if (!durasiOk) gagal++;
      console.log(
        `\n${acuan.id}: durasi ${durasiOk ? `sama, ${fmtDurasi(acuan.durasi, acuan.fps)}` : `BERUBAH ${acuan.durasi} -> ${composition.durationInFrames} frame`}`,
      );
      for (const frame of acuan.frames) {
        const file = path.join(ujiDir, `${acuan.id}-${frame}.png`);
        const fileBeda = path.join(ujiDir, `${acuan.id}-${frame}-beda.png`);
        await renderFrame(frame, file);
        const hasil = await bandingkan(path.join(baseDir, `${acuan.id}-${frame}.png`), file, fileBeda);
        if (hasil.beda) gagal++;
        console.log(
          hasil.beda
            ? `  ✗ frame ${frame}: ${hasil.beda} pixel beda (${hasil.ukuran ?? `${hasil.persen.toFixed(3)}%, selisih maks ${hasil.maks}`}) -> out/uji/${path.basename(fileBeda)}`
            : `  ✓ frame ${frame}: 0 pixel beda`,
        );
      }
    }
    console.log(`\n${gagal ? `✗ GAGAL: ${gagal} frame/durasi berbeda dari acuan.` : `✓ LULUS: ${daftar.length} komposisi identik dengan acuan.`}`);
    if (gagal) process.exitCode = 1;
  }
} finally {
  await tutup();
}
