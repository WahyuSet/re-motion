// Timing kata narasi & shot. Sengaja tanpa import React/Remotion, supaya bisa dipakai juga
// oleh scripts/storyboard.mjs dengan perhitungan yang persis sama dengan video.
import type {Scene, WordTiming} from '../types';

/** Jeda sebelum suara mulai di tiap scene (frame) */
export const NARASI_DELAY = 8;
/** Jeda setelah suara selesai sebelum scene berganti (frame), di luar durasi transisi */
export const NARASI_TAIL = 12;
/** Lama transisi antar scene (frame); 0 untuk transisi 'none' */
export const TRANSITION_FRAMES = 18;
export const transitionFrames = (type: string | undefined) => (type === 'none' ? 0 : TRANSITION_FRAMES);
/** Lama foto berikutnya muncul menimpa foto sebelumnya (frame) */
export const SHOT_OVERLAP = 8;
/** Durasi minimal satu shot (frame) */
const MIN_SHOT = 24;

type Word = {word: string; highlight: boolean};

// "Dibangun *abad ke-9*" -> kata "abad ke-9" ditandai highlight.
export const parseWords = (text: string): Word[] => {
  let inHighlight = false;
  return text.split(/\s+/).map((raw) => {
    let word = raw;
    if (word.startsWith('*')) {
      inHighlight = true;
      word = word.slice(1);
    }
    const highlight = inHighlight;
    if (/\*[.,!?;:]?$/.test(word)) {
      word = word.replace(/\*([.,!?;:]?)$/, '$1');
      inHighlight = false;
    }
    return {word, highlight};
  });
};

export type TimedWord = Word & {
  /** Frame mulai & selesai diucapkan, relatif terhadap awal scene */
  start: number;
  end: number;
};

export const sceneWords = (scene: {narasi?: string; kata?: WordTiming[]}, fps: number): TimedWord[] => {
  if (!scene.narasi || !scene.kata) return [];
  const timings = scene.kata;
  return parseWords(scene.narasi.trim()).map((w, i) => ({
    ...w,
    start: NARASI_DELAY + Math.round((timings[i]?.[0] ?? 0) * fps),
    end: NARASI_DELAY + Math.round((timings[i]?.[1] ?? 0) * fps),
  }));
};

/** Kecepatan bicara TTS bahasa Indonesia rata-rata (sama dengan scripts/narasi.mjs) */
export const WORDS_PER_SECOND = 2.4;
export const estimateSeconds = (narasi: string) => narasi.trim().split(/\s+/).length / WORDS_PER_SECOND;

// Perkiraan timing kalau tidak ada kata.json: waktu dibagi sesuai panjang tiap kata.
export const spreadWords = (narasi: string, seconds: number): WordTiming[] => {
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

/** Durasi scene (frame) supaya narasi sepanjang `seconds` selesai sebelum transisi ke scene berikutnya */
export const narasiDuration = (minDuration: number, seconds: number, fps: number, nextTransitionFrames: number) =>
  Math.max(minDuration, NARASI_DELAY + Math.ceil(seconds * fps) + NARASI_TAIL + nextTransitionFrames);

export const normalizeWord = (word: string) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

/** Indeks kata pertama yang cocok dengan `target` (kata pertamanya saja), mulai dari indeks `from` */
export const indexOfWord = (words: {word: string}[], target: string, from = 0) => {
  const key = normalizeWord(target.trim().split(/\s+/)[0] ?? '');
  for (let i = from; i < words.length; i++) {
    if (normalizeWord(words[i].word) === key) return i;
  }
  return -1;
};

/** Frame saat kata tertentu pertama kali diucapkan */
export const frameOfWord = (words: TimedWord[], target: string) => {
  const i = indexOfWord(words, target);
  return i < 0 ? null : words[i].start;
};

/** Rentang frame kata-kata *bertanda bintang* pertama di narasi */
export const highlightRange = (words: TimedWord[]) => {
  const first = words.findIndex((w) => w.highlight);
  if (first < 0) return null;
  let last = first;
  while (last + 1 < words.length && words[last + 1].highlight) last++;
  return {start: words[first].start, end: words[last].end};
};

/**
 * Frame mulai tiap shot (relatif awal scene).
 * Shot dengan `di: 'kata'` mulai tepat saat kata itu diucapkan; shot tanpa `di` dibagi rata
 * di antara shot-shot yang sudah ditentukan. Shot pertama selalu mulai di frame 0.
 */
export const shotStarts = (shots: {di?: string}[], words: TimedWord[], duration: number): number[] => {
  const n = shots.length;
  if (n === 0) return [];
  const anchors: (number | null)[] = shots.map(() => null);
  anchors[0] = 0;
  let searchFrom = 0;
  for (let i = 1; i < n; i++) {
    const di = shots[i].di;
    if (!di) continue;
    const idx = indexOfWord(words, di, searchFrom);
    if (idx < 0) continue;
    // Mulai sedikit sebelum kata, supaya foto sudah tampil penuh saat kata terdengar
    anchors[i] = Math.max(0, words[idx].start - SHOT_OVERLAP / 2);
    searchFrom = idx + 1;
  }

  const starts = [...anchors] as number[];
  let i = 0;
  while (i < n) {
    if (anchors[i] !== null) {
      i++;
      continue;
    }
    let j = i;
    while (j < n && anchors[j] === null) j++;
    const from = starts[i - 1];
    const to = j < n ? (anchors[j] as number) : duration;
    const step = (to - from) / (j - i + 1);
    for (let k = i; k < j; k++) starts[k] = Math.round(from + step * (k - i + 1));
    i = j;
  }

  for (let k = 1; k < n; k++) {
    starts[k] = Math.min(Math.max(starts[k], starts[k - 1] + MIN_SHOT), Math.max(0, duration - MIN_SHOT * (n - k)));
  }
  return starts;
};

/**
 * Frame muncul tiap item berurutan (titik garis waktu, dsb., relatif awal scene).
 * Item dengan `di: 'kata'` muncul saat kata itu diucapkan (dicari berurutan); sisanya dibagi rata
 * di antara item yang sudah ditentukan, sepanjang narasi (atau sepanjang scene kalau tanpa narasi).
 */
export const momenUrut = (items: {di?: string}[], words: TimedWord[], duration: number): number[] => {
  const n = items.length;
  if (!n) return [];
  const awal = words.length ? words[0].start : 15;
  const akhir = words.length ? words[words.length - 1].start : Math.max(awal + 1, duration - 30);
  const anchors: (number | null)[] = items.map(() => null);
  let from = 0;
  items.forEach((item, i) => {
    if (!item.di) return;
    const idx = indexOfWord(words, item.di, from);
    if (idx < 0) return;
    anchors[i] = words[idx].start;
    from = idx + 1;
  });
  // Ujung virtual supaya celah di awal/akhir juga dibagi rata
  const ext = [awal - (n > 1 ? (akhir - awal) / (n - 1) : 0), ...anchors, akhir + (n > 1 ? (akhir - awal) / (n - 1) : 0)];
  if (ext[1] === null) ext[1] = awal;
  if (ext[n] === null) ext[n] = akhir;
  const out = [...ext] as number[];
  let i = 1;
  while (i <= n) {
    if (ext[i] !== null) {
      i++;
      continue;
    }
    let j = i;
    while (ext[j] === null) j++;
    const step = (out[j] - out[i - 1]) / (j - i + 1);
    for (let k = i; k < j; k++) out[k] = Math.round(out[i - 1] + step * (k - i + 1));
    i = j;
  }
  return out.slice(1, n + 1);
};
