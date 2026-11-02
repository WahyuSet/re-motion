import credits from '../../public/photos/borobudur/credits.json';
import {fotoDari} from '../lib/foto';
import type {VideoScript} from '../types';

// Naskah video. Foto dari public/photos/borobudur/ (hasil scripts/cari-foto.mjs),
// props dari public/props/ (hasil scripts/generate-props.mjs, prompt-nya di borobudur.props.json),
// narasi dari public/audio/borobudur/ (hasil scripts/potong-narasi.mjs).
// Durasi scene otomatis mengikuti panjang narasi; `duration` di sini hanya batas minimal.
const foto = fotoDari('borobudur', credits);

export const borobudur: VideoScript = {
  narasiAudio: 'audio/borobudur',
  narasiExt: 'wav',
  scenes: [
    {
      type: 'title',
      duration: 90,
      kicker: 'Sejarah Nusantara',
      title: 'Borobudur',
      subtitle: 'Candi Buddha terbesar di dunia',
      narasi:
        'Di jantung Pulau Jawa, berdiri sebuah monumen yang membuat dunia terpukau. Inilah *Borobudur*, candi Buddha terbesar di dunia.',
      shots: [
        {...foto('20-borobudur-temple-park-indonesia-stupas-of-borobudu.jpg'), move: 'pan-right'},
        {...foto('18-borobudur-sunrise-and-volcano-view.jpg'), move: 'push-in'},
        {...foto('06-borobudur-temple-park-indonesia-stupas-of-borobudu.jpg'), move: 'pull-out'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Magelang · Jawa Tengah',
      judul: 'Dibangun *abad ke-9*',
      judulDi: 'kesembilan',
      narasi:
        'Candi ini dibangun sekitar *abad kesembilan Masehi*, pada masa Wangsa *Syailendra*, di wilayah yang kini menjadi Kabupaten Magelang, Jawa Tengah.',
      shots: [
        {...foto('03-borobudur-java-indonesia-20220817-1013-8739.jpg'), move: 'push-in'},
        {
          ...foto('30-thomas-stamford-raffles-map-of-java.jpg'),
          layout: 'print',
          tag: 'Peta Jawa · Raffles',
          anotasi: [{x: 53, y: 56, w: 7, h: 16, label: 'Kedu · Magelang'}],
        },
        {...foto('04-borobudur-java-indonesia-20220817-1058-8808.jpg'), move: 'pan-left', focus: {x: 60, y: 30}},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 2672,
      label: 'Panel relief',
      narasi:
        'Dindingnya dihiasi *dua ribu enam ratus tujuh puluh dua* panel relief. Sebagian besar menceritakan kisah dan ajaran Buddha, sekaligus merekam kehidupan masyarakat Jawa kuno.',
      shots: [
        {...foto('09-kitlv-40091-kassian-ce-phas-relief-of-the-hidden-b.jpg'), move: 'pan-left', tag: 'Relief kaki tersembunyi · foto 1890'},
        {...foto('24-borobudur-divyavadana-086-n-the-landing-of-hiru-an.jpg'), move: 'push-in', tag: 'Relief kapal'},
        {...foto('23-kitlv-84598-kassian-ce-phas-relief-on-the-first-ga.jpg'), layout: 'print', tag: 'Galeri pertama · foto Cephas'},
        {...foto('25-kitlv-90016-borobudur-relief-dancer-with-orchestra.jpg'), move: 'pan-right', tag: 'Penari & pemusik'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'none',
      value: 504,
      label: 'Arca Buddha',
      ulang: {photo: 'photos/borobudur/17-borobudur-buddha-statue-inside-an-enclosed-stupa.jpg', jumlah: 32},
      narasi:
        'Ada juga *lima ratus empat* arca Buddha. Sebagian di antaranya duduk tersembunyi di dalam stupa berlubang di teras paling atas.',
      shots: [
        {...foto('17-borobudur-buddha-statue-inside-an-enclosed-stupa.jpg'), move: 'push-in'},
        {...foto('16-borobudur-temple-park-indonesia-stupas-of-borobudu.jpg'), move: 'pan-left', tag: 'Arupadhatu · teras atas'},
        {...foto('05-borobudur-temple-park-indonesia-stupas-of-borobudu.jpg'), move: 'tilt-up'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'zoom',
      tag: 'Kassian Cephas · 1872',
      judul: '*Terlupakan* berabad-abad',
      judulDi: 'terlupakan',
      narasi:
        'Namun selama ratusan tahun, Borobudur sempat *terlupakan*. Lapisan *abu vulkanik* dan hutan lebat menutupi bangunannya.',
      shots: [
        {
          ...foto('10-kitlv-40183-kassian-ce-phas-borobudur-1872.jpg'),
          layout: 'print',
          anotasi: [{x: 50, y: 29, w: 13, h: 11, label: 'Stupa induk'}],
        },
        {...foto('08-kitlv-29214-kassian-ce-phas-stair-and-gate-borobud.jpg'), move: 'pan-left'},
        {...foto('07-kitlv-40942-kassian-ce-phas-part-of-the-second-lev.jpg'), layout: 'print'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'dorong',
      value: 1814,
      format: 'year',
      label: 'Ditemukan kembali',
      stempel: {teks: 'Dibersihkan', di: 'dibersihkan', x: 68, y: 46},
      narasi:
        'Pada tahun *seribu delapan ratus empat belas*, di masa pemerintahan Thomas Stamford Raffles, candi ini mulai dibersihkan dan dikenal kembali oleh dunia.',
      shots: [
        {...foto('29-stamfordraffles.jpg'), layout: 'print', tag: 'Letnan Gubernur Jawa · 1811–1816'},
        {...foto('13-boroboedoe-bij-magelang-tijdens-de-restauratie-doo.jpg'), move: 'pan-right', tag: 'Restorasi Van Erp · 1907–1911'},
        {...foto('14-kitlv-a746-boroboedoer-bij-magelang-tijdens-de-res.jpg'), layout: 'print'},
      ],
    },
    {
      type: 'outro',
      duration: 90,
      transition: 'kartu',
      tag: 'UNESCO · 1991',
      title: 'Situs Warisan Dunia *UNESCO* sejak 1991',
      cta: 'Follow untuk sejarah lainnya',
      narasi:
        'Sejak tahun seribu sembilan ratus sembilan puluh satu, Borobudur diakui UNESCO sebagai Situs Warisan Dunia. Ikuti channel ini untuk kisah sejarah Nusantara lainnya.',
      shots: [
        {...foto('19-sunrise-over-borobudur.jpg'), move: 'push-in'},
        {...foto('28-borobudur-buddha-statue-061-buddha-statue-at-dawn-.jpg'), move: 'pull-out'},
      ],
    },
  ],
};
