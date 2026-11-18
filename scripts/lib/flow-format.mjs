// Ukuran gambar Flow Bridge per format video. Flow mengikuti pilihan rasio di halamannya, jadi `size`
// dipakai bridge untuk mencocokkan rasio itu, dan hasil latar tetap diperiksa setelah diunduh.
import fs from 'node:fs/promises';

export const UKURAN_FLOW = {short: '1024x1024', landscape: '1792x1024'};

/** Rasio lebar/tinggi minimal latar video long. */
export const RASIO_LATAR_LONG = 1.5;
/** Lebar minimal latar video long, px. Gambar 16:9 dari Flow lebarnya sekitar 1376. */
export const LEBAR_LATAR_LONG = 1200;

/** Format dari naskah pendamping `<slug>.latar.json` / `<slug>.props.json`, atau null kalau tidak bisa ditentukan. */
export const formatDariFile = async (file) => {
  const dasar = file?.match(/^(.*)\.(?:latar|props)\.json$/)?.[1];
  if (!dasar) return null;
  try {
    const naskah = await fs.readFile(`${dasar}.ts`, 'utf8');
    return /^\s*format:\s*'landscape'/m.test(naskah) ? 'landscape' : 'short';
  } catch {
    return null;
  }
};

/** Pesan masalah kalau gambar tidak layak jadi latar video long, atau null kalau layak. */
export const masalahLatarLong = ({width, height}) => {
  if (!width || !height) return 'ukuran gambar tidak terbaca';
  if (width / height < RASIO_LATAR_LONG) return `gambar ${width}x${height} bukan 16:9`;
  if (width < LEBAR_LATAR_LONG) return `lebar ${width} px terlalu kecil (minimal ${LEBAR_LATAR_LONG})`;
  return null;
};
