// Data kecil bersama untuk test tests/3d. Semua angka waktu mudah dihitung: tiap kata 0,5 detik.
import {muatModulWaktu} from '../../scripts/3d/lib/waktu.mjs';

const zona = [20, 30, 80, 60];
const kamera = (tambahan) => ({dari: [0, -3, 1], ke: [0, -2, 1], lihat: [0, 0, 1], lensa: 30, ...tambahan});

export const katalogUji = () => ({
  versi: 1,
  set: {
    uji: {
      file: 'uji.py',
      cocok_untuk: 'adegan contoh untuk test',
      langit: '#FFFFFF',
      isi: {mode: {pilihan: ['a', 'b'], bawaan: 'a'}},
      syarat_hook: {mode: 'b'},
      kamera: {
        k: kamera({zona_subjek: zona, hook: true}),
        l: kamera({zona_subjek: zona, hook: false}),
        p: kamera({prop: true}),
      },
      gerak: {
        g1: {detik: 1, arti: 'gerak satu'},
        g2: {detik: 1, arti: 'gerak dua', butuh: ['g1'], terus: true},
        g3: {detik: 1, arti: 'gerak tiga', syarat_isi: {mode: ['b']}},
      },
    },
  },
});

export const naskahUji = () => ({
  format: 'short',
  gayaTeks: 'stiker',
  narasiAudio: 'audio/uji',
  scenes: [
    {type: 'hook', duration: 60, baris1: 'A', baris2: 'B', narasi: 'Kenapa bisa begitu ya', items: []},
    {type: 'beat', duration: 30, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin', items: []},
    {type: 'stage', duration: 60, narasi: 'Alasan pertama *maling* datang. Maling nyangkut, lalu diam.', items: []},
  ],
});

const kataBeruntun = (n) => Array.from({length: n}, (_, i) => [i * 0.5, (i + 1) * 0.5]);

export const kataUji = () => ({0: kataBeruntun(4), 1: kataBeruntun(4), 2: kataBeruntun(8)});

export const ktxUji = async (ubah = (k) => k) => {
  const data = {
    slug: 'uji',
    klip: [{scene: 3, set: 'uji', kamera: 'l', isi: {}, gerak: [{jenis: 'g1', di: 'maling'}]}],
    gambar: [],
  };
  const ktx = {
    slug: 'uji',
    teks: JSON.stringify(data),
    data,
    galatParse: null,
    katalog: katalogUji(),
    script: naskahUji(),
    kataJson: kataUji(),
    modul: await muatModulWaktu(),
    lock: null,
    ukuran: new Map(),
  };
  return ubah(ktx) ?? ktx;
};

/** Panggil aturan `fn(...arg, lapor)` dan kumpulkan pesannya. */
export const jalankan = async (fn, ...arg) => {
  const errors = [];
  const warnings = [];
  const format = (where, msg, fix) => `${where}: ${msg}${fix ? ` → PERBAIKI: ${fix}` : ''}`;
  const hasil = await fn(...arg, {
    err: (where, msg, fix) => errors.push(format(where, msg, fix)),
    warn: (where, msg, fix) => warnings.push(format(where, msg, fix)),
  });
  return {errors, warnings, hasil};
};
