// Profil tata letak dan aturan per format explainer, tanpa import React/Remotion.
// Dipakai engine (lewat useProfil) dan validator scripts/cek-explainer.mjs (lewat importTs),
// jadi angka keduanya selalu sama. Nilai short = angka engine sebelum format long ada:
// jangan diubah tanpa alasan, semua video short yang sudah ada bergantung padanya.
import {FORMAT_SIZE, SAFE_SHORT} from '../lib/safe';

export type FormatExplainer = 'short' | 'landscape';

export type ProfilFormat = {
  format: FormatExplainer;
  kanvas: {w: number; h: number};
  /** Area aman, persen layar */
  aman: {kiri: number; kanan: number; atas: number; bawah: number};
  /** Tepi bawah judul tiap jenis scene, persen (aturan L1) */
  zonaJudul: {hook: number; stageBerjudul: number; beat: number};
  /** Tepi atas kotak subtitle, persen (aturan L2) */
  subtitleAtas: number;
  hook: {top: string; side: number; font1: number; font2: number; lebar1: number; lebar2: number};
  bannerStage: {top: string; side: number};
  beat: {topBerItem: string; topKosong: string; side: number};
  diagram: {top: string; side: number; skala: number};
  watermark: {left: string; top: string};
  thumb: {top: string; side: number; font1: number; font2: number; lebar1: number; lebar2: number};
  bab: {right: string; top: string; fontSize: number};
  /** Batas durasi video, detik */
  durasi: {min: number; max: number};
  /** Jumlah kata narasi scene hook (aturan H1) */
  hookKata: {min: number; max: number};
  minJoke: number;
  jokePerMenit: number;
};

const S = FORMAT_SIZE.short;

export const PROFIL: Record<FormatExplainer, ProfilFormat> = {
  short: {
    format: 'short',
    kanvas: {w: S.width, h: S.height},
    aman: {
      kiri: (SAFE_SHORT.left / S.width) * 100,
      kanan: 100 - (SAFE_SHORT.right / S.width) * 100,
      atas: (SAFE_SHORT.top / S.height) * 100,
      bawah: 100 - (SAFE_SHORT.bottom / S.height) * 100,
    },
    zonaJudul: {hook: 28, stageBerjudul: 22, beat: 24},
    subtitleAtas: 73.5,
    hook: {top: '15%', side: 56, font1: 92, font2: 84, lebar1: 960, lebar2: 936},
    bannerStage: {top: '16%', side: 72},
    beat: {topBerItem: '18%', topKosong: '38%', side: 60},
    diagram: {top: '16%', side: 80, skala: 1},
    watermark: {left: '7%', top: '8.5%'},
    thumb: {top: '15%', side: 56, font1: 112, font2: 100, lebar1: 980, lebar2: 956},
    bab: {right: '3%', top: '4%', fontSize: 30},
    durasi: {min: 0, max: 60},
    hookKata: {min: 7, max: 14},
    minJoke: 2,
    jokePerMenit: 0,
  },
  landscape: {
    format: 'landscape',
    kanvas: {w: FORMAT_SIZE.landscape.width, h: FORMAT_SIZE.landscape.height},
    aman: {kiri: 3, kanan: 97, atas: 5, bawah: 95},
    zonaJudul: {hook: 34, stageBerjudul: 16, beat: 18},
    subtitleAtas: 85,
    hook: {top: '7%', side: 120, font1: 104, font2: 92, lebar1: 1600, lebar2: 1560},
    bannerStage: {top: '7%', side: 200},
    beat: {topBerItem: '8%', topKosong: '38%', side: 200},
    diagram: {top: '7%', side: 200, skala: 0.8},
    watermark: {left: '3%', top: '4%'},
    thumb: {top: '9%', side: 60, font1: 100, font2: 88, lebar1: 1160, lebar2: 1120},
    bab: {right: '3%', top: '4%', fontSize: 30},
    durasi: {min: 180, max: 720},
    hookKata: {min: 12, max: 45},
    minJoke: 4,
    jokePerMenit: 1,
  },
};

export const profilNaskah = (script: {format?: FormatExplainer} | undefined): ProfilFormat =>
  PROFIL[script?.format === 'landscape' ? 'landscape' : 'short'];

export const profilDari = (width: number, height: number): ProfilFormat =>
  PROFIL[width > height ? 'landscape' : 'short'];

/** Jumlah joke minimal untuk video berdurasi `detik`. */
export const jokeMinimal = (profil: ProfilFormat, detik: number): number =>
  Math.max(profil.minJoke, Math.ceil((detik / 60) * profil.jokePerMenit));
