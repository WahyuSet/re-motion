import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';
import {bacaTabelHook} from '../../scripts/lib/explainer-cek/hook.mjs';

const beat = {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.'};
const naskah = (hook, thumbnail) => ({
  format: 'short',
  thumbnail,
  scenes: [
    {type: 'hook', duration: 100, latar: 'latar/gandum-tropis-1.png', baris1: 'AIR GAK BASI', baris2: 'KOK ADA KADALUWARSA?', narasi: 'Air putih gak pernah basi, kok botolnya ada kadaluwarsa?', ...hook},
    beat,
  ],
});
const RENCANA_OK = [
  '# Rencana: Uji',
  '',
  '## Hook',
  '| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |',
  '|---|---|---|---|---|---|---|---|---|---|---|',
  '| 1 | kontras-angka | a | b | c | 2 | 2 | 2 | 1 | 2 | 9 |',
  '| 2 | bocoran | a | b | c | 1 | 1 | 1 | 1 | 1 | 5 |',
  '| 3 | salah-kaprah | a | b | c | 1 | 1 | 1 | 1 | 1 | 5 |',
  '| 4 | taruhan | a | b | c | 1 | 1 | 1 | 1 | 1 | 5 |',
  '| 5 | kok-kenapa | a | b | c | 1 | 1 | 1 | 1 | 2 | 6 |',
  '',
  'Terpilih: #1',
  '',
  '## Narasi',
  'isi',
].join('\n');
const cek = (script, rencana = RENCANA_OK, slug = 'uji-hook') => validasiExplainer(script, slug, {props: [], rencana});
const ada = (pesan, kode) => pesan.some((m) => m.includes(kode));

test('H1: hook 6 kata -> terlalu pendek; 16 kata -> terlalu panjang', async () => {
  const pendek = await cek(naskah({narasi: 'Air gak basi, kok kadaluwarsa sih?'}));
  assert.ok(ada(pendek.warnings, 'Hook narasi terlalu pendek'), pendek.warnings.join(' | '));
  const panjang = await cek(naskah({narasi: 'Air putih gak pernah basi sama sekali dari dulu, kok botol plastiknya malah ada tanggal kadaluwarsa?'}));
  assert.ok(ada(panjang.warnings, 'Hook narasi terlalu panjang'), panjang.warnings.join(' | '));
});

test('H2: hook tanpa kata kontras jadi peringatan; "kok" lolos', async () => {
  const tanpa = await cek(naskah({narasi: 'Air putih di botol plastik punya tanggal kadaluwarsa sendiri.'}));
  assert.ok(ada(tanpa.warnings, 'H2'), tanpa.warnings.join(' | '));
  const dengan = await cek(naskah({}));
  assert.ok(!ada(dengan.warnings, 'H2'), dengan.warnings.join(' | '));
});

test('H4: baris2 tanpa ?, digit, atau kata kontras jadi peringatan', async () => {
  const buruk = await cek(naskah({baris2: 'ADA KADALUWARSA'}, {baris1: 'AIR GAK BASI', baris2: 'BOTOL PLASTIK'}));
  assert.equal(buruk.warnings.filter((w) => w.includes('H4')).length, 2, buruk.warnings.join(' | '));
  const angka = await cek(naskah({baris2: 'DI BOTOL CUMA 2 TAHUN'}));
  assert.ok(!ada(angka.warnings, 'H4'), angka.warnings.join(' | '));
});

test('H3 tetap berlaku untuk slug LEGACY', async () => {
  const {warnings} = await cek(naskah({baris1: 'BARIS SATU YANG SENGAJA DIBUAT TERLALU PANJANG'}), null, 'token-listrik');
  assert.ok(ada(warnings, 'H3'), warnings.join(' | '));
  assert.ok(!ada(warnings, 'R1'), warnings.join(' | '));
});

test('R1: rencana null atau berisi TODO jadi peringatan', async () => {
  const kosong = await cek(naskah({}), null);
  assert.ok(ada(kosong.warnings, 'R1'), kosong.warnings.join(' | '));
  const todo = await cek(naskah({}), RENCANA_OK + '\nTODO');
  assert.ok(ada(todo.warnings, 'R1'), todo.warnings.join(' | '));
  const bersih = await cek(naskah({}));
  assert.ok(!ada(bersih.warnings, 'R1') && !ada(bersih.warnings, 'R2'), bersih.warnings.join(' | '));
});

test('bacaTabelHook membaca 5 baris dan kolom Total', () => {
  assert.deepEqual(
    bacaTabelHook(RENCANA_OK),
    [
      {no: 1, total: 9},
      {no: 2, total: 5},
      {no: 3, total: 5},
      {no: 4, total: 5},
      {no: 5, total: 6},
    ],
  );
});

test('bacaTabelHook membaca file CRLF sama dengan LF', () => {
  assert.deepEqual(bacaTabelHook(RENCANA_OK.replace(/\n/g, '\r\n')), bacaTabelHook(RENCANA_OK));
});

test('R2: Terpilih menunjuk Total < 7 jadi peringatan', async () => {
  const {warnings} = await cek(naskah({}), RENCANA_OK.replace('Terpilih: #1', 'Terpilih: #2'));
  assert.ok(ada(warnings, 'R2'), warnings.join(' | '));
});

test('R2: kurang dari 5 kandidat jadi peringatan', async () => {
  const empat = RENCANA_OK.split('\n').filter((l) => !l.startsWith('| 5 ')).join('\n');
  const {warnings} = await cek(naskah({}), empat);
  assert.ok(ada(warnings, 'R2'), warnings.join(' | '));
});

test('H6: prop utama hook harus tampil penuh di frame 0', async () => {
  const utama = (u) => ({utama: {kind: 'prop', src: 'props/meme-kucing-paw.png', x: 34, y: 54, width: 300, ...u}});
  const tanpa = await cek(naskah({}));
  assert.ok(ada(tanpa.warnings, 'H6 hook belum punya utama'), tanpa.warnings.join(' | '));
  const drop = await cek(naskah(utama({masuk: 'drop', delay: 0})));
  assert.ok(ada(drop.warnings, "H6 prop utama hook belum tampil penuh di frame 0 (masuk 'drop')"), drop.warnings.join(' | '));
  const telat = await cek(naskah(utama({masuk: 'none', di: 'botolnya'})));
  assert.ok(ada(telat.warnings, "di 'botolnya'"), telat.warnings.join(' | '));
  const ok = await cek(naskah(utama({masuk: 'none', delay: 0})));
  assert.ok(!ada(ok.warnings, 'H6'), ok.warnings.join(' | '));
});
