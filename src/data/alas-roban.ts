import credits from '../../public/photos/alas-roban/credits.json';
import {fotoDari} from '../lib/foto';
import type {VideoScript} from '../types';

// Naskah video "Alas Roban" (Kabupaten Batang, Jawa Tengah). Sumber fakta: alas-roban.sumber.md.
// Durasi target ±3 menit (18 scene). Cek dengan: node scripts/cek-naskah.mjs alas-roban
const foto = fotoDari('alas-roban', credits);

export const alasRoban: VideoScript = {
  narasiAudio: 'audio/alas-roban',
  narasiExt: 'wav',
  scenes: [
    {
      type: 'title',
      duration: 90,
      kicker: 'Sejarah Nusantara',
      title: 'Alas Roban',
      subtitle: 'Jejak Jalan Raya Pos di hutan Batang',
      narasi:
        'Di pesisir utara Jawa Tengah, terbentang jalur hutan perbukitan yang menyimpan sejarah panjang perjalanan darat Pulau Jawa. Inilah *Alas Roban*.',
      shots: [
        {...foto('27-pantai-ujung-negoro-batang-jawa-tengah-indonesia.jpg'), move: 'pan-right'},
        {...foto('36-hutan-bojonegoro.jpg'), di: 'hutan', move: 'push-in'},
        {...foto('01-jln-pintas-alas-roban-panoramio.jpg'), di: 'Inilah', move: 'push-in'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Kabupaten Batang · Jawa Tengah',
      judul: 'Hutan jati di *utara Batang*',
      judulDi: 'hutan',
      narasi:
        'Dalam bahasa Jawa, alas berarti *hutan*. Kawasan hutan jati milik Perhutani ini melintasi Kecamatan Banyuputih, Gringsing, dan Subah di Kabupaten Batang.',
      shots: [
        {...foto('35-young-teak-forest-nature-46396525004.jpg'), move: 'tilt-up', tag: 'Tegakan hutan jati · Jawa Tengah'},
        {
          ...foto('42-thomas-stamford-raffles-map-of-java-mataram.jpg'),
          layout: 'print',
          di: 'Kecamatan',
          tag: 'Peta Jawa · Raffles 1817',
        },
        {
          ...foto('19-kapokonderneming-kedongong-te-soebah-ten-zuidooste.jpg'),
          layout: 'print',
          di: 'Subah',
          tag: 'Subah, Batang · arsip KITLV',
        },
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'zoom',
      value: 1808,
      format: 'year',
      label: 'Daendels tiba di Jawa',
      narasi:
        'Kisah besarnya sebagai jalur raya dimulai pada tahun *seribu delapan ratus delapan*, ketika Gubernur Jenderal Herman Willem Daendels tiba untuk mempertahankan Jawa dari ancaman Inggris.',
      shots: [
        {...foto('13-daendels-herman-willem.jpg'), layout: 'print', tag: 'Herman Willem Daendels'},
        {
          ...foto('14-posthuum-portret-van-herman-willem-daendels-1762-1.jpg'),
          layout: 'print',
          di: 'Herman',
          tag: 'Lukisan Raden Saleh · Rijksmuseum',
          anotasi: [{x: 63, y: 83, w: 22, h: 15, label: 'Peta jalan'}],
        },
        {
          ...foto('50-b26056056h-the-landing-of-the-british-army-at-chil.jpg'),
          layout: 'print',
          di: 'ancaman',
          tag: 'Armada Inggris di Jawa · 1811',
        },
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'none',
      value: 1000,
      label: 'Km Anyer ke Panarukan',
      stempel: {teks: 'Satu tahun', di: 'merampungkannya', x: 70, y: 44},
      narasi:
        'Mulai Mei tahun itu, Daendels memerintahkan pembangunan Jalan Raya Pos sepanjang sekitar *seribu* kilometer dari Anyer hingga Panarukan, dan merampungkannya dalam waktu sekitar setahun.',
      shots: [
        {...foto('02-kitlv-33460-kurkdjian-n-v-photografisch-atelier-so.jpg'), layout: 'print', tag: 'De Grote Postweg · arsip KITLV'},
        {
          ...foto('40-thomas-stamford-raffles-map-of-java-west-java.jpg'),
          layout: 'print',
          di: 'Anyer',
          tag: 'Ujung barat · Anyer, Banten',
        },
        {
          ...foto('04-grote-postweg-bij-pasoeroean-kitlv-2578.jpg'),
          layout: 'print',
          di: 'merampungkannya',
          tag: 'Jalan Raya Pos Jawa Timur · KITLV',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'De Grote Postweg · 1808–1809',
      judul: 'Jalur *militer* dan surat pos',
      judulDi: 'pasukan',
      narasi:
        'Jalan ini dirancang agar *pasukan* kolonial dapat bergerak cepat antarkota, sekaligus mempercepat pengiriman surat dinas melalui pos-pos pergantian kereta kuda.',
      shots: [
        {...foto('06-de-grote-postweg-te-buitenzorg-kitlv-502920.jpg'), layout: 'print', tag: 'Grote Postweg · Buitenzorg'},
        {...foto('03-grote-postweg-bandoeng-kitlv-1400401.jpg'), layout: 'print', di: 'mempercepat', tag: 'Jalur pos antarkota · KITLV'},
        {
          ...foto('07-post-tjisokan-aan-de-grote-postweg-in-de-buurt-van.jpg'),
          layout: 'print',
          di: 'pos-pos',
          tag: 'Pos kereta kuda Tjisokan · KITLV',
        },
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'dorong',
      value: 6,
      label: 'Hari Batavia ke Surabaya',
      narasi:
        'Hasilnya drastis. Perjalanan darat dari Batavia menuju Surabaya yang semula memakan waktu sekitar empat puluh hari dipangkas menjadi sekitar *enam* hari saja.',
      shots: [
        {
          ...foto('40-thomas-stamford-raffles-map-of-java-west-java.jpg'),
          layout: 'print',
          tag: 'Batavia · Peta Jawa 1817',
          anotasi: [{x: 48, y: 27, w: 8, h: 9, label: 'Batavia'}],
        },
        {
          ...foto('24-jalur-pantura.jpg'),
          layout: 'print',
          di: 'Surabaya',
          tag: 'Rute utara Pulau Jawa',
          anotasi: [{x: 71, y: 51, w: 6, h: 11, label: 'Surabaya'}],
        },
        {
          ...foto('02-kitlv-33460-kurkdjian-n-v-photografisch-atelier-so.jpg'),
          layout: 'print',
          di: 'menjadi',
          tag: 'Grote Postweg Surabaya · ca. 1920',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Pesisir utara Batang · 1808',
      judul: 'Membelah *bukit dan hutan*',
      judulDi: 'membelah',
      narasi:
        'Di banyak tempat, proyek ini hanya memperlebar jalan lama. Namun di Alas Roban, pekerja harus *membelah* hutan lebat serta perbukitan batu yang curam.',
      shots: [
        {...foto('05-grote-postweg-op-west-java-kitlv-26319.jpg'), layout: 'print', tag: 'Ruas jalan kolonial · KITLV'},
        {
          ...foto('45-collectie-tropenmuseum-java-aanleg-van-een-weg-doo.jpg'),
          layout: 'print',
          di: 'Alas',
          tag: 'Membuka jalan hutan · Tropenmuseum',
        },
        {
          ...foto('52-collectie-tropenmuseum-de-weg-langs-de-cadas-pange.jpg'),
          layout: 'print',
          di: 'perbukitan',
          tag: 'Jalan tebing batu Jawa · Tropenmuseum',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Gringsing · Banyuputih',
      judul: 'Jejak tua *Jalur Poncowati*',
      judulDi: 'tertua',
      narasi:
        'Ruas tertua yang menembus rimbunnya hutan perbukitan Alas Roban itu masih bertahan hingga kini, dan dikenal warga sebagai *Jalur Poncowati*.',
      shots: [
        {...foto('36-hutan-bojonegoro.jpg'), move: 'push-in', tag: 'Jalan menembus hutan jati'},
        {
          ...foto('01-jln-pintas-alas-roban-panoramio.jpg'),
          di: 'bertahan',
          move: 'pan-right',
          tag: 'Kawasan jalur Alas Roban · Batang',
        },
        {
          ...foto('20-kitlv-a706-stopplaats-tjelong-van-de-semarang-cher.jpg'),
          layout: 'print',
          di: 'warga',
          tag: 'Celong, dekat Alas Roban · KITLV',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Mobilisasi tenaga pribumi',
      judul: 'Pengerahan lewat *para bupati*',
      judulDi: 'bupati',
      narasi:
        'Untuk mengejar target waktu, pemerintah kolonial mewajibkan para *bupati* di sepanjang pesisir Jawa mengerahkan ribuan rakyat dari desa-desa sekitar.',
      shots: [
        {...foto('18-kitlv-a55-raden-mas-adipati-ario-dhipokoesoemo-van.jpg'), layout: 'print', tag: 'Bupati Batang · arsip KITLV'},
        {
          ...foto('41-thomas-stamford-raffles-map-of-java-legends.jpg'),
          layout: 'print',
          di: 'bupati',
          tag: 'Data penduduk Batang · 1817',
          anotasi: [{x: 56, y: 36, w: 10, h: 5, label: 'Batang · 1817'}],
        },
        {
          ...foto('46-collectie-tropenmuseum-aanleg-van-een-weg-op-java-.jpg'),
          layout: 'print',
          di: 'rakyat',
          tag: 'Pengerahan pekerja jalan · Jawa',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Kas menipis · kerja wajib',
      judul: 'Berubah menjadi *kerja paksa*',
      judulDi: 'berubah',
      stempel: {teks: 'Kerja Rodi', di: 'rodi', x: 70, y: 44},
      narasi:
        'Awalnya ada anggaran upah dan beras. Namun ketika kas kolonial menipis dan terjadi penyelewengan, pengerjaan berubah menjadi kerja *paksa* atau rodi di bawah pengawasan militer.',
      shots: [
        {...foto('43-collectie-tropenmuseum-woningbouw-en-wegenaanleg-o.jpg'), layout: 'print', tag: 'Pekerjaan jalan Jawa Tengah'},
        {
          ...foto('44-kitlv-a1114-aanleg-van-een-spoorbrug-middenachter-.jpg'),
          layout: 'print',
          di: 'penyelewengan',
          tag: 'Konstruksi kolonial · Jawa Tengah',
        },
        {
          ...foto('51-collectie-tropenmuseum-dwangarbeider-te-banyuwangi.jpg'),
          layout: 'print',
          di: 'paksa',
          tag: 'Pekerja paksa di Jawa · Tropenmuseum',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Medan ekstrem · wabah penyakit',
      judul: 'Kelelahan, lapar, dan *malaria*',
      judulDi: 'kelelahan',
      narasi:
        'Dengan alat sederhana, para pekerja menebang pohon besar dan memecah batu tebing. Banyak yang tumbang akibat kelelahan, kekurangan pangan, serta wabah *malaria*.',
      shots: [
        {...foto('45-collectie-tropenmuseum-java-aanleg-van-een-weg-doo.jpg'), layout: 'print', tag: 'Menebang hutan untuk jalan · Jawa'},
        {
          ...foto('46-collectie-tropenmuseum-aanleg-van-een-weg-op-java-.jpg'),
          layout: 'print',
          di: 'memecah',
          tag: 'Menggali lereng bukit · Tropenmuseum',
        },
        {
          ...foto('53-collectie-tropenmuseum-bestrijding-van-malaria-pet.jpg'),
          layout: 'print',
          di: 'serta',
          tag: 'Penanganan malaria · Jawa kolonial',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Catatan William Thorn · 1815',
      judul: 'Angka korban *masih diperdebatkan*',
      judulDi: 'diperkirakan',
      narasi:
        'Perwira Inggris William Thorn mencatat *diperkirakan* dua belas ribu pekerja tewas di seluruh Jalan Raya Pos, tetapi sejarawan menilai angka pastinya masih diperdebatkan.',
      shots: [
        {...foto('50-b26056056h-the-landing-of-the-british-army-at-chil.jpg'), layout: 'print', tag: 'Buku Mayor William Thorn · 1815'},
        {...foto('05-grote-postweg-op-west-java-kitlv-26319.jpg'), layout: 'print', di: 'tewas', tag: 'Sepanjang Jalan Raya Pos · KITLV'},
        {
          ...foto('14-posthuum-portret-van-herman-willem-daendels-1762-1.jpg'),
          layout: 'print',
          di: 'sejarawan',
          tag: 'Era Daendels · kajian sejarah',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Arsip kolonial · abad ke-19',
      judul: 'Tanpa *catatan resmi* pekerja',
      judulDi: 'arsip',
      narasi:
        'Pemerintah kolonial tidak meninggalkan *arsip* jumlah korban pekerja pribumi di tiap ruas, termasuk di Alas Roban, sementara sumber Inggris dinilai menyimpan bias politik.',
      shots: [
        {...foto('39-thomas-stamford-raffles-map-of-java-title.jpg'), layout: 'print', tag: 'Dokumen administrasi Inggris · 1817'},
        {
          ...foto('57-collectie-tropenmuseum-brug-te-pekalongan-midden-j.jpg'),
          layout: 'print',
          di: 'termasuk',
          tag: 'Karesidenan Pekalongan · Tropenmuseum',
        },
        {...foto('13-daendels-herman-willem.jpg'), layout: 'print', di: 'Inggris', tag: 'Persaingan kolonial Prancis-Inggris'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Jalur Pantai Utara Jawa',
      judul: 'Urat nadi *Jalur Pantura*',
      judulDi: 'Jalur',
      narasi:
        'Memasuki masa kemerdekaan, jalan warisan kolonial di Alas Roban tumbuh menjadi bagian utama *Jalur Pantura* yang menghubungkan Jakarta, Semarang, hingga Surabaya.',
      shots: [
        {...foto('01-jln-pintas-alas-roban-panoramio.jpg'), move: 'push-in', tag: 'Ruas Alas Roban · Kabupaten Batang'},
        {...foto('21-jalur-pantura-indramayu.jpg'), di: 'bagian', move: 'pan-right', tag: 'Koridor Jalur Pantura'},
        {
          ...foto('24-jalur-pantura.jpg'),
          layout: 'print',
          di: 'Jakarta',
          tag: 'Peta Jalur Pantura Jawa',
          anotasi: [{x: 46, y: 45, w: 6, h: 10, label: 'Alas Roban · Batang'}],
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'kartu',
      tag: 'Tanjakan curam · tikungan tajam',
      judul: 'Julukan *jalur tengkorak*',
      judulDi: 'hingga',
      narasi:
        'Tanjakan curam, tikungan tajam, dan hutan yang dulu gelap membuat truk serta bus kerap mengalami gagal rem, hingga muncul julukan jalur *tengkorak*.',
      shots: [
        {...foto('36-hutan-bojonegoro.jpg'), move: 'push-in', tag: 'Lorong jalan hutan jati'},
        {...foto('63-tanjakan-buntu-banyumas.jpg'), di: 'truk', move: 'pan-left', tag: 'Truk berat di jalur tanjakan'},
        {
          ...foto('58-jembatan-tonggara-kedungbanteng-kab-tegal-jawa-ten.jpg'),
          di: 'muncul',
          move: 'pull-out',
          tag: 'Senja di jalur utara Jawa Tengah',
        },
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'Cerita lisan masyarakat',
      judul: 'Cerita mistis di *masyarakat*',
      judulDi: 'melahirkan',
      narasi:
        'Ingatan tentang kerja paksa, kecelakaan, serta kabar pembuangan jenazah pada dekade seribu sembilan ratus delapan puluhan melahirkan berbagai cerita mistis di tengah *masyarakat*.',
      shots: [
        {...foto('45-collectie-tropenmuseum-java-aanleg-van-een-weg-doo.jpg'), layout: 'print', tag: 'Jejak kelam pembukaan hutan'},
        {...foto('35-young-teak-forest-nature-46396525004.jpg'), di: 'kabar', move: 'pan-right', tag: 'Rimbun hutan jati'},
        {...foto('32-kasepuhan-batang-sub-district-batang-regency-centr.jpg'), di: 'berbagai', move: 'pull-out', tag: 'Warga di Kabupaten Batang'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 2018,
      format: 'year',
      label: 'Tol Batang-Semarang dibuka',
      narasi:
        'Pemerintah memecah Alas Roban menjadi tiga jalur, sebelum Jalan Tol Batang Semarang resmi beroperasi pada Desember *dua ribu delapan belas* dan mengurai kepadatan.',
      shots: [
        {...foto('01-jln-pintas-alas-roban-panoramio.jpg'), move: 'pan-left', tag: 'Jalan Pintas Alas Roban'},
        {...foto('47-kalikuto-bridge.jpg'), di: 'Tol', move: 'push-in', tag: 'Jembatan Kalikuto · Tol Batang-Semarang'},
        {
          ...foto('64-kali-kuto-pantura-bridge-2.jpg'),
          di: 'Desember',
          move: 'push-in',
          focus: {x: 50, y: 62},
          tag: 'Lajur Jalan Tol Batang-Semarang',
        },
      ],
    },
    {
      type: 'outro',
      duration: 90,
      transition: 'dorong',
      tag: 'Alas Roban · masa kini',
      title: 'Saksi dua abad *perjalanan Jawa*',
      cta: 'Follow untuk sejarah lainnya',
      narasi:
        'Meski kini lebih lengang, Alas Roban tetap dilalui truk logistik, pemudik, dan menghidupi warung warga sekitar. Ikuti channel ini untuk kisah sejarah Nusantara lainnya.',
      shots: [
        {
          ...foto('21-jalur-pantura-indramayu.jpg'),
          move: 'push-in',
          focus: {x: 65, y: 54},
          tag: 'Arus truk & motor di Jalur Pantura',
        },
        {...foto('60-rombongan-motor-mudik.jpg'), di: 'pemudik', move: 'pan-right', tag: 'Arus pemudik sepeda motor'},
        {
          ...foto('29-train-at-plabuan-station-batang-regency-central-ja.jpg'),
          di: 'Ikuti',
          move: 'pull-out',
          tag: 'Pesisir Plabuan, Gringsing · Batang',
        },
      ],
    },
  ],
};
