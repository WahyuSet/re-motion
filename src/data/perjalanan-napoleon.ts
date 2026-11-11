import credits from '../../public/photos/perjalanan-napoleon/credits.json';
import {fotoDari} from '../lib/foto';
import type {VideoScript} from '../types';

// Naskah short 9:16 "Perjalanan Napoleon". Ikuti .claude/skills/video-sejarah/SKILL.md (bagian Mode Short).
// Cek dengan: node scripts/cek-naskah.mjs perjalanan-napoleon
const foto = fotoDari('perjalanan-napoleon', credits);

export const perjalananNapoleon: VideoScript = {
  format: 'short',
  narasiAudio: 'audio/perjalanan-napoleon',
  narasiExt: 'wav',
  youtube: {
    judul: 'Perjalanan Napoleon: Dari Korsika hingga Pengasingan',
    deskripsi:
      'Kisah singkat kebangkitan dan kejatuhan Napoleon Bonaparte: dari perwira artileri asal Korsika yang menjadi Kaisar Prancis, hingga invasi Rusia, kekalahan di Waterloo, dan pengasingan di Saint Helena.',
    tags: [
      'napoleon bonaparte',
      'sejarah eropa',
      'revolusi prancis',
      'pertempuran waterloo',
      'sejarah dunia',
    ],
  },
  thumbnail: {
    judul: 'Taklukkan Eropa, *berakhir sendiri*',
    sub: 'Kisah Napoleon Bonaparte',
    ...foto('01-napoleon-at-the-great-st-bernard-jacques-louis-dav.jpg'),
  },
  scenes: [
    {
      type: 'title',
      duration: 60,
      kicker: 'Sejarah Dunia',
      title: 'Perjalanan Napoleon',
      narasi:
        'Dari pulau kecil di Mediterania, ia menaklukkan hampir seluruh Eropa. Inilah *Perjalanan Napoleon* Bonaparte.',
      shots: [
        {...foto('01-napoleon-at-the-great-st-bernard-jacques-louis-dav.jpg'), move: 'pan-right'},
        {
          ...foto('05-napoleon-i-of-france-by-andrea-appiani.jpg'),
          layout: 'print',
          tag: 'Napoleon Bonaparte',
          di: 'Inilah',
        },
      ],
    },
    {
      type: 'photo',
      duration: 60,
      transition: 'dorong',
      tag: 'Korsika · 1769–1799',
      judul: 'Bangkit dari *Revolusi Prancis*',
      judulDi: 'Revolusi',
      narasi:
        'Lahir di Pulau Korsika, perwira artileri muda ini melejit menjadi pemimpin tertinggi setelah *Revolusi Prancis*.',
      shots: [
        {...foto('10-antoine-jean-gros-bonaparte-au-pont-d-arcole-1796.jpg'), move: 'pan-left'},
        {
          ...foto('06-bonaparte-premier-consul-ge-rard-chantilly.jpg'),
          layout: 'print',
          tag: 'Konsul Pertama · 1799',
          di: 'melejit',
        },
      ],
    },
    {
      type: 'fact',
      duration: 60,
      transition: 'kartu',
      value: 1804,
      format: 'year',
      label: 'Dinobatkan jadi Kaisar',
      narasi:
        'Tahun *seribu delapan ratus empat*, ia menobatkan dirinya sebagai Kaisar Prancis dan menyusun kitab hukum sipil.',
      shots: [
        {
          ...foto('13-jacques-louis-david-the-coronation-of-napoleon-180.jpg'),
          move: 'pan-right',
          tag: 'Penobatan · Notre-Dame',
        },
        {
          ...foto('07-jacques-louis-david-the-emperor-napoleon-in-his-st.jpg'),
          layout: 'print',
          tag: 'Kaisar Prancis · 1804',
          di: 'Kaisar',
        },
      ],
    },
    {
      type: 'photo',
      duration: 60,
      transition: 'dorong',
      tag: 'Eropa · 1805–1812',
      judul: 'Puncak kuasa dan *bencana*',
      judulDi: 'Rusia',
      narasi:
        'Setelah berjaya di Austerlitz, kekuatannya hancur saat menyerbu *Rusia* di tengah musim dingin yang membekukan.',
      shots: [
        {
          ...foto('17-la-bataille-d-austerlitz-2-decembre-1805-franc-ois.jpg'),
          move: 'pan-left',
          tag: 'Pertempuran Austerlitz',
        },
        {
          ...foto('20-retreat-of-napoleon-army-from-moscow-1812.jpg'),
          move: 'pan-right',
          tag: 'Mundur dari Rusia · 1812',
          di: 'menyerbu',
        },
      ],
    },
    {
      type: 'timeline',
      duration: 60,
      transition: 'kartu',
      tag: 'Kejatuhan · 1812–1815',
      narasi:
        'Mundur dari Rusia tahun seribu delapan ratus dua belas, ia dibuang ke Elba, lalu kalah di Waterloo.',
      titik: [
        {tahun: 1812, label: 'Mundur dari Rusia', di: 'Rusia'},
        {tahun: 1814, label: 'Diasingkan ke Pulau Elba', di: 'Elba'},
        {tahun: 1815, label: 'Tumbang di Waterloo', di: 'Waterloo'},
      ],
      shots: [
        {
          ...foto('21-horace-vernet-1789-1863-after-the-departure-of-nap.jpg'),
          move: 'push-in',
          tag: 'Pengasingan Elba · 1814',
        },
        {
          ...foto('22-battle-of-waterloo-1815.jpg'),
          move: 'pan-left',
          tag: 'Waterloo · Juni 1815',
          di: 'dibuang',
        },
      ],
    },
    {
      type: 'photo',
      duration: 60,
      transition: 'zoom',
      tag: 'Saint Helena · 1815–1821',
      judul: 'Akhir hidup di *pengasingan*',
      judulDi: 'diasingkan',
      stempel: {teks: 'Diasingkan', di: 'diasingkan', x: 65, y: 42},
      narasi:
        'Napoleon akhirnya *diasingkan* ke Pulau Saint Helena hingga wafat, sebelum jenazahnya dipulangkan ke Kota Paris.',
      shots: [
        {
          ...foto('23-longwood-house-le-12-janvier-2008.jpg'),
          layout: 'print',
          tag: 'Longwood · Saint Helena',
        },
        {
          ...foto('25-paris-do-me-des-invalides-tombeau-de-napole-on-002.jpg'),
          move: 'push-in',
          tag: 'Makam · Les Invalides',
          di: 'wafat',
        },
      ],
    },
    {
      type: 'outro',
      duration: 60,
      transition: 'kartu',
      tag: 'Warisan Napoleon',
      title: 'Jejaknya mengubah *wajah Eropa*',
      cta: 'Follow untuk sejarah lainnya',
      narasi:
        'Jejak hukum dan militernya mengubah Eropa selamanya. Ikuti channel ini untuk kisah sejarah dunia lainnya.',
      shots: [
        {...foto('27-arc-de-triomphe-de-l-e-toile-at-night-vertical-fix.jpg'), move: 'pan-right'},
        {
          ...foto('02-david-napoleon-crossing-the-alps-malmaison1.jpg'),
          move: 'push-in',
          di: 'Ikuti',
        },
      ],
    },
  ],
};
