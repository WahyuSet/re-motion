import credits from '../../public/photos/danau-toba/credits.json';
import {fotoDari} from '../lib/foto';
import type {VideoScript} from '../types';

// Naskah video "Danau Toba". Mengikuti .claude/skills/video-sejarah/SKILL.md.
const foto = fotoDari('danau-toba', credits);

export const danauToba: VideoScript = {
  narasiAudio: 'audio/danau-toba',
  narasiExt: 'wav',
  music: 'music/danau-toba/03-ketawang-sekar-teja-slendro-manyura.mp3',
  youtube: {
    judul: 'Sejarah Danau Toba: Supervulkan Purba Hingga Geopark Dunia',
    deskripsi:
      'Menelusuri sejarah pembentukan Danau Toba dari letusan katastropik supervulkan 74.000 tahun lalu, fenomena pengangkatan Pulau Samosir, hingga jejak kebudayaan luhur masyarakat Batak di Sumatera Utara.',
    tags: [
      'danau toba',
      'sejarah danau toba',
      'supervulkan toba',
      'pulau samosir',
      'batak toba',
      'geopark toba',
      'sejarah nusantara',
      'sumatera utara',
    ],
  },
  thumbnail: {
    judul: 'Rahasia letusan *supervulkan purba*',
    sub: 'Sejarah Sumatera Utara',
    ...foto('04-lake-toba-from-simalem-north-sumatra.jpg'),
  },
  scenes: [
    // ==========================================
    // BAB 1: Danau Toba
    // ==========================================
    {
      type: 'title',
      duration: 90,
      bab: 'Danau Toba',
      kicker: 'Keajaiban Nusantara',
      title: 'Danau Toba',
      subtitle: 'Danau vulkanik terbesar di dunia',
      narasi:
        'Di dataran tinggi Sumatera Utara, terhampar danau vulkanik yang menakjubkan. Inilah *Danau Toba*, kaldera raksasa bukti kekuatan bumi.',
      shots: [
        {...foto('04-lake-toba-from-simalem-north-sumatra.jpg'), move: 'pan-right'},
        {...foto('02-danau-toba-sumut.jpg'), move: 'push-in', di: 'menakjubkan'},
        {...foto('07-danau-toba-view.jpg'), move: 'pull-out', di: 'raksasa'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Sumatera Utara · 904 mdpl',
      judul: 'Kaldera di *ketinggian*',
      judulDi: 'ketinggian',
      narasi:
        'Membentang di ketinggian sembilan ratus empat meter di atas permukaan laut, pemandangan air birunya dikelilingi tebing pegunungan hijau yang megah.',
      shots: [
        {...foto('06-danau-toba-1.jpg'), move: 'push-in'},
        {...foto('28-indonesia-lake-toba-26224127503.jpg'), move: 'pan-left', di: 'meter'},
        {...foto('25-toba-lake-seen-from-merek.jpg'), move: 'pull-out', di: 'dikelilingi'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 1130,
      label: 'Kilometer persegi',
      suffix: ' km²',
      narasi:
        'Permukaan airnya sangat luas, mencapai *seribu seratus tiga puluh* kilometer persegi, menjadikannya danau terbesar di seluruh kawasan Asia Tenggara.',
      shots: [
        {...foto('08-danau-toba-sumatera.jpg'), move: 'pan-right', tag: 'Lanskap Perairan Toba'},
        {...foto('09-danau-toba-2.jpg'), move: 'push-in', di: 'menjadikannya'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'none',
      value: 505,
      label: 'Kedalaman maksimum',
      suffix: ' meter',
      narasi:
        'Kedalaman danau ini mencapai *lima ratus lima* meter, menyimpan volume air tawar yang luar biasa besar di dasar palungnya.',
      shots: [
        {...foto('10-danau-toba-9.jpg'), move: 'pull-out', tag: 'Palung Air Tawar Toba'},
        {...foto('05-danau-toba-5.jpg'), move: 'pan-left', di: 'menyimpan'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Kaldera Toba · 100 × 30 km',
      judul: 'Kawah *gunung purba*',
      judulDi: 'panjangnya',
      narasi:
        'Dengan panjangnya mencapai seratus kilometer dan lebar tiga puluh kilometer, cekungan ini sebenarnya adalah kawah gunung api purba yang tenggelam.',
      shots: [
        {
          ...foto('21-toba-caldera-sumatra-indonesia-1to4n-98to100e-topo.jpg'),
          layout: 'print',
          tag: 'Peta Topografi Kaldera',
        },
        {
          ...foto('23-lake-toba-srtm.jpg'),
          layout: 'print',
          di: 'cekungan',
          tag: 'Citra Radar SRTM',
        },
        {...foto('03-pemandangan-danau-toba-dari-ajibata.jpg'), move: 'push-in', di: 'kawah'},
      ],
    },

    // ==========================================
    // BAB 2: Letusan Supervulkan
    // ==========================================
    {
      type: 'chapter',
      duration: 75,
      transition: 'zoom',
      nomor: 2,
      judul: 'Letusan *supervulkan purba*',
      narasi:
        'Puluhan ribu tahun lalu, bencana dahsyat meledak dari perut bumi dan mengguncang seluruh *dunia*.',
      shots: [
        {...foto('59-lake-toba-supervolcano-indonesia-34214504410.jpg'), move: 'pull-out', tag: 'Supervulkan Toba'},
        {...foto('28-indonesia-lake-toba-26224127503.jpg'), move: 'pan-left', di: 'bumi'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 74000,
      label: 'Tahun lalu',
      narasi:
        'Letusan katastropik terakhir meledak sekitar *tujuh puluh empat ribu* tahun lalu, menghasilkan endapan yang dikenal sebagai batuan Tuff Toba Muda.',
      shots: [
        {...foto('01-view-of-the-outskirts-of-lake-toba-pinggiran-danau.jpg'), move: 'push-in', tag: 'Endapan Tuff Toba'},
        {
          ...foto('17-toba-caldera-sumatra-aster.jpg'),
          layout: 'print',
          di: 'menghasilkan',
          tag: 'Citra Satelit ASTER',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Skala Letusan Purba',
      judul: 'Kekuatan *skala tertinggi*',
      judulDi: 'tertinggi',
      stempel: {teks: 'VEI 8', di: 'tertinggi', x: 70, y: 45},
      narasi:
        'Letusan ini digolongkan pada indeks letusan vulkanik skala delapan, tingkat tertinggi dalam sains kegunungapian yang melipatgandakan kekuatan letusan modern.',
      shots: [
        {...foto('22-caldera-toba.jpg'), move: 'pan-right'},
        {...foto('26-danau-toba-6.jpg'), move: 'push-in', di: 'tingkat'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 2800,
      label: 'Kilometer kubik material',
      suffix: ' km³',
      narasi:
        'Ledakan tersebut memuntahkan *dua ribu delapan ratus* kilometer kubik batu apung dan abu panas ke udara bebas.',
      shots: [
        {...foto('08-danau-toba-sumatera.jpg'), move: 'pull-out', tag: 'Endapan Piroklastik'},
        {...foto('29-danau-toba-pagi-hari.jpg'), move: 'pan-left', di: 'batu'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Sebaran Abu Vulkanik',
      judul: 'Abu melintasi *samudra*',
      judulDi: 'melintasi',
      narasi:
        'Angin kencang membawa debu vulkanik melintasi Samudra Hindia, mengubur Semenanjung Malaya hingga daratan India dengan lapisan abu tebal.',
      shots: [
        {
          ...foto('21-toba-caldera-sumatra-indonesia-1to4n-98to100e-topo.jpg'),
          layout: 'print',
          tag: 'Peta Kawasan Regional',
        },
        {
          ...foto('23-lake-toba-srtm.jpg'),
          layout: 'print',
          di: 'Semenanjung',
          tag: 'Topografi Sumatera',
        },
      ],
    },
    {
      type: 'kutipan',
      duration: 90,
      transition: 'kartu',
      teks:
        'Letusan Toba memicu pendinginan iklim global, namun ketahanan populasi manusia purba membuktikan kemampuan adaptasi yang luar biasa.',
      sumber: 'Kajian Arkeologi Modern, 2020',
      narasi:
        'Para ilmuwan sempat menduga letusan ini nyaris memunahkan manusia purba, namun temuan arkeologi modern membuktikan populasi di berbagai kawasan berhasil bertahan.',
      shots: [
        {...foto('27-danau-toba-dari-samosir.jpg'), move: 'pan-right'},
        {...foto('28-indonesia-lake-toba-26224127503.jpg'), move: 'push-in', di: 'arkeologi'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Runtuhnya Kantong Magma',
      judul: 'Kubah *runtuh ke dalam*',
      judulDi: 'runtuh',
      narasi:
        'Setelah ruang magma kosong terkuras, atap gunung runtuh menciptakan kaldera amblas yang perlahan terisi air hujan selama ribuan tahun.',
      shots: [
        {...foto('31-danau-toba-dari-pasir-putih.jpg'), move: 'pull-out'},
        {...foto('32-pemandangan-danau-toba-dari-ajibata-sirungkungon.jpg'), move: 'pan-left', di: 'menciptakan'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Empat Siklus Letusan',
      judul: 'Empat *letusan besar*',
      judulDi: 'empat',
      narasi:
        'Kajian geologi mengungkap bahwa kaldera terbentuk bertahap melalui empat letusan dahsyat sejak satu juta tahun silam.',
      shots: [
        {
          ...foto('17-toba-caldera-sumatra-aster.jpg'),
          layout: 'print',
          tag: 'Kompleks Kaldera Toba',
        },
        {...foto('22-caldera-toba.jpg'), move: 'push-in', di: 'letusan'},
      ],
    },

    // ==========================================
    // BAB 3: Lahirnya Pulau Samosir
    // ==========================================
    {
      type: 'chapter',
      duration: 75,
      transition: 'kartu',
      nomor: 3,
      judul: 'Lahirnya *Pulau Samosir*',
      narasi:
        'Dari dasar danau yang tenang, kekuatan geologi kembali bergolak membentuk sebuah pulau *raksasa*.',
      shots: [
        {...foto('14-panorama-of-hills-of-samosir-island-banner.jpg'), move: 'pull-out'},
        {...foto('27-danau-toba-dari-samosir.jpg'), move: 'pan-left', di: 'bergolak'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Fenomena Resurgent Dome',
      judul: 'Dasar danau *terangkat naik*',
      judulDi: 'terangkat',
      narasi:
        'Tekanan magma dari dalam bumi perlahan mendorong dasar kaldera hingga terangkat ke permukaan, membentuk fenomena kubah bangkitan Pulau Samosir.',
      shots: [
        {...foto('12-samosir-island.jpg'), move: 'push-in'},
        {...foto('13-lake-toba-samosir-island-01.jpg'), move: 'pan-right', di: 'kaldera'},
        {...foto('11-a-piece-of-heaven-in-samosir-island.jpg'), move: 'pull-out', di: 'kubah'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 630,
      label: 'Kilometer persegi',
      suffix: ' km²',
      narasi:
        'Pulau di tengah danau ini memiliki luas *enam ratus tiga puluh* kilometer persegi, hampir sebanding dengan luas wilayah negara Singapura.',
      shots: [
        {...foto('14-panorama-of-hills-of-samosir-island-banner.jpg'), move: 'pan-left', tag: 'Perbukitan Samosir'},
        {...foto('15-batak-tombs-in-samosir-island-02.jpg'), move: 'pull-out', di: 'hampir'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Hulu Sungai Asahan',
      judul: 'Satu-satunya *aliran keluar*',
      judulDi: 'hanya',
      narasi:
        'Ratusan anak sungai bermuara ke Toba, namun airnya hanya mengalir keluar melalui satu celah sempit, yaitu lembah Sungai Asahan.',
      shots: [
        {
          ...foto('55-asahan-rivier-nabij-het-toba-meer-kitlv-32303.jpg'),
          layout: 'print',
          tag: 'Arsip KITLV · Sungai Asahan',
        },
        {
          ...foto('56-kitlv-a182-wilhelmina-waterval-in-de-asahan-in-tap.jpg'),
          layout: 'print',
          di: 'mengalir',
          tag: 'Air Terjun Lembah Asahan',
        },
        {...foto('54-asahan-river-almanak-pemerintah-daerah-propinsi-su.jpg'), move: 'push-in', di: 'lembah'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Kisah Rakyat Nusantara',
      judul: 'Legenda *putri ikan mas*',
      judulDi: 'petani',
      narasi:
        'Masyarakat meyakini cerita rakyat tentang petani bernama Toba dan sumpah terlarang pada istrinya yang merupakan jelmaan seekor ikan mas ajaib.',
      shots: [
        {...foto('06-danau-toba-1.jpg'), move: 'pan-right'},
        {...foto('29-danau-toba-pagi-hari.jpg'), move: 'pull-out', di: 'sumpah'},
      ],
    },

    // ==========================================
    // BAB 4: Tanah Leluhur Batak
    // ==========================================
    {
      type: 'chapter',
      duration: 75,
      transition: 'kartu',
      nomor: 4,
      judul: 'Tanah *leluhur Batak*',
      narasi:
        'Tepian Danau Toba menjadi rumah bagi peradaban luhur suku Batak yang sarat dengan *falsafah hidup*.',
      shots: [
        {...foto('38-batak-houses.jpg'), move: 'push-in'},
        {...foto('36-batak-house-silalahi.jpg'), move: 'pull-out', di: 'peradaban'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Pusuk Buhit · Samosir',
      judul: 'Puncak *kosmologi Batak*',
      judulDi: 'dipercaya',
      narasi:
        'Gunung Pusuk Buhit dipercaya sebagai tempat asal mula Si Raja Batak turun ke bumi dan menurunkan garis keturunan marga Batak.',
      shots: [
        {...foto('51-pusuk-buhit.jpg'), move: 'pan-left', tag: 'Gunung Sakral Pusuk Buhit'},
        {...foto('52-keindahan-alam-pusuk-buhit-danau-toba.jpg'), move: 'push-in', di: 'turun'},
        {...foto('53-pusuk-buhit-from-tele.jpg'), move: 'pull-out', di: 'marga'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Ruma Bolon · Arsitektur Adat',
      judul: 'Haluan *perahu kayu*',
      judulDi: 'melengkung',
      narasi:
        'Rumah adat Ruma Bolon berdiri megah dengan atap melengkung mirip perahu, dihiasi ukiran gorga bermakna pelindung dan lambang kesejahteraan hidup.',
      props: [
        {src: 'props/perahu-batak.png', x: 80, y: 35, width: 260, animation: 'pop', delay: 20},
      ],
      shots: [
        {...foto('33-ruma-bolon-traditional-batak-toba-house-1.jpg'), move: 'push-in', tag: 'Ruma Bolon Batak Toba'},
        {
          ...foto('34-rumah-bolon-the-traditional-house-of-batak-toba.jpg'),
          layout: 'print',
          di: 'dihiasi',
          tag: 'Ukiran Ornamen Gorga',
        },
        {...foto('37-rumah-bolon-batak-traditional-house.jpg'), move: 'pan-right', di: 'lambang'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'dorong',
      value: 450,
      prefix: '±',
      label: 'Tahun usia situs',
      stempel: {teks: 'Diadili', di: 'persidangan', x: 68, y: 44},
      narasi:
        'Di Huta Siallagan, terdapat kompleks batu persidangan berusia lebih dari *empat ratus lima puluh* tahun tempat para raja mengadili kejahatan.',
      shots: [
        {
          ...foto('39-batu-persidangan-huta-siallagan-januari-2026.jpg'),
          layout: 'print',
          tag: 'Batu Persidangan Siallagan',
        },
        {...foto('16-batak-toba-house-in-samosir-island-02.jpg'), move: 'pull-out', di: 'raja'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Tomok · Makam Megalitik',
      judul: 'Sarkofagus *Raja Sidabutar*',
      judulDi: 'sarkofagus',
      narasi:
        'Di Tomok, jasad para penguasa disemayamkan dalam sarkofagus batu utuh berukirkan wajah raja, tanpa dikubur ke dalam liang tanah.',
      shots: [
        {
          ...foto('48-graftombe-te-tomok-op-samosir-kitlv-405510.jpg'),
          layout: 'print',
          tag: 'Arsip KITLV · Makam Tomok',
        },
        {
          ...foto('49-graftombe-te-tomok-op-samosir-kitlv-405161.jpg'),
          layout: 'print',
          di: 'wajah',
          tag: 'Pahatan Sarkofagus Batu',
        },
        {...foto('47-desa-tomok-simanindo-samosir.jpg'), move: 'pan-left', di: 'liang'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Tradisi Luhur Samosir',
      judul: 'Tarian *Sigale-gale*',
      judulDi: 'tarian',
      narasi:
        'Kearifan lokal terus hidup melalui tarian boneka Sigale-gale dan tenunan kain ulos sakral yang mengiringi setiap upacara adat masyarakat.',
      shots: [
        {...foto('44-tari-sigale-gale-pulau-samosir.jpg'), move: 'push-in', tag: 'Pementasan Sigale-gale'},
        {
          ...foto('43-sigale-gale.jpg'),
          layout: 'print',
          di: 'boneka',
          tag: 'Patung Kayu Sigale-gale',
        },
        {...foto('46-patung-sigale-gale-pulau-samosir.jpg'), move: 'pan-right', di: 'upacara'},
      ],
    },
    {
      type: 'timeline',
      duration: 90,
      transition: 'kartu',
      tag: 'Perjumpaan Sejarah Toba',
      narasi:
        'Catatan sejarah merekam masuknya pengaruh luar, dari kedatangan misionaris Ludwig Nommensen hingga penetapan kaldera sebagai warisan internasional.',
      titik: [
        {tahun: 1862, label: 'Nommensen tiba di Batak', di: 'misionaris'},
        {tahun: 1890, label: 'Riset Elio Modigliani', di: 'hingga'},
        {tahun: 2020, label: 'UNESCO Global Geopark', di: 'internasional'},
      ],
      shots: [
        {
          ...foto('58-zendeling-van-de-rheinische-missiongesellschaft-lu.jpg'),
          layout: 'print',
          tag: 'Ludwig Ingwer Nommensen',
        },
        {
          ...foto('57-ludwig-ingwer-nommensen-monument-vermoedelijk-op-d.jpg'),
          move: 'push-in',
          di: 'hingga',
          tag: 'Monumen Nommensen',
        },
      ],
    },

    // ==========================================
    // BAB 5: Warisan Geopark Dunia
    // ==========================================
    {
      type: 'chapter',
      duration: 75,
      transition: 'kartu',
      nomor: 5,
      judul: 'Warisan *geopark dunia*',
      narasi:
        'Kini Danau Toba tidak hanya milik Nusantara, tetapi telah diakui sebagai warisan berharga bagi *seluruh dunia*.',
      shots: [
        {...foto('19-lake-toba-caldera-geopark.jpg'), move: 'pan-left'},
        {...foto('22-caldera-toba.jpg'), move: 'pull-out', di: 'warisan'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 2020,
      format: 'year',
      label: 'UNESCO Global Geopark',
      narasi:
        'Pada tahun *dua ribu dua puluh*, lembaga dunia UNESCO resmi menetapkan Kaldera Toba sebagai taman bumi warisan geologi dunia.',
      shots: [
        {...foto('24-geopark-caldera-toba.jpg'), move: 'push-in', tag: 'Prasasti UNESCO Geopark'},
        {...foto('18-entrance-of-toba-caldera-resort-north-sumatera.jpg'), move: 'pan-right', di: 'resmi'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Parapat & Tuktuk Siadong',
      judul: 'Pesona *pariwisata danau*',
      judulDi: 'pariwisata',
      narasi:
        'Kawasan Parapat dan Semenanjung Tuktuk kini berkembang menjadi pusat pariwisata internasional yang menyuguhkan keindahan panorama dan keramahan warga.',
      shots: [
        {...foto('60-on-ferry-on-the-lake-toba-sumatra-2000.jpg'), move: 'push-in', tag: 'Kapal Penyeberangan Danau'},
        {...foto('30-lompatan-harapan-danau-toba-10.jpg'), move: 'pan-left', di: 'pusat'},
        {
          ...foto('50-market-in-tomok-samosir-island.jpg'),
          layout: 'print',
          di: 'keramahan',
          tag: 'Pasar Cendera Mata Samosir',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Konservasi Ekosistem Toba',
      judul: 'Menjaga *kelestarian alam*',
      judulDi: 'menjaga',
      narasi:
        'Tantangan masa depan adalah menjaga kualitas air dan kelestarian ekosistem kaldera agar keindahan purba ini tetap dinikmati generasi mendatang.',
      shots: [
        {...foto('07-danau-toba-view.jpg'), move: 'pull-out'},
        {...foto('20-danau-toba-sumatra-utara.jpg'), move: 'pan-right', di: 'ekosistem'},
      ],
    },
    {
      type: 'outro',
      duration: 90,
      transition: 'kartu',
      tag: 'Warisan Danau Toba',
      title: 'Keagungan alam *dan budaya*',
      cta: 'Follow untuk sejarah lainnya',
      narasi:
        'Danau Toba adalah monumen abadi pertemuan kedahsyatan bumi dan keagungan budaya. Ikuti channel ini untuk kisah sejarah Nusantara lainnya.',
      shots: [
        {...foto('04-lake-toba-from-simalem-north-sumatra.jpg'), move: 'push-in'},
        {...foto('02-danau-toba-sumut.jpg'), move: 'pull-out', di: 'Ikuti'},
      ],
    },
  ],
};
