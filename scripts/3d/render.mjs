// Render klip 3D. Pakai: npm run 3d:uji -- <slug>     lembar kontak resolusi kecil
//                        npm run 3d:render -- <slug>  klip penuh, klip yang tidak berubah dilewati
//                        npm run 3d:render -- <slug> --paksa
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {cek3d} from './cek.mjs';
import {cariBlender, jalankanBlender} from './lib/blender.mjs';
import {bacaLock, hashRencana, KANVAS, muatKonteks, namaKlip, rencanaGambar, rencanaKlip, tulisLock} from './lib/rencana.mjs';

const LEBAR_SEL = 216;
const KOLOM = 6;

const encodeAsli = (folder, mp4, fps) =>
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-start_number', '0', '-i', path.join(folder, '%05d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', mp4]);

const potongPngAsli = async (src, dst) => {
  fs.mkdirSync(path.dirname(dst), {recursive: true});
  await sharp(src).trim().png().toFile(dst);
};

const salinAsli = (src, dst) => {
  fs.mkdirSync(path.dirname(dst), {recursive: true});
  fs.copyFileSync(src, dst);
};

/** Tiap frame diberi persegi zona_subjek, supaya subjek yang keluar area langsung terlihat. */
export const lembarUjiAsli = async (folder, jpg, [kiri, atas, kanan, bawah]) => {
  const tinggiSel = Math.round((LEBAR_SEL * KANVAS.tinggi) / KANVAS.lebar);
  const persegi = Buffer.from(
    `<svg width="${LEBAR_SEL}" height="${tinggiSel}"><rect x="${(kiri / 100) * LEBAR_SEL}" y="${(atas / 100) * tinggiSel}" width="${((kanan - kiri) / 100) * LEBAR_SEL}" height="${((bawah - atas) / 100) * tinggiSel}" fill="none" stroke="#ff00aa" stroke-width="2"/></svg>`,
  );
  const frame = fs.readdirSync(folder).filter((f) => f.endsWith('.png')).sort();
  const sel = await Promise.all(
    frame.map((f) => sharp(path.join(folder, f)).resize(LEBAR_SEL, tinggiSel).composite([{input: persegi}]).png().toBuffer()),
  );
  const kolom = Math.min(KOLOM, sel.length);
  await sharp({create: {width: kolom * (LEBAR_SEL + 4), height: Math.ceil(sel.length / kolom) * (tinggiSel + 4), channels: 3, background: '#ffffff'}})
    .composite(sel.map((input, i) => ({input, left: (i % kolom) * (LEBAR_SEL + 4), top: Math.floor(i / kolom) * (tinggiSel + 4)})))
    .jpeg()
    .toFile(jpg);
};

export const buatAlat = (blender) => ({
  root: '.',
  konteks: muatKonteks,
  cek: cek3d,
  hash: hashRencana,
  render: (rencanaFile, folderFrame, uji) => jalankanBlender({blender, rencanaFile, folderFrame, uji}),
  encode: encodeAsli,
  potongPng: potongPngAsli,
  lembarUji: lembarUjiAsli,
  salin: salinAsli,
});

const fileFrame = (folder) => fs.readdirSync(folder).filter((f) => f.endsWith('.png')).sort();

export const jalankanRender = async (slug, {uji = false, paksa = false} = {}, alat) => {
  const {errors} = await alat.cek(slug, {pasang: false});
  if (errors.length) throw new Error(`Render ditolak, cek:3d masih punya error:\n${errors.join('\n')}`);

  const ktx = await alat.konteks(slug);
  const dirData = path.join(alat.root, 'src/explainer/data');
  const dirOut = path.join(alat.root, 'out/3d', slug);
  fs.mkdirSync(dirOut, {recursive: true});
  const lock = bacaLock(slug, dirData) ?? {versi: 1, klip: {}, gambar: {}};
  const hasil = {dirender: 0, dilewati: 0};
  const ulang = `npm run ${uji ? '3d:uji' : '3d:render'} -- ${slug}`;

  const renderSatu = async (nama, rencana) => {
    const rencanaFile = path.join(dirOut, `${nama}.json`);
    const folder = path.join(dirOut, nama);
    fs.writeFileSync(rencanaFile, `${JSON.stringify(rencana, null, 2)}\n`);
    fs.rmSync(folder, {recursive: true, force: true});
    const r = await alat.render(rencanaFile, folder, uji);
    if (r.status !== 0) throw new Error(`Render ${nama} gagal (kode ${r.status}).\n${r.ekor}\nUlangi: ${ulang}`);
    const frame = fs.existsSync(folder) ? fileFrame(folder) : [];
    if (!uji && frame.length !== rencana.frame_akhir) {
      throw new Error(`Render ${nama} hanya menghasilkan ${frame.length} dari ${rencana.frame_akhir} frame.\nUlangi: ${ulang}`);
    }
    return {folder, frame};
  };

  const lewati = (hash, tersimpan, tujuan) => !paksa && tersimpan === hash && fs.existsSync(tujuan);

  for (const entri of ktx.data.klip) {
    const nama = namaKlip(entri.scene);
    const rencana = rencanaKlip(ktx, entri);
    const hash = alat.hash(rencana);
    const tujuan = path.join(alat.root, 'public/klip', slug, `${nama}.mp4`);
    if (!uji && lewati(hash, lock.klip[entri.scene], tujuan)) {
      hasil.dilewati++;
      continue;
    }
    const {folder} = await renderSatu(nama, rencana);
    hasil.dirender++;
    if (uji) {
      await alat.lembarUji(folder, path.join(dirOut, `${nama}-uji.jpg`), ktx.katalog.set[entri.set].kamera[entri.kamera].zona_subjek);
      continue;
    }
    const mp4 = path.join(dirOut, `${nama}.mp4`);
    await alat.encode(folder, mp4, rencana.fps);
    await alat.salin(mp4, tujuan);
    lock.klip[entri.scene] = hash;
    tulisLock(slug, lock, dirData);
  }

  if (uji) return hasil;

  for (const entri of ktx.data.gambar ?? []) {
    const rencana = rencanaGambar(ktx, entri);
    const hash = alat.hash(rencana);
    const tujuan = path.join(alat.root, 'public/props', `${entri.nama}.png`);
    if (lewati(hash, lock.gambar[entri.nama], tujuan)) {
      hasil.dilewati++;
      continue;
    }
    const {folder, frame} = await renderSatu(entri.nama, rencana);
    hasil.dirender++;
    await alat.potongPng(path.join(folder, frame[frame.length - 1]), tujuan);
    lock.gambar[entri.nama] = hash;
    tulisLock(slug, lock, dirData);
  }
  return hasil;
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith('--'));
  const uji = args.includes('--uji');
  if (!slug) {
    console.error('Pakai: npm run 3d:uji -- <slug>  atau  npm run 3d:render -- <slug> [--paksa]');
    process.exit(1);
  }
  const blender = cariBlender();
  if (!blender) {
    console.error('✗ Blender tidak ditemukan. Pasang dengan: winget install BlenderFoundation.Blender, atau isi env BLENDER.');
    process.exit(1);
  }
  try {
    const hasil = await jalankanRender(slug, {uji, paksa: args.includes('--paksa')}, buatAlat(blender));
    console.log(`✓ ${hasil.dirender} dirender, ${hasil.dilewati} dilewati.`);
    if (uji) {
      console.log(`Lihat lembar kontak: out/3d/${slug}/scene-NN-uji.jpg. Subjek harus berada di dalam persegi.`);
    } else {
      const {data} = await muatKonteks(slug);
      for (const {scene} of data.klip) console.log(`scene ${scene}: latarVideo: 'klip/${slug}/${namaKlip(scene)}.mp4'`);
    }
  } catch (e) {
    console.error(`✗ ${e.message}`);
    process.exit(1);
  }
}
