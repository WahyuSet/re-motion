// Validator rencana klip 3D. Pakai: npm run cek:3d -- <slug>
// Selesai = 0 error dan 0 peringatan. Setiap pesan berbentuk `lokasi: KODE masalah → PERBAIKI: langkah`.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {cekHook} from './lib/aturan/hook.mjs';
import {cekKatalog} from './lib/aturan/katalog.mjs';
import {cekSkema} from './lib/aturan/skema.mjs';
import {muatKonteks} from './lib/rencana.mjs';

export const cek3dKonteks = async (ktx, {pasang = Boolean(ktx.lock)} = {}) => {
  const errors = [];
  const warnings = [];
  const format = (where, msg, fix) => `${where}: ${msg}${fix ? ` → PERBAIKI: ${fix}` : ''}`;
  const lapor = {
    err: (where, msg, fix) => errors.push(format(where, msg, fix)),
    warn: (where, msg, fix) => warnings.push(format(where, msg, fix)),
  };
  if (!cekSkema(ktx, lapor)) return {errors, warnings};
  const {klip} = cekKatalog(ktx, lapor);
  cekHook(ktx, klip, lapor);
  return {errors, warnings};
};

export const cek3d = async (slug, opsi) => cek3dKonteks(await muatKonteks(slug), opsi);

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Pakai: npm run cek:3d -- <slug>');
    process.exit(1);
  }
  const {errors, warnings} = await cek3d(slug);
  for (const e of errors) console.error(`  ✗ ${e}`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  if (errors.length) {
    console.error(`\n✗ GAGAL: ${errors.length} error, ${warnings.length} peringatan.`);
    process.exit(1);
  }
  if (warnings.length) {
    console.log(`\n⚠ BELUM SELESAI: ${slug} (0 error, ${warnings.length} peringatan). Kerjakan setiap PERBAIKI di atas.`);
  } else {
    console.log(`\n✓ LULUS: ${slug} (0 error, 0 peringatan).`);
  }
}
