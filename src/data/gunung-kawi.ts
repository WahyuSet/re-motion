import credits from '../../public/photos/gunung-kawi/credits.json';
import {fotoDari} from '../lib/foto';
import type {VideoScript} from '../types';

// Naskah video "Gunung Kawi" (Pesarean Gunung Kawi, Kabupaten Malang). Sumber fakta: gunung-kawi.sumber.md.
// Durasi target ±3 menit (18 scene). Cek dengan: node scripts/cek-naskah.mjs gunung-kawi
const foto = fotoDari('gunung-kawi', credits);

export const gunungKawi: VideoScript = {
  narasiAudio: 'audio/gunung-kawi',
  narasiExt: 'wav',
  // Paket upload: node scripts/paket-youtube.mjs gunung-kawi
  youtube: {
    judul: 'Sejarah Gunung Kawi, Tempat Bertemunya Banyak Tradisi',
    deskripsi:
      'Di lereng Gunung Kawi, Kabupaten Malang, ada pesarean yang diziarahi orang dari berbagai suku dan agama. Dari laskar Perang Jawa, kisah Eyang Djoego dan Raden Mas Iman Soedjono, sampai masjid dan klenteng yang berdiri berdampingan.',
    tags: ['gunung kawi', 'sejarah malang', 'pesarean gunung kawi', 'eyang djoego', 'sejarah nusantara'],
  },
  thumbnail: {judul: 'Satu gunung, *banyak tradisi*', sub: 'Sejarah Malang', ...foto('07-gunung-kawi-saka-pesarean.jpg')},
  scenes: [
    {
      type: 'title',
      duration: 90,
      bab: 'Gunung Kawi',
      kicker: 'Sejarah Nusantara',
      title: 'Gunung Kawi',
      subtitle: 'Tempat bertemunya banyak tradisi',
      narasi:
        'Di lereng sebuah gunung di Kabupaten Malang, ada tempat yang selalu ramai peziarah dari berbagai suku dan agama. Inilah *Gunung Kawi*.',
      shots: [
        {...foto('05-kawi-in-fog-from-mount-penanjakan.jpg'), move: 'push-in'},
        {...foto('02-gunung-kawi-dilihat-dari-maduarjo-ngajum.jpg'), move: 'pan-right'},
        {...foto('09-batu-city-and-mount-panderman-kawi-butak-from-brak.jpg'), move: 'pull-out'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Kabupaten Malang · Jawa Timur',
      judul: 'Gunung api *tanpa catatan letusan*',
      judulDi: 'catatan',
      narasi:
        'Gunung Kawi adalah gunung api yang berdiri bersebelahan dengan Gunung Butak. Hingga kini, tidak ada catatan sejarah tentang letusannya.',
      shots: [
        {...foto('14-kawi-butak-indonesia-2023-11-16-13-51-02-umbra-04.jpg'), layout: 'print', tag: 'Citra radar Kawi-Butak · 2023'},
        {...foto('13-beautiful-wukir-2.jpg'), move: 'pan-left'},
        {...foto('17-mt-buthak-via-sirah-kencong-1.jpg'), move: 'tilt-up'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 2551,
      suffix: ' m',
      label: 'Tinggi puncak Kawi',
      narasi:
        'Puncaknya menjulang sekitar *dua ribu lima ratus lima puluh satu* meter di atas permukaan laut, diselimuti hutan dan kabut.',
      shots: [
        {...foto('01-rijstvelden-met-de-berg-gunung-kawi-bij-malang-bes.jpg'), layout: 'print', tag: 'Gunung Kawi dari Malang · foto lama'},
        {...foto('16-gunung-buthak.jpg'), move: 'push-in', tag: 'Matahari terbit · Gunung Butak'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Desa Wonosari · lereng selatan',
      bab: 'Asal-usul pesarean',
      judul: 'Makam di *lereng selatan*',
      judulDi: 'Wonosari',
      narasi:
        'Namun Gunung Kawi terkenal bukan karena puncaknya, melainkan karena sebuah kompleks makam di Desa Wonosari, di *lereng selatan* gunung ini.',
      shots: [
        {...foto('07-gunung-kawi-saka-pesarean.jpg'), move: 'push-in', tag: 'Jalan menuju pesarean'},
        {...foto('24-kawi-gebergte-kitlv-37b528.jpg'), layout: 'print', tag: 'Pegunungan Kawi · sketsa KITLV'},
        {...foto('12-rimtbutakmtkawi.jpg'), move: 'pan-right'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'zoom',
      tag: 'Perang Jawa · 1825–1830',
      judul: 'Laskar *Diponegoro*',
      judulDi: 'Diponegoro',
      narasi:
        'Kisahnya berawal dari Perang Jawa, perlawanan besar yang dipimpin Pangeran *Diponegoro* melawan pemerintah kolonial Belanda selama lima tahun.',
      shots: [
        {...foto('28-prince-dipanegara-fights-with-dutch-soldiers-babad.jpg'), layout: 'print', tag: 'Babad Diponegoro · 1866'},
        {...foto('27-collectie-nmvwereldculturen-tm-1574-32-litho-portr.jpg'), layout: 'print', tag: 'Diponegoro · litografi 1835'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 1830,
      format: 'year',
      label: 'Diponegoro ditangkap',
      stempel: {teks: 'Ditangkap', di: 'ditangkap', x: 70, y: 44},
      narasi:
        'Pada tahun *seribu delapan ratus tiga puluh*, Diponegoro ditangkap. Para pengikutnya tercerai-berai, sebagian memilih mengembara ke arah timur.',
      shots: [
        {...foto('25-raden-saleh-diponegoro-arrest.jpg'), move: 'pan-right', tag: 'Penangkapan Diponegoro · Raden Saleh'},
        {...foto('25-raden-saleh-diponegoro-arrest.jpg'), layout: 'print', anotasi: [{x: 32, y: 40, w: 7, h: 12, label: 'Diponegoro'}]},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Kanjeng Kyai Zakaria II',
      bab: 'Eyang Djoego dan Iman Soedjono',
      judul: 'Sang ulama, *Eyang Djoego*',
      judulDi: 'ulama,',
      narasi:
        'Salah satunya dikisahkan bernama Kanjeng Kyai Zakaria Kedua, keturunan bangsawan Kartasura sekaligus ulama, yang kemudian dikenal sebagai *Eyang Djoego*.',
      shots: [
        {...foto('23-kawi-gebergte-kitlv-37b527.jpg'), layout: 'print', tag: 'Pegunungan Kawi · abad ke-19'},
        {...foto('01-rijstvelden-met-de-berg-gunung-kawi-bij-malang-bes.jpg'), move: 'pan-left'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Jugo · Kesamben, Blitar',
      judul: 'Guru di *Desa Jugo*',
      judulDi: 'Jugo,',
      narasi:
        'Ia menetap di Desa Jugo, Kesamben, Blitar. Di sana ia mengajar agama, mengajari warga *bercocok tanam*, dan dikenal pandai mengobati orang sakit.',
      shots: [
        {...foto('43-station-te-blitar-gebouwd-in-1884-kitlv-19194.jpg'), layout: 'print', tag: 'Stasiun Blitar · dibangun 1884'},
        {...foto('12-rimtbutakmtkawi.jpg'), move: 'push-in', tag: 'Sawah di lereng gunung'},
        {...foto('42-fabriek-van-suikeronderneming-tjandi-sewoe-bij-bli.jpg'), layout: 'print', tag: 'Pabrik gula dekat Blitar · KITLV'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 1871,
      format: 'year',
      label: 'Eyang Djoego wafat',
      narasi:
        'Eyang Djoego wafat pada tahun *seribu delapan ratus tujuh puluh satu*. Sesuai wasiatnya, ia dimakamkan di lereng selatan Gunung Kawi.',
      shots: [
        {...foto('17-mt-buthak-via-sirah-kencong-1.jpg'), move: 'push-in'},
        {...foto('24-kawi-gebergte-kitlv-37b528.jpg'), layout: 'print'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Keturunan Keraton Yogyakarta',
      judul: 'Padepokan di *Wonosari*',
      judulDi: 'padepokan',
      narasi:
        'Pemakamannya dipimpin muridnya, Raden Mas *Iman Soedjono*, keturunan Keraton Yogyakarta. Ia membuka padepokan di Wonosari untuk merawat makam sang guru.',
      shots: [
        {...foto('07-gunung-kawi-saka-pesarean.jpg'), move: 'pull-out', tag: 'Wonosari · kini'},
        {...foto('13-beautiful-wukir-2.jpg'), move: 'pan-right'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 1876,
      format: 'year',
      label: 'Iman Soedjono wafat',
      stempel: {teks: 'Satu liang', di: 'liang', x: 70, y: 44},
      narasi:
        'Iman Soedjono wafat pada tahun *seribu delapan ratus tujuh puluh enam*, lalu dimakamkan satu liang bersama gurunya, Eyang Djoego.',
      shots: [
        {...foto('23-kawi-gebergte-kitlv-37b527.jpg'), layout: 'print'},
        {...foto('05-kawi-in-fog-from-mount-penanjakan.jpg'), move: 'push-in'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Twa Low She · Djie Low She',
      bab: 'Satu kompleks, banyak tradisi',
      judul: 'Dihormati *warga Tionghoa*',
      judulDi: 'Tionghoa,',
      narasi:
        'Keduanya juga dihormati masyarakat Tionghoa, yang menyebut mereka *Twa Low She* dan *Djie Low She*, guru besar pertama dan kedua.',
      shots: [
        {...foto('31-eng-an-kiong-7.jpg'), move: 'push-in', tag: 'Klenteng Eng An Kiong · Malang'},
        {...foto('32-eng-an-kiong-4.jpg'), move: 'pan-left'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Masjid · klenteng · pesarean',
      judul: 'Satu kompleks, *banyak tradisi*',
      judulDi: 'masjid',
      narasi:
        'Karena itu, di kompleks ini masjid bergaya Demak berdiri tak jauh dari *Klenteng Dewi Kwan Im*, tempat peziarah Jawa dan Tionghoa berdoa.',
      shots: [
        {...foto('29-altar-dewi-kwan-im-di-kelenteng-pao-sian-ling-kong.jpg'), move: 'tilt-up', tag: 'Altar Dewi Kwan Im · Sumenep'},
        {...foto('07-gunung-kawi-saka-pesarean.jpg'), move: 'push-in', tag: 'Kompleks pesarean'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Kepercayaan peziarah',
      judul: 'Pohon *dewandaru*',
      judulDi: 'dewandaru.',
      narasi:
        'Di depan makam tumbuh pohon dewandaru. Banyak peziarah menunggu daun atau buahnya jatuh, karena dipercaya membawa *keberuntungan*.',
      shots: [
        {...foto('07-gunung-kawi-saka-pesarean.jpg'), move: 'pan-left'},
        {...foto('02-gunung-kawi-dilihat-dari-maduarjo-ngajum.jpg'), move: 'push-in'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Kisah populer · tidak terbukti',
      bab: 'Mitos dan tradisi',
      judul: 'Cerita dari *pabrik rokok*',
      judulDi: 'Bentoel',
      narasi:
        'Cerita paling terkenal menyebut pendiri pabrik rokok Bentoel sukses setelah berziarah ke sini. Kisah ini terus beredar, meski *tidak pernah terbukti*.',
      shots: [
        {...foto('19-het-malang-hotel-te-malang-kitlv-5193.jpg'), layout: 'print', tag: 'Malang · masa kolonial'},
        {...foto('21-kitlv-a708-station-vermoedelijk-te-malang-kitlv-40.jpg'), layout: 'print', tag: 'Stasiun Malang · KITLV'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Malam Jumat Legi · satu Suro',
      judul: 'Tahlil dan *kirab tumpeng*',
      judulDi: 'tahlil',
      narasi:
        'Setiap malam Jumat Legi digelar tahlil bersama. Pada satu Suro, suasananya lebih meriah, dengan wayang kulit, barongsai, dan *kirab tumpeng*.',
      shots: [
        {...foto('34-pertunjukan-wayang-kulit.jpg'), move: 'push-in', tag: 'Wayang kulit'},
        {...foto('38-nasi-tumpeng.jpg'), move: 'pull-out', tag: 'Tumpeng'},
        {...foto('33-bercerita-dengan-wayang.jpg'), move: 'pan-right'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Kata pengelola',
      judul: 'Bukan tempat *pesugihan*',
      judulDi: 'pengelola',
      narasi:
        'Gunung Kawi sering dikaitkan dengan pesugihan. Namun pengelola menegaskan, peziarah datang untuk *berdoa kepada Tuhan*, memohon keselamatan, kesehatan, dan kelancaran usaha.',
      shots: [
        {...foto('07-gunung-kawi-saka-pesarean.jpg'), move: 'pull-out', tag: 'Pesarean Gunung Kawi'},
        {...foto('09-batu-city-and-mount-panderman-kawi-butak-from-brak.jpg'), move: 'pan-left'},
      ],
    },
    {
      type: 'outro',
      duration: 90,
      transition: 'kartu',
      tag: 'Gunung Kawi · Malang',
      title: 'Tempat *bertemunya* banyak tradisi',
      cta: 'Follow untuk sejarah lainnya',
      narasi:
        'Di lereng Gunung Kawi, sejarah, kepercayaan, dan tradisi bertemu dalam satu tempat. Ikuti channel ini untuk kisah sejarah Nusantara lainnya.',
      shots: [
        {...foto('05-kawi-in-fog-from-mount-penanjakan.jpg'), move: 'push-in'},
        {...foto('02-gunung-kawi-dilihat-dari-maduarjo-ngajum.jpg'), move: 'pull-out'},
      ],
    },
  ],
};
