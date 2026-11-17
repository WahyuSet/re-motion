// Siapkan video explainer baru di src/explainer/data/<slug>.ts, daftar props .props.json,
// rencana .rencana.md, catatan sumber .sumber.md, dan daftarkan ke src/explainer/daftar.ts.
//
// Pakai: node scripts/buat-explainer.mjs bata-zigzag          (short 9:16, default)
//       node scripts/buat-explainer.mjs bata-zigzag --long   (long 16:9, 3-12 menit, dengan bab)

import fs from 'node:fs/promises';
import path from 'node:path';
import {templateLatar, templateNaskah, templateProps, templateRencana} from './lib/explainer-template.mjs';

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slug = process.argv[2];
const long = process.argv.includes('--long');
if (!slug || !SLUG.test(slug)) {
  console.error('Pakai: node scripts/buat-explainer.mjs <slug> [--long]');
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

const template = templateNaskah({slug, varName, title, long});

await fs.writeFile(dataFile, template);
await fs.writeFile(path.join(dataDir, `${slug}.props.json`), JSON.stringify(templateProps(), null, 2) + '\n');
await fs.writeFile(path.join(dataDir, `${slug}.rencana.md`), templateRencana(title, {long}));
await fs.writeFile(
  path.join(dataDir, `${slug}.latar.json`),
  JSON.stringify(
    templateLatar(slug, title, {long}),
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

console.log(`Dibuat (Explainer ${long ? 'Long 16:9, baca referensi/long.md' : 'Short 9:16'}):
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
