// Semua tipe data untuk "naskah" video. Edit naskah di src/data/, bukan di komponen.

export type PropAnimation = 'pop' | 'drop' | 'slide-left' | 'slide-right' | 'fade';

export type PropItem = {
  /** Path di folder public/, contoh: 'props/kompas.png' */
  src: string;
  /** Posisi tengah props dalam persen layar (0-100) */
  x: number;
  y: number;
  /** Lebar dalam pixel (layar 1920x1080) */
  width: number;
  rotate?: number;
  /** Frame mulai muncul, dihitung dari awal scene */
  delay?: number;
  /** Muncul saat kata ini diucapkan di narasi (menggantikan delay), contoh 'kompas' */
  di?: string;
  animation?: PropAnimation;
  /** Bergerak naik-turun pelan setelah muncul */
  float?: boolean;
};

export type CameraMove = 'push-in' | 'pull-out' | 'pan-left' | 'pan-right' | 'tilt-up' | 'tilt-down';

export type Shot = {
  /** Path foto di public/. Biasanya diisi lewat ...foto('nama.jpg') */
  photo: string;
  credit?: string;
  /**
   * 'full' = foto memenuhi layar dengan gerak kamera.
   * 'print' = foto tampil sebagai cetakan berbingkai di atas latar blur (cocok untuk foto arsip, potret, peta).
   */
  layout?: 'full' | 'print';
  /** Gerak kamera. Kosong = dipilih otomatis bergantian */
  move?: CameraMove;
  /** Titik fokus zoom dalam persen foto, default tengah */
  focus?: {x: number; y: number};
  /**
   * Shot ini mulai saat kata ini diucapkan di narasi, contoh 'klenteng'. Pilih kata yang
   * menyebut isi foto. Kosong = dibagi rata di antara shot lain. Diabaikan untuk shot pertama.
   */
  di?: string;
  /** Label mono di kanan atas selama shot ini tampil, contoh 'FOTO 1872 · KASSIAN CEPHAS' */
  tag?: string;
  /** Lingkaran merah yang tergambar di titik penting foto */
  anotasi?: Anotasi[];
  /**
   * Garis rute putus-putus yang tergambar di atas foto (layout 'print', cocok untuk peta), panah di ujung.
   * Koordinat titik dalam persen gambar, cari dengan scripts/grid-foto.mjs.
   */
  rute?: Rute;
};

export type Rute = {
  /** 2–8 titik berurutan dari awal ke ujung rute, persen gambar */
  titik: {x: number; y: number}[];
  /** Rute mulai tergambar saat kata ini diucapkan, default setelah foto mapan */
  di?: string;
  /** Keterangan pendek di tengah rute, contoh 'Jalan Raya Pos' */
  label?: string;
};

export type Anotasi = {
  /** Pusat lingkaran dalam persen gambar (layout 'print') atau persen layar (layout 'full') */
  x: number;
  y: number;
  /** Lebar & tinggi lingkaran dalam persen, default 10 */
  w?: number;
  h?: number;
  /** Keterangan pendek di samping lingkaran */
  label?: string;
  /** 'lingkaran' (default) = elips coretan tangan; 'pin' = pin lokasi yang jatuh lalu berdenyut di titik x, y */
  bentuk?: 'lingkaran' | 'pin';
};

export type Stempel = {
  teks: string;
  /** Kata di narasi yang memicu stempel, default di tengah scene */
  di?: string;
  /** Posisi pusat dalam persen layar, default 70 / 42 */
  x?: number;
  y?: number;
};

/**
 * dorong = scene baru mendorong yang lama ke samping (paralaks, tanpa blur)
 * kartu  = scene baru datang dari kedalaman seperti kartu, yang lama mundur & gelap
 * zoom   = menyelam ke scene berikutnya; simpan untuk 1 momen (misal masuk ke masa lalu)
 * whip   = kibasan kamera dengan blur; simpan untuk 1 momen
 * none   = potong langsung (cut), cocok antar dua scene fakta
 */
export type TransitionType = 'dorong' | 'kartu' | 'zoom' | 'whip' | 'fade' | 'slide' | 'wipe' | 'none';

/** [mulai, selesai] dalam detik, relatif terhadap awal audio narasi scene */
export type WordTiming = [number, number];

type BaseScene = {
  /** Durasi minimal scene dalam frame (30 frame = 1 detik). Diperpanjang otomatis mengikuti audio narasi. */
  duration: number;
  /** Transisi masuk ke scene ini dari scene sebelumnya */
  transition?: TransitionType;
  /** Foto-foto yang bergantian dalam scene ini (dibagi rata sepanjang scene) */
  shots?: Shot[];
  /** Singkatan untuk satu foto saja: ...foto('nama.jpg') mengisi photo + credit */
  photo?: string;
  credit?: string;
  props?: PropItem[];
  /**
   * Teks yang dibacakan TTS. Angka & singkatan ditulis seperti diucapkan.
   * Kata di dalam *bintang* jadi emas di subtitle dan memicu animasi (judul, hitungan angka).
   */
  narasi?: string;
  /** Diisi otomatis dari audio narasi (kata.json), jangan diisi manual */
  kata?: WordTiming[];
  /** Label mono di kiri atas (tempat · waktu), contoh 'MAGELANG · JAWA TENGAH' */
  tag?: string;
  /** Judul pendek (maks. 5 kata) di kiri atas. Kata dalam *bintang* diberi stabilo */
  judul?: string;
  /** Kata di narasi yang memicu judul muncul, default awal narasi */
  judulDi?: string;
  /** Cap/stempel merah yang menghentak masuk, dipakai 1–2 kali per video */
  stempel?: Stempel;
  /**
   * Scene ini membuka bab baru: jadi chapter YouTube di deskripsi (scripts/paket-youtube.mjs).
   * Isi judul bab pendek, contoh 'Asal-usul pesarean'. Bab pertama wajib di scene 1.
   */
  bab?: string;
};

export type TitleScene = BaseScene & {
  type: 'title';
  kicker: string;
  title: string;
  subtitle?: string;
};

export type PhotoScene = BaseScene & {
  type: 'photo';
  /** Teks besar di layar, hanya dipakai kalau scene tidak punya narasi */
  text?: string;
};

export type FactScene = BaseScene & {
  type: 'fact';
  value: number;
  /** 'number' -> 2.672, 'year' -> 1814 (tanpa titik) */
  format?: 'number' | 'year';
  prefix?: string;
  suffix?: string;
  label: string;
  /** Keterangan kecil, hanya dipakai kalau scene tidak punya narasi */
  sub?: string;
  /**
   * Foto yang diulang jadi grid ubin selama angka menghitung, untuk memperlihatkan "sebanyak itu".
   * Contoh {photo: 'photos/borobudur/17-arca.jpg', jumlah: 32}
   */
  ulang?: {photo: string; jumlah?: number};
};

export type OutroScene = BaseScene & {
  type: 'outro';
  title: string;
  cta: string;
};

/** Kartu bab: "BAB 2" + judul bab di atas foto gelap-buram. Otomatis jadi chapter YouTube. */
export type ChapterScene = BaseScene & {
  type: 'chapter';
  /** Nomor bab, tampil sebagai "BAB 2" */
  nomor: number;
  /** Judul bab (maks. 5 kata), juga jadi judul chapter YouTube. Frasa *bintang* jadi emas */
  judul: string;
};

export type TimelineTitik = {
  tahun: number;
  /** Keterangan pendek (maks. ±28 huruf) */
  label: string;
  /** Titik muncul saat kata ini diucapkan, default dibagi rata sepanjang narasi */
  di?: string;
};

/** Garis waktu: titik-titik tahun muncul satu per satu mengikuti narasi (short: garis tegak) */
export type TimelineScene = BaseScene & {
  type: 'timeline';
  /** 2–6 titik, tahun berurutan naik */
  titik: TimelineTitik[];
};

/** Kutipan: teks kutipan besar muncul mengikuti narasi, sumber di bawah, foto di sisi */
export type KutipanScene = BaseScene & {
  type: 'kutipan';
  /** Isi kutipan (maks. 30 kata, short 20), tanpa tanda kutip */
  teks: string;
  /** Wajib: siapa & kapan, contoh 'Raffles, 1817' */
  sumber: string;
};

export type Scene = TitleScene | PhotoScene | FactScene | OutroScene | ChapterScene | TimelineScene | KutipanScene;

export type VideoScript = {
  /** 'landscape' = 1920×1080 (default), 'short' = 1080×1920 untuk YouTube Shorts / TikTok / Reels */
  format?: 'landscape' | 'short';
  /** Teks watermark kanan atas. Default nama channel di src/channel.ts; false = tanpa watermark */
  watermark?: string | false;
  scenes: Scene[];
  /** Musik latar di public/, contoh 'music/borobudur/01-gamelan.mp3' */
  music?: string;
  musicVolume?: number;
  /** Efek suara otomatis (transisi, stempel, angka, judul, props, timeline). Default true; false = matikan */
  sfx?: boolean;
  /** Ketebalan bintik film (grain) 0–1. Default 1; kurangi bila ukuran file terlalu besar */
  grain?: number;
  /** Rekaman narasi satu file utuh di public/ (kalau tidak dipotong per scene) */
  voiceover?: string;
  /**
   * Folder audio narasi per scene di public/, contoh 'audio/borobudur'.
   * Isinya 01.wav, 02.wav, ... (hasil scripts/potong-narasi.mjs) + kata.json.
   */
  narasiAudio?: string;
  /** Ekstensi file audio narasi, default 'mp3' */
  narasiExt?: 'mp3' | 'wav' | 'm4a';
  /** Teks upload YouTube (scripts/paket-youtube.mjs) */
  youtube?: YoutubeMeta;
  /** Gambar thumbnail (landscape 1280×720) atau cover (short 1080×1920), dirender sebagai Still <Id>Thumb */
  thumbnail?: ThumbnailData;
};

export type YoutubeMeta = {
  /** Judul video di YouTube, maks. 100 huruf (ideal ≤60 supaya tidak terpotong) */
  judul: string;
  /** Paragraf pembuka deskripsi. Chapter, kredit foto, dan hashtag ditambahkan otomatis */
  deskripsi?: string;
  /** Kata kunci untuk kolom Tags, contoh ['gunung kawi', 'sejarah malang'] */
  tags?: string[];
};

export type ThumbnailData = {
  /** Judul raksasa maks. 5 kata. Frasa dalam *bintang* diberi stabilo kuning */
  judul: string;
  /** Foto latar, isi lewat ...foto('nama.jpg') (credit ikut terisi, dipakai di daftar kredit) */
  photo: string;
  credit?: string;
  /** Label kecil di atas judul, contoh 'Sejarah Malang' */
  sub?: string;
  /** Titik tengah potongan foto dalam persen (penting untuk cover short yang memotong foto landscape), default tengah */
  focus?: {x: number; y: number};
};
