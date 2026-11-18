import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';

const {nomorBab, tampilBanner} = await importTs('src/explainer/bab.ts');

test('nomorBab menghitung scene ber-bab sampai index itu', () => {
  const scenes = [{bab: 'A'}, {}, {bab: 'B'}, {bab: 'C'}];
  assert.equal(nomorBab(scenes, 2), 2);
  assert.equal(nomorBab(scenes, 3), 3);
  assert.equal(nomorBab(scenes, 1), null);
});

test('nomorBab tetap urut kalau scene 1 tanpa bab', () => {
  assert.equal(nomorBab([{}, {bab: 'A'}, {bab: 'B'}], 2), 2);
});

test('banner bab tidak tampil di scene 1', () => {
  assert.equal(tampilBanner(0, {bab: 'Pembuka'}), false);
  assert.equal(tampilBanner(3, {bab: 'X'}), true);
  assert.equal(tampilBanner(3, {}), false);
});

test('bab spasi-saja diabaikan dan banner tidak tampil di format short', () => {
  assert.equal(nomorBab([{bab: '   '}, {bab: 'Isi'}], 0), null);
  assert.equal(nomorBab([{bab: '   '}, {bab: 'Isi'}], 1), 1);
  assert.equal(tampilBanner(2, {bab: '   '}), false);
  assert.equal(tampilBanner(2, {bab: 'Isi'}, 'short'), false);
  assert.equal(tampilBanner(2, {bab: 'Isi'}, 'landscape'), true);
});
