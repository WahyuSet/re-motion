import {ALL_FORMATS, Input, UrlSource} from 'mediabunny';
import {staticFile} from 'remotion';
import type {VideoScript, WordTiming} from '../types';
import {NARASI_DELAY} from './kata';

export {NARASI_DELAY};
/** Jeda setelah suara selesai sebelum scene berganti (frame), di luar durasi transisi */
const NARASI_TAIL = 12;

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

// Perkiraan timing kalau tidak ada kata.json: waktu dibagi sesuai panjang tiap kata.
const spreadWords = (narasi: string, seconds: number): WordTiming[] => {
  const words = narasi.trim().split(/\s+/);
  const weights = words.map((w) => w.replace(/\*/g, '').length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  let t = 0;
  return weights.map((w) => {
    const start = t;
    t += (w / total) * seconds;
    return [start, t];
  });
};

/** Kecepatan bicara TTS bahasa Indonesia rata-rata (sama dengan scripts/narasi.mjs) */
const WORDS_PER_SECOND = 2.4;
const estimateSeconds = (narasi: string) => narasi.trim().split(/\s+/).length / WORDS_PER_SECOND;

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
      const needed = NARASI_DELAY + Math.ceil(seconds * fps) + NARASI_TAIL + transitionFrames(i + 1);
      return {
        ...scene,
        duration: Math.max(scene.duration, needed),
        kata: kataJson?.[String(i)] ?? spreadWords(scene.narasi, seconds),
      };
    }),
  );

  return {...script, scenes};
};
