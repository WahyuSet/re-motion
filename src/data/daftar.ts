// Daftar semua video. Diisi otomatis oleh `node scripts/buat-video.mjs <slug>`; tidak perlu diedit manual.
import type {VideoScript} from '../types';
import {danauToba} from './danau-toba';
import {kodePlatKendaraan} from './kode-plat-kendaraan';
import {borobudurShort} from './borobudur-short';
import {alasRoban} from './alas-roban';
import {gunungKawi} from './gunung-kawi';
import {borobudur} from './borobudur';

export const daftarVideo: {id: string; script: VideoScript}[] = [
  {id: 'Borobudur', script: borobudur},
  {id: 'GunungKawi', script: gunungKawi},
  {id: 'AlasRoban', script: alasRoban},
  {id: 'BorobudurShort', script: borobudurShort},
  {id: 'KodePlatKendaraan', script: kodePlatKendaraan},
  {id: 'DanauToba', script: danauToba},
];
