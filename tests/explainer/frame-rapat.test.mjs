import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';
import {frameRapat} from '../../scripts/lib/frame-rapat.mjs';

const {waktuItem} = await importTs('src/explainer/timing.ts');
const words = [
  {word: 'Botol', start: 10, end: 20},
  {word: 'plastik', start: 20, end: 30},
  {word: 'itu', start: 30, end: 40},
  {word: 'rapuh.', start: 40, end: 50},
];

test('frameRapat mengambil frame tiap masuk dan keluar item, plus 35% dan 85%', () => {
  const scene = {
    duration: 100,
    items: [
      {x: 50, y: 50, delay: 0, sampai: 'itu'},
      {x: 50, y: 50, di: 'itu'},
    ],
  };
  const f = frameRapat(scene, words, waktuItem);
  assert.deepEqual(f, [6, 34, 36, 85]);
});

test('frameRapat membuang frame yang terlalu berdekatan dan tetap di dalam scene', () => {
  const scene = {duration: 40, items: [{x: 50, y: 50, di: 'rapuh.'}]};
  const f = frameRapat(scene, words, waktuItem);
  assert.ok(f.every((x) => x >= 0 && x < 40), String(f));
  for (let i = 1; i < f.length; i++) assert.ok(f[i] - f[i - 1] >= 2, String(f));
});
