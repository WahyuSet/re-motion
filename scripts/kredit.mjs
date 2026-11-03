// Buat daftar kredit foto untuk deskripsi YouTube, hanya foto yang benar-benar dipakai di naskah.
// Foto boleh berasal dari folder video lain (short turunan memakai foto video panjangnya).
//
// Pakai: node scripts/kredit.mjs borobudur   -> out/borobudur-kredit.txt

import fs from 'node:fs/promises';
import path from 'node:path';
import {loadScript} from './lib/load-script.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('Pakai: node scripts/kredit.mjs <slug>');
  process.exit(1);
}

const script = await loadScript(slug);

// Kumpulkan path foto yang dipakai: semua shot, satu-foto scene, dan grid `ulang`
const used = new Set();
for (const scene of script.scenes) {
  for (const shot of scene.shots ?? []) used.add(shot.photo);
  if (scene.photo) used.add(scene.photo);
  if (scene.ulang?.photo) used.add(scene.ulang.photo);
}

const creditsCache = new Map();
const creditsOf = async (folder) => {
  if (!creditsCache.has(folder)) {
    const file = path.resolve('public', folder, 'credits.json');
    creditsCache.set(folder, JSON.parse(await fs.readFile(file, 'utf8').catch(() => '{}')));
  }
  return creditsCache.get(folder);
};

const entries = [];
const missing = [];
for (const photo of [...used].sort()) {
  const folder = path.posix.dirname(photo);
  const c = (await creditsOf(folder))[path.posix.basename(photo)];
  if (c) entries.push(c);
  else missing.push(photo);
}

const lines = [
  'Sumber foto:',
  ...entries.map((c) => `- ${c.title} oleh ${c.author} (${c.license}) ${c.sourceUrl}`),
  '',
  'Ilustrasi props dibuat dengan AI.',
];

await fs.mkdir('out', {recursive: true});
await fs.writeFile(path.join('out', `${slug}-kredit.txt`), lines.join('\n'));
console.log(lines.join('\n'));
console.log(`\nTersimpan di out/${slug}-kredit.txt (${entries.length} foto)`);
if (missing.length) {
  console.log(`⚠ ${missing.length} foto tanpa data kredit (bukan dari cari-foto?): ${missing.join(', ')}`);
}
