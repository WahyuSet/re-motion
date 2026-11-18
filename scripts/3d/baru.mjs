// Buat kerangka src/explainer/data/<slug>.3d.json. Pakai: npm run 3d:baru -- <slug>
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadScript} from '../lib/load-script.mjs';
import {fileData} from './lib/rencana.mjs';

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const kerangka = (slug, script) => ({
  slug,
  klip: script.scenes.flatMap((scene, i) =>
    scene.type === 'beat' ? [] : [{scene: i + 1, set: '', kamera: '', isi: {}, gerak: []}],
  ),
  gambar: [],
});

export const buatKerangka = (slug, {dir = 'src/explainer/data', script}) => {
  if (!SLUG.test(slug)) throw new Error(`slug "${slug}" tidak valid: pakai huruf kecil, angka, dan tanda minus.`);
  if (script.format === 'landscape') throw new Error('Klip 3D hanya untuk video short 9:16.');
  const {json: file} = fileData(slug, dir);
  if (fs.existsSync(file)) return {file, dibuat: false};
  fs.writeFileSync(file, `${JSON.stringify(kerangka(slug, script), null, 2)}\n`);
  return {file, dibuat: true};
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Pakai: npm run 3d:baru -- <slug>');
    process.exit(1);
  }
  try {
    if (!SLUG.test(slug)) throw new Error(`slug "${slug}" tidak valid.`);
    const script = await loadScript(slug);
    const {file, dibuat} = buatKerangka(slug, {script});
    const lokasi = file.replaceAll('\\', '/');
    console.log(dibuat ? `✓ ${lokasi} dibuat.` : `• ${lokasi} sudah ada, tidak ditimpa.`);
    script.scenes.forEach((scene, i) => {
      if (scene.type !== 'beat') console.log(`\nscene ${i + 1}: ${scene.narasi ?? '(tanpa narasi)'}`);
    });
    console.log('\nLangkah berikutnya: baca .claude/skills/video-3d/referensi/katalog.md lalu isi file itu.');
  } catch (e) {
    console.error(`✗ ${e.message}`);
    process.exit(1);
  }
}
