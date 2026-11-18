import test from 'node:test';
import assert from 'node:assert/strict';
import {cek3dKonteks} from '../../scripts/3d/cek.mjs';
import {ktxUji} from './bantu.mjs';

const G1 = [{jenis: 'g1', di: 'maling'}];
const G1G2 = [...G1, {jenis: 'g2', di: 'nyangkut'}];
const teks = (t = {}) => ({kind: 'teks', teks: 'TENGAH', x: 50, y: 20, ukuran: 40, di: 'lalu', ...t});

const cek = async (items, gerak = G1) => {
  const ktx = await ktxUji((k) => {
    k.script.scenes[2].items = items;
    k.data.klip[0].gerak = gerak;
    return k;
  });
  return cek3dKonteks(ktx);
};
const jumlah = (hasil, kode) => hasil.warnings.filter((w) => w.includes(`${kode} `)).length;

test('Z1 teks menutupi subjek saat gerak berjalan', async () => {
  assert.equal(jumlah(await cek([teks({y: 45, di: 'maling'})]), 'Z1'), 1);
});

test('Z1 teks muncul setelah gerak selesai', async () => {
  assert.equal(jumlah(await cek([teks({y: 45})]), 'Z1'), 0);
});

test('Z1 gerak terus dihitung sampai akhir scene', async () => {
  assert.equal(jumlah(await cek([teks({y: 45})], G1G2), 'Z1'), 1);
});

test('Z1 memeriksa tujuan aksi move', async () => {
  const item = teks({di: 'pertama', aksi: [{type: 'move', di: 'maling', toY: 45}]});
  assert.equal(jumlah(await cek([item]), 'Z1'), 1);
});

test('Z1 teks di luar zona lolos', async () => {
  assert.equal(jumlah(await cek([teks({di: 'maling'})]), 'Z1'), 0);
});

test('Z1 item yang keluar sebelum gerak mulai lolos', async () => {
  assert.equal(jumlah(await cek([teks({y: 45, di: 'Alasan', sampai: 'pertama'})]), 'Z1'), 0);
});

test('S1 teks terlalu kecil', async () => {
  assert.equal(jumlah(await cek([teks({ukuran: 34})]), 'S1'), 1);
});

test('S1 satu celetukan miring boleh berukuran 32', async () => {
  assert.equal(jumlah(await cek([teks({ukuran: 32, rotate: -6})]), 'S1'), 0);
});

test('S1 celetukan kedua kena peringatan', async () => {
  assert.equal(jumlah(await cek([teks({ukuran: 32, rotate: -6}), teks({ukuran: 32, rotate: 6, y: 25})]), 'S1'), 1);
});

test('S1 teks 32 tanpa rotate kena peringatan', async () => {
  assert.equal(jumlah(await cek([teks({ukuran: 32})]), 'S1'), 1);
});

test('S2 simbol terlalu kecil', async () => {
  assert.equal(jumlah(await cek([{kind: 'simbol', simbol: 'panah', x: 50, y: 20, width: 110}]), 'S2'), 1);
});

test('S2 simbol tanpa width memakai ukuran bawaan', async () => {
  assert.equal(jumlah(await cek([{kind: 'simbol', simbol: 'panah', x: 50, y: 20}]), 'S2'), 0);
});

test('peringatan memberi langkah perbaikan', async () => {
  const {warnings} = await cek([teks({y: 45, di: 'maling', ukuran: 34})]);
  assert.ok(warnings.length >= 2);
  assert.ok(warnings.every((w) => w.includes('→ PERBAIKI:')));
});
