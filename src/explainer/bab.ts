// Logika bab (chapter) video long, tanpa React. Scene yang punya `bab` membuka bab baru;
// paket-youtube.mjs memakai field yang sama untuk chapter di deskripsi.

/** Nomor bab (1-based) yang dibuka scene `index`, atau null kalau scene itu tidak punya `bab`. */
export const nomorBab = (scenes: {bab?: string}[], index: number): number | null => {
  if (!scenes[index]?.bab) return null;
  return scenes.slice(0, index + 1).filter((s) => s.bab).length;
};

/** Banner bab tampil di setiap scene ber-`bab`, kecuali scene 1 (frame 0 hook tetap bersih). */
export const tampilBanner = (index: number, scene: {bab?: string}): boolean => index > 0 && Boolean(scene.bab);
