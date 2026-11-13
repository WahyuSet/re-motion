// Gaya teks "stiker die-cut" untuk item teks panggung (opt-in lewat ExplainerScript.gayaTeks).
// Sengaja tanpa import React/Remotion agar dapat diuji langsung di Node via importTs.
// Ukuran di sini dipakai juga oleh perkiraan kotak validator (scripts/lib/explainer-cek/kotak.mjs);
// kalau diubah, samakan di sana.

export const STIKER = {
  /** Pinggiran putih die-cut (px). */
  pinggir: 8,
  padX: 28,
  padY: 12,
  radius: 26,
};

/**
 * Kemiringan otomatis stiker (derajat) untuk item tanpa `rotate`: 3-5 derajat ke kiri atau kanan,
 * diturunkan dari isi teks supaya sama di setiap render dan tidak semua stiker miring ke arah yang sama.
 */
export const miringStiker = (teks: string): number => {
  let h = 5381;
  for (let i = 0; i < teks.length; i++) h = ((h * 33) ^ teks.charCodeAt(i)) >>> 0;
  const besar = 3 + ((h >>> 1) % 21) / 10;
  return h % 2 === 0 ? besar : -besar;
};
