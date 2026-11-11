import credits from '../../public/photos/warren-buffett/credits.json';
import {fotoDari} from '../lib/foto';
import type {VideoScript} from '../types';

// Naskah video "Warren Buffett: Prinsip Keuangan & Sang Peramal dari Omaha".
// Sumber fakta: warren-buffett.sumber.md. Rencana: rencana/warren-buffett.md.
// Cek dengan: node scripts/cek-naskah.mjs warren-buffett
const foto = fotoDari('warren-buffett', credits);

export const warrenBuffett: VideoScript = {
  narasiAudio: 'audio/warren-buffett',
  narasiExt: 'wav',
  youtube: {
    judul: 'Warren Buffett: Prinsip Keuangan Sang Miliarder Omaha',
    deskripsi:
      'Bagaimana Warren Buffett membangun kekayaan dari mengantar koran dan membeli saham di usia sebelas tahun hingga memimpin Berkshire Hathaway, sembari tetap tinggal di rumah tahun 1958 dan menyumbangkan 99 persen hartanya.',
    tags: [
      'warren buffett',
      'keuangan warren buffett',
      'berkshire hathaway',
      'sejarah investasi',
      'value investing',
      'benjamin graham',
      'charlie munger',
    ],
  },
  thumbnail: {
    judul: 'Kaya dari *kesabaran & waktu*',
    sub: 'Kisah & Prinsip Warren Buffett',
    ...foto('02-warren-buffett-at-the-2015-selectusa-investment-su.jpg'),
  },
  scenes: [
    // Bab 1. Sang Peramal dari Omaha (scene 1–4)
    {
      type: 'title',
      duration: 90,
      bab: 'Sang Peramal dari Omaha',
      kicker: 'Tokoh & Keuangan',
      title: 'Warren Buffett',
      subtitle: 'Prinsip keuangan sang peramal dari Omaha',
      narasi:
        'Bagaimana seseorang bisa menjadi salah satu manusia terkaya di dunia, namun tetap tinggal di rumah yang sama selama puluhan tahun? Inilah kisah *Warren Buffett*.',
      shots: [
        {
          ...foto('02-warren-buffett-at-the-2015-selectusa-investment-su.jpg'),
          move: 'push-in',
          focus: {x: 50, y: 30},
          tag: 'Warren Buffett · Investor Amerika',
        },
        {
          ...foto('21-new-york-stock-exchange-trading-floor-on-wall-stre.jpg'),
          move: 'pan-right',
          tag: 'Bursa Saham Wall Street · New York',
          di: 'terkaya',
        },
        {
          ...foto('47-omaha-nebraska-skyline-view-from-joslyn-art-museum.jpg'),
          move: 'pull-out',
          tag: 'Kota Omaha · Nebraska',
          di: 'rumah',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Omaha · Nebraska',
      judul: 'Rumah sejak *lima puluh delapan*',
      judulDi: 'delapan',
      narasi:
        'Di kota Omaha, Nebraska, Warren Buffett masih menempati rumah sederhana yang ia beli pada tahun seribu sembilan ratus lima puluh delapan.',
      shots: [
        {
          ...foto('48-city-of-omaha-nebraska-skyline-on-gene-leahy-mall.jpg'),
          move: 'pan-right',
          tag: 'Pusat kota Omaha · Nebraska',
        },
        {
          ...foto('10-dundee-hd-omaha-ne.jpg'),
          layout: 'print',
          tag: 'Rumah Omaha · dibeli tahun 1958',
          di: 'rumah',
        },
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 1930,
      format: 'year',
      label: 'Lahir saat Depresi Besar',
      narasi:
        'Ia lahir pada tiga puluh Agustus *seribu sembilan ratus tiga puluh*, tepat ketika Amerika Serikat sedang dihantam krisis ekonomi Depresi Besar.',
      shots: [
        {
          ...foto('05-180830124413-02-warren-buffett.jpg'),
          layout: 'print',
          tag: 'Warren Buffett masa bayi · 1930',
        },
        {
          ...foto('15-american-union-bank.jpg'),
          layout: 'print',
          tag: 'Antrean nasabah bank · Depresi Besar',
          di: 'ketika',
        },
        {
          ...foto('14-lange-migrantmother02.jpg'),
          move: 'push-in',
          tag: 'Potret masa Depresi Besar · 1930-an',
          di: 'krisis',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Omaha · masa kecil',
      judul: 'Berdagang sejak *usia enam tahun*',
      judulDi: 'enam',
      narasi:
        'Sejak usia enam tahun, ia sudah mencari uang sendiri dengan menjual permen karet, botol minuman, hingga mengantar koran keliling kota.',
      shots: [
        {
          ...foto('38-15-09-26-ralfr-wlc-0098-coca-cola-glass-bottle-ger.jpg'),
          move: 'pan-left',
          tag: 'Botol minuman kaca klasik',
        },
        {
          ...foto('29-lewis-hine-simon-mellitto-age-10-newsboy-philadelp.jpg'),
          layout: 'print',
          tag: 'Bocah penjual koran · arsip Lewis Hine',
          di: 'mengantar',
        },
      ],
    },

    // Bab 2. Saham pertama dan kesabaran (scene 5–8)
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      bab: 'Saham pertama dan kesabaran',
      value: 11,
      label: 'Usia beli saham pertama',
      narasi:
        'Pada tahun seribu sembilan ratus empat puluh dua, di usia *sebelas* tahun, Buffett membeli tiga lembar saham pertamanya di perusahaan Cities Service.',
      shots: [
        {
          ...foto('45-exterior-view-of-the-new-york-stock-exchange-gille.jpg'),
          layout: 'print',
          tag: 'Gedung Bursa Saham New York',
        },
        {
          ...foto('30-1894-b-o-railroad-stock-certificate-signed-by-orla.jpg'),
          layout: 'print',
          tag: 'Lembar sertifikat saham klasik',
          di: 'membeli',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Cities Service · 1942',
      judul: 'Menjual *terlalu cepat*',
      judulDi: 'menjualnya',
      narasi:
        'Harga saham itu sempat anjlok sebelum naik tipis. Ia buru-buru menjualnya demi untung kecil, padahal setelah itu harganya melesat berkali-kali lipat.',
      shots: [
        {
          ...foto('19-trading-floor-new-york-stock-exchange-new-york-new.jpg'),
          move: 'push-in',
          tag: 'Lantai perdagangan Bursa New York',
        },
        {
          ...foto('31-boston-and-providence-railroad-stock-certificate.jpg'),
          layout: 'print',
          tag: 'Dokumen kepemilikan saham lama',
          di: 'menjualnya',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Pelajaran pertama',
      judul: 'Kunci utamanya *kesabaran*',
      judulDi: 'kesabaran',
      narasi:
        'Pengalaman masa kecil itu mengajarkan prinsip penting bahwa pasar modal memindahkan uang dari orang yang tidak sabar kepada orang yang memiliki *kesabaran*.',
      shots: [
        {
          ...foto('21-new-york-stock-exchange-trading-floor-on-wall-stre.jpg'),
          move: 'pan-right',
          tag: 'Pergerakan pasar di Wall Street',
        },
        {
          ...foto('01-warren-buffett-ku-visit.jpg'),
          move: 'push-in',
          focus: {x: 50, y: 25},
          tag: 'Prinsip kesabaran jangka panjang',
          di: 'memindahkan',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Washington D.C. · 1945',
      judul: 'Bisnis koran dan *pinball*',
      judulDi: 'koran',
      narasi:
        'Saat remaja, ia mengumpulkan tabungan dari hasil mengantar koran dan menaruh mesin permainan di pangkas rambut, lalu membeli lahan pertanian di Nebraska.',
      shots: [
        {
          ...foto('28-lewis-hine-indianapolis-newsboy-41-inches-high-190.jpg'),
          layout: 'print',
          tag: 'Pengantar koran muda · arsip NARA',
        },
        {
          ...foto('18-the-chicago-sunday-bee-about-books-13-oct-1946.jpg'),
          layout: 'print',
          tag: 'Surat kabar Amerika · 1946',
          di: 'koran',
        },
        {
          ...foto('12-2312-n-st-south-omaha-main-street-historic-distric.jpg'),
          move: 'pull-out',
          tag: 'Kawasan niaga di Nebraska',
          di: 'lahan',
        },
      ],
    },

    // Bab 3. Guru besar investasi nilai (scene 9–13)
    {
      type: 'fact',
      duration: 90,
      transition: 'zoom',
      bab: 'Guru besar investasi nilai',
      value: 1950,
      format: 'year',
      label: 'Kuliah di Universitas Columbia',
      narasi:
        'Setelah ditolak Universitas Harvard, Buffett mendaftar ke Universitas Columbia pada tahun *seribu sembilan ratus lima puluh* untuk belajar langsung dari Benjamin Graham.',
      shots: [
        {
          ...foto('24-low-memorial-library-columbia-university-nyc-retou.jpg'),
          move: 'push-in',
          tag: 'Low Library · Columbia University',
        },
        {
          ...foto('25-low-memorial-library-columbia-university-college-w.jpg'),
          move: 'pan-left',
          tag: 'Kampus Universitas Columbia · New York',
          di: 'tahun',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'The Intelligent Investor · 1949',
      judul: 'Membeli di bawah *nilai asli*',
      judulDi: 'nilai',
      narasi:
        'Graham adalah bapak investasi nilai. Ia mengajarkan cara mencari perusahaan bagus yang harga sahamnya sedang dijual jauh di bawah nilai aslinya.',
      shots: [
        {
          ...foto('30-1894-b-o-railroad-stock-certificate-signed-by-orla.jpg'),
          layout: 'print',
          tag: 'Analisis nilai intrinsik saham',
        },
        {
          ...foto('19-trading-floor-new-york-stock-exchange-new-york-new.jpg'),
          move: 'pan-right',
          tag: 'Transaksi saham di lantai bursa',
          di: 'perusahaan',
        },
      ],
    },
    {
      type: 'kutipan',
      duration: 90,
      transition: 'kartu',
      teks: 'Harga adalah apa yang Anda bayar, sedangkan *nilai* adalah apa yang Anda dapatkan.',
      sumber: 'Surat Pemegang Saham Berkshire Hathaway, 2008',
      narasi:
        'Dalam surat tahunannya pada dua ribu delapan, Buffett merangkum pelajaran gurunya: harga adalah apa yang Anda bayar, sedangkan nilai adalah apa yang Anda dapatkan.',
      shots: [
        {
          ...foto('04-warren-buffett-wall-street-money-never-sleeps-prem.jpg'),
          move: 'push-in',
          tag: 'Warren Buffett · New York, 2010',
        },
        {
          ...foto('16-great-depression-token-brother-can-you-spare-a-dim.jpg'),
          layout: 'print',
          tag: 'Perbedaan harga pasar dan nilai',
          di: 'harga',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Washington D.C. · 1951',
      judul: 'Mengetuk pintu *kantor asuransi*',
      judulDi: 'asuransi',
      narasi:
        'Tahun seribu sembilan ratus lima puluh satu, ia naik kereta di akhir pekan demi mengetuk pintu kantor asuransi GEICO dan mempelajari cara kerjanya.',
      shots: [
        {
          ...foto('36-president-barack-obama-and-warren-buffett-in-the-o.jpg'),
          move: 'pan-right',
          tag: 'Kunjungan kerja di Washington D.C.',
        },
        {
          ...foto('45-exterior-view-of-the-new-york-stock-exchange-gille.jpg'),
          layout: 'print',
          tag: 'Gedung keuangan Amerika abad ke-20',
          di: 'kantor',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Model bisnis asuransi',
      judul: 'Modal dari *premi asuransi*',
      judulDi: 'premi',
      narasi:
        'Dari sana ia memahami bahwa perusahaan asuransi menerima uang premi di muka sebelum klaim dibayar, sehingga dana itu bisa diputarkan untuk berinvestasi.',
      shots: [
        {
          ...foto('37-p071811ps-0254-5951720542.jpg'),
          move: 'push-in',
          tag: 'Strategi perputaran modal asuransi',
        },
        {
          ...foto('21-new-york-stock-exchange-trading-floor-on-wall-stre.jpg'),
          move: 'pan-left',
          tag: 'Penempatan dana premi ke pasar saham',
          di: 'dana',
        },
      ],
    },

    // Bab 4. Lahirnya kerajaan Berkshire Hathaway (scene 14–18)
    {
      type: 'fact',
      duration: 90,
      transition: 'dorong',
      bab: 'Lahirnya kerajaan Berkshire Hathaway',
      value: 1956,
      format: 'year',
      label: 'Kemitraan investasi di Omaha',
      narasi:
        'Pada tahun *seribu sembilan ratus lima puluh enam*, Buffett kembali ke Omaha dan mendirikan kemitraan investasi dari kamar tidur rumahnya.',
      shots: [
        {
          ...foto('11-omaha-4833-4835-s-24-vanous-block.jpg'),
          move: 'push-in',
          tag: 'Kawasan bersejarah kota Omaha',
        },
        {
          ...foto('10-dundee-hd-omaha-ne.jpg'),
          layout: 'print',
          tag: 'Kediaman tempat Buffett berkantor',
          di: 'kemitraan',
        },
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'none',
      value: 1965,
      format: 'year',
      label: 'Mengambil alih Berkshire Hathaway',
      stempel: {teks: 'Titik Balik', di: 'mengambil', x: 70, y: 44},
      narasi:
        'Lalu pada tahun *seribu sembilan ratus enam puluh lima*, ia mengambil alih kendali perusahaan tekstil tua yang sedang merugi bernama Berkshire Hathaway.',
      shots: [
        {
          ...foto('32-hathaway-mills.jpg'),
          move: 'push-in',
          tag: 'Pabrik Hathaway Mills · New Bedford',
        },
        {
          ...foto('43-paterson-new-jersey-textiles-looms-nara-518596.jpg'),
          layout: 'print',
          tag: 'Deretan mesin tenun pabrik tekstil',
          di: 'perusahaan',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'New Bedford · Massachusetts',
      judul: 'Dari tekstil ke *perusahaan induk*',
      judulDi: 'induk',
      narasi:
        'Bisnis tekstilnya terus tertekan impor murah. Buffett pun mengalihkan arus kasnya untuk membeli perusahaan asuransi, perbankan, dan ritel di bawah satu perusahaan induk.',
      shots: [
        {
          ...foto('44-masson-mills-wtm-12b-power-loom-5877.jpg'),
          move: 'pull-out',
          tag: 'Mesin tenun industri tekstil',
        },
        {
          ...foto('47-omaha-nebraska-skyline-view-from-joslyn-art-museum.jpg'),
          move: 'pan-right',
          tag: 'Omaha · markas Berkshire Hathaway',
          di: 'membeli',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Charlie Munger · mitra bisnis',
      judul: 'Bisnis hebat, *harga wajar*',
      judulDi: 'hebat',
      narasi:
        'Bersama sahabat dan mitra bisnisnya, Charlie Munger, ia mengubah strategi menjadi membeli perusahaan hebat dengan harga wajar dan memegangnya dalam jangka panjang.',
      shots: [
        {
          ...foto('26-charlie-munger-2-cropped.jpg'),
          layout: 'print',
          tag: 'Charlie Munger · Wakil Ketua Berkshire',
        },
        {
          ...foto('27-charlie-munger-2.jpg'),
          move: 'push-in',
          tag: 'Filosofi investasi Munger & Buffett',
          di: 'membeli',
        },
      ],
    },
    {
      type: 'timeline',
      duration: 90,
      transition: 'kartu',
      tag: 'Jejak akuisisi utama',
      narasi:
        'Berkshire membeli asuransi National Indemnity tahun seribu sembilan ratus enam puluh tujuh, toko cokelat tahun tujuh puluh dua, saham minuman bersoda tahun delapan puluh delapan, hingga raksasa teknologi tahun dua ribu enam belas.',
      titik: [
        {tahun: 1967, label: 'National Indemnity', di: 'asuransi'},
        {tahun: 1972, label: "See's Candies", di: 'cokelat'},
        {tahun: 1988, label: 'Saham Coca-Cola', di: 'minuman'},
        {tahun: 2016, label: 'Saham Apple', di: 'teknologi'},
      ],
      shots: [
        {
          ...foto('33-sees-candies-headquarters.jpg'),
          move: 'pan-right',
          tag: "See's Candies · diakuisisi 1972",
        },
        {
          ...foto('38-15-09-26-ralfr-wlc-0098-coca-cola-glass-bottle-ger.jpg'),
          move: 'pan-left',
          tag: 'Saham Coca-Cola · dibeli sejak 1988',
          di: 'minuman',
        },
      ],
    },

    // Bab 5. Prinsip keuangan dan efek bola salju (scene 19–22)
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      bab: 'Prinsip keuangan dan efek bola salju',
      tag: 'Aturan nomor satu',
      judul: 'Jangan pernah *kehilangan uang*',
      judulDi: 'kehilangan',
      narasi:
        'Prinsip pertamanya terkenal tegas: aturan nomor satu adalah jangan pernah kehilangan uang, dan aturan nomor dua adalah jangan lupakan aturan nomor satu.',
      shots: [
        {
          ...foto('02-warren-buffett-at-the-2015-selectusa-investment-su.jpg'),
          move: 'push-in',
          tag: 'Prinsip perlindungan modal utama',
        },
        {
          ...foto('31-boston-and-providence-railroad-stock-certificate.jpg'),
          layout: 'print',
          tag: 'Menjaga batas keamanan investasi',
          di: 'aturan nomor dua',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Bunga majemuk · efek bola salju',
      judul: 'Gulungan *bola salju* waktu',
      judulDi: 'salju',
      narasi:
        'Kekayaannya tumbuh berkat efek bunga berbunga. Ia mengibaratkannya seperti menggelindingkan bola salju kecil dari puncak bukit panjang yang basah dan bersalju.',
      shots: [
        {
          ...foto('39-1.jpg'),
          move: 'push-in',
          tag: 'Ibarat bola salju yang terus membesar',
        },
        {
          ...foto('40-snowball-pyramid-at-santa-claus-village.jpg'),
          move: 'pan-right',
          tag: 'Akumulasi hasil bunga majemuk',
          di: 'bola',
        },
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'dorong',
      value: 50,
      label: 'Usia saat kekayaan melesat',
      narasi:
        'Buktinya, sebagian besar kekayaan bersih Warren Buffett baru terbentuk setelah ia melewati usia *lima puluh* tahun, hasil dari investasi yang tidak terputus.',
      shots: [
        {
          ...foto('03-warren-buffett-at-the-2015-selectusa-investment-su.jpg'),
          layout: 'print',
          tag: 'Hasil investasi puluhan tahun',
        },
        {
          ...foto('37-p071811ps-0254-5951720542.jpg'),
          move: 'pan-left',
          tag: 'Pertumbuhan eksponensial di usia matang',
          di: 'melewati',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Lingkaran kompetensi',
      judul: 'Pahami apa yang *Anda beli*',
      judulDi: 'pahami',
      narasi:
        'Ia juga menolak membeli bisnis yang tidak ia pahami. Dalam keseharian, ia menghindari utang konsumtif dan tetap sarapan sederhana setiap pagi.',
      shots: [
        {
          ...foto('34-see-s-candies-december-2025-sarah-stierch-04.jpg'),
          move: 'push-in',
          tag: "Gerai toko cokelat See's Candies",
        },
        {
          ...foto('13-4801-s-24th-st-south-omaha-main-street-historic-di.jpg'),
          move: 'pan-right',
          tag: 'Gaya hidup bersahaja di Omaha',
          di: 'menghindari',
        },
      ],
    },

    // Bab 6. Janji filantropi dan warisan (scene 23–26)
    {
      type: 'fact',
      duration: 90,
      transition: 'dorong',
      bab: 'Janji filantropi dan warisan',
      value: 99,
      suffix: '%',
      label: 'Kekayaan yang disumbangkan',
      stempel: {teks: 'Disumbangkan', di: 'menyumbangkan', x: 70, y: 44},
      narasi:
        'Sejak tahun dua ribu enam, Buffett berjanji menyumbangkan lebih dari *sembilan puluh sembilan* persen kekayaannya untuk kegiatan amal dan kesehatan dunia.',
      shots: [
        {
          ...foto('01-warren-buffett-ku-visit.jpg'),
          layout: 'print',
          tag: 'Komitmen filantropi · sejak 2006',
        },
        {
          ...foto('41-bill-gates-2023-p062021-967902-cropped.jpg'),
          layout: 'print',
          tag: 'Bill Gates · mitra filantropi',
          di: 'kegiatan',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'The Giving Pledge · 2010',
      judul: 'Gerakan *berbagi kekayaan*',
      judulDi: 'mengajak',
      narasi:
        'Bersama Bill dan Melinda Gates pada tahun dua ribu sepuluh, ia menggagas gerakan untuk mengajak para miliarder dunia menyumbangkan mayoritas harta mereka.',
      shots: [
        {
          ...foto('42-bill-gates-jose-ignacio-galindo.jpg'),
          layout: 'print',
          tag: 'Pendiri The Giving Pledge · 2010',
        },
        {
          ...foto('36-president-barack-obama-and-warren-buffett-in-the-o.jpg'),
          move: 'push-in',
          tag: 'Kampanye filantropi para miliarder',
          di: 'mengajak',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Omaha · rapat tahunan',
      judul: 'Puluhan ribu *investor datang*',
      judulDi: 'ribu',
      narasi:
        'Setiap tahun, puluhan ribu orang datang ke Omaha untuk mendengarkan wejangan keuangannya tentang kesabaran, disiplin, dan ketenangan menghadapi gejolak pasar.',
      shots: [
        {
          ...foto('07-warren-buffett-with-fisher-college-of-business-stu.jpg'),
          layout: 'print',
          tag: 'Pertemuan bersama mahasiswa bisnis',
        },
        {
          ...foto('08-warren-buffett-with-fisher-college-of-business-stu.jpg'),
          layout: 'print',
          tag: 'Berbagi ilmu investasi di Omaha',
          di: 'mendengarkan',
        },
      ],
    },
    {
      type: 'outro',
      duration: 90,
      transition: 'kartu',
      tag: 'Warren Buffett · Keuangan',
      title: 'Kaya karena *waktu dan disiplin*',
      cta: 'Follow untuk sejarah lainnya',
      narasi:
        'Kisah Warren Buffett membuktikan bahwa kekayaan sejati dibangun dari disiplin, kesabaran, dan waktu. Ikuti channel ini untuk kisah tokoh dan sejarah lainnya.',
      shots: [
        {
          ...foto('04-warren-buffett-wall-street-money-never-sleeps-prem.jpg'),
          layout: 'print',
        },
        {
          ...foto('48-city-of-omaha-nebraska-skyline-on-gene-leahy-mall.jpg'),
          move: 'pull-out',
          di: 'kesabaran,',
        },
      ],
    },
  ],
};
