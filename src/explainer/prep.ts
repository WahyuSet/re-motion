import {estimateSeconds, narasiDuration, spreadWords, transitionFrames} from '../lib/kata';
import {applyNarasi} from '../lib/narasi';
import type {VideoScript} from '../types';
import type {ExplainerScene, ExplainerScript} from './types';

/**
 * Frame tambahan di akhir scene terakhir. TTS hampir tanpa jeda setelah kalimat penutup, padahal
 * kalimat itu sering berisi punchline (callback); tanpa tahanan, visual gag-nya cuma lewat sekilas.
 */
export const TAHAN_AKHIR = 30;

const tahanAkhir = (scenes: ExplainerScene[]): ExplainerScene[] =>
  scenes.map((s, i) => (i === scenes.length - 1 ? {...s, duration: s.duration + TAHAN_AKHIR} : s));

export const explainerTransitionFrames = (scene?: ExplainerScene) =>
  transitionFrames(scene?.transition ?? 'none');

export const getExplainerDuration = (script: ExplainerScript) =>
  script.scenes.reduce(
    (total, scene, i) => total + scene.duration - (i === 0 ? 0 : explainerTransitionFrames(scene)),
    0,
  );

export const prepareExplainerScript = async (
  script: ExplainerScript,
  fps: number,
): Promise<ExplainerScript> => {
  // Default transisi explainer adalah 'none' (cut langsung khas @NahhJadi)
  const normalizedScenes = script.scenes.map((s) => ({
    ...s,
    transition: s.transition ?? ('none' as const),
  }));

  if (!script.narasiAudio) {
    const scenes = normalizedScenes.map((scene, i) => {
      if (!scene.narasi) return scene;
      const seconds = estimateSeconds(scene.narasi);
      return {
        ...scene,
        duration: narasiDuration(
          scene.duration,
          seconds,
          fps,
          i + 1 < normalizedScenes.length ? explainerTransitionFrames(normalizedScenes[i + 1]) : 0,
        ),
        kata: spreadWords(scene.narasi, seconds),
      };
    });
    return {...script, scenes: tahanAkhir(scenes)};
  }

  const res = await applyNarasi(
    {...(script as unknown as VideoScript), scenes: normalizedScenes as unknown as VideoScript['scenes']},
    fps,
    (i) => (i < normalizedScenes.length ? explainerTransitionFrames(normalizedScenes[i]) : 0),
  );
  return {...script, scenes: tahanAkhir(res.scenes as unknown as ExplainerScene[])};
};
