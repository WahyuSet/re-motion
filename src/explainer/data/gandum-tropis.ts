import type {ExplainerScript} from '../types';

// Naskah explainer "Gandum Tropis". Ikuti .claude/skills/video-explainer/SKILL.md.
// Cek dengan: npm run cek:explainer -- gandum-tropis
export const gandumTropis: ExplainerScript = {
  format: 'short',
  watermark: false,
  // Isi dua baris ini SETELAH audio narasi dipotong (node scripts/potong-narasi.mjs gandum-tropis <file-audio>):
  // narasiAudio: 'audio/gandum-tropis',
  // narasiExt: 'wav',
  youtube: {
    judul: 'TODO Judul Gandum Tropis',
    deskripsi: 'TODO Deskripsi singkat topik Gandum Tropis.',
    tags: ['edukasi', 'explainer'],
  },
  thumbnail: {
    baris1: 'TODO BARIS 1',
    baris2: 'TODO BARIS 2?',
  },
  scenes: [
    {
      type: 'hook',
      duration: 110,
      latar: 'latar/gandum-tropis-1.png',
      baris1: 'TODO PERTANYAAN UTAMA',
      baris2: 'KENAPA BISA BEGITU?',
      narasi: 'TODO kalimat pembuka yang memancing rasa penasaran tentang *topik utama* ini.',
      items: [],
    },
    {
      type: 'stage',
      duration: 120,
      latar: 'latar/gandum-tropis-2.png',
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
      latar: 'latar/gandum-tropis-4.png',
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
