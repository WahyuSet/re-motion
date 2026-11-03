import {useVideoConfig} from 'remotion';
import {FORMAT_SIZE, SAFE_SHORT} from './safe';

export {FORMAT_SIZE, SAFE_SHORT};

// Ukuran & posisi elemen per orientasi. Nilai landscape = angka asli template (jangan diubah tanpa alasan,
// semua video landscape yang sudah ada bergantung padanya).
const LANDSCAPE = {
  vertical: false,
  tag: {top: 80, side: 110, fontSize: 30},
  /** Tag per shot: kanan atas di landscape */
  shotTag: {side: 'right' as 'left' | 'right', top: 80 as number | undefined, bottom: undefined as number | undefined},
  judul: {left: 110, top: 150, topNoTag: 90, maxWidth: 1250, fontSize: 92},
  subtitle: {style: 'pill' as 'pill' | 'short', maxWords: 6, fontSize: 50, bottom: 70, centerY: 0, side: 0, maxWidth: 1500},
  credit: {right: 50 as number | undefined, left: undefined as number | undefined, bottom: 36, fontSize: 26, maxWidth: undefined as number | undefined},
  title: {fontSize: 220, kickerSize: 34, kickerSpacing: 12, subtitleSize: 48, offsetY: -40, maxWidth: 1800},
  fact: {numberSize: 300, labelSize: 64, centerX: 960, centerY: 490, badgeX: 300, badgeY: 175, badgeShrink: 0.56, textMaxWidth: 1200},
  ghostSize: 620,
  print: {maxWidth: 1560, maxHeight: 740},
  outro: {titleSize: 110, maxWidth: 1500, ctaSize: 44, offsetY: -60},
  stempel: {x: 70, y: 42, fontSize: 64},
  anotasiLabelSize: 30,
  photoText: {left: 110, right: 110, bottom: 110, maxWidth: 1400, fontSize: 76},
  /** Di landscape tepat di atas baris tag per shot (top 80) */
  watermark: {top: 26, right: 110, fontSize: 30},
};

export type LayoutTokens = typeof LANDSCAPE;

const S = SAFE_SHORT;
const SAFE_WIDTH = FORMAT_SIZE.short.width - S.left - S.right;

const VERTICAL: LayoutTokens = {
  vertical: true,
  tag: {top: S.top + 10, side: S.left, fontSize: 30},
  // Di layar sempit tag shot tidak muat berdampingan dengan tag scene: taruh di kiri bawah, di atas kredit
  shotTag: {side: 'left', top: undefined, bottom: S.bottom + 56},
  judul: {left: S.left, top: S.top + 80, topNoTag: S.top + 20, maxWidth: SAFE_WIDTH, fontSize: 84},
  subtitle: {style: 'short', maxWords: 3, fontSize: 84, bottom: 0, centerY: 1160, side: S.left, maxWidth: SAFE_WIDTH},
  credit: {right: undefined, left: S.left, bottom: S.bottom + 10, fontSize: 22, maxWidth: SAFE_WIDTH},
  title: {fontSize: 200, kickerSize: 28, kickerSpacing: 8, subtitleSize: 40, offsetY: -80, maxWidth: SAFE_WIDTH},
  fact: {numberSize: 230, labelSize: 50, centerX: 540, centerY: 860, badgeX: 270, badgeY: S.top + 150, badgeShrink: 0.5, textMaxWidth: SAFE_WIDTH},
  ghostSize: 380,
  print: {maxWidth: 960, maxHeight: 1100},
  // Judul & tombol outro naik ke sepertiga atas, supaya tidak bertabrakan dengan subtitle di tengah-bawah
  outro: {titleSize: 92, maxWidth: SAFE_WIDTH, ctaSize: 40, offsetY: -380},
  stempel: {x: 50, y: 40, fontSize: 56},
  anotasiLabelSize: 34,
  photoText: {left: S.left, right: S.right, bottom: S.bottom + 20, maxWidth: SAFE_WIDTH, fontSize: 68},
  // Sebaris dengan tag scene (kiri), di dalam area aman kanan
  watermark: {top: S.top + 14, right: S.right, fontSize: 30},
};

export const useLayout = (): LayoutTokens => {
  const {width, height} = useVideoConfig();
  return height > width ? VERTICAL : LANDSCAPE;
};

/** Ukuran font judul besar supaya muat dalam lebar maksimal (perkiraan lebar huruf Playfair 900 ±0,72 em) */
export const fitTitleSize = (title: string, tokens: LayoutTokens) =>
  Math.min(tokens.title.fontSize, Math.floor(tokens.title.maxWidth / (Math.max(1, title.length) * 0.72)));
