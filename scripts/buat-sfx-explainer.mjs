// Sintesis efek suara (SFX) komedi & explainer bebas lisensi (100% matematis di Node)
// ke public/sfx/*.wav (44.1 kHz, 16-bit mono PCM).
//
// Daftar SFX komedi:
// - boing.wav : bunyi per/kartun melenting saat objek lucu nongol (peek / pop komedi)
// - boom.wav  : bass drop meme (vine boom style) saat punchline / plot twist
// - womp.wav  : nada turun kecewa ("womp womp") saat potongan biaya / rugi / zonk
// - slap.wav  : bunyi tepok / gepeng saat objek ketiban beban
// - ding.wav  : lonceng ting! cerah saat solusi / poin benar muncul
//
// Pakai: node scripts/buat-sfx-explainer.mjs

import fs from 'node:fs/promises';
import path from 'node:path';

const SR = 44100;
const TAU = Math.PI * 2;

const prng = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 2147483648 - 1;
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
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
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

// 1. boing: per kartun melenting (frekuensi berayun naik-turun dengan vibrato cepat)
const buatBoing = () => {
  let phase = 0;
  return buatSamples(0.45, (t) => {
    const pitchGlide = 180 + 260 * (1 - Math.exp(-t * 10));
    const wobble = Math.sin(TAU * 19 * t) * 75 * Math.exp(-t * 4.5);
    const freq = pitchGlide + wobble;
    phase += (TAU * freq) / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t * 5.8);
    return (Math.sin(phase) + 0.35 * Math.sin(phase * 2) + 0.15 * Math.sin(phase * 3)) * env;
  });
};

// 2. boom: vine-boom style sub-bass drop untuk punchline komedi
const buatBoom = () => {
  const rand = prng(303);
  let phase = 0;
  return buatSamples(0.65, (t) => {
    const freq = 38 + 140 * Math.exp(-t * 22);
    phase += (TAU * freq) / SR;
    const sub = Math.tanh(Math.sin(phase) * 2.2) * Math.exp(-t * 4.8);
    const punch = rand() * Math.exp(-t * 95) * 0.45;
    const attack = Math.min(1, t / 0.002);
    return (sub + punch) * attack;
  });
};

// 3. womp: 2 nada turun sedih/kecewa ("womp-womp" komedi saat rugi/zonk)
const buatWomp = () => {
  let phase = 0;
  return buatSamples(0.62, (t) => {
    const note2 = t >= 0.28;
    const localT = note2 ? t - 0.28 : t;
    const baseFreq = note2 ? 195 - 55 * (localT / 0.34) : 233 - 25 * (localT / 0.28);
    const vibrato = Math.sin(TAU * 7 * localT) * 4;
    phase += (TAU * (baseFreq + vibrato)) / SR;
    const gate = Math.min(1, localT / 0.012) * Math.exp(-localT * (note2 ? 4.5 : 3.2));
    return (Math.sin(phase) + 0.5 * Math.sin(phase * 2) + 0.25 * Math.sin(phase * 3)) * gate;
  });
};

// 4. slap: bunyi tepok/gepeng komedi saat ketiban beban
const buatSlap = () => {
  const rand = prng(404);
  let phase = 0;
  return buatSamples(0.2, (t) => {
    const freq = 120 + 480 * Math.exp(-t * 65);
    phase += (TAU * freq) / SR;
    const snap = rand() * Math.exp(-t * 75) * 0.8;
    const body = Math.sin(phase) * Math.exp(-t * 35) * 0.7;
    return (snap + body) * Math.min(1, t / 0.0015);
  });
};

// 5. ding: lonceng kristal cerah saat ide/jawaban benar
const buatDing = () => {
  let p1 = 0, p2 = 0, p3 = 0;
  return buatSamples(0.55, (t) => {
    p1 += (TAU * 1567.98) / SR; // G6
    p2 += (TAU * 3135.96) / SR; // G7
    p3 += (TAU * 4703.94) / SR;
    const env = Math.min(1, t / 0.002) * Math.exp(-t * 7.5);
    return (Math.sin(p1) + 0.35 * Math.sin(p2) * Math.exp(-t * 14) + 0.12 * Math.sin(p3) * Math.exp(-t * 25)) * env;
  });
};

const outDir = path.resolve('public/sfx');
await fs.mkdir(outDir, {recursive: true});

const daftar = [
  ['boing.wav', buatBoing()],
  ['boom.wav', buatBoom()],
  ['womp.wav', buatWomp()],
  ['slap.wav', buatSlap()],
  ['ding.wav', buatDing()],
];

for (const [nama, samples] of daftar) {
  const file = path.join(outDir, nama);
  await tulisWav(file, samples);
  const {size} = await fs.stat(file);
  console.log(`  public/sfx/${nama} (${(samples.length / SR).toFixed(2)} dtk, ${Math.round(size / 1024)} KB)`);
}
console.log('Selesai: 5 SFX komedi explainer tersimpan di public/sfx/.');
