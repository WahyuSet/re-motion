// Sintesis efek suara (SFX) bebas lisensi (100% dibuat secara matematis di Node, domain publik)
// ke public/sfx/*.wav (44.1 kHz, 16-bit mono PCM). Deterministik: hasil selalu identik byte demi byte.
//
// Pakai: node scripts/buat-sfx.mjs

import fs from 'node:fs/promises';
import path from 'node:path';

const SR = 44100;
const TAU = Math.PI * 2;

// PRNG deterministik (mulberry32) supaya noise selalu menghasilkan file WAV yang persis sama.
const prng = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 2147483648 - 1;
};

// Filter biquad band-pass / low-pass sederhana dengan frekuensi yang bisa berubah per sampel.
const biquad = (mode) => {
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x, freq, q = 1) => {
    const w0 = (TAU * Math.max(20, Math.min(SR * 0.45, freq))) / SR;
    const sin = Math.sin(w0);
    const cos = Math.cos(w0);
    const alpha = sin / (2 * q);
    const a0 = 1 + alpha;
    const b0 = mode === 'bp' ? alpha : (1 - cos) / 2;
    const b1 = mode === 'bp' ? 0 : 1 - cos;
    const b2 = mode === 'bp' ? -alpha : (1 - cos) / 2;
    const a1 = -2 * cos;
    const a2 = 1 - alpha;
    const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
    return y;
  };
};

const buatSamples = (durasi, fn) => {
  const n = Math.round(durasi * SR);
  const out = new Float64Array(n);
  let maks = 0;
  for (let i = 0; i < n; i++) {
    const v = fn(i / SR, i / n, i);
    out[i] = v;
    if (Math.abs(v) > maks) maks = Math.abs(v);
  }
  const skala = maks > 0 ? 0.85 / maks : 1;
  for (let i = 0; i < n; i++) out[i] *= skala;
  return out;
};

const tulisWav = async (file, samples) => {
  const dataSize = samples.length * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16); // PCM chunk size
  buf.writeUInt16LE(1, 20);  // PCM = 1
  buf.writeUInt16LE(1, 22);  // 1 channel (mono)
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  await fs.writeFile(file, buf);
};

// 1. whoosh: desau angin halus saat transisi antar scene (noise tersaring menyapu 220 -> 900 -> 280 Hz)
const buatWhoosh = () => {
  const rand = prng(101);
  const bp = biquad('bp');
  return buatSamples(0.32, (_t, p) => {
    const env = Math.sin(Math.PI * p) ** 1.6;
    const freq = 220 + 680 * Math.sin(Math.PI * p ** 0.85);
    return bp(rand(), freq, 2.2) * env;
  });
};

// 2. dum: hentakan stempel (sinus rendah turun cepat 135 -> 45 Hz + ketukan kertas di awal)
const buatDum = () => {
  const rand = prng(202);
  const lp = biquad('lp');
  let phase = 0;
  return buatSamples(0.42, (t) => {
    const freq = 45 + 95 * Math.exp(-t * 28);
    phase += (TAU * freq) / SR;
    const sub = Math.sin(phase) * Math.exp(-t * 7.5);
    const harm = Math.sin(phase * 2) * Math.exp(-t * 16) * 0.35;
    const klik = lp(rand(), 900, 0.9) * Math.exp(-t * 140) * 0.7;
    const attack = Math.min(1, t / 0.003);
    return (sub + harm + klik) * attack;
  });
};

// 3. tik: bunyi pengunci saat angka fakta selesai menghitung (lonceng pendek + ketukan mekanis)
const buatTik = () => {
  let p1 = 0, p2 = 0, p3 = 0;
  return buatSamples(0.18, (t) => {
    p1 += (TAU * 1320) / SR;
    p2 += (TAU * 2640) / SR;
    p3 += (TAU * 190) / SR;
    const lonceng = (Math.sin(p1) * Math.exp(-t * 28) + Math.sin(p2) * Math.exp(-t * 45) * 0.4) * 0.7;
    const ketuk = Math.sin(p3) * Math.exp(-t * 95) * 0.6;
    const attack = Math.min(1, t / 0.002);
    return (lonceng + ketuk) * attack;
  });
};

// 4. pop: bunyi lembut saat props, pin lokasi, atau titik garis waktu muncul (sapuan naik singkat)
const buatPop = () => {
  let phase = 0;
  return buatSamples(0.14, (t) => {
    const freq = 260 + 440 * (1 - Math.exp(-t * 45));
    phase += (TAU * freq) / SR;
    const env = Math.min(1, t / 0.003) * Math.exp(-t * 32);
    return (Math.sin(phase) + 0.25 * Math.sin(phase * 2)) * env;
  });
};

// 5. swell: dengung hangat saat judul besar atau kartu bab muncul (akor A mayor rendah tersaring)
const buatSwell = () => {
  const freqs = [110, 164.81, 220, 277.18, 329.63];
  const phases = freqs.map(() => 0);
  const lp = biquad('lp');
  return buatSamples(0.75, (t, p) => {
    const attack = Math.sin(Math.min(1, p / 0.35) * (Math.PI / 2)) ** 1.4;
    const decay = Math.exp(-Math.max(0, p - 0.25) * 3.8);
    const env = attack * decay * Math.sin(Math.PI * p) ** 0.3;
    let sum = 0;
    freqs.forEach((f, i) => {
      phases[i] += (TAU * f * (1 + 0.0015 * (i - 2))) / SR;
      sum += (Math.sin(phases[i]) + 0.3 * Math.sin(phases[i] * 2)) / (1 + i * 0.35);
    });
    return lp(sum, 380 + 520 * env, 0.85) * env;
  });
};

const outDir = path.resolve('public/sfx');
await fs.mkdir(outDir, {recursive: true});

const daftar = [
  ['whoosh.wav', buatWhoosh()],
  ['dum.wav', buatDum()],
  ['tik.wav', buatTik()],
  ['pop.wav', buatPop()],
  ['swell.wav', buatSwell()],
];

for (const [nama, samples] of daftar) {
  const file = path.join(outDir, nama);
  await tulisWav(file, samples);
  const {size} = await fs.stat(file);
  console.log(`  public/sfx/${nama} (${(samples.length / SR).toFixed(2)} dtk, ${Math.round(size / 1024)} KB)`);
}
console.log('Selesai: 5 file SFX tersimpan di public/sfx/.');
