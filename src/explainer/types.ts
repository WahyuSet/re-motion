import type {TransitionType, WordTiming, YoutubeMeta} from '../types';

export type StageSymbolType =
  | 'larang'
  | 'centang'
  | 'silang'
  | 'panah'
  | 'tanya'
  | 'retak'
  | 'tetes-air'
  | 'gelombang-air';

export type StageEnterType =
  | 'pop'
  | 'drop'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'grow-up'
  | 'fade'
  | 'none';

export type StageExitType =
  | 'fade'
  | 'pop-out'
  | 'slide-left'
  | 'slide-right'
  | 'slide-down'
  | 'none';

export type ExplainerSfxName =
  | 'whoosh'
  | 'dum'
  | 'tik'
  | 'pop'
  | 'swell'
  | 'boing'
  | 'boom'
  | 'womp'
  | 'slap'
  | 'ding';

export type StageAction = {
  type: 'move' | 'peek' | 'grow' | 'dim' | 'shake' | 'pulse' | 'jump' | 'wiggle' | 'squash';
  di?: string;
  delay?: number;
  durasi?: number;
  sfx?: ExplainerSfxName | false;
  /** Untuk 'move' */
  toX?: number;
  toY?: number;
  toScale?: number;
  toRotate?: number;
  /** Untuk 'peek' */
  dx?: number;
  dy?: number;
  rotate?: number;
  tahan?: number;
  /** Untuk 'grow' */
  toScaleX?: number;
  toScaleY?: number;
  /** Untuk 'dim' */
  toOpacity?: number;
  /** Alias toOpacity untuk 'dim' */
  to?: number;
  /** Untuk 'shake' */
  intensitas?: number;
  /** Untuk 'pulse' */
  sampai?: string;
  skala?: number;
};

export type StageItem = {
  kind?: 'prop' | 'teks' | 'simbol';
  /** Untuk kind 'prop': path di public/, contoh 'props/token-meteran.svg' */
  src?: string;
  bingkai?: boolean;
  /** Untuk kind 'teks' */
  teks?: string;
  ukuran?: number;
  warna?: string;
  kotak?: string;
  /** Untuk kind 'simbol' */
  simbol?: StageSymbolType;
  /** Posisi tengah dalam persen layar (0..100) */
  x: number;
  y: number;
  width?: number;
  rotate?: number;
  zIndex?: number;
  float?: boolean;
  /** Kata di narasi saat objek masuk */
  di?: string;
  delay?: number;
  /** Kata di narasi saat objek keluar */
  sampai?: string;
  endFrame?: number;
  masuk?: StageEnterType;
  keluar?: StageExitType;
  sfx?: ExplainerSfxName | false;
  aksi?: StageAction[];
};

type BaseExplainerScene = {
  duration: number;
  transition?: TransitionType;
  narasi?: string;
  kata?: WordTiming[];
  accentColor?: string;
  bab?: string;
  /** Path gambar latar lokasi hybrid di public/ (contoh: 'latar/token-kos.png') */
  latar?: string;
  /** Opacity latar lokasi (default 0.28) */
  latarOpacity?: number;
  /** Blur piksel latar lokasi (default 5) */
  latarBlur?: number;
};

export type HookScene = BaseExplainerScene & {
  type: 'hook';
  baris1: string;
  baris2?: string;
  utama?: StageItem;
  items?: StageItem[];
};

export type BeatScene = BaseExplainerScene & {
  type: 'beat';
  teks: string;
  di?: string;
  items?: StageItem[];
};

export type StageScene = BaseExplainerScene & {
  type: 'stage';
  judul?: string;
  judulDi?: string;
  items: StageItem[];
};

export type DiagramPotonganStep = {
  label: string;
  potong: string;
  sisa: string;
  di?: string;
  warna?: string;
};

export type DiagramPotonganScene = BaseExplainerScene & {
  type: 'diagram';
  mode: 'potongan';
  judul?: string;
  awal: {label: string; nilai: string};
  langkah: DiagramPotonganStep[];
  pembagi?: {label: string; nilai: string; di?: string};
  hasil: {label: string; nilai: string; di?: string};
  items?: StageItem[];
};

export type DiagramBataScene = BaseExplainerScene & {
  type: 'diagram';
  mode: 'grid-bata';
  judul?: string;
  pola: 'zigzag' | 'sejajar';
  baris?: number;
  kolom?: number;
  x?: number;
  y?: number;
  width?: number;
  rakitDi?: string;
  beban?: {
    nilai: number;
    satuan?: string;
    di?: string;
    angkaDi?: string;
  };
  items?: StageItem[];
};

export type DiagramScene = DiagramPotonganScene | DiagramBataScene;

export type ExplainerScene = HookScene | BeatScene | StageScene | DiagramScene;

export type ExplainerThumbData = {
  baris1: string;
  baris2?: string;
  src?: string;
  latar?: string;
  stabilo?: string;
  items?: StageItem[];
};

export type ExplainerScript = {
  format?: 'short' | 'landscape';
  bg?: string;
  watermark?: string | false;
  scenes: ExplainerScene[];
  music?: string;
  musicVolume?: number;
  sfx?: boolean;
  voiceover?: string;
  narasiAudio?: string;
  narasiExt?: 'mp3' | 'wav' | 'm4a';
  youtube?: YoutubeMeta;
  thumbnail?: ExplainerThumbData;
};
