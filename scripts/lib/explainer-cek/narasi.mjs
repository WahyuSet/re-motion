// Aturan narasi lisan (N1-N5): naskah dibacakan TTS, jadi harus enak didengar,
// satu gagasan per kalimat, tanpa gaya buku pelajaran dan tanpa rujukan kabur.

// Kalimat ±18 kata = ±7,5 detik TTS. Diagram boleh lebih panjang karena berisi daftar potongan berkoma.
const MAX_KATA_KALIMAT = {default: 18, diagram: 22};

/** Kata buku pelajaran -> pengganti lisan. Kunci boleh frasa. */
export const KATA_BUKU = {
  sehingga: 'jadi',
  akan: 'hapus saja, atau "bakal"',
  mengubah: 'bikin / ngubah',
  memiliki: 'punya',
  apabila: 'kalau',
  namun: 'tapi',
  idealnya: 'harusnya',
  luruh: 'lepas',
  'zat kimia': 'sebut zatnya, atau "zat dari plastik"',
  merupakan: 'hapus saja',
  dapat: 'bisa',
  'oleh karena itu': 'jadi',
  'karena itu': 'jadi',
  sangat: 'banget',
  yaitu: 'hapus, pakai koma',
  terhadap: 'ke / sama',
  melakukan: 'pakai kata kerjanya langsung',
};

/** Rujukan yang membuat penonton harus menebak bendanya. */
const RUJUKAN_KABUR = ['di situ', 'tadi', 'hal ini', 'hal itu', 'tersebut'];
const BIKIN_TANPA_OBJEK = /\bbikin (cepat|gampang|makin|lebih|tambah|jadi)\b/i;

/** Klaim mutlak yang sering tidak didukung sumber. */
const KLAIM_MUTLAK = ['semua', 'selalu', 'pasti', 'gak boleh', 'tidak boleh', 'gak pernah', 'tidak pernah', 'mustahil'];

const polos = (teks) => teks.replace(/\*/g, '');
const ada = (teks, frasa) => new RegExp(`(^|[^\\p{L}])${frasa}([^\\p{L}]|$)`, 'iu').test(teks);
const hitung = (teks, frasa) => (teks.match(new RegExp(`(^|[^\\p{L}])${frasa}(?=[^\\p{L}]|$)`, 'giu')) ?? []).length;

export const pecahKalimat = (teks) =>
  polos(teks)
    .split(/(?<=[.?!])\s+/)
    .map((k) => k.trim())
    .filter(Boolean);

export const cekNarasiScene = (scene, where, lapor) => {
  const narasi = scene.narasi ?? '';
  if (!narasi.trim()) return;
  const teks = polos(narasi);

  // N1
  const batas = MAX_KATA_KALIMAT[scene.type] ?? MAX_KATA_KALIMAT.default;
  for (const kalimat of pecahKalimat(narasi)) {
    const n = kalimat.split(/\s+/).length;
    if (n > batas) {
      lapor.warn(
        where,
        `N1 kalimat ${n} kata (batas ${batas}): "${kalimat}"`,
        'Pecah jadi dua kalimat, satu gagasan per kalimat. Cara cepat: potong di "sehingga", "dan", atau koma kedua.',
      );
    }
  }

  // N2
  for (const [kata, ganti] of Object.entries(KATA_BUKU)) {
    if (ada(teks, kata)) {
      lapor.warn(where, `N2 "${kata}" terdengar seperti buku pelajaran.`, `Ganti: ${ganti}.`);
    }
  }

  // N4
  for (const frasa of RUJUKAN_KABUR) {
    if (ada(teks, frasa)) {
      lapor.warn(where, `N4 rujukan kabur "${frasa}".`, 'Sebut bendanya langsung, contoh "lewat pori itu" jadi "lewat pori cangkang".');
    }
  }
  const bikin = teks.match(BIKIN_TANPA_OBJEK);
  if (bikin) {
    lapor.warn(where, `N4 "${bikin[0]}" tanpa menyebut apa yang berubah.`, 'Sebut bendanya, contoh "bikin cepat rusak" jadi "bikin telur cepat rusak".');
  }

  // N5
  for (const frasa of KLAIM_MUTLAK) {
    if (ada(teks, frasa)) {
      lapor.warn(where, `N5 klaim mutlak "${frasa}".`, 'Pastikan sumber memang bilang begitu; kalau tidak, lunakkan ("kebanyakan", "sering", "gak disarankan").');
    }
  }
};

export const cekNarasiVideo = (script, lapor) => {
  const semua = (script?.scenes ?? []).map((s) => polos(s.narasi ?? '')).join(' ');
  for (const frasa of ['padahal', 'banyak yang ngira']) {
    const n = hitung(semua, frasa);
    if (n > 1) {
      lapor.warn('video', `N3 "${frasa}" dipakai ${n} kali.`, `Pakai sekali saja untuk salah kaprah utama. "Padahal" hanya untuk kebalikan; untuk sebab pakai "masalahnya", untuk kesimpulan pakai "jadi".`);
    }
  }
};

// D3: total durasi video. Dari kata.json kalau audio sudah dipotong, kalau belum dari perkiraan
// 2,4 kata per detik (sama dengan scripts/narasi.mjs), plus jeda sekitar 0,5 detik per scene.
const KATA_PER_DETIK = 2.4;
const JEDA_SCENE = 0.5;
const MAX_DETIK = 60;

export const perkiraanDurasi = (script, kataJson) =>
  (script?.scenes ?? []).reduce((total, s, i) => {
    const kata = kataJson?.[i];
    const detik = Array.isArray(kata) && kata.length ? kata[kata.length - 1][1] : polos(s.narasi ?? '').split(/\s+/).filter(Boolean).length / KATA_PER_DETIK;
    return total + detik + JEDA_SCENE;
  }, 0);

export const cekDurasi = (script, kataJson, lapor) => {
  const detik = perkiraanDurasi(script, kataJson);
  if (detik > MAX_DETIK) {
    lapor.warn(
      'video',
      `D3 ${kataJson ? 'durasi' : 'perkiraan durasi'} ${Math.round(detik)} detik (batas ${MAX_DETIK}).`,
      'Pangkas narasi: buang kalimat yang tidak membawa fakta baru, atau gabungkan dua scene fakta.',
    );
  }
};
