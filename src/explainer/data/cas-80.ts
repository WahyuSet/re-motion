import type {ExplainerScript} from '../types';

// Naskah explainer "Cas 80". Ikuti .claude/skills/video-explainer/SKILL.md.
// Cek dengan: npm run cek:explainer -- cas-80
export const cas80: ExplainerScript = {
  format: 'short',
  watermark: false,
  // Isi dua baris ini SETELAH audio narasi dipotong (node scripts/potong-narasi.mjs cas-80 <file-audio>):
  // narasiAudio: 'audio/cas-80',
  // narasiExt: 'wav',
  youtube: {
    judul: 'TODO Judul Cas 80',
    deskripsi: 'TODO Deskripsi singkat topik Cas 80.',
    tags: ['edukasi', 'explainer'],
  },
  // Judul 2 baris utuh dan natural (<= 28 huruf per baris). Baris 1 = sticker putih, Baris 2 = stabilo kuning + sticker putih.
  thumbnail: {
    baris1: 'TODO SUBJEK JELAS',
    baris2: 'KENAPA BISA BEGITU?',
    latar: 'latar/cas-80-1.png',
    src: 'props/meme-kucing-paw.png',
  },
  scenes: [
    {
      type: 'hook',
      duration: 105,
      latar: 'latar/cas-80-1.png',
      baris1: 'TODO SUBJEK JELAS',
      baris2: 'KENAPA BISA BEGITU?',
      // Hook Stop-Scroll (wajib 8-14 kata, 1 kalimat ~3 detik, langsung tembak kejanggalan tanpa pengantar):
      narasi: 'TODO kebiasaan singkat sehari-hari, kok bisa muncul *kejanggalan utama* ini?',
      items: [],
    },
    {
      type: 'stage',
      duration: 120,
      latar: 'latar/cas-80-2.png',
      narasi: 'TODO penjelasan visual pertama dengan celetukan *komedi* dan kata kunci *penting* di dalam kalimat.',
      items: [
        {
          kind: 'prop',
          src: 'props/meme-kucing-paw.png',
          x: 28,
          y: 54,
          width: 300,
          masuk: 'slide-up',
          delay: 0,
          sampai: 'penting',
          aksi: [
            {type: 'wiggle', di: 'penjelasan', rotate: 14, durasi: 18},
            {type: 'move', di: 'komedi', toX: 24, toY: 56, toRotate: -5, durasi: 16},
            {type: 'jump', di: 'penting', dy: 60, durasi: 18},
          ],
        },
        {
          kind: 'simbol',
          simbol: 'tanya',
          x: 46,
          y: 38,
          width: 130,
          masuk: 'pop',
          delay: 4,
          sampai: 'penting',
          aksi: [{type: 'peek', di: 'komedi', dx: 12, dy: -8, rotate: -14, durasi: 12, tahan: 20, sfx: 'boing'}],
        },
        {
          kind: 'teks',
          teks: 'TODO POIN KUNCI',
          x: 50,
          y: 45,
          ukuran: 44,
          warna: '#ffffff',
          kotak: '#1976d2',
          masuk: 'drop',
          sfx: 'boom',
          di: 'penting',
          aksi: [{type: 'squash', di: 'kalimat', durasi: 16}],
        },
      ],
    },
    {
      type: 'beat',
      duration: 55,
      teks: 'Oke, sini gue jelasin.',
      narasi: 'Oke, *sini gue jelasin* alasannya.',
      items: [
        {
          kind: 'prop',
          src: 'props/meme-kucing-jelasin.png',
          x: 50,
          y: 58,
          width: 360,
          masuk: 'pop',
          sfx: 'boing',
          aksi: [{type: 'wiggle', di: 'jelasin', rotate: 12, durasi: 16}],
        },
      ],
    },
    {
      type: 'stage',
      duration: 120,
      latar: 'latar/cas-80-4.png',
      narasi: 'TODO kesimpulan akhir yang menjawab pertanyaan di awal dengan *jelas*.',
      items: [
        {
          kind: 'simbol',
          simbol: 'centang',
          x: 50,
          y: 45,
          width: 180,
          masuk: 'pop',
          di: 'jelas',
        },
      ],
    },
  ],
};
