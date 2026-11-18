import test from 'node:test';
import assert from 'node:assert/strict';
import {cariKata, durasiScene, kataScene, muatModulWaktu} from '../../scripts/3d/lib/waktu.mjs';
import {kataUji, naskahUji} from './bantu.mjs';

const modul = await muatModulWaktu();
const naskah = naskahUji();
const kataJson = kataUji();
const kata = kataScene(naskah, kataJson, 2, modul);

test('durasi scene terakhir mengikuti rumus engine', () => {
  assert.equal(durasiScene(naskah, kataJson, 2, modul), 164); // 8 + 120 + 6 + 30
});

test('durasi scene memuat tahan dan transisi scene berikutnya', () => {
  const dasar = durasiScene(naskah, kataJson, 0, modul);
  assert.equal(dasar, 8 + 60 + 6);
  const ubah = naskahUji();
  ubah.scenes[0].tahan = 10;
  assert.equal(durasiScene(ubah, kataJson, 0, modul), dasar + 10);
  const transisi = naskahUji();
  transisi.scenes[1].transition = 'fade';
  assert.equal(durasiScene(transisi, kataJson, 0, modul), dasar + 18);
});

test('scene tanpa narasi memakai duration naskah', () => {
  const s = {scenes: [{type: 'stage', duration: 77}, {type: 'stage', duration: 5}]};
  assert.equal(durasiScene(s, {}, 0, modul), 77);
});

test('scene bernarasi tanpa kata tidak punya durasi', () => {
  assert.equal(durasiScene({scenes: [{type: 'stage', narasi: 'a'}]}, {}, 0, modul), null);
});

test('cariKata mengabaikan huruf besar, bintang, dan tanda baca', () => {
  assert.deepEqual(cariKata(kata, 'maling', 1, modul), {idx: 2, frame: 38, jumlah: 2});
  assert.deepEqual(cariKata(kata, 'MALING', 2, modul), {idx: 4, frame: 68, jumlah: 2});
  assert.equal(cariKata(kata, 'nyangkut', 1, modul).frame, 83);
});

test('cariKata menerima frasa dua kata', () => {
  assert.equal(cariKata(kata, 'datang. maling', 1, modul).idx, 3);
});

test('cariKata melapor kemunculan yang tidak ada', () => {
  assert.equal(cariKata(kata, 'maling', 3, modul).idx, -1);
  assert.deepEqual(cariKata(kata, 'zebra', 1, modul), {idx: -1, frame: null, jumlah: 0});
});
