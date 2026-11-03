// Siapkan video baru: file naskah dari template, daftar props, catatan sumber, folder foto,
// dan daftarkan ke src/data/daftar.ts (jadi muncul di Remotion Studio).
//
// Pakai: node scripts/buat-video.mjs perang-diponegoro
//          -> video panjang 16:9, Composition id "PerangDiponegoro"
//        node scripts/buat-video.mjs perang-diponegoro-short --short
//          -> short 9:16 (YouTube Shorts / TikTok / Reels) dengan topik & foto sendiri
//        node scripts/buat-video.mjs borobudur-short --short --dari borobudur
//          -> short turunan: memakai foto, kredit, dan sumber fakta video "borobudur"

import fs from 'node:fs/promises';
import path from 'node:path';
import {parseArgs} from 'node:util';

const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {
    short: {type: 'boolean', default: false},
    dari: {type: 'string'},
  },
});

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slug = positionals[0];
if (!slug || !SLUG.test(slug)) {
  console.error('Pakai: node scripts/buat-video.mjs <slug> [--short] [--dari <slug-video-panjang>]');
  console.error('       slug: huruf kecil, angka, tanda minus. Contoh: perang-diponegoro, borobudur-short');
  process.exit(1);
}
const dari = values.dari;
if (dari && !values.short) {
  console.error('--dari hanya untuk short turunan. Pakai: --short --dari <slug-video-panjang>');
  process.exit(1);
}

const exists = (p) => fs.access(p).then(() => true, () => false);
const pascal = (s) =>
  s
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');

const id = pascal(slug);
const varName = id[0].toLowerCase() + id.slice(1);
// Judul tampil: dari video induk (turunan) atau dari slug tanpa akhiran "-short"
const title = (dari ?? slug.replace(/-short$/, ''))
  .split('-')
  .map((w) => w[0].toUpperCase() + w.slice(1))
  .join(' ');
const photoSlug = dari ?? slug;

const dataFile = path.resolve('src/data', `${slug}.ts`);
if (await exists(dataFile)) {
  console.error(`src/data/${slug}.ts sudah ada. Pilih slug lain atau edit file itu.`);
  process.exit(1);
}
if (dari && !(await exists(path.resolve('src/data', `${dari}.ts`)))) {
  console.error(`Video induk src/data/${dari}.ts tidak ada. Cek slug --dari.`);
  process.exit(1);
}

const header = `import credits from '../../public/photos/${photoSlug}/credits.json';
import {fotoDari} from '../lib/foto';
import type {VideoScript} from '../types';

// Naskah ${values.short ? 'short 9:16' : 'video'} "${title}". Ikuti .claude/skills/video-sejarah/SKILL.md${values.short ? ' (bagian Mode Short)' : ''}.
// Setiap TODO harus diganti. Cek dengan: node scripts/cek-naskah.mjs ${slug}
${dari ? `// Turunan dari video "${dari}": foto & kredit diambil dari public/photos/${dari}/.\n// Butuh foto tambahan? node scripts/cari-foto.mjs "<kata kunci>" --slug ${dari}\n` : ''}const foto = fotoDari('${photoSlug}', credits);
`;

const longTemplate = `${header}
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
        // {...foto('02-nama-file.jpg'), move: 'pan-left', di: 'TODO kata di narasi'},
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
        // {...foto('04-foto-arsip.jpg'), layout: 'print', tag: 'Fotografer · tahun', di: 'TODO kata di narasi'},
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
        // {...foto('06-nama-file.jpg'), di: 'TODO kata di narasi'},
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

// Short: 5 scene, total 30–60 detik. Hook di 2 detik pertama, judul ≤4 kata, 2–3 shot per scene.
const shortTemplate = `${header}
export const ${varName}: VideoScript = {
  format: 'short',
  // Isi dua baris ini SETELAH audio narasi dipotong (node scripts/potong-narasi.mjs):
  // narasiAudio: 'audio/${slug}',
  // narasiExt: 'wav',
  scenes: [
    {
      type: 'title',
      duration: 60,
      kicker: 'Sejarah Nusantara',
      title: '${title}',
      narasi: 'TODO hook: satu pertanyaan atau fakta mengejutkan. Inilah *${title}*.',
      shots: [
        // {...foto('01-nama-file.jpg'), move: 'pan-right'},
        // {...foto('02-nama-file.jpg'), di: 'TODO kata di narasi'},
      ],
    },
    {
      type: 'photo',
      duration: 60,
      transition: 'dorong',
      tag: 'TODO tempat · waktu',
      judul: 'TODO maks empat *kata*',
      judulDi: 'TODO',
      narasi: 'TODO narasi pendek, dua belas sampai dua puluh kata, angka ditulis dengan huruf.',
      shots: [
        // {...foto('03-nama-file.jpg'), move: 'pan-left'},
        // {...foto('04-foto-arsip.jpg'), layout: 'print', tag: 'Keterangan', di: 'TODO kata di narasi'},
      ],
    },
    {
      type: 'fact',
      duration: 60,
      transition: 'kartu',
      value: 0,
      label: 'TODO label angka',
      narasi: 'TODO kalimat yang menyebut *angka dalam huruf* di dalam tanda bintang.',
      shots: [
        // {...foto('05-nama-file.jpg'), move: 'pan-right'},
      ],
    },
    {
      type: 'photo',
      duration: 60,
      transition: 'dorong',
      tag: 'TODO',
      judul: 'TODO maks empat *kata*',
      judulDi: 'TODO',
      narasi: 'TODO narasi pendek, dua belas sampai dua puluh kata.',
      shots: [
        // {...foto('06-nama-file.jpg'), move: 'pan-left'},
        // {...foto('07-nama-file.jpg'), di: 'TODO kata di narasi'},
      ],
    },
    {
      type: 'outro',
      duration: 60,
      transition: 'kartu',
      title: '${dari ? 'Versi *lengkapnya* ada di channel' : 'TODO kalimat penutup *pendek*'}',
      cta: 'Follow untuk sejarah lainnya',
      narasi: '${dari ? 'TODO satu kalimat penutup. Tonton versi lengkapnya di channel ini, dan ikuti untuk kisah sejarah lainnya.' : 'TODO satu kalimat penutup. Ikuti untuk kisah sejarah Nusantara lainnya.'}',
      shots: [
        // {...foto('08-nama-file.jpg'), move: 'push-in'},
      ],
    },
  ],
};
`;

await fs.writeFile(dataFile, values.short ? shortTemplate : longTemplate);
await fs.writeFile(path.resolve('src/data', `${slug}.props.json`), '[]\n');

const sumberPath = path.resolve('src/data', `${slug}.sumber.md`);
if (dari && (await exists(path.resolve('src/data', `${dari}.sumber.md`)))) {
  const parent = await fs.readFile(path.resolve('src/data', `${dari}.sumber.md`), 'utf8');
  await fs.writeFile(
    sumberPath,
    `<!-- Short turunan dari "${dari}". Fakta di bawah disalin dari ${dari}.sumber.md; tambahkan sumber untuk fakta baru. -->\n\n${parent}`,
  );
} else {
  await fs.writeFile(
    sumberPath,
    `# Sumber fakta: ${title}\n\nSetiap fakta di narasi + minimal 2 URL sumber.\n\n- Fakta: TODO\n  - https://...\n  - https://...\n`,
  );
}

if (!dari) {
  const photoDir = path.resolve('public/photos', slug);
  await fs.mkdir(photoDir, {recursive: true});
  if (!(await exists(path.join(photoDir, 'credits.json')))) {
    await fs.writeFile(path.join(photoDir, 'credits.json'), '{}\n');
  }
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

console.log(`Dibuat${values.short ? ' (short 9:16)' : ''}:
  src/data/${slug}.ts          naskah (isi semua TODO)
  src/data/${slug}.props.json  daftar props untuk generate-props
  src/data/${slug}.sumber.md   catatan sumber fakta${dari ? ` (disalin dari ${dari})` : ''}
  ${dari ? `foto: public/photos/${dari}/ (milik video induk)` : `public/photos/${slug}/       folder foto`}
Terdaftar sebagai Composition "${id}" di src/data/daftar.ts.

Langkah berikutnya: ${
  dari
    ? `lihat public/photos/${dari}/_contact-sheet.jpg, pilih foto, lalu tulis naskah short.`
    : `cari foto ->  node scripts/cari-foto.mjs "<kata kunci>" --slug ${slug}`
}`);
