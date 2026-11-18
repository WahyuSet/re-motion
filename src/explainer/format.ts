// Profil tata letak dan aturan per format explainer, tanpa import React/Remotion.
// Dipakai engine (lewat useProfil) dan validator scripts/cek-explainer.mjs (lewat importTs),
// jadi angka keduanya selalu sama. Nilai short = angka engine sebelum format long ada:
// jangan diubah tanpa alasan, semua video short yang sudah ada bergantung padanya.
import {FORMAT_SIZE, SAFE_SHORT} from '../lib/safe';

export type FormatExplainer = 'short' | 'landscape';

/** Jarak dan perilaku gerak item panggung yang bergantung pada lebar kanvas. */
export type GerakProfil = {
  /** Jarak masuk slide-left/slide-right, px */
  slideX: number;
  /** Jarak keluar slide-left/slide-right, px */
  keluarX: number;
  /** Lama pulse tanpa `durasi`, frame; null = sampai akhir scene */
  pulseFrame: number | null;
  /** Pulse melemah sampai skala 1 sebelum berhenti */
  pulseHalus: boolean;
};

/** Batas ritme yang dicek validator (M7-M10). null = tidak dicek. */
export type RitmeProfil = {
  /** Minimal kejadian visual (item + aksi) per detik narasi */
  kejadianPerDetik: number;
  /** Minimal jarak `move` terjauh per scene stage, persen lebar layar */
  moveMin: number;
  /** Maksimal scene stage berurutan dengan posisi objek utama yang sama */
  polaBerulangMaks: number;
};

export type ProfilFormat = {
  format: FormatExplainer;
  kanvas: {w: number; h: number};
  /** Area aman, persen layar */
  aman: {kiri: number; kanan: number; atas: number; bawah: number};
  /** Tepi bawah judul tiap jenis scene, persen (aturan L1) */
  zonaJudul: {hook: number; stageBerjudul: number; beat: number};
  /** Tepi atas kotak subtitle, persen (aturan L2) */
  subtitleAtas: number;
  subtitle: {side: number; bottom: number; fontSize: number};
  /** Kolom subtitle terlebar, persen lebar layar. Item `nempel` harus di luar kolom ini. */
  kolomSubtitle: {kiri: number; kanan: number};
  gerak: GerakProfil;
  ritme: RitmeProfil | null;
  /** Ukuran item teks: batas bawah (L3) dan batas celetukan (M6) */
  teks: {min: number; celetukanMaks: number};
  hook: {top: string; side: number; font1: number; font2: number; lebar1: number; lebar2: number};
  bannerStage: {top: string; side: number; fontSize: number};
  beat: {topBerItem: string; topKosong: string; side: number; fontSize: number};
  diagram: {top: string; side: number; skala: number};
  watermark: {left: string; top: string};
  /** Thumbnail: judul + prop utama (propTop = jarak atas area prop, px). */
  thumb: {top: string; side: number; font1: number; font2: number; lebar1: number; lebar2: number; propTop: number; propMaxW: number; propMaxH: number};
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
    subtitle: {side: 72, bottom: 430, fontSize: 40},
    kolomSubtitle: {kiri: 0, kanan: 100},
    gerak: {slideX: 520, keluarX: 480, pulseFrame: null, pulseHalus: false},
    ritme: null,
    teks: {min: 0, celetukanMaks: 32},
    hook: {top: '15%', side: 56, font1: 92, font2: 84, lebar1: 960, lebar2: 936},
    bannerStage: {top: '16%', side: 72, fontSize: 48},
    beat: {topBerItem: '18%', topKosong: '38%', side: 60, fontSize: 52},
    diagram: {top: '16%', side: 80, skala: 1},
    watermark: {left: '7%', top: '8.5%'},
    thumb: {top: '15%', side: 56, font1: 112, font2: 100, lebar1: 980, lebar2: 956, propTop: 220, propMaxW: 560, propMaxH: 880},
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
    zonaJudul: {hook: 36, stageBerjudul: 20, beat: 21},
    subtitleAtas: 85,
    // Dibaca dari HP: 48 px di kanvas 1920 setara ±10 px saat HP tegak.
    subtitle: {side: 140, bottom: 64, fontSize: 48},
    kolomSubtitle: {kiri: 25, kanan: 75},
    gerak: {slideX: 920, keluarX: 860, pulseFrame: 24, pulseHalus: true},
    ritme: {kejadianPerDetik: 0.8, moveMin: 10, polaBerulangMaks: 3},
    teks: {min: 44, celetukanMaks: 48},
    hook: {top: '9%', side: 120, font1: 104, font2: 92, lebar1: 1600, lebar2: 1560},
    // Judul stage/beat/diagram mulai 10%, di bawah banner bab (kanan atas) dan watermark (kiri atas).
    bannerStage: {top: '10%', side: 200, fontSize: 56},
    beat: {topBerItem: '10%', topKosong: '38%', side: 200, fontSize: 60},
    diagram: {top: '10%', side: 200, skala: 0.8},
    watermark: {left: '3%', top: '4%'},
    thumb: {top: '9%', side: 60, font1: 100, font2: 88, lebar1: 1160, lebar2: 1120, propTop: 320, propMaxW: 460, propMaxH: 390},
    bab: {right: '3%', top: '4%', fontSize: 36},
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
