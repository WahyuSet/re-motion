// Cetak peta visual per klausa: teks klausa dan kejadian visual yang jatuh di dalamnya.
// Dipakai lewat: node scripts/cek-explainer.mjs <slug> --peta

import {kejadianScene, pecahKlausa} from './visual.mjs';

export const formatPeta = (script, kata) => {
  const baris = [];
  for (const [i, scene] of (script?.scenes ?? []).entries()) {
    const narasi = scene.narasi?.trim();
    if (!narasi) continue;
    const label = `S${i + 1}`;
    const indent = ' '.repeat(label.length);
    // parseWords memecah dengan /\s+/, jadi indeks token mentah = indeks kata.
    const mentah = narasi.split(/\s+/);
    const words = kata.parseWords(narasi);
    const kejadian = kejadianScene(scene, words, kata);

    baris.push(`${label} (${scene.type})`);
    for (const {mulai, akhir} of pecahKlausa(words)) {
      const isi = kejadian.filter((k) => k.idx >= mulai && k.idx <= akhir).map((k) => k.label);
      baris.push(`${label} │ ${mentah.slice(mulai, akhir + 1).join(' ')}`);
      baris.push(`${indent} │   → ${isi.length ? isi.join(' · ') : '(kosong) ✗'}`);
    }
    baris.push('');
  }
  return baris.join('\n');
};
