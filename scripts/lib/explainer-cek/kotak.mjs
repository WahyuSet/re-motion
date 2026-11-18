// Kotak sebenarnya tiap StageItem dalam persen layar, di kanvas sesuai format (default short 1080x1920).
// Prop dihitung dari ukuran PNG asli (tinggi = width * rasio gambar), simbol dari viewBox SymbolSvg,
// teks dari perkiraan lebar huruf. Dipakai aturan A1 (area aman), L1/L2 (judul & subtitle), dan V6 (tumpuk).
import path from 'node:path';
import sharp from 'sharp';

const W_SHORT = 1080;
const H_SHORT = 1920;

/** Sama dengan SAFE_SHORT di src/lib/safe.ts (dijaga test validator-kotak). */
export const BATAS_AMAN = {
  kiri: (70 / W_SHORT) * 100,
  kanan: 100 - (150 / W_SHORT) * 100,
  atas: (240 / H_SHORT) * 100,
  bawah: 100 - (420 / H_SHORT) * 100,
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

/** Sisi dianggap terpotong kalau bagian buramnya menyentuh tepi PNG sepanjang minimal 12% sisi itu. */
const PORSI_SISI_POTONG = 0.12;
const ALPHA_BURAM = 200;
const ALPHA_PENUH = 240;
const ALPHA_KOSONG = 15;

const cacheAlpha = new Map();

/** Sisi PNG yang terpotong rata dan persentase pixel setengah tembus: {potong, tembus}, atau null. */
export const infoAlpha = async (src) => {
  if (!src) return null;
  if (!cacheAlpha.has(src)) {
    cacheAlpha.set(
      src,
      sharp(path.resolve('public', src))
        .ensureAlpha()
        .extractChannel(3)
        .raw()
        .toBuffer({resolveWithObject: true})
        .then(({data, info: {width: W, height: H}}) => {
          let penuh = 0;
          let semi = 0;
          for (const a of data) {
            if (a >= ALPHA_PENUH) penuh++;
            else if (a > ALPHA_KOSONG) semi++;
          }
          const sisi = (n, ambil) => {
            let c = 0;
            for (let i = 0; i < n; i++) if (ambil(i) >= ALPHA_BURAM) c++;
            return c / n >= PORSI_SISI_POTONG;
          };
          return {
            potong: {
              kiri: sisi(H, (y) => data[y * W]),
              kanan: sisi(H, (y) => data[y * W + W - 1]),
              atas: sisi(W, (x) => data[x]),
              bawah: sisi(W, (x) => data[(H - 1) * W + x]),
            },
            tembus: penuh + semi ? (semi / (penuh + semi)) * 100 : 0,
          };
        })
        .catch(() => null),
    );
  }
  return cacheAlpha.get(src);
};

/** Muat info alpha semua prop yang dipakai naskah: Map<src, info|null>. */
export const muatAlpha = async (script) => {
  const srcs = new Set();
  for (const s of script?.scenes ?? []) {
    for (const it of [...(s.utama ? [s.utama] : []), ...(s.items ?? [])]) if (it.src) srcs.add(it.src);
  }
  const peta = new Map();
  await Promise.all([...srcs].map(async (src) => peta.set(src, await infoAlpha(src))));
  return peta;
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

/** Sama dengan STIKER di src/explainer/stiker.ts (pinggiran putih + padding stiker die-cut). */
const STIKER = {pinggir: 8, padX: 28, padY: 12};
/** Font stiker (Baloo 2 ExtraBold) sedikit lebih lebar per huruf daripada Inter Black. */
const LEBAR_HURUF_STIKER = 0.6;

/**
 * {kiri, kanan, atas, bawah} dalam persen, atau null kalau ukuran gambar tidak diketahui.
 * `gayaTeks` = ExplainerScript.gayaTeks ('kotak' default, atau 'stiker').
 * `profil` = ProfilFormat dari src/explainer/format.ts; tanpa profil = kanvas short.
 */
export const kotakItem = (item, ukuran, gayaTeks = 'kotak', profil = null) => {
  const W = profil?.kanvas.w ?? W_SHORT;
  const H = profil?.kanvas.h ?? H_SHORT;
  const kind = item.kind ?? (item.simbol ? 'simbol' : item.teks ? 'teks' : 'prop');
  let wPx;
  let hPx;
  if (kind === 'teks' && gayaTeks === 'stiker') {
    const u = item.ukuran ?? 56;
    wPx = String(item.teks ?? '').length * u * LEBAR_HURUF_STIKER + 2 * (STIKER.padX + STIKER.pinggir);
    hPx = u * 1.15 + 2 * (STIKER.padY + STIKER.pinggir);
  } else if (kind === 'teks') {
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
  if (item.nempel) {
    const lebar = (wPx / W) * 100;
    const pusat = item.nempel === 'kiri-bawah' ? lebar / 2 : item.nempel === 'kanan-bawah' ? 100 - lebar / 2 : item.x;
    return {kiri: pusat - lebar / 2, kanan: pusat + lebar / 2, atas: 100 - (hPx / H) * 100, bawah: 100};
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
