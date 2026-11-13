// Kotak sebenarnya tiap StageItem di kanvas short 1080x1920, dalam persen layar.
// Prop dihitung dari ukuran PNG asli (tinggi = width * rasio gambar), simbol dari viewBox SymbolSvg,
// teks dari perkiraan lebar huruf. Dipakai aturan A1 (area aman), L1/L2 (judul & subtitle), dan V6 (tumpuk).
import path from 'node:path';
import sharp from 'sharp';

const W = 1080;
const H = 1920;

/** Sama dengan SAFE_SHORT di src/lib/safe.ts (dijaga test validator-kotak). */
export const BATAS_AMAN = {
  kiri: (70 / W) * 100,
  kanan: 100 - (150 / W) * 100,
  atas: (240 / H) * 100,
  bawah: 100 - (420 / H) * 100,
};

/** Tinggi/lebar SymbolSvg di src/explainer/Stage.tsx */
const RASIO_SIMBOL = {tanya: 1.25, panah: 0.6, retak: 0.75, 'gelombang-air': 0.35};

const cache = new Map();
export const ukuranGambar = async (src) => {
  if (!src) return null;
  if (!cache.has(src)) {
    cache.set(
      src,
      sharp(path.resolve('public', src))
        .metadata()
        .then((m) => (m.width && m.height ? {w: m.width, h: m.height} : null))
        .catch(() => null),
    );
  }
  return cache.get(src);
};

/** Muat ukuran semua gambar yang dipakai naskah: Map<src, {w,h}|null>. */
export const muatUkuran = async (script) => {
  const srcs = new Set();
  for (const s of script?.scenes ?? []) {
    for (const it of [...(s.utama ? [s.utama] : []), ...(s.items ?? [])]) if (it.src) srcs.add(it.src);
  }
  const peta = new Map();
  await Promise.all([...srcs].map(async (src) => peta.set(src, await ukuranGambar(src))));
  return peta;
};

/** {kiri, kanan, atas, bawah} dalam persen, atau null kalau ukuran gambar tidak diketahui. */
export const kotakItem = (item, ukuran) => {
  const kind = item.kind ?? (item.simbol ? 'simbol' : item.teks ? 'teks' : 'prop');
  let wPx;
  let hPx;
  if (kind === 'teks') {
    const u = item.ukuran ?? 56;
    const berkotak = item.kotak ? 1 : 0;
    wPx = String(item.teks ?? '').length * u * 0.56 + berkotak * 48;
    hPx = u * 1.25 + berkotak * 20;
  } else if (kind === 'simbol') {
    wPx = item.width ?? 170;
    hPx = wPx * (RASIO_SIMBOL[item.simbol] ?? 1);
  } else {
    if (!ukuran) return null;
    wPx = item.width ?? 340;
    hPx = (wPx * ukuran.h) / ukuran.w;
    if (item.bingkai) {
      wPx += 12;
      hPx += 12;
    }
  }
  const cx = (item.x / 100) * W;
  const cy = (item.y / 100) * H;
  const atasPx = item.masuk === 'grow-up' ? cy - hPx : cy - hPx / 2;
  return {
    kiri: ((cx - wPx / 2) / W) * 100,
    kanan: ((cx + wPx / 2) / W) * 100,
    atas: (atasPx / H) * 100,
    bawah: ((atasPx + hPx) / H) * 100,
  };
};

/** Porsi kotak terkecil yang tertutup kotak lain (0..1). */
export const porsiTumpuk = (a, b) => {
  const lebar = Math.min(a.kanan, b.kanan) - Math.max(a.kiri, b.kiri);
  const tinggi = Math.min(a.bawah, b.bawah) - Math.max(a.atas, b.atas);
  if (lebar <= 0 || tinggi <= 0) return 0;
  const luas = (k) => (k.kanan - k.kiri) * (k.bawah - k.atas);
  return (lebar * tinggi) / Math.min(luas(a), luas(b));
};
