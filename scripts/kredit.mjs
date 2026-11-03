// Buat daftar kredit foto & musik untuk deskripsi YouTube, hanya yang benar-benar dipakai di naskah.
// Foto/musik boleh berasal dari folder video lain (short turunan memakai aset video panjangnya).
// Paket upload lengkap (thumbnail, chapter, subtitle): node scripts/paket-youtube.mjs <slug>
//
// Pakai: node scripts/kredit.mjs borobudur   -> out/borobudur-kredit.txt

import fs from 'node:fs/promises';
import path from 'node:path';
import {kreditFoto} from './lib/kredit.mjs';
import {loadScript} from './lib/load-script.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('Pakai: node scripts/kredit.mjs <slug>');
  process.exit(1);
}

const script = await loadScript(slug);
const {entries, musik, missing, baris} = await kreditFoto(script);

await fs.mkdir('out', {recursive: true});
await fs.writeFile(path.join('out', `${slug}-kredit.txt`), baris.join('\n'));
console.log(baris.join('\n'));
console.log(`\nTersimpan di out/${slug}-kredit.txt (${entries.length} foto${musik ? ', 1 musik' : ''})`);
if (missing.length) {
  console.log(`⚠ ${missing.length} aset tanpa data kredit (bukan dari cari-foto/cari-musik?): ${missing.join(', ')}`);
}
