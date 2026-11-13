import {estimateSeconds, NARASI_DELAY, spreadWords, transitionFrames} from '../lib/kata';
import {applyNarasi} from '../lib/narasi';
import type {VideoScript, WordTiming} from '../types';
import type {ExplainerScene, ExplainerScript} from './types';

/**
 * Frame tambahan di akhir scene terakhir. TTS hampir tanpa jeda setelah kalimat penutup, padahal
 * kalimat itu sering berisi punchline (callback); tanpa tahanan, visual gag-nya cuma lewat sekilas.
 */
export const TAHAN_AKHIR = 30;

/**
 * Jeda setelah kata terakhir sebelum scene berganti (frame). Lebih rapat dari NARASI_TAIL (12) milik
 * video sejarah: Shorts butuh tempo cepat. Dihitung dari akhir kata terakhir (kata.json), bukan dari
 * panjang file audio, jadi hening sisa potongan TTS tidak ikut memperlambat.
 */
export const EKOR_EXPLAINER = 6;

const tahanAkhir = (scenes: ExplainerScene[]): ExplainerScene[] =>
  scenes.map((s, i) => (i === scenes.length - 1 ? {...s, duration: s.duration + TAHAN_AKHIR} : s));

export const explainerTransitionFrames = (scene?: ExplainerScene) =>
  transitionFrames(scene?.transition ?? 'none');

export const getExplainerDuration = (script: ExplainerScript) =>
  script.scenes.reduce(
    (total, scene, i) => total + scene.duration - (i === 0 ? 0 : explainerTransitionFrames(scene)),
    0,
  );

/**
 * Durasi scene bernarasi = jeda awal + sampai kata terakhir selesai + ekor + `tahan` + transisi berikutnya.
 * `duration` di naskah diabaikan untuk scene bernarasi: angka itu cuma perkiraan sebelum audio ada, dan
 * dulu membuat hening sampai 2 detik di antara scene. Jeda yang disengaja ditulis lewat `tahan`.
 */
const durasiNarasi = (scene: ExplainerScene, fps: number, nextTransition: number) => {
  const kata = scene.kata as WordTiming[] | undefined;
  const last = kata?.[kata.length - 1];
  const akhir = Array.isArray(last) ? last[1] : estimateSeconds(scene.narasi ?? '');
  return NARASI_DELAY + Math.ceil(akhir * fps) + EKOR_EXPLAINER + (scene.tahan ?? 0) + nextTransition;
};

export const prepareExplainerScript = async (
  script: ExplainerScript,
  fps: number,
): Promise<ExplainerScript> => {
  // Default transisi explainer adalah 'none' (cut langsung khas @NahhJadi)
  const normalizedScenes = script.scenes.map((s) => ({
    ...s,
    transition: s.transition ?? ('none' as const),
  }));
  const nextTransition = (i: number) =>
    i + 1 < normalizedScenes.length ? explainerTransitionFrames(normalizedScenes[i + 1]) : 0;

  let scenes: ExplainerScene[];
  if (!script.narasiAudio) {
    scenes = normalizedScenes.map((scene) =>
      scene.narasi ? {...scene, kata: spreadWords(scene.narasi, estimateSeconds(scene.narasi))} : scene,
    );
  } else {
    const res = await applyNarasi(
      {...(script as unknown as VideoScript), scenes: normalizedScenes as unknown as VideoScript['scenes']},
      fps,
      (i) => (i < normalizedScenes.length ? explainerTransitionFrames(normalizedScenes[i]) : 0),
    );
    scenes = res.scenes as unknown as ExplainerScene[];
  }

  const rapat = scenes.map((scene, i) =>
    scene.narasi ? {...scene, duration: durasiNarasi(scene, fps, nextTransition(i))} : scene,
  );
  return {...script, scenes: tahanAkhir(rapat)};
};
