import type {CameraMove} from '../types';

const AUTO_MOVES: CameraMove[] = ['push-in', 'pan-left', 'pull-out', 'pan-right', 'tilt-up', 'push-in', 'tilt-down'];
// Layar vertikal memotong foto landscape jadi pita sempit: utamakan pan yang menyusuri lebar foto.
const AUTO_MOVES_VERTICAL: CameraMove[] = ['pan-right', 'push-in', 'pan-left', 'pull-out'];

/** Gerak kamera shot ke-`index` dalam scene: `move` kalau diisi, kalau tidak dipilih bergantian */
export const shotMove = (shot: {move?: CameraMove}, index: number, vertical: boolean): CameraMove => {
  const auto = vertical ? AUTO_MOVES_VERTICAL : AUTO_MOVES;
  return shot.move ?? auto[index % auto.length];
};

// Guncangan kamera singkat yang meredam, untuk momen "hentakan" (judul muncul, angka selesai dihitung).
export const shake = (frame: number, at: number | null, strength = 14, length = 16) => {
  if (at === null) return {x: 0, y: 0};
  const t = frame - at;
  if (t < 0 || t > length) return {x: 0, y: 0};
  const decay = (1 - t / length) ** 2;
  return {x: Math.sin(t * 2.7) * strength * decay, y: Math.cos(t * 3.3) * strength * 0.6 * decay};
};
