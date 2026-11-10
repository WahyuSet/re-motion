// Timing & transformasi objek panggung (StageItem) serta potongan frasa subtitle.
// Sengaja tanpa import React/Remotion agar dapat diuji langsung di Node via importTs.
import {indexOfWord, type TimedWord} from '../lib/kata';
import type {StageAction, StageItem} from './types';

export type FrasaSubtitle = {
  mulai: number;
  selesai: number;
  kata: TimedWord[];
};

/**
 * Pecah daftar kata bertimestamp menjadi potongan frasa pendek (1 baris di bawah panggung).
 * Putus otomatis saat mencapai batas kata/huruf atau bertemu tanda baca akhir klausa.
 */
export const potongFrasa = (
  words: TimedWord[],
  maxKata = 5,
  maxHuruf = 34,
): FrasaSubtitle[] => {
  const hasil: FrasaSubtitle[] = [];
  let isi: TimedWord[] = [];

  const simpan = () => {
    if (!isi.length) return;
    hasil.push({
      mulai: isi[0].start,
      selesai: isi[isi.length - 1].end,
      kata: isi,
    });
    isi = [];
  };

  for (const w of words) {
    const calonHuruf = [...isi, w].map((x) => x.word).join(' ').length;
    if (isi.length > 0 && (isi.length >= maxKata || calonHuruf > maxHuruf)) {
      simpan();
    }
    isi.push(w);
    if (/[.,!?;:]$/.test(w.word)) {
      simpan();
    }
  }
  simpan();

  // Tahan sedikit (8 frame) setelah kata terakhir selama belum menabrak frasa berikutnya
  for (let i = 0; i < hasil.length; i++) {
    const nextStart = hasil[i + 1]?.mulai ?? Infinity;
    hasil[i].selesai = Math.min(Math.max(hasil[i].selesai + 8, hasil[i].mulai + 15), nextStart);
  }
  return hasil;
};

export type ResolvedAction = StageAction & {
  at: number;
  endAt: number;
};

/**
 * Hitung frame masuk, frame keluar, dan frame tiap aksi berantai.
 * Pencarian kata untuk `aksi` dan `sampai` dimulai SETELAH indeks kata `di` agar kata berulang
 * di narasi tidak menyebabkan objek hilang/bereaksi sebelum muncul.
 */
export const waktuItem = (
  item: StageItem,
  words: TimedWord[],
  duration: number,
): {masukAt: number; keluarAt: number; aksi: ResolvedAction[]} => {
  let cursorIdx = 0;
  let masukAt = item.delay ?? 0;

  if (item.di) {
    const idx = indexOfWord(words, item.di, 0);
    if (idx >= 0) {
      masukAt = words[idx].start;
      cursorIdx = idx + 1;
    }
  }

  let actionCursor = cursorIdx;
  const aksi: ResolvedAction[] = (item.aksi ?? []).map((a) => {
    const dur = a.durasi ?? 18;
    let at = masukAt + (a.delay ?? 12);
    if (a.di) {
      const idx = indexOfWord(words, a.di, actionCursor);
      const fallbackIdx = idx >= 0 ? idx : indexOfWord(words, a.di, cursorIdx);
      if (fallbackIdx >= 0) {
        at = words[fallbackIdx].start;
        actionCursor = fallbackIdx + 1;
      }
    }
    let endAt = at + dur;
    if (a.type === 'pulse' && a.sampai) {
      const sIdx = indexOfWord(words, a.sampai, actionCursor);
      if (sIdx >= 0) endAt = words[sIdx].start;
      else endAt = duration;
    } else if (a.type === 'pulse') {
      endAt = duration;
    }
    return {...a, at, endAt};
  });

  let keluarAt = item.endFrame ?? Infinity;
  if (item.sampai) {
    const idx = indexOfWord(words, item.sampai, cursorIdx);
    if (idx >= 0) {
      keluarAt = words[idx].start;
    }
  }

  return {masukAt, keluarAt, aksi};
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOutQuad = (t: number) => {
  const c = clamp01(t);
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
};
const easeOutBack = (t: number) => {
  const c = clamp01(t);
  const k = 1.70158;
  return 1 + (k + 1) * Math.pow(c - 1, 3) + k * Math.pow(c - 1, 2);
};

export type ItemTransform = {
  visible: boolean;
  x: number;
  y: number;
  tx: number;
  ty: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  opacity: number;
  shakeX: number;
  originY: 'center' | 'bottom';
};

/**
 * Hitung transformasi deterministik satu StageItem pada `frame` tertentu.
 */
export const hitungTransformItem = (
  item: StageItem,
  frame: number,
  _fps: number,
  words: TimedWord[],
  duration: number,
): ItemTransform => {
  const {masukAt, keluarAt, aksi} = waktuItem(item, words, duration);
  const exitDur = item.keluar === 'none' ? 0 : 10;

  if (frame < masukAt || frame > keluarAt + exitDur) {
    return {
      visible: false,
      x: item.x,
      y: item.y,
      tx: 0,
      ty: 0,
      scaleX: 1,
      scaleY: 1,
      rotate: item.rotate ?? 0,
      opacity: 0,
      shakeX: 0,
      originY: item.masuk === 'grow-up' ? 'bottom' : 'center',
    };
  }

  const enterMode = item.masuk ?? 'pop';
  const enterDur = enterMode === 'none' ? 1 : enterMode === 'grow-up' ? 18 : 12;
  const enterT = clamp01((frame - masukAt) / enterDur);
  const enterEase = enterMode === 'pop' || enterMode === 'drop' ? easeOutBack(enterT) : easeInOutQuad(enterT);

  let x = item.x;
  let y = item.y;
  let tx = 0;
  let ty = 0;
  let scaleX = 1;
  let scaleY = 1;
  let rotate = item.rotate ?? 0;
  let opacity = enterMode === 'none' ? 1 : clamp01((frame - masukAt) / 6);
  let originY: 'center' | 'bottom' = 'center';

  switch (enterMode) {
    case 'pop':
      scaleX = enterEase;
      scaleY = enterEase;
      rotate += (1 - enterEase) * -12;
      break;
    case 'drop':
      ty = (1 - enterEase) * -420;
      break;
    case 'slide-left':
      tx = (1 - enterEase) * 520;
      break;
    case 'slide-right':
      tx = (1 - enterEase) * -520;
      break;
    case 'slide-up':
      ty = (1 - enterEase) * 420;
      break;
    case 'grow-up':
      originY = 'bottom';
      scaleY = easeInOutQuad(enterT);
      break;
    case 'fade':
      scaleX = 0.92 + 0.08 * enterEase;
      scaleY = 0.92 + 0.08 * enterEase;
      break;
  }

  let shakeX = 0;

  for (const a of aksi) {
    if (frame < a.at) continue;
    const dur = Math.max(1, a.durasi ?? 18);
    const p = easeInOutQuad((frame - a.at) / dur);

    switch (a.type) {
      case 'move': {
        const fromX = x;
        const fromY = y;
        const fromScaleX = scaleX;
        const fromScaleY = scaleY;
        const fromRot = rotate;
        if (a.toX !== undefined) x = fromX + (a.toX - fromX) * p;
        if (a.toY !== undefined) y = fromY + (a.toY - fromY) * p;
        if (a.toScale !== undefined) {
          scaleX = fromScaleX + (a.toScale - fromScaleX) * p;
          scaleY = fromScaleY + (a.toScale - fromScaleY) * p;
        }
        if (a.toRotate !== undefined) rotate = fromRot + (a.toRotate - fromRot) * p;
        break;
      }
      case 'peek': {
        const tahan = a.tahan ?? 35;
        const totalPeek = dur * 2 + tahan;
        const local = frame - a.at;
        if (local <= totalPeek) {
          const factor =
            local < dur
              ? easeOutBack(local / dur)
              : local < dur + tahan
                ? 1
                : 1 - easeInOutQuad((local - dur - tahan) / dur);
          x += (a.dx ?? -14) * factor;
          y += (a.dy ?? 0) * factor;
          rotate += (a.rotate ?? -15) * factor;
        }
        break;
      }
      case 'grow': {
        originY = 'bottom';
        const fromSX = scaleX;
        const fromSY = scaleY;
        if (a.toScaleX !== undefined) scaleX = fromSX + (a.toScaleX - fromSX) * p;
        if (a.toScaleY !== undefined) scaleY = fromSY + (a.toScaleY - fromSY) * p;
        break;
      }
      case 'dim': {
        const target = a.toOpacity ?? 0.25;
        opacity = opacity + (target - opacity) * p;
        break;
      }
      case 'shake': {
        if (frame <= a.endAt) {
          const amp = a.intensitas ?? 10;
          const decay = 1 - clamp01((frame - a.at) / dur);
          shakeX += Math.sin((frame - a.at) * 1.9) * amp * decay;
        }
        break;
      }
      case 'pulse': {
        if (frame <= a.endAt) {
          const s = 1 + 0.08 * Math.sin((frame - a.at) * 0.45);
          scaleX *= s;
          scaleY *= s;
        }
        break;
      }
    }
  }

  if (item.float) {
    const t = Math.max(0, frame - masukAt);
    ty += Math.sin(t / 22) * 8;
  }

  // Animasi keluar bila melewati keluarAt
  if (frame > keluarAt && exitDur > 0) {
    const outP = easeInOutQuad((frame - keluarAt) / exitDur);
    opacity *= 1 - outP;
    switch (item.keluar ?? 'fade') {
      case 'pop-out':
        scaleX *= 1 - outP * 0.6;
        scaleY *= 1 - outP * 0.6;
        break;
      case 'slide-left':
        tx -= outP * 480;
        break;
      case 'slide-right':
        tx += outP * 480;
        break;
      case 'slide-down':
        ty += outP * 420;
        break;
    }
  }

  return {
    visible: opacity > 0.001,
    x,
    y,
    tx,
    ty,
    scaleX,
    scaleY,
    rotate,
    opacity,
    shakeX,
    originY,
  };
};
