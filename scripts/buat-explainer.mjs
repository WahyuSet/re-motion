// Siapkan video explainer baru di src/explainer/data/<slug>.ts, daftar props .props.json,
// catatan sumber .sumber.md, dan daftarkan ke src/explainer/daftar.ts.
//
// Pakai: node scripts/buat-explainer.mjs bata-zigzag

import fs from 'node:fs/promises';
import path from 'node:path';

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slug = process.argv[2];
if (!slug || !SLUG.test(slug)) {
  console.error('Pakai: node scripts/buat-explainer.mjs <slug>');
  console.error('       slug: huruf kecil, angka, tanda minus. Contoh: token-listrik, bata-zigzag');
  process.exit(1);
}

const exists = (p) =>
  fs.access(p).then(
    () => true,
    () => false,
  );
const pascal = (s) =>
  s
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');

const id = pascal(slug);
const varName = id[0].toLowerCase() + id.slice(1);
const title = slug
  .split('-')
  .map((w) => w[0].toUpperCase() + w.slice(1))
  .join(' ');

const dataDir = path.resolve('src/explainer/data');
await fs.mkdir(dataDir, {recursive: true});

const dataFile = path.join(dataDir, `${slug}.ts`);
if (await exists(dataFile)) {
  console.error(`src/explainer/data/${slug}.ts sudah ada. Pilih slug lain atau edit file itu.`);
  process.exit(1);
}

const template = `import type {ExplainerScript} from '../types';

// Naskah explainer "${title}". Ikuti .claude/skills/video-explainer/SKILL.md.
// Cek dengan: npm run cek:explainer -- ${slug}
export const ${varName}: ExplainerScript = {
  format: 'short',
  watermark: 'nahh gini',
  // Isi dua baris ini SETELAH audio narasi dipotong (node scripts/potong-narasi.mjs ${slug} <file-audio>):
  // narasiAudio: 'audio/${slug}',
  // narasiExt: 'wav',
  youtube: {
    judul: 'TODO Judul ${title}',
    deskripsi: 'TODO Deskripsi singkat topik ${title}.',
    tags: ['edukasi', 'explainer'],
  },
  thumbnail: {
    baris1: 'TODO BARIS 1',
    baris2: 'TODO BARIS 2?',
  },
  scenes: [
    {
      type: 'hook',
      duration: 110,
      baris1: 'TODO PERTANYAAN UTAMA',
      baris2: 'KENAPA BISA BEGITU?',
      narasi: 'TODO kalimat pembuka yang memancing rasa penasaran tentang *topik utama* ini.',
      items: [],
    },
    {
      type: 'stage',
      duration: 120,
      narasi: 'TODO penjelasan visual pertama dengan celetukan *komedi* dan kata kunci *penting* di dalam kalimat.',
      items: [
        {
          kind: 'simbol',
          simbol: 'tanya',
          x: 28,
          y: 38,
          width: 140,
          masuk: 'pop',
          delay: 0,
          sampai: 'penting',
          aksi: [{type: 'peek', di: 'komedi', dx: 12, dy: -8, rotate: -14, durasi: 12, tahan: 20, sfx: 'boing'}],
        },
        {
          kind: 'teks',
          teks: 'TODO POIN KUNCI',
          x: 50,
          y: 45,
          ukuran: 44,
          warna: '#ffffff',
          kotak: '#1976d2',
          masuk: 'drop',
          sfx: 'boom',
          di: 'penting',
        },
      ],
    },
    {
      type: 'beat',
      duration: 45,
      teks: 'nah',
      narasi: '*Nah*, begini alasannya.',
    },
    {
      type: 'stage',
      duration: 120,
      narasi: 'TODO kesimpulan akhir yang menjawab pertanyaan di awal dengan *jelas*.',
      items: [
        {
          kind: 'simbol',
          simbol: 'centang',
          x: 50,
          y: 45,
          width: 180,
          masuk: 'pop',
          di: 'jelas',
        },
      ],
    },
  ],
};
`;

await fs.writeFile(dataFile, template);
await fs.writeFile(path.join(dataDir, `${slug}.props.json`), '[]\n');
await fs.writeFile(
  path.join(dataDir, `${slug}.sumber.md`),
  `# Sumber fakta: ${title}\n\nSetiap fakta di narasi + minimal 2 URL sumber.\n\n- Fakta: TODO\n  - https://...\n  - https://...\n`,
);

const daftarPath = path.resolve('src/explainer/daftar.ts');
let daftar = await fs.readFile(daftarPath, 'utf8');
if (!daftar.includes(`id: '${id}'`)) {
  daftar = `import {${varName}} from './data/${slug}';\n` + daftar;
  daftar = daftar.replace(/\n\];\s*$/, `\n  {id: '${id}', script: ${varName}},\n];\n`);
  await fs.writeFile(daftarPath, daftar);
}

console.log(`Dibuat (Explainer Short 9:16):
  src/explainer/data/${slug}.ts          naskah explainer (isi semua TODO)
  src/explainer/data/${slug}.props.json  daftar props untuk generate-props
  src/explainer/data/${slug}.sumber.md   catatan sumber fakta
Terdaftar sebagai Composition "${id}" di src/explainer/daftar.ts.

Langkah berikutnya:
  1. Edit naskah di src/explainer/data/${slug}.ts
  2. Cek naskah -> npm run cek:explainer -- ${slug}
  3. Generate props (opsional) -> node scripts/generate-props.mjs --file src/explainer/data/${slug}.props.json`);
