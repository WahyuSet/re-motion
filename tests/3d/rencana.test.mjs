import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {bacaLock, CADANGAN_FRAME, hashRencana, KANVAS, namaKlip, rencanaGambar, rencanaKlip, tulisLock} from '../../scripts/3d/lib/rencana.mjs';
import {ktxUji} from './bantu.mjs';

const ktx = await ktxUji();
const entri = {scene: 3, set: 'uji', kamera: 'l', gerak: [{jenis: 'g2', di: 'nyangkut'}, {jenis: 'g1', di: 'maling'}]};

test('rencana klip menghitung frame dari kata pemicu dan mengurutkan gerak', () => {
  const r = rencanaKlip(ktx, entri);
  assert.equal(CADANGAN_FRAME, 15);
  assert.equal(r.frame_akhir, 179);
  assert.deepEqual([r.fps, r.lebar, r.tinggi], [KANVAS.fps, KANVAS.lebar, KANVAS.tinggi]);
  assert.deepEqual(r.isi, {mode: 'a'});
  assert.deepEqual(r.gerak, [
    {jenis: 'g1', mulai: 38, selesai: 68, terus: false},
    {jenis: 'g2', mulai: 83, selesai: 113, terus: true},
  ]);
  assert.equal(r.transparan, false);
  assert.equal(r.file, 'uji.py');
  assert.equal(r.langit, '#FFFFFF');
});

test('kamera rencana hanya membawa data untuk Blender', () => {
  assert.deepEqual(Object.keys(rencanaKlip(ktx, entri).kamera).sort(), ['dari', 'ke', 'lensa', 'lihat']);
});

test('rencana gambar satu frame dan transparan', () => {
  const g = rencanaGambar(ktx, {nama: 'x', set: 'uji', kamera: 'p'});
  assert.equal(g.transparan, true);
  assert.equal(g.frame_akhir, 1);
  assert.deepEqual(g.gerak, []);
});

const sumber = (ubah = {}) => (file) => ubah[path.basename(String(file))] ?? `isi ${path.basename(String(file))}\n`;

test('hash stabil dan berubah kalau rencana berubah', () => {
  const r = rencanaKlip(ktx, entri);
  assert.equal(hashRencana(r, sumber()), hashRencana(r, sumber()));
  assert.notEqual(hashRencana(r, sumber()), hashRencana({...r, frame_akhir: 180}, sumber()));
});

test('hash berubah kalau Python berubah, tapi tidak karena akhir baris', () => {
  const r = rencanaKlip(ktx, entri);
  const dasar = hashRencana(r, sumber());
  for (const file of ['inti.py', 'utama.py', 'uji.py']) {
    assert.notEqual(hashRencana(r, sumber({[file]: 'lain\n'})), dasar, file);
  }
  const lf = sumber({'inti.py': 'a\nb\n'});
  const crlf = sumber({'inti.py': 'a\r\nb\r\n'});
  assert.equal(hashRencana(r, lf), hashRencana(r, crlf));
});

test('namaKlip memakai dua digit', () => {
  assert.equal(namaKlip(4), 'scene-04');
  assert.equal(namaKlip(12), 'scene-12');
});

test('lock ditulis utuh dan terbaca lagi', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lock-3d-'));
  const lock = {versi: 1, klip: {4: 'abc'}, gambar: {x: 'def'}};
  assert.equal(bacaLock('uji', dir), null);
  tulisLock('uji', lock, dir);
  assert.deepEqual(bacaLock('uji', dir), {versi: 1, klip: {4: 'abc'}, gambar: {x: 'def'}});
  assert.deepEqual(fs.readdirSync(dir), ['uji.3d.lock.json']);
});
