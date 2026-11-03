// Kredit foto & musik yang benar-benar dipakai naskah (dipakai kredit.mjs & paket-youtube.mjs).
// Foto/musik boleh berasal dari folder video lain (short turunan memakai aset video panjangnya).

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
* Daftar kredit: {entries: [{title, author, license, sourceUrl}], musik: {...}|null, missing: [path tanpa data], baris: [teks siap tempel]}
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

  let musik = null;
  if (script.music) {
    const c = (await creditsOf(path.posix.dirname(script.music)))[path.posix.basename(script.music)];
    if (c) musik = c;
    else missing.push(script.music);
  }

  const baris = ['Sumber foto:', ...entries.map((c) => `- ${c.title} oleh ${c.author} (${c.license}) ${c.sourceUrl}`)];
  if (musik) {
    baris.push('', 'Musik latar:', `- ${musik.title} oleh ${musik.author} (${musik.license}) ${musik.sourceUrl}`);
  }
  if (adaProps(script)) baris.push('', 'Ilustrasi props dibuat dengan AI.');
  return {entries, musik, missing, baris};
};
