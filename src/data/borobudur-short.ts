import credits from '../../public/photos/borobudur/credits.json';
import {fotoDari} from '../lib/foto';
import type {VideoScript} from '../types';

// Naskah short 9:16 "Borobudur". Ikuti .claude/skills/video-sejarah/SKILL.md (bagian Mode Short).
// Cek dengan: node scripts/cek-naskah.mjs borobudur-short
// Turunan dari video "borobudur": foto & kredit diambil dari public/photos/borobudur/.
// Butuh foto tambahan? node scripts/cari-foto.mjs "<kata kunci>" --slug borobudur
const foto = fotoDari('borobudur', credits);

export const borobudurShort: VideoScript = {
  format: 'short',
  // Isi dua baris ini SETELAH audio narasi dipotong (node scripts/potong-narasi.mjs):
  // narasiAudio: 'audio/borobudur-short',
  // narasiExt: 'wav',
  scenes: [
    {
      type: 'title',
      duration: 60,
      kicker: 'Sejarah Nusantara',
      title: 'Borobudur',
      narasi: 'Candi Buddha terbesar di dunia ini pernah hilang ditelan hutan. Inilah *Borobudur*.',
      shots: [
        {...foto('10-kitlv-40183-kassian-ce-phas-borobudur-1872.jpg'), layout: 'print'},
        {...foto('03-borobudur-java-indonesia-20220817-1013-8739.jpg'), move: 'pan-right', di: 'Inilah'},
      ],
    },
    {
      type: 'photo',
      duration: 60,
      transition: 'dorong',
      tag: 'Magelang · abad ke-9',
      judul: 'Dibangun *abad ke-9*',
      judulDi: 'kesembilan',
      narasi: 'Candi ini dibangun sekitar *abad kesembilan* oleh Wangsa Syailendra, di Magelang, Jawa Tengah.',
      shots: [
        {...foto('01-borobudur-nothwest-view.jpg'), move: 'pan-left'},
        {
          ...foto('30-thomas-stamford-raffles-map-of-java.jpg'),
          layout: 'print',
          di: 'Magelang,',
          tag: 'Peta Jawa · Raffles',
          anotasi: [{x: 53, y: 56, w: 7, h: 16, label: 'Magelang'}],
        },
      ],
    },
    {
      type: 'fact',
      duration: 60,
      transition: 'kartu',
      value: 2672,
      label: 'Panel relief',
      narasi: 'Dindingnya dihiasi *dua ribu enam ratus tujuh puluh dua* panel relief yang bercerita.',
      shots: [
        {...foto('09-kitlv-40091-kassian-ce-phas-relief-of-the-hidden-b.jpg'), move: 'pan-right'},
        {...foto('24-borobudur-divyavadana-086-n-the-landing-of-hiru-an.jpg'), move: 'pan-left', di: 'relief', tag: 'Relief kapal'},
      ],
    },
    {
      type: 'fact',
      duration: 60,
      transition: 'none',
      value: 504,
      label: 'Arca Buddha',
      ulang: {photo: 'photos/borobudur/17-borobudur-buddha-statue-inside-an-enclosed-stupa.jpg', jumlah: 24},
      narasi: 'Ada *lima ratus empat* arca Buddha, banyak yang tersembunyi di dalam stupa berlubang.',
      shots: [
        {...foto('17-borobudur-buddha-statue-inside-an-enclosed-stupa.jpg'), move: 'push-in'},
        {...foto('16-borobudur-temple-park-indonesia-stupas-of-borobudu.jpg'), move: 'pan-right', di: 'stupa'},
      ],
    },
    {
      type: 'photo',
      duration: 60,
      transition: 'zoom',
      tag: 'Kassian Cephas · 1872',
      judul: '*Terlupakan* berabad-abad',
      judulDi: 'terlupakan,',
      narasi:
        'Lalu candi ini *terlupakan*, tertutup abu vulkanik dan hutan, sampai mulai dibersihkan tahun seribu delapan ratus empat belas.',
      shots: [
        {
          ...foto('10-kitlv-40183-kassian-ce-phas-borobudur-1872.jpg'),
          layout: 'print',
          anotasi: [{x: 50, y: 29, w: 13, h: 11, label: 'Stupa induk'}],
        },
        {...foto('13-boroboedoe-bij-magelang-tijdens-de-restauratie-doo.jpg'), move: 'pan-left', di: 'dibersihkan'},
      ],
    },
    {
      type: 'outro',
      duration: 60,
      transition: 'kartu',
      title: 'Versi *lengkapnya* ada di channel',
      cta: 'Follow untuk sejarah lainnya',
      narasi:
        'Kini Borobudur menjadi Situs Warisan Dunia UNESCO. Tonton versi lengkapnya di channel ini, dan ikuti untuk kisah sejarah lainnya.',
      shots: [
        {...foto('19-sunrise-over-borobudur.jpg'), move: 'pan-right'},
        {...foto('01-borobudur-nothwest-view.jpg'), move: 'push-in', di: 'Tonton'},
      ],
    },
  ],
};
