import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';

test('hitungBebanBata splits 100kg into Pascal triangle on zigzag vs straight columns on sejajar, and handles 1x1 edge case', async () => {
  const {hitungBebanBata} = await importTs('src/explainer/diagram.ts');

  const zigzag = hitungBebanBata('zigzag', 4, 5, 100);
  assert.equal(zigzag.length, 4);
  const r0 = zigzag[0].filter((b) => b.aktif).map((b) => b.beban);
  const r1 = zigzag[1].filter((b) => b.aktif).map((b) => b.beban);
  const r2 = zigzag[2].filter((b) => b.aktif).map((b) => b.beban);
  const r3 = zigzag[3].filter((b) => b.aktif).map((b) => b.beban);
  assert.deepEqual(r0, [100]);
  assert.deepEqual(r1, [50, 50]);
  assert.deepEqual(r2, [25, 50, 25]);
  assert.deepEqual(r3, [12.5, 37.5, 37.5, 12.5]);

  const sejajar = hitungBebanBata('sejajar', 4, 5, 100);
  for (const row of sejajar) {
    const aktif = row.filter((b) => b.aktif).map((b) => b.beban);
    assert.deepEqual(aktif, [50, 50]);
  }

  const single = hitungBebanBata('zigzag', 1, 1, 100);
  assert.equal(single[0][0].beban, 100);
  assert.ok(Number.isFinite(single[0][0].xOffset));
});

test('hitungPotongan resolves step trigger frames and handles empty langkah array without NaN', async () => {
  const {hitungPotongan} = await importTs('src/explainer/diagram.ts');
  const words = [
    {word: 'admin', highlight: false, start: 15, end: 22},
    {word: 'pajak', highlight: false, start: 40, end: 48},
  ];
  const steps = hitungPotongan(
    'Rp100.000',
    [
      {label: 'Biaya Admin', potong: '-Rp2.500', sisa: 'Rp97.500', di: 'admin'},
      {label: 'PPJ Daerah 10%', potong: '-Rp8.863', sisa: 'Rp88.637', di: 'pajak'},
    ],
    words,
  );
  assert.equal(steps.length, 2);
  assert.equal(steps[0].at, 15);
  assert.equal(steps[1].at, 40);
  assert.ok(steps[1].porsi < steps[0].porsi && steps[1].porsi > 0);

  const empty = hitungPotongan('Rp100.000', [], words);
  assert.deepEqual(empty, []);
});
