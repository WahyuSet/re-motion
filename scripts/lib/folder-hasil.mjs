// Lokasi hasil akhir per video: out/sejarah/<slug>/ atau out/explainer/<slug>/.
// Isinya MP4 (utama, 720p, preview), paket YouTube (youtube.txt, subtitle, thumbnail), dan kredit.
import fs from 'node:fs';
import path from 'node:path';

export const jenisVideo = (slug) =>
  fs.existsSync(path.join('src/explainer/data', `${slug}.ts`)) ? 'explainer' : 'sejarah';

export const folderHasil = (slug) => path.resolve('out', jenisVideo(slug), slug);

/** Path relatif untuk dicetak ke konsol, contoh "out/explainer/token-listrik". */
export const folderHasilRel = (slug) => `out/${jenisVideo(slug)}/${slug}`;

/** Isi youtube.txt: judul, deskripsi, dan tags dalam satu file. */
export const formatYoutubeTxt = ({judul, deskripsi, tags}) =>
  `=== JUDUL ===\n${judul}\n\n=== DESKRIPSI ===\n${deskripsi}\n\n=== TAGS ===\n${tags}\n`;
