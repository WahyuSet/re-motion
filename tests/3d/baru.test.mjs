import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buatKerangka, kerangka} from '../../scripts/3d/baru.mjs';
import {naskahUji} from './bantu.mjs';

const folder = () => fs.mkdtempSync(path.join(os.tmpdir(), 'baru-3d-'));

test('kerangka berisi satu entri kosong per scene non-beat', () => {
  assert.deepEqual(kerangka('x', naskahUji()), {
    slug: 'x',
    klip: [1, 3].map((scene) => ({scene, set: '', kamera: '', isi: {}, gerak: []})),
    gambar: [],
  });
});

test('buatKerangka tidak menimpa file yang sudah ada', () => {
  const dir = folder();
  const pertama = buatKerangka('x', {dir, script: naskahUji()});
  assert.equal(pertama.dibuat, true);
  fs.writeFileSync(pertama.file, 'punya model');
  assert.equal(buatKerangka('x', {dir, script: naskahUji()}).dibuat, false);
  assert.equal(fs.readFileSync(pertama.file, 'utf8'), 'punya model');
});

test('naskah landscape ditolak', () => {
  assert.throws(() => buatKerangka('x', {dir: folder(), script: {...naskahUji(), format: 'landscape'}}), /short/);
});

test('slug yang keluar folder ditolak', () => {
  assert.throws(() => buatKerangka('../x', {dir: folder(), script: naskahUji()}), /slug/);
});
