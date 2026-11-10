// Buka komposisi Remotion dari Node + hitung waktu tiap scene, dipakai bersama oleh
// cek-frame, storyboard, uji-regresi (dan script render/paket berikutnya).
// Timing memakai src/lib/kata.ts, jadi persis sama dengan hasil render.

import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {importTs} from './load-script.mjs';

/** 'gunung-kawi' -> 'GunungKawi' (id Composition di Root.tsx) */
export const idDari = (slug) =>
  slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');

/** 'GunungKawi' -> 'gunung-kawi' */
export const slugDari = (id) => id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

let proyek = null;

// Bundle + browser cukup sekali per proses, walau komposisi yang dibuka lebih dari satu.
const bukaProyek = () => {
  proyek ??= (async () => {
    console.log('Bundle project ...');
    const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
    const browser = await openBrowser('chrome');
    return {serveUrl, browser};
  })();
  return proyek;
};

/** Tutup browser. Panggil di blok finally. */
export const tutup = async () => {
  if (!proyek) return;
  const {browser} = await proyek;
  proyek = null;
  await browser.close({silent: true});
};

/**
 * Buka komposisi video (slug 'gunung-kawi' atau id 'GunungKawi').
 * Hasil: {composition, serveUrl, browser, renderFrame(frame, output, opsi?)}
 * `opsi` diteruskan ke renderStill, misalnya {imageFormat: 'jpeg', jpegQuality: 90}.
 */
export const bukaKomposisi = async (slugAtauId, inputProps = {}) => {
  const id = /[A-Z]/.test(slugAtauId[0]) ? slugAtauId : idDari(slugAtauId);
  const {serveUrl, browser} = await bukaProyek();
  const composition = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: browser});
  const renderFrame = (frame, output, opsi = {}) =>
    renderStill({composition, serveUrl, output, frame, inputProps, puppeteerInstance: browser, ...opsi});
  return {composition, serveUrl, browser, renderFrame};
};

/** Modul timing src/lib/kata.ts (di-cache) */
let kata = null;
export const modulKata = () => (kata ??= importTs('src/lib/kata.ts'));

/**
 * Waktu tiap scene dalam frame video (sudah dikurangi tumpang tindih transisi):
 * [{index, start, end, scene, shots, words, shotStarts}]
 * - words: kata narasi bertimestamp (frame relatif awal scene)
 * - shotStarts: frame mulai tiap shot (relatif awal scene)
 */
const virtualShots = (scene, words, indexOfWord) => {
  const raw = [
    ...(scene.langkah ?? []).map((l) => ({photo: l.label ?? scene.type, di: l.di})),
    ...(scene.items ?? [])
      .filter((it) => it.di)
      .map((it) => ({photo: it.src ?? it.teks ?? it.kind ?? scene.type, di: it.di})),
  ];
  const seen = new Set();
  const unique = raw
    .filter((s) => {
      if (!s.di || seen.has(s.di)) return false;
      seen.add(s.di);
      return true;
    })
    .map((s) => ({...s, wordIdx: indexOfWord(words, s.di)}))
    .filter((s) => s.wordIdx >= 0)
    .sort((a, b) => a.wordIdx - b.wordIdx);
  return [{photo: scene.utama?.src ?? scene.baris1 ?? scene.judul ?? scene.teks ?? scene.type}, ...unique.slice(0, 3)];
};

export const waktuScene = async (composition) => {
  const {indexOfWord, sceneWords, shotStarts, transitionFrames} = await modulKata();
  const fps = composition.fps;
  let start = 0;
  return composition.props.script.scenes.map((scene, index) => {
    if (index > 0) start -= transitionFrames(scene.transition);
    const words = sceneWords(scene, fps);
    const shots =
      scene.shots ??
      (scene.photo ? [{photo: scene.photo, credit: scene.credit}] : virtualShots(scene, words, indexOfWord));
    const item = {index, start, end: start + scene.duration, scene, shots, words, shotStarts: shotStarts(shots, words, scene.duration)};
    start += scene.duration;
    return item;
  });
};
