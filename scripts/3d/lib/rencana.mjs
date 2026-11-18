// Gabungkan <slug>.3d.json, katalog, dan waktu kata menjadi rencana jadi. Hanya rencana jadi yang dibaca Python.
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {muatUkuran} from '../../lib/explainer-cek/kotak.mjs';
import {loadScript} from '../../lib/load-script.mjs';
import {isiLengkap, muatKatalog} from './katalog.mjs';
import {cariKata, durasiScene, kataScene, muatKataJson, muatModulWaktu} from './waktu.mjs';

export const KANVAS = {fps: 30, lebar: 1080, tinggi: 1920};
/** Frame tambahan di akhir klip, supaya klip tidak habis sebelum scene berganti. */
export const CADANGAN_FRAME = 15;

const DIR_DATA = 'src/explainer/data';
const DIR_BLENDER = 'scripts/blender';

export const namaKlip = (scene) => `scene-${String(scene).padStart(2, '0')}`;

export const fileData = (slug, dir = DIR_DATA) => ({
  json: path.join(dir, `${slug}.3d.json`),
  lock: path.join(dir, `${slug}.3d.lock.json`),
});

export const bacaLock = (slug, dir = DIR_DATA) => {
  const {lock} = fileData(slug, dir);
  return fs.existsSync(lock) ? JSON.parse(fs.readFileSync(lock, 'utf8')) : null;
};

export const tulisLock = (slug, lock, dir = DIR_DATA) => {
  const tujuan = fileData(slug, dir).lock;
  const sementara = `${tujuan}.tmp`;
  fs.writeFileSync(sementara, `${JSON.stringify(lock, null, 2)}\n`);
  fs.renameSync(sementara, tujuan);
};

export const muatKonteks = async (slug) => {
  const {json} = fileData(slug);
  const teks = fs.existsSync(json) ? fs.readFileSync(json, 'utf8') : null;
  let data = null;
  let galatParse = null;
  if (teks !== null) {
    try {
      data = JSON.parse(teks);
    } catch (e) {
      galatParse = e.message;
    }
  }
  const script = await loadScript(slug).catch(() => null);
  return {
    slug,
    teks,
    data,
    galatParse,
    katalog: muatKatalog(),
    script,
    kataJson: muatKataJson(script),
    modul: await muatModulWaktu(),
    lock: bacaLock(slug),
    ukuran: await muatUkuran(script),
  };
};

const dasarRencana = (ktx, entri) => {
  const set = ktx.katalog.set[entri.set];
  const {dari, ke, lihat, lensa} = set.kamera[entri.kamera];
  return {
    set: entri.set,
    file: set.file,
    fps: KANVAS.fps,
    lebar: KANVAS.lebar,
    tinggi: KANVAS.tinggi,
    langit: set.langit,
    kamera: {dari, ke, lihat, lensa},
    isi: isiLengkap(set, entri.isi),
  };
};

/** Frame mulai dan selesai satu gerak klip. */
export const waktuGerak = (ktx, entri, g) => {
  const def = ktx.katalog.set[entri.set].gerak[g.jenis];
  const kata = kataScene(ktx.script, ktx.kataJson, entri.scene - 1, ktx.modul, KANVAS.fps);
  const mulai = cariKata(kata, g.di, g.ke ?? 1, ktx.modul).frame;
  return {jenis: g.jenis, mulai, selesai: mulai + Math.round(def.detik * KANVAS.fps), terus: Boolean(def.terus)};
};

export const rencanaKlip = (ktx, entri) => {
  const dasar = dasarRencana(ktx, entri);
  const durasi = durasiScene(ktx.script, ktx.kataJson, entri.scene - 1, ktx.modul, KANVAS.fps);
  return {
    ...dasar,
    frame_akhir: durasi + CADANGAN_FRAME,
    transparan: false,
    gerak: (entri.gerak ?? []).map((g) => waktuGerak(ktx, entri, g)).sort((a, b) => a.mulai - b.mulai),
  };
};

export const rencanaGambar = (ktx, entri) => ({...dasarRencana(ktx, entri), frame_akhir: 1, transparan: true, gerak: []});

/** Sidik klip: rencana jadi ditambah Python yang merendernya. Akhir baris dinormalkan. */
export const hashRencana = (rencana, baca = fs.readFileSync) => {
  const hash = createHash('sha256').update(JSON.stringify(rencana));
  for (const file of ['utama.py', 'inti.py', path.join('set', rencana.file)]) {
    hash.update(String(baca(path.join(DIR_BLENDER, file), 'utf8')).replaceAll('\r\n', '\n'));
  }
  return hash.digest('hex');
};
