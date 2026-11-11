import credits from '../../public/photos/warren-buffett/credits.json';
import {fotoDari} from '../lib/foto';
import type {VideoScript} from '../types';

// Naskah short 9:16 "Warren Buffett". Ikuti .claude/skills/video-sejarah/SKILL.md (bagian Mode Short).
// Cek dengan: node scripts/cek-naskah.mjs warren-buffett-short
// Turunan dari video "warren-buffett": foto & kredit diambil dari public/photos/warren-buffett/.
const foto = fotoDari('warren-buffett', credits);

export const warrenBuffettShort: VideoScript = {
  format: 'short',
  narasiAudio: 'audio/warren-buffett-short',
  narasiExt: 'wav',
  youtube: {
    judul: 'Rahasia Kekayaan Warren Buffett dalam 60 Detik #Shorts',
    deskripsi:
      'Bagaimana Warren Buffett membangun kekayaan dari usia sebelas tahun lewat investasi nilai dan efek bola salju waktu, lalu menyumbangkan 99 persen hartanya.',
    tags: [
      'warren buffett',
      'prinsip keuangan',
      'investasi nilai',
      'berkshire hathaway',
      'sejarah ekonomi',
    ],
  },
  thumbnail: {
    judul: 'Kaya lewat *bola salju waktu*',
    sub: 'Rahasia Warren Buffett',
    ...foto('02-warren-buffett-at-the-2015-selectusa-investment-su.jpg'),
    focus: {x: 50, y: 30},
  },
  scenes: [
    {
      type: 'title',
      duration: 60,
      kicker: 'Tokoh & Keuangan',
      title: 'Warren Buffett',
      narasi:
        'Sembilan puluh sembilan persen hartanya baru datang setelah usia lima puluh. Inilah rahasia keuangan *Warren Buffett*.',
      shots: [
        {
          ...foto('21-new-york-stock-exchange-trading-floor-on-wall-stre.jpg'),
          move: 'pan-right',
          tag: 'Wall Street · New York',
        },
        {
          ...foto('12-2312-n-st-south-omaha-main-street-historic-distric.jpg'),
          move: 'pan-left',
          tag: 'Kawasan Omaha · Nebraska',
          di: 'setelah',
        },
        {
          ...foto('02-warren-buffett-at-the-2015-selectusa-investment-su.jpg'),
          move: 'push-in',
          focus: {x: 50, y: 30},
          tag: 'Warren Buffett · Investor',
          di: 'Inilah',
        },
      ],
    },
    {
      type: 'fact',
      duration: 60,
      transition: 'dorong',
      value: 11,
      label: 'Usia beli saham pertama',
      narasi:
        'Sejak kecil ia giat menabung dari berdagang, lalu membeli saham pertamanya pada usia *sebelas* tahun.',
      shots: [
        {
          ...foto('29-lewis-hine-simon-mellitto-age-10-newsboy-philadelp.jpg'),
          layout: 'print',
          tag: 'Penjual koran · Lewis Hine',
        },
        {
          ...foto('30-1894-b-o-railroad-stock-certificate-signed-by-orla.jpg'),
          layout: 'print',
          tag: 'Sertifikat saham klasik',
          di: 'membeli',
        },
      ],
    },
    {
      type: 'photo',
      duration: 60,
      transition: 'kartu',
      tag: 'Universitas Columbia',
      judul: 'Belajar *investasi nilai*',
      judulDi: 'nilai,',
      narasi:
        'Dari gurunya Benjamin Graham, ia belajar investasi *nilai*, yakni membeli perusahaan bagus di bawah harga aslinya.',
      shots: [
        {
          ...foto('24-low-memorial-library-columbia-university-nyc-retou.jpg'),
          move: 'pan-left',
          tag: 'Low Library · Columbia',
        },
        {
          ...foto('19-trading-floor-new-york-stock-exchange-new-york-new.jpg'),
          move: 'push-in',
          tag: 'Bursa Saham New York',
          di: 'membeli',
        },
      ],
    },
    {
      type: 'fact',
      duration: 60,
      transition: 'zoom',
      value: 1965,
      format: 'year',
      label: 'Akuisisi Berkshire Hathaway',
      stempel: {teks: 'Titik Balik', di: 'mengambil', x: 65, y: 45},
      narasi:
        'Tahun *seribu sembilan ratus enam puluh lima*, ia mengambil alih pabrik tekstil Berkshire Hathaway menjadi perusahaan induk.',
      shots: [
        {
          ...foto('32-hathaway-mills.jpg'),
          move: 'pan-right',
          tag: 'Pabrik Hathaway Mills',
        },
        {
          ...foto('47-omaha-nebraska-skyline-view-from-joslyn-art-museum.jpg'),
          move: 'pan-left',
          tag: 'Kota Omaha · Nebraska',
          di: 'Berkshire',
        },
      ],
    },
    {
      type: 'photo',
      duration: 60,
      transition: 'dorong',
      tag: 'Efek bunga majemuk',
      judul: 'Gulungan *bola salju*',
      judulDi: 'salju',
      narasi:
        'Bersama Charlie Munger, ia membiarkan modalnya tumbuh puluhan tahun layaknya gulungan *bola salju* yang terus membesar.',
      shots: [
        {
          ...foto('26-charlie-munger-2-cropped.jpg'),
          layout: 'print',
          tag: 'Charlie Munger · Mitra',
        },
        {
          ...foto('39-1.jpg'),
          move: 'push-in',
          tag: 'Efek gulungan bola salju',
          di: 'layaknya',
        },
      ],
    },
    {
      type: 'fact',
      duration: 60,
      transition: 'kartu',
      value: 99,
      suffix: '%',
      label: 'Harta yang disumbangkan',
      narasi:
        'Meski amat kaya, ia tetap hidup sederhana di rumah lamanya dan menyumbangkan *sembilan puluh sembilan* persen hartanya.',
      shots: [
        {
          ...foto('10-dundee-hd-omaha-ne.jpg'),
          layout: 'print',
          tag: 'Rumah Omaha · sejak 1958',
        },
        {
          ...foto('41-bill-gates-2023-p062021-967902-cropped.jpg'),
          layout: 'print',
          tag: 'Mitra filantropi dunia',
          di: 'menyumbangkan',
        },
      ],
    },
    {
      type: 'outro',
      duration: 60,
      transition: 'dorong',
      tag: 'Prinsip Warren Buffett',
      title: 'Versi *lengkapnya* di channel',
      cta: 'Follow untuk kisah lainnya',
      narasi:
        'Kekayaan sejati lahir dari disiplin dan kesabaran. Tonton versi lengkapnya di channel ini, dan ikuti untuk kisah lainnya.',
      shots: [
        {
          ...foto('04-warren-buffett-wall-street-money-never-sleeps-prem.jpg'),
          layout: 'print',
        },
        {
          ...foto('48-city-of-omaha-nebraska-skyline-on-gene-leahy-mall.jpg'),
          move: 'pan-right',
          di: 'Tonton',
        },
      ],
    },
  ],
};
