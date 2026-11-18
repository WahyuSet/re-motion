import test from 'node:test';
import assert from 'node:assert/strict';
import {cek3dKonteks} from '../../scripts/3d/cek.mjs';
import {cekPasang} from '../../scripts/3d/lib/aturan/pasang.mjs';
import {ktxUji, jalankan} from './bantu.mjs';

const KLIP = 'klip/uji/scene-03.mp4';
const siap = async (ubah) =>
  ktxUji((k) => {
    k.script.scenes[2].latarVideo = KLIP;
    k.data.gambar = [{nama: 'gbr', set: 'uji', kamera: 'p'}];
    k.lock = {versi: 1, klip: {3: 'hash-klip'}, gambar: {gbr: 'hash-gambar'}};
    ubah?.(k);
    return k;
  });

const alatBaik = (t = {}) => ({
  ada: () => true,
  durasiDetik: () => 6,
  hash: (r) => (r.transparan ? 'hash-gambar' : 'hash-klip'),
  ...t,
});

const cek = async (ubah, alat) => {
  const ktx = await siap(ubah);
  return jalankan((lapor) => cekPasang(ktx, ktx.data.klip, ktx.data.gambar, lapor, alatBaik(alat)));
};
const ada = (hasil, ...isi) => hasil.errors.some((e) => isi.every((t) => e.includes(t)));

test('klip yang terpasang dan segar lolos', async () => {
  assert.deepEqual((await cek()).errors, []);
});

test('P1 naskah belum memakai klip', async () => {
  assert.ok(ada(await cek((k) => { delete k.script.scenes[2].latarVideo; }), 'P1', KLIP));
  assert.ok(ada(await cek((k) => { k.script.scenes[2].latarVideo = 'klip/uji/lain.mp4'; }), 'P1', KLIP));
});

test('P2 file klip tidak ada', async () => {
  assert.ok(ada(await cek(null, {ada: (f) => !f.endsWith('.mp4')}), 'P2'));
});

test('P2 klip lebih pendek dari scene', async () => {
  assert.ok(ada(await cek(null, {durasiDetik: () => 5}), 'P2'));
});

test('P3 klip basi', async () => {
  assert.ok(ada(await cek(null, {hash: () => 'lain'}), 'P3', '3d:render'));
});

test('P3 scene belum tercatat', async () => {
  assert.ok(ada(await cek((k) => { k.lock.klip = {}; }), 'P3', '3d:render'));
});

test('P4 gambar tidak ada', async () => {
  assert.ok(ada(await cek(null, {ada: (f) => !f.endsWith('.png')}), 'P4', 'gbr'));
});

test('aturan P tidak berjalan sebelum render pertama', async () => {
  const ktx = await siap((k) => { k.lock = null; delete k.script.scenes[2].latarVideo; });
  assert.deepEqual((await cek3dKonteks(ktx)).errors, []);
});
