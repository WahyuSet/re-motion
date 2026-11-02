// Buat daftar kredit foto untuk deskripsi YouTube, hanya foto yang benar-benar dipakai di naskah.
//
// Pakai: node scripts/kredit.mjs borobudur   -> out/borobudur-kredit.txt

import fs from 'node:fs/promises';
import path from 'node:path';

const slug = process.argv[2];
if (!slug) {
  console.error('Pakai: node scripts/kredit.mjs <slug>');
  process.exit(1);
}

const credits = JSON.parse(await fs.readFile(path.resolve('public/photos', slug, 'credits.json'), 'utf8'));
const script = await fs.readFile(path.resolve('src/data', `${slug}.ts`), 'utf8');

const used = Object.entries(credits).filter(([file]) => script.includes(file));
const lines = [
  'Sumber foto:',
  ...used.map(([, c]) => `- ${c.title} oleh ${c.author} (${c.license}) ${c.sourceUrl}`),
  '',
  'Ilustrasi props dibuat dengan AI.',
];

await fs.mkdir('out', {recursive: true});
await fs.writeFile(path.join('out', `${slug}-kredit.txt`), lines.join('\n'));
console.log(lines.join('\n'));
console.log(`\nTersimpan di out/${slug}-kredit.txt (${used.length} foto)`);
