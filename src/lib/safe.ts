// Konstanta ukuran & area aman, tanpa import React/Remotion (dipakai juga oleh scripts/).

/**
 * Area aman gabungan YouTube Shorts, TikTok, dan Instagram Reels untuk kanvas 1080×1920 (px dari tepi).
 * Di luar area ini tertutup tombol, judul, atau caption aplikasi.
 */
export const SAFE_SHORT = {top: 240, bottom: 420, left: 70, right: 150};

export const FORMAT_SIZE = {
  landscape: {width: 1920, height: 1080},
  short: {width: 1080, height: 1920},
};
