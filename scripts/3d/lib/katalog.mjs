// Menu resmi klip 3D: set, kamera, isi, dan gerak yang boleh dipilih di <slug>.3d.json.
import fs from 'node:fs';

export const FILE_KATALOG = 'scripts/blender/katalog.json';

export const muatKatalog = (file = FILE_KATALOG) => JSON.parse(fs.readFileSync(file, 'utf8'));

/** `isi` klip dengan nilai yang tidak ditulis diisi `bawaan` dari katalog. */
export const isiLengkap = (setDef, isi = {}) =>
  Object.fromEntries(Object.entries(setDef.isi).map(([kunci, def]) => [kunci, isi[kunci] ?? def.bawaan]));
