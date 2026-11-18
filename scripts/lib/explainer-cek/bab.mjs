// Aturan bab/chapter (C0-C6). C0-C4 sama dengan syarat chapter di scripts/paket-youtube.mjs:
// bab pertama di scene 1, minimal 3 bab, setiap bab minimal 10 detik, judul <= 30 huruf.
import {detikScene} from './narasi.mjs';

const MIN_BAB = 3;
const BAB_MIN_DETIK = 10;
const MAX_JUDUL_BAB = 30;

/** Jawaban pertanyaan hook jatuh di rentang ini (porsi durasi video), supaya penonton tetap punya alasan menonton. */
const JAWABAN_HOOK = {min: 0.55, maks: 0.85};

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

// C5, C6: alur video long ditulis di bagian "## Bab" rencana.
export const cekAlurLong = (script, rencana, kataJson, lapor, profil = null) => {
  if (profil?.format !== 'landscape' || rencana === null || rencana === undefined) return;
  const isi = rencana.replace(/\r\n?/g, '\n').match(/^## Bab[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m)?.[1] ?? '';

  const nomor = Number(isi.match(/^Jawaban hook:\s*scene\s*(\d+)/im)?.[1]);
  const detik = detikScene(script, kataJson);
  if (!Number.isInteger(nomor) || nomor < 1 || nomor > detik.length) {
    lapor.warn('rencana.md', 'C5 baris "Jawaban hook: scene N" belum diisi di bagian ## Bab.', 'Tulis nomor scene yang menjawab pertanyaan hook.');
  } else {
    const total = detik.reduce((a, b) => a + b, 0);
    const posisi = detik.slice(0, nomor - 1).reduce((a, b) => a + b, 0) / total;
    if (posisi < JAWABAN_HOOK.min || posisi > JAWABAN_HOOK.maks) {
      const persen = (n) => Math.round(n * 100);
      lapor.warn(`scene ${nomor}`, `C5 jawaban hook jatuh di ${persen(posisi)}% video (target ${persen(JAWABAN_HOOK.min)}-${persen(JAWABAN_HOOK.maks)}%).`, 'Urutkan ulang bab: bangun konteks dulu, simpan jawaban utama sebagai puncak di paruh akhir.');
    }
  }

  const baris = isi.split('\n').filter((l) => l.trim().startsWith('|')).map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
  const kolom = baris[0]?.findIndex((c) => /^kail/i.test(c)) ?? -1;
  const bab = baris.slice(1).filter((b) => !/^:?-+:?$/.test(b[0] ?? ''));
  if (kolom < 0) {
    lapor.warn('rencana.md', 'C6 tabel ## Bab belum punya kolom "Kail ke bab berikutnya".', 'Tambah kolom itu dan tulis pertanyaan yang membuka bab sesudahnya.');
  } else if (bab.slice(0, -1).some((b) => !b[kolom])) {
    lapor.warn('rencana.md', 'C6 ada bab tanpa kail ke bab berikutnya.', 'Akhiri tiap bab dengan pertanyaan atau janji yang dijawab bab sesudahnya.');
  }
};
