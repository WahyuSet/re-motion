import {ALL_FORMATS, Input, UrlSource} from 'mediabunny';
import {staticFile} from 'remotion';
import type {VideoScript, WordTiming} from '../types';
import {estimateSeconds, NARASI_DELAY, narasiDuration, spreadWords} from './kata';

export {NARASI_DELAY};

// Scene tanpa teks narasi dianggap tidak punya audio.
export const narasiFile = (script: VideoScript, index: number) =>
  script.narasiAudio && script.scenes[index]?.narasi
    ? `${script.narasiAudio}/${String(index + 1).padStart(2, '0')}.${script.narasiExt ?? 'mp3'}`
    : null;

const getDurationInSeconds = async (path: string) => {
  const input = new Input({formats: ALL_FORMATS, source: new UrlSource(staticFile(path))});
  try {
    return await input.computeDuration();
  } finally {
    input.dispose();
  }
};

const loadKata = async (dir: string): Promise<Record<string, WordTiming[]> | null> => {
  try {
    const res = await fetch(staticFile(`${dir}/kata.json`));
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

// Siapkan naskah sebelum render:
// - perpanjang scene supaya narasinya selesai sebelum transisi berikutnya,
// - isi `kata` (timing per kata) untuk subtitle dan animasi yang mengikuti suara.
export const applyNarasi = async (
  script: VideoScript,
  fps: number,
  transitionFrames: (i: number) => number,
): Promise<VideoScript> => {
  const kataJson = script.narasiAudio ? await loadKata(script.narasiAudio) : null;

  const scenes = await Promise.all(
    script.scenes.map(async (scene, i) => {
      if (!scene.narasi) return scene;
      const file = narasiFile(script, i);
      // Belum ada audio: perkirakan panjang narasi dari jumlah kata, supaya preview sudah mirip hasil akhir.
      const seconds = file ? await getDurationInSeconds(file) : estimateSeconds(scene.narasi);
      return {
        ...scene,
        duration: narasiDuration(scene.duration, seconds, fps, transitionFrames(i + 1)),
        kata: kataJson?.[String(i)] ?? spreadWords(scene.narasi, seconds),
      };
    }),
  );

  return {...script, scenes};
};
