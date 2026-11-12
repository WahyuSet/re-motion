import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';
import {formatPeta} from '../../scripts/lib/explainer-cek/peta.mjs';

const kata = await importTs('src/lib/kata.ts');

const script = {
  scenes: [
    {
      type: 'stage',
      narasi: 'Tanggal itu batas umur *botol plastiknya*. Lewat dari dua tahun, plastik rapuh.',
      items: [
        {
          kind: 'prop',
          src: 'props/air-botol-retak.png',
          x: 50,
          y: 50,
          masuk: 'drop',
          delay: 0,
          aksi: [{type: 'shake', di: 'plastiknya'}],
        },
      ],
    },
  ],
};

test('formatPeta menandai klausa kosong dengan ✗', () => {
  const baris = formatPeta(script, kata).split('\n');
  const idx = baris.findIndex((b) => b.includes('Lewat dari dua tahun,'));
  assert.ok(idx >= 0, baris.join('\n'));
  assert.ok(baris[idx + 1].includes('(kosong) ✗'), baris.join('\n'));
});

test('formatPeta menampilkan label prop dan aksi di klausa yang benar', () => {
  const baris = formatPeta(script, kata).split('\n');
  const idx = baris.findIndex((b) => b.includes('Tanggal itu batas umur'));
  assert.ok(baris[idx].includes('S1'), baris[idx]);
  assert.ok(baris[idx].includes('*botol plastiknya*.'), baris[idx]);
  assert.ok(baris[idx + 1].includes('air-botol-retak.png'), baris[idx + 1]);
  assert.ok(baris[idx + 1].includes('shake@plastiknya'), baris[idx + 1]);
});
