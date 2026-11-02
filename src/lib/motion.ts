// Guncangan kamera singkat yang meredam, untuk momen "hentakan" (judul muncul, angka selesai dihitung).
export const shake = (frame: number, at: number | null, strength = 14, length = 16) => {
  if (at === null) return {x: 0, y: 0};
  const t = frame - at;
  if (t < 0 || t > length) return {x: 0, y: 0};
  const decay = (1 - t / length) ** 2;
  return {x: Math.sin(t * 2.7) * strength * decay, y: Math.cos(t * 3.3) * strength * 0.6 * decay};
};
