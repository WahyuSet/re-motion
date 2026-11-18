// J1-J3: file rencana terbaca dan menunjuk scene yang benar.

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const posisiGalat = (teks, pesan) => {
  const cocok = /position (\d+)/.exec(pesan);
  const pos = cocok ? Number(cocok[1]) : teks.length;
  const baris = teks.slice(0, pos).split('\n');
  return {baris: baris.length, kolom: baris[baris.length - 1].length + 1};
};

export const cekSkema = (ktx, lapor) => {
  const {slug, teks, data, galatParse, script} = ktx;
  const file = `${slug}.3d.json`;
  let sah = true;
  const err = (where, msg, fix) => {
    sah = false;
    lapor.err(where, msg, fix);
  };

  if (teks === null) {
    err(file, 'J1 file rencana belum ada.', `Jalankan npm run 3d:baru -- ${slug}`);
    return false;
  }
  if (!data) {
    const {baris, kolom} = posisiGalat(teks, galatParse ?? '');
    err(file, `J1 JSON tidak valid di baris ${baris} kolom ${kolom}.`, 'Perbaiki tanda baca di posisi itu: koma, kutip, atau kurung.');
    return false;
  }
  if (!Array.isArray(data.klip) || (data.gambar !== undefined && !Array.isArray(data.gambar))) {
    err(file, 'J1 "klip" dan "gambar" harus berupa daftar.', 'Tulis "klip": [ ... ] dan "gambar": [ ... ].');
    return false;
  }
  if (data.slug !== slug) err(file, `J2 slug "${data.slug}" tidak sama dengan "${slug}".`, `Isi "slug": "${slug}".`);
  if (!script) {
    err(file, `J2 naskah src/explainer/data/${slug}.ts tidak ditemukan.`, 'Buat dan loloskan naskahnya dulu dengan skill video-explainer.');
    return false;
  }
  if (script.format === 'landscape') {
    err(file, 'J2 klip 3D hanya untuk video short, naskah ini landscape.', 'Laporkan ke user bahwa video long belum didukung.');
  }

  const terpakai = new Set();
  for (const entri of data.klip) {
    const where = `klip scene ${entri?.scene}`;
    const scene = Number.isInteger(entri?.scene) ? script.scenes[entri.scene - 1] : null;
    const rentang = `Pakai nomor 1 sampai ${script.scenes.length}.`;
    if (!scene) err(where, 'J3 scene tidak ada di naskah.', rentang);
    else if (scene.type === 'beat') err(where, 'J3 scene beat tidak memakai klip 3D.', 'Hapus entri ini.');
    else if (terpakai.has(entri.scene)) err(where, 'J3 scene ini ditulis lebih dari sekali.', 'Sisakan satu entri.');
    terpakai.add(entri?.scene);
  }
  for (const entri of data.gambar ?? []) {
    if (!SLUG.test(String(entri?.nama))) {
      err(`gambar "${entri?.nama}"`, 'J3 nama gambar tidak valid.', 'Pakai huruf kecil, angka, dan tanda minus.');
    }
  }
  return sah;
};
