// Aturan nominal diagram potongan (D1, D2).
// Engine (src/explainer/diagram.ts) membaca angka dengan membuang semua selain digit dan koma,
// jadi "Rp5 juta" terbaca 5 sedangkan "Rp4.950.000" terbaca 4950000 dan bar sisa jadi rusak.

const KATA_SATUAN = /\b(juta|jt|ribu|rb|miliar|m)\b/i;
const baca = (teks) => {
  const num = Number(String(teks).replace(/[^\d,]/g, '').replace(',', '.'));
  return Number.isFinite(num) ? num : 0;
};

export const cekNominal = (scene, where, lapor) => {
  if (scene.type !== 'diagram' || scene.mode !== 'potongan') return;
  const nilaiList = [
    ['awal.nilai', scene.awal?.nilai],
    ...(scene.langkah ?? []).map((l, i) => [`langkah[${i + 1}].sisa`, l.sisa]),
  ];
  for (const [nama, nilai] of nilaiList) {
    if (typeof nilai === 'string' && KATA_SATUAN.test(nilai)) {
      lapor.warn(where, `D1 ${nama} "${nilai}" memakai kata satuan.`, 'Tulis nominal penuh dengan titik ribuan, contoh "Rp5.000.000", supaya bar sisa terhitung benar.');
    }
  }
  let sebelumnya = baca(scene.awal?.nilai);
  for (const [i, l] of (scene.langkah ?? []).entries()) {
    const sisa = baca(l.sisa);
    if (sebelumnya > 0 && sisa > sebelumnya) {
      lapor.warn(where, `D2 langkah[${i + 1}].sisa "${l.sisa}" lebih besar dari nilai sebelumnya.`, 'Periksa hitungan: sisa setiap langkah harus sama atau lebih kecil dari sisa sebelumnya, dengan format angka yang sama.');
    }
    sebelumnya = sisa;
  }
};
