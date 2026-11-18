// P1-P4: klip yang sudah dirender benar-benar terpasang dan masih cocok dengan rencana.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {hashRencana, KANVAS, namaKlip, rencanaGambar, rencanaKlip} from '../rencana.mjs';
import {durasiScene} from '../waktu.mjs';

const durasiFfprobe = (file) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8'}).trim());

export const alatPasang = {ada: fs.existsSync, durasiDetik: durasiFfprobe, hash: hashRencana};

export const cekPasang = (ktx, klip, gambar, lapor, alat = alatPasang) => {
  const render = `Jalankan npm run 3d:render -- ${ktx.slug}`;
  for (const entri of klip) {
    const where = `klip scene ${entri.scene}`;
    const latar = `klip/${ktx.slug}/${namaKlip(entri.scene)}.mp4`;
    const scene = ktx.script.scenes[entri.scene - 1];
    if (scene.latarVideo !== latar) {
      lapor.err(where, `P1 naskah belum memakai klip ini.`, `Isi latarVideo: '${latar}' di scene ${entri.scene}, menggantikan baris latar.`);
    }
    const file = path.join('public', latar);
    if (!alat.ada(file)) {
      lapor.err(where, `P2 file public/${latar} tidak ada.`, render);
    } else {
      const durasi = durasiScene(ktx.script, ktx.kataJson, entri.scene - 1, ktx.modul, KANVAS.fps);
      if (alat.durasiDetik(file) * KANVAS.fps < durasi) lapor.err(where, `P2 klip lebih pendek dari scene (${durasi} frame).`, `${render} --paksa`);
    }
    if (ktx.lock.klip?.[entri.scene] !== alat.hash(rencanaKlip(ktx, entri))) {
      lapor.err(where, 'P3 klip basi: rencana, audio, atau Python berubah sejak render terakhir.', render);
    }
  }
  for (const entri of gambar) {
    const where = `gambar "${entri.nama}"`;
    if (!alat.ada(path.join('public', 'props', `${entri.nama}.png`))) lapor.err(where, `P4 file public/props/${entri.nama}.png tidak ada.`, render);
    if (ktx.lock.gambar?.[entri.nama] !== alat.hash(rencanaGambar(ktx, entri))) lapor.err(where, 'P3 gambar basi.', render);
  }
};
