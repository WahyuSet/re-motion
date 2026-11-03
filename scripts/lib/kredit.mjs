// Kredit foto yang benar-benar dipakai naskah (dipakai kredit.mjs & paket-youtube.mjs).
// Foto boleh berasal dari folder video lain (short turunan memakai foto video panjangnya).

import fs from 'node:fs/promises';
import path from 'node:path';

/** Semua path foto yang tampil: shot, satu-foto scene, grid `ulang`, dan foto thumbnail */
export const fotoDipakai = (script) => {
  const used = new Set();
  for (const scene of script.scenes) {
    for (const shot of scene.shots ?? []) used.add(shot.photo);
    if (scene.photo) used.add(scene.photo);
    if (scene.ulang?.photo) used.add(scene.ulang.photo);
  }
  if (script.thumbnail?.photo) used.add(script.thumbnail.photo);
  return [...used].filter(Boolean).sort();
};

/** Ada props hasil generate AI di naskah? */
export const adaProps = (script) => script.scenes.some((s) => s.props?.length);

/**
 * Daftar kredit: {entries: [{title, author, license, sourceUrl}], missing: [path foto tanpa data], baris: [teks siap tempel]}
 */
export const kreditFoto = async (script) => {
  const cache = new Map();
  const creditsOf = async (folder) => {
    if (!cache.has(folder)) {
      const file = path.resolve('public', folder, 'credits.json');
      cache.set(folder, JSON.parse(await fs.readFile(file, 'utf8').catch(() => '{}')));
    }
    return cache.get(folder);
  };

  const entries = [];
  const missing = [];
  for (const photo of fotoDipakai(script)) {
    const c = (await creditsOf(path.posix.dirname(photo)))[path.posix.basename(photo)];
    if (c) entries.push(c);
    else missing.push(photo);
  }

  const baris = ['Sumber foto:', ...entries.map((c) => `- ${c.title} oleh ${c.author} (${c.license}) ${c.sourceUrl}`)];
  if (adaProps(script)) baris.push('', 'Ilustrasi props dibuat dengan AI.');
  return {entries, missing, baris};
};
