// Siapkan video baru: file naskah dari template, daftar props, catatan sumber, folder foto,
// dan daftarkan ke src/data/daftar.ts (jadi muncul di Remotion Studio).
//
// Pakai: node scripts/buat-video.mjs perang-diponegoro
//        -> src/data/perang-diponegoro.ts, .props.json, .sumber.md, Composition id "PerangDiponegoro"

import fs from 'node:fs/promises';
import path from 'node:path';

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('Pakai: node scripts/buat-video.mjs <slug>   (huruf kecil, angka, tanda minus. Contoh: perang-diponegoro)');
  process.exit(1);
}

const words = slug.split('-');
const id = words.map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const varName = words[0] + words.slice(1).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const title = words.map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

const exists = (p) => fs.access(p).then(() => true, () => false);

const dataFile = path.resolve('src/data', `${slug}.ts`);
if (await exists(dataFile)) {
  console.error(`src/data/${slug}.ts sudah ada. Pilih slug lain atau edit file itu.`);
  process.exit(1);
}

const template = `import credits from '../../public/photos/${slug}/credits.json';
import {fotoDari} from '../lib/foto';
import type {VideoScript} from '../types';

// Naskah video "${title}". Ikuti .claude/skills/video-sejarah/SKILL.md.
// Setiap TODO harus diganti. Cek dengan: node scripts/cek-naskah.mjs ${slug}
const foto = fotoDari('${slug}', credits);

export const ${varName}: VideoScript = {
  // Isi dua baris ini SETELAH audio narasi dipotong (node scripts/potong-narasi.mjs):
  // narasiAudio: 'audio/${slug}',
  // narasiExt: 'wav',
  scenes: [
    {
      type: 'title',
      duration: 90,
      kicker: 'Sejarah Nusantara',
      title: '${title}',
      subtitle: 'TODO subjudul pendek',
      narasi: 'TODO dua kalimat pembuka. Inilah *${title}*.',
      shots: [
        // {...foto('01-nama-file.jpg'), move: 'push-in'},
        // {...foto('02-nama-file.jpg'), move: 'pan-left'},
      ],
    },
    {
      type: 'photo',
      duration: 90,
      transition: 'dorong',
      tag: 'TODO tempat · waktu',
      judul: 'TODO maks lima *kata*',
      judulDi: 'TODO',
      narasi: 'TODO narasi scene ini, lima belas sampai dua puluh lima kata, angka ditulis dengan huruf.',
      shots: [
        // {...foto('03-nama-file.jpg'), move: 'pan-right'},
        // {...foto('04-foto-arsip.jpg'), layout: 'print', tag: 'Fotografer · tahun'},
      ],
    },
    {
      type: 'fact',
      duration: 90,
      transition: 'kartu',
      value: 0,
      label: 'TODO label angka',
      narasi: 'TODO kalimat yang menyebut *angka dalam huruf* di dalam tanda bintang.',
      shots: [
        // {...foto('05-nama-file.jpg'), tag: 'Keterangan foto'},
        // {...foto('06-nama-file.jpg')},
      ],
    },
    {
      type: 'outro',
      duration: 90,
      transition: 'kartu',
      tag: 'TODO',
      title: 'TODO kalimat penutup',
      cta: 'Follow untuk sejarah lainnya',
      narasi: 'TODO kalimat penutup. Ikuti channel ini untuk kisah sejarah Nusantara lainnya.',
      shots: [
        // {...foto('07-nama-file.jpg'), move: 'push-in'},
      ],
    },
  ],
};
`;

await fs.writeFile(dataFile, template);
await fs.writeFile(path.resolve('src/data', `${slug}.props.json`), '[]\n');
await fs.writeFile(
  path.resolve('src/data', `${slug}.sumber.md`),
  `# Sumber fakta: ${title}\n\nSetiap fakta di narasi + minimal 2 URL sumber.\n\n- Fakta: TODO\n  - https://...\n  - https://...\n`,
);

const photoDir = path.resolve('public/photos', slug);
await fs.mkdir(photoDir, {recursive: true});
if (!(await exists(path.join(photoDir, 'credits.json')))) {
  await fs.writeFile(path.join(photoDir, 'credits.json'), '{}\n');
}

// Daftarkan di src/data/daftar.ts
const daftarPath = path.resolve('src/data/daftar.ts');
let daftar = await fs.readFile(daftarPath, 'utf8');
if (!daftar.includes(`id: '${id}'`)) {
  daftar = daftar.replace(
    "import type {VideoScript} from '../types';\n",
    `import type {VideoScript} from '../types';\nimport {${varName}} from './${slug}';\n`,
  );
  daftar = daftar.replace(/\n\];\s*$/, `\n  {id: '${id}', script: ${varName}},\n];\n`);
  await fs.writeFile(daftarPath, daftar);
}

console.log(`Dibuat:
  src/data/${slug}.ts          naskah (isi semua TODO)
  src/data/${slug}.props.json  daftar props untuk generate-props
  src/data/${slug}.sumber.md   catatan sumber fakta
  public/photos/${slug}/       folder foto
Terdaftar sebagai Composition "${id}" di src/data/daftar.ts.

Langkah berikutnya: cari foto ->  node scripts/cari-foto.mjs "<kata kunci>" --slug ${slug}`);
