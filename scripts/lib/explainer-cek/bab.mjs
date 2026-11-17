// Aturan bab/chapter (C0-C3). Sama dengan syarat chapter di scripts/paket-youtube.mjs:
// bab pertama di scene 1, minimal 3 bab, setiap bab minimal 10 detik.
import {detikScene} from './narasi.mjs';

const MIN_BAB = 3;
const BAB_MIN_DETIK = 10;

export const cekBab = (script, kataJson, lapor, profil = null) => {
  const scenes = script?.scenes ?? [];
  const adaBab = scenes.some((s) => s.bab);
  if (profil?.format !== 'landscape') {
    if (adaBab) lapor.warn('video', 'C0 video short tidak mendukung chapter.', 'Hapus field bab; chapter hanya untuk format landscape.');
    return;
  }
  if (!scenes[0]?.bab) {
    lapor.warn('scene 1', 'C1 scene 1 belum punya bab, chapter YouTube harus mulai di 0:00.', "Isi bab di scene 1, contoh bab: 'Pembuka'.");
  }
  const bab = [];
  detikScene(script, kataJson).forEach((detik, i) => {
    if (scenes[i].bab || !bab.length) bab.push({judul: scenes[i].bab, detik: 0});
    bab[bab.length - 1].detik += detik;
  });
  const bernama = bab.filter((b) => b.judul);
  if (bernama.length < MIN_BAB) {
    lapor.warn('video', `C2 baru ${bernama.length} bab (minimal ${MIN_BAB}).`, 'Bagi narasi jadi 3-6 bab; isi bab di scene pertama tiap bab.');
  }
  for (const b of bernama) {
    if (b.detik < BAB_MIN_DETIK) {
      lapor.warn(`bab "${b.judul}"`, `C3 bab cuma ${Math.round(b.detik)} detik (minimal ${BAB_MIN_DETIK}).`, 'Gabungkan dengan bab sebelum/sesudahnya, atau tambah narasi.');
    }
  }
};
