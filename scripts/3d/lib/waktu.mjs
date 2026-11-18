// Waktu kata dan durasi scene untuk klip 3D. Konstanta dan rumus kata diambil dari engine explainer,
// jadi frame klip sama dengan frame subtitle dan scene di video.
import fs from 'node:fs';
import path from 'node:path';
import {importTs} from '../../lib/load-script.mjs';

let modul = null;

export const muatModulWaktu = () =>
  (modul ??= Promise.all([importTs('src/lib/kata.ts'), importTs('src/explainer/prep.ts')]).then(([kata, prep]) => ({
    kata,
    EKOR_EXPLAINER: prep.EKOR_EXPLAINER,
    TAHAN_AKHIR: prep.TAHAN_AKHIR,
  })));

export const muatKataJson = (script) => {
  if (!script?.narasiAudio) return null;
  const file = path.join('public', script.narasiAudio, 'kata.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
};

/** Kata bertimestamp scene ke-`i` (berbasis 0), frame relatif awal scene. */
export const kataScene = (script, kataJson, i, modul, fps = 30) => {
  const scene = script.scenes[i];
  return modul.kata.sceneWords({narasi: scene?.narasi, kata: kataJson?.[String(i)]}, fps);
};

/** Durasi scene seperti prepareExplainerScript, atau null kalau scene bernarasi belum punya kata. */
export const durasiScene = (script, kataJson, i, modul, fps = 30) => {
  const scene = script.scenes[i];
  const terakhir = i === script.scenes.length - 1;
  const tahanAkhir = terakhir ? modul.TAHAN_AKHIR : 0;
  if (!scene.narasi) return scene.duration + tahanAkhir;
  const kata = kataJson?.[String(i)];
  if (!kata?.length) return null;
  const berikut = terakhir ? 0 : modul.kata.transitionFrames(script.scenes[i + 1].transition ?? 'none');
  const akhir = kata[kata.length - 1][1];
  return modul.kata.NARASI_DELAY + Math.ceil(akhir * fps) + modul.EKOR_EXPLAINER + (scene.tahan ?? 0) + berikut + tahanAkhir;
};

/** Kemunculan ke-`ke` dari kata atau frasa `di`. `idx` -1 kalau tidak ada; `jumlah` = total kemunculan. */
export const cariKata = (words, di, ke = 1, modul) => {
  const posisi = [];
  let dari = 0;
  for (;;) {
    const idx = modul.kata.indexOfWord(words, di, dari);
    if (idx < 0) break;
    posisi.push(idx);
    dari = idx + 1;
  }
  const idx = posisi[ke - 1] ?? -1;
  return {idx, frame: idx >= 0 ? words[idx].start : null, jumlah: posisi.length};
};
