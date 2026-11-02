// Daftar semua video. Diisi otomatis oleh `node scripts/buat-video.mjs <slug>`; tidak perlu diedit manual.
import type {VideoScript} from '../types';
import {gunungKawi} from './gunung-kawi';
import {borobudur} from './borobudur';

export const daftarVideo: {id: string; script: VideoScript}[] = [
  {id: 'Borobudur', script: borobudur},
  {id: 'GunungKawi', script: gunungKawi},
];
