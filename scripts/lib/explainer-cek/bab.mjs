// Aturan bab/chapter (C0-C4). Sama dengan syarat chapter di scripts/paket-youtube.mjs:
// bab pertama di scene 1, minimal 3 bab, setiap bab minimal 10 detik, judul <= 30 huruf.
import {detikScene} from './narasi.mjs';

const MIN_BAB = 3;
const BAB_MIN_DETIK = 10;
const MAX_JUDUL_BAB = 30;

const judulBab = (s) => (typeof s?.bab === 'string' ? s.bab.trim() : '');

export const cekBab = (script, kataJson, lapor, profil = null) => {
  const scenes = script?.scenes ?? [];
  if (profil?.format !== 'landscape') {
    const adaBab = scenes.some((s) => typeof s?.bab === 'string' && s.bab.length > 0);
    if (adaBab) lapor.warn('video', 'C0 video short tidak mendukung chapter.', 'Hapus field bab; chapter hanya untuk format landscape.');
    return;
  }
  if (!judulBab(scenes[0])) {
    lapor.warn('scene 1', 'C1 scene 1 belum punya bab, chapter YouTube harus mulai di 0:00.', "Isi bab di scene 1, contoh bab: 'Pembuka'.");
  }
  const bab = [];
  detikScene(script, kataJson).forEach((detik, i) => {
    const judul = judulBab(scenes[i]);
    if (i > 0 && scenes[i].bab !== undefined && !judul) {
      lapor.warn(`scene ${i + 1}`, 'C1 field bab kosong.', `Isi judul bab pendek (<= ${MAX_JUDUL_BAB} huruf), atau hapus field bab.`);
    }
    if (judul || !bab.length) bab.push({judul, detik: 0});
    bab[bab.length - 1].detik += detik;
  });
  const bernama = bab.filter((b) => b.judul);
  if (bernama.length < MIN_BAB) {
    lapor.warn('video', `C2 baru ${bernama.length} bab (minimal ${MIN_BAB}).`, 'Bagi narasi jadi 3-6 bab; isi bab di scene pertama tiap bab.');
  }
  for (const b of bernama) {
    if (b.judul.length > MAX_JUDUL_BAB) {
      lapor.warn(
        `bab "${b.judul}"`,
        `C4 judul bab terlalu panjang (${b.judul.length} huruf, batas ${MAX_JUDUL_BAB}).`,
        `Ringkas jadi pertanyaan atau klaim pendek <= ${MAX_JUDUL_BAB} huruf.`,
      );
    }
    if (b.detik < BAB_MIN_DETIK) {
      lapor.warn(`bab "${b.judul}"`, `C3 bab cuma ${Math.floor(b.detik)} detik (minimal ${BAB_MIN_DETIK}).`, 'Gabungkan dengan bab sebelum/sesudahnya, atau tambah narasi.');
    }
  }
};
