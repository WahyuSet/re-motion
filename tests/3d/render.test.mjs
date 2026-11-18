import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {cariBlender, jalankanBlender} from '../../scripts/3d/lib/blender.mjs';
import {jalankanRender} from '../../scripts/3d/render.mjs';
import {ktxUji} from './bantu.mjs';

const siapkan = async (t = {}) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'render-3d-'));
  fs.mkdirSync(path.join(root, 'src/explainer/data'), {recursive: true});
  const ktx = await ktxUji((k) => {
    k.data.klip = [
      {scene: 1, set: 'uji', kamera: 'k', isi: {mode: 'b'}, gerak: []},
      {scene: 3, set: 'uji', kamera: 'l', isi: {}, gerak: [{jenis: 'g1', di: 'maling'}]},
    ];
    k.data.gambar = [{nama: 'gbr', set: 'uji', kamera: 'p'}];
    return k;
  });
  const catatan = {render: [], salin: [], encode: [], potong: [], lembar: []};
  const alat = {
    root,
    konteks: async () => ktx,
    cek: async () => ({errors: []}),
    hash: (r) => `hash-${r.frame_akhir}-${r.transparan}`,
    render: (rencanaFile, folder, uji) => {
      catatan.render.push(path.basename(rencanaFile));
      const r = JSON.parse(fs.readFileSync(rencanaFile, 'utf8'));
      fs.mkdirSync(folder, {recursive: true});
      const langkah = uji ? 15 : 1;
      for (let f = 0; f < r.frame_akhir; f += langkah) fs.writeFileSync(path.join(folder, `${String(f).padStart(5, '0')}.png`), 'x');
      return {status: 0, ekor: ''};
    },
    encode: (folder, mp4) => {
      catatan.encode.push(path.basename(mp4));
      fs.writeFileSync(mp4, 'baru');
    },
    potongPng: (src, dst) => {
      catatan.potong.push(path.basename(dst));
      fs.mkdirSync(path.dirname(dst), {recursive: true});
      fs.writeFileSync(dst, 'png');
    },
    lembarUji: (folder, jpg, zona) => catatan.lembar.push([path.basename(jpg), zona]),
    salin: (src, dst) => {
      catatan.salin.push(path.basename(dst));
      fs.mkdirSync(path.dirname(dst), {recursive: true});
      fs.copyFileSync(src, dst);
    },
    ...t,
  };
  const lock = () => JSON.parse(fs.readFileSync(path.join(root, 'src/explainer/data/uji.3d.lock.json'), 'utf8'));
  return {root, alat, catatan, lock};
};

test('render penuh menyalin klip dan gambar lalu mencatat lock', async () => {
  const {root, alat, catatan, lock} = await siapkan();
  const hasil = await jalankanRender('uji', {}, alat);
  assert.deepEqual(hasil, {dirender: 3, dilewati: 0});
  assert.deepEqual(catatan.salin, ['scene-01.mp4', 'scene-03.mp4']);
  assert.deepEqual(catatan.potong, ['gbr.png']);
  assert.ok(fs.existsSync(path.join(root, 'public/klip/uji/scene-03.mp4')));
  assert.deepEqual(Object.keys(lock().klip), ['1', '3']);
  assert.ok(lock().gambar.gbr);
});

test('render terhenti: klip pertama tercatat, MP4 lama klip kedua utuh, lalu bisa dilanjutkan', async () => {
  const {root, alat, catatan, lock} = await siapkan();
  const lama = path.join(root, 'public/klip/uji/scene-03.mp4');
  fs.mkdirSync(path.dirname(lama), {recursive: true});
  fs.writeFileSync(lama, 'lama');
  const renderAsli = alat.render;
  alat.render = (file, ...sisa) =>
    file.endsWith('scene-03.json') ? {status: 1, ekor: 'Traceback gagal'} : renderAsli(file, ...sisa);
  await assert.rejects(jalankanRender('uji', {}, alat), (e) => {
    for (const t of ['scene-03', 'Traceback gagal', 'npm run 3d:render -- uji']) assert.ok(e.message.includes(t), t);
    return true;
  });
  assert.equal(fs.readFileSync(lama, 'utf8'), 'lama');
  assert.deepEqual(Object.keys(lock().klip), ['1']);

  alat.render = renderAsli;
  catatan.render.length = 0;
  const hasil = await jalankanRender('uji', {}, alat);
  assert.deepEqual(catatan.render, ['scene-03.json', 'gbr.json']);
  assert.deepEqual(hasil, {dirender: 2, dilewati: 1});
  assert.equal(fs.readFileSync(lama, 'utf8'), 'baru');
});

test('paksa merender ulang semua', async () => {
  const {alat} = await siapkan();
  await jalankanRender('uji', {}, alat);
  assert.deepEqual(await jalankanRender('uji', {paksa: true}, alat), {dirender: 3, dilewati: 0});
});

test('klip dirender ulang kalau filenya hilang walau lock cocok', async () => {
  const {root, alat} = await siapkan();
  await jalankanRender('uji', {}, alat);
  fs.rmSync(path.join(root, 'public/klip/uji/scene-01.mp4'));
  assert.deepEqual(await jalankanRender('uji', {}, alat), {dirender: 1, dilewati: 2});
});

test('uji hanya membuat lembar kontak', async () => {
  const {root, alat, catatan} = await siapkan();
  await jalankanRender('uji', {uji: true}, alat);
  assert.deepEqual(catatan.salin, []);
  assert.deepEqual(catatan.potong, []);
  assert.deepEqual(catatan.lembar, [['scene-01-uji.jpg', [20, 30, 80, 60]], ['scene-03-uji.jpg', [20, 30, 80, 60]]]);
  assert.ok(!fs.existsSync(path.join(root, 'src/explainer/data/uji.3d.lock.json')));
});

test('render ditolak kalau rencana masih error', async () => {
  const {alat, catatan} = await siapkan({cek: async (slug, opsi) => {
    assert.deepEqual(opsi, {pasang: false});
    return {errors: ['klip scene 1: C1 salah']};
  }});
  await assert.rejects(jalankanRender('uji', {}, alat), /C1 salah/);
  assert.deepEqual(catatan.render, []);
});

test('jumlah frame yang kurang dianggap gagal', async () => {
  const {alat, catatan} = await siapkan({
    render: (file, folder) => {
      fs.mkdirSync(folder, {recursive: true});
      fs.writeFileSync(path.join(folder, '00000.png'), 'x');
      return {status: 0, ekor: ''};
    },
  });
  await assert.rejects(jalankanRender('uji', {}, alat), /frame/);
  assert.deepEqual(catatan.encode, []);
});

test('cariBlender mengikuti urutan env, PATH, lalu Program Files', () => {
  const ada = () => true;
  assert.equal(cariBlender({env: {BLENDER: 'C:/b.exe'}, ada, where: () => 'C:/lain.exe'}), 'C:/b.exe');
  assert.equal(cariBlender({env: {}, ada, where: () => 'C:/lain.exe'}), 'C:/lain.exe');
  const dariProgram = cariBlender({env: {}, ada, where: () => null, daftarVersi: () => ['Blender 4.2', 'Blender 5.3']});
  assert.ok(dariProgram.includes('Blender 5.3') && dariProgram.endsWith('blender.exe'));
  assert.equal(cariBlender({env: {}, ada: () => false, where: () => null, daftarVersi: () => []}), null);
});

const rencanaRuang = (gerak) => ({
  set: 'ruang-primitif',
  file: 'ruang_primitif.py',
  fps: 30,
  lebar: 1080,
  tinggi: 1920,
  frame_akhir: 31,
  transparan: false,
  langit: '#F3EBDD',
  kamera: {dari: [2.6, -3.2, 2.4], ke: [2.0, -2.4, 2.1], lihat: [-0.6, 1.6, 0.9], lensa: 26},
  isi: {},
  gerak,
});

const blenderNyata = (nama, gerak, cekHasil) =>
  test(nama, {timeout: 180000}, (t) => {
    const blender = cariBlender();
    if (!blender) return t.skip('Blender tidak ditemukan');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blender-3d-'));
    const rencanaFile = path.join(dir, 'r.json');
    const folderFrame = path.join(dir, 'frame');
    fs.writeFileSync(rencanaFile, JSON.stringify(rencanaRuang(gerak)));
    cekHasil(jalankanBlender({blender, rencanaFile, folderFrame, uji: true}), folderFrame);
  });

blenderNyata(
  'Blender merender set ruang-primitif dari frame 0',
  [{jenis: 'bola-gelinding', mulai: 0, selesai: 15, terus: false}, {jenis: 'kardus-jatuh', mulai: 10, selesai: 25, terus: false}],
  (hasil, folder) => {
    assert.equal(hasil.status, 0, hasil.ekor);
    assert.ok(fs.existsSync(path.join(folder, '00000.png')));
  },
);

blenderNyata('error Python membuat Blender keluar dengan kode bukan 0', [{jenis: 'tidak-ada', mulai: 0, selesai: 5, terus: false}], (hasil) => {
  assert.notEqual(hasil.status, 0);
  assert.match(hasil.ekor, /tidak-ada/);
});
