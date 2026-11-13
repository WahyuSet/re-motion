import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';

test('potongFrasa splits TimedWord[] by max words, max chars, punctuation, and absorbs closing orphan word', async () => {
  const {potongFrasa} = await importTs('src/explainer/timing.ts');
  const words = [
    {word: 'Nah,', highlight: false, start: 8, end: 16},
    {word: 'kenapa', highlight: false, start: 18, end: 26},
    {word: 'isi', highlight: false, start: 27, end: 33},
    {word: 'token', highlight: true, start: 34, end: 42},
    {word: 'seratus', highlight: false, start: 43, end: 52},
    {word: 'ribu', highlight: false, start: 53, end: 60},
    {word: 'beda?', highlight: false, start: 61, end: 72},
    {word: 'Karena', highlight: false, start: 75, end: 82},
    {word: 'ada', highlight: false, start: 83, end: 88},
    {word: 'potongan', highlight: false, start: 89, end: 98},
    {word: 'pajak', highlight: false, start: 99, end: 106},
    {word: 'jalan', highlight: false, start: 107, end: 114},
    {word: 'daerah', highlight: false, start: 115, end: 122},
    {word: 'masing-masing.', highlight: false, start: 123, end: 135},
  ];
  const frasa = potongFrasa(words, 5, 34);
  assert.equal(frasa.length, 4);
  assert.equal(frasa[0].kata.map((w) => w.word).join(' '), 'Nah,');
  assert.equal(frasa[1].kata.map((w) => w.word).join(' '), 'kenapa isi token seratus ribu beda?');
  assert.equal(frasa[2].kata.map((w) => w.word).join(' '), 'Karena ada potongan pajak jalan');
  assert.equal(frasa[3].kata.map((w) => w.word).join(' '), 'daerah masing-masing.');
});

test('waktuItem resolves repeated trigger words sequentially (sampai after di, aksi in order)', async () => {
  const {waktuItem} = await importTs('src/explainer/timing.ts');
  const words = [
    {word: 'token', highlight: false, start: 10, end: 20},
    {word: 'pertama', highlight: false, start: 22, end: 32},
    {word: 'lalu', highlight: false, start: 35, end: 45},
    {word: 'token', highlight: false, start: 50, end: 60},
    {word: 'kedua', highlight: false, start: 65, end: 75},
  ];
  const resolved = waktuItem(
    {
      kind: 'prop',
      src: 'props/meteran.png',
      x: 50,
      y: 45,
      di: 'token',
      sampai: 'token',
      aksi: [{type: 'move', di: 'lalu', toX: 30, toY: 45}],
    },
    words,
    120,
  );
  assert.equal(resolved.masukAt, 10);
  assert.equal(resolved.aksi[0].at, 35);
  assert.equal(resolved.keluarAt, 50);
});

test('hitungTransformItem applies grow-up, move, peek, and dim deterministically', async () => {
  const {hitungTransformItem} = await importTs('src/explainer/timing.ts');
  const words = [
    {word: 'mulai', highlight: false, start: 10, end: 18},
    {word: 'geser', highlight: false, start: 30, end: 38},
    {word: 'redup', highlight: false, start: 60, end: 68},
  ];
  const item = {
    kind: 'prop',
    src: 'props/batang.png',
    x: 50,
    y: 50,
    di: 'mulai',
    masuk: 'grow-up',
    aksi: [
      {type: 'move', di: 'geser', toX: 70, toY: 40, durasi: 10},
      {type: 'dim', di: 'redup', toOpacity: 0.25, durasi: 10},
    ],
  };
  const before = hitungTransformItem(item, 5, 30, words, 100);
  assert.equal(before.visible, false);

  const afterMove = hitungTransformItem(item, 45, 30, words, 100);
  assert.equal(afterMove.visible, true);
  assert.equal(afterMove.x, 70);
  assert.equal(afterMove.y, 40);
  assert.equal(afterMove.opacity, 1);

  const afterDim = hitungTransformItem(item, 75, 30, words, 100);
  assert.ok(Math.abs(afterDim.opacity - 0.25) < 0.01);
});

test('hitungTransformItem applies default living idle motion on props and supports jump, wiggle, squash', async () => {
  const {hitungTransformItem} = await importTs('src/explainer/timing.ts');
  const words = [
    {word: 'loncat', highlight: false, start: 20, end: 28},
    {word: 'goyang', highlight: false, start: 50, end: 58},
    {word: 'penyet', highlight: false, start: 80, end: 88},
  ];
  const item = {
    kind: 'prop',
    src: 'props/kucing.png',
    x: 40,
    y: 50,
    delay: 0,
    aksi: [
      {type: 'jump', di: 'loncat', durasi: 16},
      {type: 'wiggle', di: 'goyang', durasi: 16},
      {type: 'squash', di: 'penyet', durasi: 16},
    ],
  };

  // Idle motion changes ty & rotate between frames even before any action triggers
  const idle1 = hitungTransformItem(item, 12, 30, words, 120);
  const idle2 = hitungTransformItem(item, 18, 30, words, 120);
  assert.notEqual(idle1.ty, idle2.ty);
  assert.notEqual(idle1.rotate, idle2.rotate);

  // Mid-jump lifts the prop upward (negative ty)
  const midJump = hitungTransformItem({...item, float: false}, 28, 30, words, 120);
  assert.ok(midJump.ty < -30);

  // Mid-squash widens scaleX and compresses scaleY with bottom origin
  const midSquash = hitungTransformItem({...item, float: false}, 88, 30, words, 120);
  assert.equal(midSquash.originY, 'bottom');
  assert.ok(midSquash.scaleX > 1.15);
  assert.ok(midSquash.scaleY < 0.85);
});

test('fitThumbFontSize keeps maxFont for short titles and scales down proportionally for 24-char titles', async () => {
  const {fitThumbFontSize} = await importTs('src/explainer/timing.ts');
  assert.equal(fitThumbFontSize('HP DISADAP', 80, 912), 80);
  const longSize = fitThumbFontSize('KENAPA BAHAN BAKU TEPUNG', 80, 912);
  assert.ok(longSize < 80 && longSize >= 52, `expected scaled font between 52 and 79, got ${longSize}`);
});


test('grow memakai toScale untuk X dan Y', async () => {
  const {hitungTransformItem} = await importTs('src/explainer/timing.ts');
  const item = {kind: 'prop', x: 50, y: 50, float: false, masuk: 'none', aksi: [{type: 'grow', delay: 0, toScale: 1.5, durasi: 10}]};
  const tf = hitungTransformItem(item, 40, 30, [], 100);
  assert.ok(Math.abs(tf.scaleX - 1.5) < 1e-6, `scaleX ${tf.scaleX}`);
  assert.ok(Math.abs(tf.scaleY - 1.5) < 1e-6, `scaleY ${tf.scaleY}`);
});

test('grow: toScaleX menang atas toScale', async () => {
  const {hitungTransformItem} = await importTs('src/explainer/timing.ts');
  const item = {kind: 'prop', x: 50, y: 50, float: false, masuk: 'none', aksi: [{type: 'grow', delay: 0, toScale: 1.5, toScaleX: 2, durasi: 10}]};
  const tf = hitungTransformItem(item, 40, 30, [], 100);
  assert.ok(Math.abs(tf.scaleX - 2) < 1e-6, `scaleX ${tf.scaleX}`);
  assert.ok(Math.abs(tf.scaleY - 1.5) < 1e-6, `scaleY ${tf.scaleY}`);
});

test('dim menerima alias to', async () => {
  const {hitungTransformItem} = await importTs('src/explainer/timing.ts');
  const item = {kind: 'prop', x: 50, y: 50, float: false, masuk: 'none', aksi: [{type: 'dim', delay: 0, to: 0.5, durasi: 10}]};
  const tf = hitungTransformItem(item, 40, 30, [], 100);
  assert.ok(Math.abs(tf.opacity - 0.5) < 1e-6, `opacity ${tf.opacity}`);
});
