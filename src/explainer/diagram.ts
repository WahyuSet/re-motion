// Perhitungan deterministik untuk DiagramScene (mode 'grid-bata' dan 'potongan').
// Tanpa import React/Remotion agar dapat diuji langsung via importTs di Node.
import {indexOfWord, type TimedWord} from '../lib/kata';
import type {DiagramPotonganStep} from './types';

export type BataItem = {
  row: number;
  col: number;
  /** Posisi horizontal tengah bata dalam satuan kolom (0..kolom) */
  xOffset: number;
  beban: number;
  aktif: boolean;
};

/**
 * Hitung posisi dan distribusi beban tiap bata:
 * - 'zigzag': beban puncak di tengah baris 0 terbagi 50%/50% ke dua bata di bawahnya (segitiga Pascal).
 * - 'sejajar': beban terbagi ke 2 kolom tengah (atau 1 kolom jika kolom === 1) dan turun lurus vertikal.
 */
export const hitungBebanBata = (
  pola: 'zigzag' | 'sejajar',
  baris: number,
  kolom: number,
  nilaiBeban: number,
): BataItem[][] => {
  const R = Math.max(1, Math.floor(baris));
  const C = Math.max(1, Math.floor(kolom));
  const grid: BataItem[][] = [];

  if (pola === 'sejajar') {
    const midLeft = Math.max(0, Math.floor((C - 1) / 2));
    const midRight = Math.min(C - 1, midLeft + (C > 1 ? 1 : 0));
    const activeCols = midLeft === midRight ? [midLeft] : [midLeft, midRight];
    const perCol = Number((nilaiBeban / activeCols.length).toFixed(2));

    for (let r = 0; r < R; r++) {
      const rowItems: BataItem[] = [];
      for (let c = 0; c < C; c++) {
        const aktif = activeCols.includes(c);
        rowItems.push({
          row: r,
          col: c,
          xOffset: c + 0.5,
          beban: aktif ? perCol : 0,
          aktif,
        });
      }
      grid.push(rowItems);
    }
    return grid;
  }

  // Pola zigzag: baris r memiliki (r + 1) bata aktif di tengah piramida, ditambah bata pinggir tak aktif
  for (let r = 0; r < R; r++) {
    const activeCount = r + 1;
    const totalInRow = Math.max(C, activeCount);
    const startActive = Math.floor((totalInRow - activeCount) / 2);

    // Hitung bobot segitiga Pascal untuk baris r
    const weights: number[] = [nilaiBeban];
    for (let step = 0; step < r; step++) {
      const next = new Array(weights.length + 1).fill(0);
      for (let k = 0; k < weights.length; k++) {
        next[k] += weights[k] / 2;
        next[k + 1] += weights[k] / 2;
      }
      weights.splice(0, weights.length, ...next);
    }

    const rowItems: BataItem[] = [];
    const stagger = (r % 2) * 0.5;
    for (let c = 0; c < totalInRow; c++) {
      const activeIdx = c - startActive;
      const aktif = activeIdx >= 0 && activeIdx < activeCount;
      const beban = aktif ? Number(weights[activeIdx].toFixed(2)) : 0;
      rowItems.push({
        row: r,
        col: c,
        xOffset: c + stagger,
        beban,
        aktif,
      });
    }
    grid.push(rowItems);
  }

  return grid;
};

const parseNominal = (teks: string): number => {
  const digits = teks.replace(/[^\d,]/g, '').replace(',', '.');
  const num = Number(digits);
  return Number.isFinite(num) && num > 0 ? num : 0;
};

export type ResolvedPotonganStep = DiagramPotonganStep & {
  at: number;
  porsi: number;
};

/**
 * Hitung frame muncul dan porsi bar sisa (0..1) untuk setiap langkah pemotongan nilai.
 */
export const hitungPotongan = (
  awalNilai: string,
  langkah: DiagramPotonganStep[],
  words: TimedWord[],
): ResolvedPotonganStep[] => {
  if (!langkah.length) return [];
  const base = parseNominal(awalNilai);
  let searchFrom = 0;

  return langkah.map((step, i) => {
    let at = 16 + i * 24;
    if (step.di) {
      const idx = indexOfWord(words, step.di, searchFrom);
      if (idx >= 0) {
        at = words[idx].start;
        searchFrom = idx + 1;
      }
    }
    const sisaNum = parseNominal(step.sisa);
    const fallbackRatio = Math.max(0.15, 1 - ((i + 1) / (langkah.length + 1)) * 0.45);
    const porsi =
      base > 0 && sisaNum > 0
        ? Math.min(1, Math.max(0.1, Number((sisaNum / base).toFixed(4))))
        : fallbackRatio;
    return {
      ...step,
      at,
      porsi,
    };
  });
};
