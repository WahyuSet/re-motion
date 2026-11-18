// Uji asap: setiap kamera dan setiap gerak katalog benar-benar bisa dirender Blender.
// Lembar kontak ditulis ke out/3d/_asap untuk diperiksa mata.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {cariBlender, jalankanBlender} from '../../scripts/3d/lib/blender.mjs';
import {muatKatalog} from '../../scripts/3d/lib/katalog.mjs';
import {KANVAS} from '../../scripts/3d/lib/rencana.mjs';
import {lembarUjiAsli} from '../../scripts/3d/render.mjs';

const JEDA = 18;
const LAMA = 15;
const DIR = 'out/3d/_asap';

const kombinasiIsi = (set) =>
  Object.entries(set.isi).reduce(
    (hasil, [kunci, def]) => hasil.flatMap((isi) => def.pilihan.map((nilai) => ({...isi, [kunci]: nilai}))),
    [{}],
  );
const bawaan = (set) => Object.fromEntries(Object.entries(set.isi).map(([k, d]) => [k, d.bawaan]));
const memenuhi = (def, isi) => Object.entries(def.syarat_isi ?? {}).every(([k, boleh]) => boleh.includes(isi[k]));
const rantai = (set, jenis) => [...(set.gerak[jenis].butuh ?? []).flatMap((b) => rantai(set, b)), jenis];

const buat = (namaSet, set, namaKamera, isi, jenis) => {
  const {dari, ke, lihat, lensa} = set.kamera[namaKamera];
  return {
    label: `${namaSet}-${namaKamera}-${Object.values(isi).join('-') || 'polos'}-${jenis.length}`,
    zona: set.kamera[namaKamera].zona_subjek,
    rencana: {
      set: namaSet,
      file: set.file,
      ...KANVAS,
      frame_akhir: Math.max(61, 20 + jenis.length * JEDA + LAMA),
      transparan: false,
      langit: set.langit,
      kamera: {dari, ke, lihat, lensa},
      isi,
      gerak: jenis.map((j, i) => ({jenis: j, mulai: 5 + i * JEDA, selesai: 5 + i * JEDA + LAMA, terus: Boolean(set.gerak[j].terus)})),
    },
  };
};

export const rencanaAsap = (katalog) =>
  Object.entries(katalog.set).flatMap(([namaSet, set]) => {
    const hasil = [];
    const tercakup = new Set();
    const kamera = Object.keys(set.kamera).filter((k) => !set.kamera[k].prop);
    for (const k of kamera) {
      const isi = bawaan(set);
      const jenis = Object.keys(set.gerak).filter((j) => rantai(set, j).every((r) => memenuhi(set.gerak[r], isi)));
      jenis.forEach((j) => tercakup.add(j));
      hasil.push(buat(namaSet, set, k, isi, jenis));
    }
    for (const j of Object.keys(set.gerak)) {
      if (tercakup.has(j)) continue;
      const urutan = [...new Set(rantai(set, j))];
      const isi = kombinasiIsi(set).find((c) => urutan.every((r) => memenuhi(set.gerak[r], c)));
      assert.ok(isi, `${namaSet}/${j} tidak punya isi yang memenuhi syarat`);
      urutan.forEach((r) => tercakup.add(r));
      hasil.push(buat(namaSet, set, kamera[0], isi, urutan));
    }
    return hasil;
  });

const katalog = muatKatalog();
const daftar = rencanaAsap(katalog);

test('file Python keempat set ada', () => {
  for (const set of Object.values(katalog.set)) assert.ok(fs.existsSync(`scripts/blender/set/${set.file}`), set.file);
});

test('rencana asap mencakup semua kamera dan gerak', () => {
  for (const [namaSet, set] of Object.entries(katalog.set)) {
    const milik = daftar.filter((d) => d.rencana.set === namaSet);
    const gerak = new Set(milik.flatMap((d) => d.rencana.gerak.map((g) => g.jenis)));
    assert.deepEqual([...gerak].sort(), Object.keys(set.gerak).sort(), namaSet);
    const kamera = new Set(milik.map((d) => JSON.stringify(d.rencana.kamera)));
    assert.equal(kamera.size, Object.values(set.kamera).filter((k) => !k.prop).length, namaSet);
  }
});

const render = (label, rencana, uji) => {
  const rencanaFile = path.join(DIR, `${label}.json`);
  const folderFrame = path.join(DIR, label);
  fs.mkdirSync(DIR, {recursive: true});
  fs.rmSync(folderFrame, {recursive: true, force: true});
  fs.writeFileSync(rencanaFile, JSON.stringify(rencana));
  return {folderFrame, ...jalankanBlender({blender: cariBlender(), rencanaFile, folderFrame, uji})};
};

for (const {label, zona, rencana} of daftar) {
  test(`Blender merender ${label}`, {timeout: 240000}, async (t) => {
    if (!cariBlender()) return t.skip('Blender tidak ditemukan');
    const {status, ekor, folderFrame} = render(label, rencana, true);
    assert.equal(status, 0, ekor);
    const frame = fs.readdirSync(folderFrame).filter((f) => f.endsWith('.png')).sort();
    assert.ok(frame.length > 0);
    const {channels} = await sharp(path.join(folderFrame, frame[0])).stats();
    assert.ok(channels.some((c) => c.stdev > 1), 'frame polos');
    await lembarUjiAsli(folderFrame, path.join(DIR, `${label}.jpg`), zona);
  });
}

test('kamera prop menghasilkan gambar berlatar transparan', {timeout: 240000}, async (t) => {
  if (!cariBlender()) return t.skip('Blender tidak ditemukan');
  const set = katalog.set['rumah-luar'];
  const {dari, ke, lihat, lensa} = set.kamera['prop-jendela'];
  const rencana = {
    set: 'rumah-luar',
    file: set.file,
    ...KANVAS,
    frame_akhir: 1,
    transparan: true,
    langit: set.langit,
    kamera: {dari, ke, lihat, lensa},
    isi: {jendela: 'kebalik', awal: 'terbuka'},
    gerak: [],
  };
  const {status, ekor, folderFrame} = render('prop-jendela', rencana, false);
  assert.equal(status, 0, ekor);
  const {data, info} = await sharp(path.join(folderFrame, '00000.png')).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  assert.equal(data[info.channels - 1], 0);
  assert.ok(data.some((nilai, i) => i % info.channels === info.channels - 1 && nilai === 255), 'benda harus terlihat');
});
