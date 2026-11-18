import type {FormatExplainer} from './format';

// Logika bab (chapter) video long, tanpa React. Scene yang punya `bab` membuka bab baru;
// paket-youtube.mjs memakai field yang sama untuk chapter di deskripsi.

const judulBab = (scene?: {bab?: string}) => scene?.bab?.trim() ?? '';

/** Nomor bab (1-based) yang dibuka scene `index`, atau null kalau scene itu tidak punya `bab`. */
export const nomorBab = (scenes: {bab?: string}[], index: number): number | null => {
  if (!judulBab(scenes[index])) return null;
  return scenes.slice(0, index + 1).filter((s) => Boolean(judulBab(s))).length;
};

/** Banner bab tampil di video landscape pada setiap scene ber-`bab`, kecuali scene 1 (frame 0 hook tetap bersih). */
export const tampilBanner = (index: number, scene: {bab?: string}, format: FormatExplainer = 'landscape'): boolean =>
  index > 0 && format === 'landscape' && Boolean(judulBab(scene));
