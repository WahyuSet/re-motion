import sharp from 'sharp';

// Hapus background polos jadi PNG transparan.
// - Background hijau (#00FF00) atau magenta (#FF00FF): chroma key seperti green screen,
//   termasuk lubang di tengah objek, lalu "despill" supaya tepi objek tidak kehijauan.
// - Background warna lain: flood fill dari pinggir gambar berdasarkan kemiripan warna.

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const sampleBorder = (data, width, height) => {
  const r = [];
  const g = [];
  const b = [];
  const add = (x, y) => {
    const i = (y * width + x) * 4;
    r.push(data[i]);
    g.push(data[i + 1]);
    b.push(data[i + 2]);
  };
  for (let x = 0; x < width; x += 4) {
    add(x, 0);
    add(x, height - 1);
  }
  for (let y = 0; y < height; y += 4) {
    add(0, y);
    add(width - 1, y);
  }
  return {r: median(r), g: median(g), b: median(b)};
};

// Seberapa "berwarna background" sebuah piksel, dan cara membuang sisa warnanya di tepi.
const CHROMA_KEYS = {
  green: {
    key: (r, g, b) => g - Math.max(r, b),
    despill: (data, i, k) => {
      data[i + 1] -= k;
    },
  },
  magenta: {
    key: (r, g, b) => Math.min(r, b) - g,
    despill: (data, i, k) => {
      data[i] -= k;
      data[i + 2] -= k;
    },
  },
};

const detectChroma = (bg) => {
  if (bg.g > 170 && bg.r < 110 && bg.b < 110) return 'green';
  if (bg.r > 170 && bg.b > 170 && bg.g < 110) return 'magenta';
  return null;
};

const chromaKey = (data, pixels, bg, {key, despill}) => {
  const kBg = key(bg.r, bg.g, bg.b);
  const alpha = new Float32Array(pixels);
  for (let p = 0; p < pixels; p++) {
    const i = p * 4;
    const k = key(data[i], data[i + 1], data[i + 2]);
    // k <= 10% kBg: objek utuh, k >= 85% kBg: background penuh, di antaranya tepi semi-transparan
    alpha[p] = 1 - clamp01((k - kBg * 0.1) / (kBg * 0.75));
    if (k > 0) despill(data, i, k);
  }
  return alpha;
};

const floodKey = (data, width, height, bg, soft = 45, hard = 120) => {
  const pixels = width * height;
  const dist = new Float32Array(pixels);
  for (let p = 0; p < pixels; p++) {
    const i = p * 4;
    dist[p] = Math.hypot(data[i] - bg.r, data[i + 1] - bg.g, data[i + 2] - bg.b);
  }
  const alpha = new Float32Array(pixels).fill(1);
  const visited = new Uint8Array(pixels);
  const stack = [];
  for (let x = 0; x < width; x++) stack.push(x, (height - 1) * width + x);
  for (let y = 0; y < height; y++) stack.push(y * width, y * width + width - 1);

  while (stack.length) {
    const p = stack.pop();
    if (visited[p] || dist[p] >= hard) continue;
    visited[p] = 1;
    alpha[p] = clamp01((dist[p] - soft) / (hard - soft));
    const x = p % width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (p >= width) stack.push(p - width);
    if (p < pixels - width) stack.push(p + width);
  }
  return alpha;
};

export const removeBackground = async (input, output) => {
  const {data, info} = await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const {width, height} = info;
  const pixels = width * height;
  const bg = sampleBorder(data, width, height);
  const mode = detectChroma(bg);

  const alpha = mode ? chromaKey(data, pixels, bg, CHROMA_KEYS[mode]) : floodKey(data, width, height, bg);

  for (let p = 0; p < pixels; p++) {
    data[p * 4 + 3] = alpha[p] < 0.04 ? 0 : Math.round(alpha[p] * 255);
  }

  await sharp(data, {raw: {width, height, channels: 4}})
    .trim({threshold: 1})
    .png()
    .toFile(output);

  return {bg, mode: mode ?? 'flood'};
};
