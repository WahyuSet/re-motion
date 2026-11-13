import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';
import {kotakItem} from '../../scripts/lib/explainer-cek/kotak.mjs';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

const OPTS = {props: [], rencana: null};
const beat = {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.', items: [{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 54}]};
const naskah = (extra, items) => ({
  format: 'short',
  ...extra,
  scenes: [{type: 'stage', duration: 90, latar: 'latar/gandum-tropis-1.png', narasi: 'Botol plastik itu rapuh.', items}, beat],
});
const ada = (pesan, kode) => pesan.some((m) => m.includes(` ${kode} `));

test('miringStiker: deterministik, 3-5 derajat, dan arahnya bervariasi', async () => {
  const {miringStiker} = await importTs('src/explainer/stiker.ts');
  const teks = ['EXP?!', 'DITILANG!', 'Asli gak nih?', 'ANTIMONI', 'MUTU', 'BASI', '60°C', 'CUKA'];
  const sudut = teks.map(miringStiker);
  assert.deepEqual(sudut, teks.map(miringStiker));
  for (const s of sudut) assert.ok(Math.abs(s) >= 3 && Math.abs(s) <= 5, `sudut ${s}`);
  assert.ok(sudut.some((s) => s > 0) && sudut.some((s) => s < 0), sudut.join(', '));
});

test('kotakItem teks gaya stiker lebih lebar dan tinggi dari gaya kotak', () => {
  const item = {kind: 'teks', teks: 'DITILANG!', ukuran: 40, kotak: '#e53935', x: 50, y: 50};
  const biasa = kotakItem(item, null);
  const stiker = kotakItem(item, null, 'stiker');
  assert.ok(stiker.kanan - stiker.kiri > biasa.kanan - biasa.kiri);
  assert.ok(stiker.bawah - stiker.atas > biasa.bawah - biasa.atas);
});

test('S1: gayaTeks tidak dikenal ditolak, stiker diterima', async () => {
  const items = [{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 50, width: 260, delay: 0}];
  const salah = await validasiExplainer(naskah({gayaTeks: 'neon'}, items), 'uji-stiker', OPTS);
  assert.ok(ada(salah.errors, 'S1'), salah.errors.join(' | '));
  const benar = await validasiExplainer(naskah({gayaTeks: 'stiker'}, items), 'uji-stiker', OPTS);
  assert.ok(!ada(benar.errors, 'S1'), benar.errors.join(' | '));
});

test('A1: teks stiker lebar di tepi kanan kena, padahal gaya kotak lolos', async () => {
  // 'Jauh dari panas & bau' ukuran 30: gaya kotak ±401 px, gaya stiker lebih lebar
  const items = [
    {kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 30, y: 50, width: 200, delay: 0},
    {kind: 'teks', teks: 'Jauh dari panas & bau', ukuran: 30, kotak: '#1e88e5', x: 67, y: 40, delay: 0},
  ];
  const biasa = await validasiExplainer(naskah({}, items), 'uji-stiker', OPTS);
  assert.ok(!ada(biasa.warnings, 'A1'), biasa.warnings.join(' | '));
  const stiker = await validasiExplainer(naskah({gayaTeks: 'stiker'}, items), 'uji-stiker', OPTS);
  assert.ok(ada(stiker.warnings, 'A1'), stiker.warnings.join(' | '));
});
