// Siapkan video explainer baru di src/explainer/data/<slug>.ts, daftar props .props.json,
// rencana .rencana.md, catatan sumber .sumber.md, dan daftarkan ke src/explainer/daftar.ts.
//
// Pakai: node scripts/buat-explainer.mjs bata-zigzag

import fs from 'node:fs/promises';
import path from 'node:path';
import {templateProps, templateRencana} from './lib/explainer-template.mjs';

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
// Tulis dulu ${slug}.rencana.md (hook, narasi, peta visual), lalu salin peta ke file ini.
// Cek dengan: npm run cek:explainer -- ${slug} --peta
export const ${varName}: ExplainerScript = {
  format: 'short',
  watermark: false,
  // Isi dua baris ini SETELAH audio narasi dipotong (node scripts/potong-narasi.mjs ${slug} <file-audio>):
  // narasiAudio: 'audio/${slug}',
  // narasiExt: 'wav',
  youtube: {
    judul: 'TODO Judul ${title}',
    deskripsi: 'TODO Deskripsi singkat topik ${title}.',
    tags: ['edukasi', 'explainer'],
  },
  // Judul 2 baris utuh dan natural (<= 28 huruf per baris). Baris 1 = sticker putih, Baris 2 = stabilo kuning + sticker putih.
  thumbnail: {
    baris1: 'TODO SUBJEK JELAS',
    baris2: 'KENAPA BISA BEGITU?',
    latar: 'latar/${slug}-1.png',
    src: 'props/meme-kucing-paw.png',
  },
  scenes: [
    {
      type: 'hook',
      duration: 105,
      latar: 'latar/${slug}-1.png',
      baris1: 'TODO SUBJEK JELAS',
      baris2: 'KENAPA BISA BEGITU?',
      // Hook Stop-Scroll (wajib 8-14 kata, 1 kalimat ~3 detik, langsung tembak kejanggalan tanpa pengantar):
      narasi: 'TODO kebiasaan singkat sehari-hari, kok bisa muncul *kejanggalan utama* ini?',
      items: [],
    },
    {
      type: 'stage',
      duration: 120,
      latar: 'latar/${slug}-2.png',
      narasi: 'TODO penjelasan visual pertama dengan celetukan *komedi* dan kata kunci *penting* di dalam kalimat.',
      items: [
        {
          kind: 'prop',
          src: 'props/meme-kucing-paw.png',
          x: 28,
          y: 54,
          width: 300,
          masuk: 'slide-up',
          delay: 0,
          sampai: 'penting',
          aksi: [
            {type: 'wiggle', di: 'penjelasan', rotate: 14, durasi: 18},
            {type: 'move', di: 'komedi', toX: 24, toY: 56, toRotate: -5, durasi: 16},
            {type: 'jump', di: 'penting', dy: 60, durasi: 18},
          ],
        },
        {
          kind: 'simbol',
          simbol: 'tanya',
          x: 46,
          y: 38,
          width: 130,
          masuk: 'pop',
          delay: 4,
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
          aksi: [{type: 'squash', di: 'kalimat', durasi: 16}],
        },
      ],
    },
    {
      type: 'beat',
      duration: 55,
      teks: 'Oke, sini gue jelasin.',
      narasi: 'Oke, *sini gue jelasin* alasannya.',
      items: [
        {
          kind: 'prop',
          src: 'props/meme-kucing-jelasin.png',
          x: 50,
          y: 58,
          width: 360,
          masuk: 'pop',
          sfx: 'boing',
          aksi: [{type: 'wiggle', di: 'jelasin', rotate: 12, durasi: 16}],
        },
      ],
    },
    {
      type: 'stage',
      duration: 120,
      latar: 'latar/${slug}-4.png',
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
await fs.writeFile(path.join(dataDir, `${slug}.props.json`), JSON.stringify(templateProps(), null, 2) + '\n');
await fs.writeFile(path.join(dataDir, `${slug}.rencana.md`), templateRencana(title));
await fs.writeFile(
  path.join(dataDir, `${slug}.latar.json`),
  JSON.stringify(
    [
      {
        name: `${slug}-1`,
        prompt: `wide realistic modern photography of ${title} scene 1 location, natural colors, full-bleed camera frame no border, clean composition`,
        utuh: true,
      },
      {
        name: `${slug}-2`,
        prompt: `wide realistic modern indoor or outdoor photography of ${title} scene 2 location, natural daylight, full-bleed camera frame no border, high detail`,
        utuh: true,
      },
      {
        name: `${slug}-4`,
        prompt: `wide realistic modern photography of ${title} conclusion scene location, soft natural lighting, full-bleed camera frame no border`,
        utuh: true,
      },
    ],
    null,
    2,
  ) + '\n',
);
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
  src/explainer/data/${slug}.ts           naskah explainer
  src/explainer/data/${slug}.rencana.md   rencana: hook, narasi, peta visual
  src/explainer/data/${slug}.props.json   daftar props (tiap prop wajib punya "untuk")
  src/explainer/data/${slug}.latar.json   daftar background real per scene
  src/explainer/data/${slug}.sumber.md    catatan sumber fakta
Terdaftar sebagai Composition "${id}" di src/explainer/daftar.ts.

Langkah berikutnya:
  1. Isi sumber fakta        -> src/explainer/data/${slug}.sumber.md
  2. Isi rencana (hook, narasi, peta visual) -> src/explainer/data/${slug}.rencana.md
  3. Isi props.json & latar.json dari peta (tiap prop wajib punya "untuk")
  4. Generate latar & props  -> node scripts/generate-props.mjs --file ... (lihat SKILL.md langkah 5)
  5. Salin peta ke naskah    -> src/explainer/data/${slug}.ts
  6. Cek naskah              -> npm run cek:explainer -- ${slug} --peta`);
