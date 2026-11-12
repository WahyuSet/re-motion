import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';
import {kejadianScene, pecahKlausa} from '../../scripts/lib/explainer-cek/visual.mjs';

const kata = await importTs('src/lib/kata.ts');
const OPTS = {props: [], rencana: null};

const beat = {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.'};
const penutup = {
  type: 'stage',
  duration: 60,
  latar: 'latar/gandum-tropis-2.png',
  narasi: 'Penjelasan selesai.',
  items: [{kind: 'teks', teks: 'OK', x: 50, y: 40, delay: 0}],
};
const naskah = (scene) => ({format: 'short', scenes: [{latar: 'latar/gandum-tropis-1.png', duration: 90, ...scene}, beat, penutup]});
const teks = (extra) => ({kind: 'teks', teks: 'OK', x: 50, y: 40, ...extra});

test('pecahKlausa memotong di tanda baca', () => {
  const words = kata.parseWords('Air putih gak basi, kok ada kadaluwarsa?');
  assert.deepEqual(pecahKlausa(words), [
    {mulai: 0, akhir: 3},
    {mulai: 4, akhir: 6},
  ]);
});

test('V1: klausa tanpa kejadian visual jadi error', async () => {
  const {errors} = await validasiExplainer(
    naskah({type: 'stage', narasi: 'Air putih gak basi, kok ada kadaluwarsa?', items: [teks({delay: 0})]}),
    'uji-visual',
    OPTS,
  );
  assert.ok(errors.some((e) => e.includes('V1') && e.includes('kok ada kadaluwarsa?')), errors.join(' | '));
});

test('V1: klausa pertama tertutup item delay 0', async () => {
  const {errors} = await validasiExplainer(
    naskah({type: 'stage', narasi: 'Air putih gak basi, kok ada kadaluwarsa?', items: [teks({delay: 0}), teks({di: 'kok', y: 60})]}),
    'uji-visual',
    OPTS,
  );
  assert.ok(!errors.some((e) => e.includes('V1')), errors.join(' | '));
});

test('V1: scene diagram dihitung dari langkah[].di', async () => {
  const {errors} = await validasiExplainer(
    naskah({
      type: 'diagram',
      mode: 'potongan',
      narasi: 'Awalnya seratus ribu, lalu dipotong pajak.',
      awal: {label: 'Bayar', nilai: '100'},
      langkah: [{label: 'Pajak', potong: '10', sisa: '90', di: 'dipotong'}],
      hasil: {label: 'Sisa', nilai: '90', di: 'Awalnya'},
    }),
    'uji-visual',
    OPTS,
  );
  assert.ok(!errors.some((e) => e.includes('V1')), errors.join(' | '));
});

test('V2: lebih dari 6 kata tanpa kejadian jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(
    naskah({type: 'stage', narasi: 'Satu dua tiga empat lima enam tujuh delapan sembilan.', items: [teks({delay: 0})]}),
    'uji-visual',
    OPTS,
  );
  assert.ok(warnings.some((w) => w.includes('V2')), warnings.join(' | '));
});

test('V3: frasa *kunci* diakhiri ? dikenali satu frasa', async () => {
  const {warnings} = await validasiExplainer(
    naskah({type: 'stage', narasi: 'Air gak basi, *kok botolnya ada kadaluwarsa*?', items: [teks({delay: 0}), teks({di: 'basi', y: 60})]}),
    'uji-visual',
    OPTS,
  );
  const v3 = warnings.filter((w) => w.includes('V3'));
  assert.equal(v3.length, 1, warnings.join(' | '));
  assert.ok(v3[0].includes('kok botolnya ada kadaluwarsa'), v3[0]);
});

test('kejadianScene: aksi.di berulang mengikuti kursor engine', () => {
  const words = kata.parseWords('token lalu token lagi');
  const scene = {type: 'stage', items: [{kind: 'prop', src: 'props/a.png', x: 50, y: 50, di: 'lalu', aksi: [{type: 'jump', di: 'token'}]}]};
  const ev = kejadianScene(scene, words, kata);
  assert.deepEqual(
    ev.map((e) => e.idx),
    [1, 2],
  );
});

const sceneProp = {
  type: 'stage',
  narasi: 'Botol plastik itu rapuh.',
  items: [{kind: 'prop', src: 'props/air-botol-retak.png', x: 50, y: 50, delay: 0}],
};

test('V4: prop tanpa untuk jadi error', async () => {
  const {errors} = await validasiExplainer(naskah(sceneProp), 'uji-visual', {
    props: [{name: 'air-botol-retak', prompt: 'x'}],
    rencana: null,
  });
  assert.ok(errors.some((e) => e.includes('V4') && e.includes('air-botol-retak')), errors.join(' | '));
});

test('V4: frasa untuk tidak ada di narasi jadi error', async () => {
  const {errors} = await validasiExplainer(naskah(sceneProp), 'uji-visual', {
    props: [{name: 'air-botol-retak', prompt: 'x', untuk: 'galon biru'}],
    rencana: null,
  });
  assert.ok(errors.some((e) => e.includes('V4') && e.includes('galon biru')), errors.join(' | '));
});

test('V4: prop dipakai di scene lain dari frasa untuk jadi error', async () => {
  const {errors} = await validasiExplainer(naskah(sceneProp), 'uji-visual', {
    props: [{name: 'air-botol-retak', prompt: 'x', untuk: 'Penjelasan selesai'}],
    rencana: null,
  });
  assert.ok(errors.some((e) => e.includes('V4') && e.includes('scene 3')), errors.join(' | '));
});

test('V4: prop dengan untuk yang benar lolos', async () => {
  const {errors} = await validasiExplainer(naskah(sceneProp), 'uji-visual', {
    props: [{name: 'air-botol-retak', prompt: 'x', untuk: 'Botol plastik'}],
    rencana: null,
  });
  assert.ok(!errors.some((e) => e.includes('V4')), errors.join(' | '));
});

test('V5: prop di props.json tidak dipakai jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(naskah(sceneProp), 'uji-visual', {
    props: [{name: 'air-galon-sejuk', prompt: 'x', untuk: 'rapuh'}],
    rencana: null,
  });
  assert.ok(warnings.some((w) => w.includes('V5') && w.includes('air-galon-sejuk')), warnings.join(' | '));
});

test('V6: dua prop beririsan waktu dan berdekatan jadi peringatan; simbol di atas prop tidak', async () => {
  const {warnings} = await validasiExplainer(
    naskah({
      type: 'stage',
      narasi: 'Botol plastik itu rapuh.',
      items: [
        {kind: 'prop', src: 'props/air-botol-retak.png', x: 50, y: 50, delay: 0},
        {kind: 'prop', src: 'props/air-galon-sejuk.png', x: 55, y: 55, di: 'rapuh'},
        {kind: 'simbol', simbol: 'larang', x: 50, y: 48, di: 'itu'},
      ],
    }),
    'uji-visual',
    OPTS,
  );
  const v6 = warnings.filter((w) => w.includes('V6'));
  assert.equal(v6.length, 1, warnings.join(' | '));
});

test('props.json rusak jadi error, bukan crash', async () => {
  const {errors} = await validasiExplainer(naskah(sceneProp), 'uji-rusak', {propsRaw: '{rusak', rencana: null});
  assert.ok(errors.some((e) => e.includes('props.json')), errors.join(' | '));
});

test('slug LEGACY melewati V1-V6', async () => {
  const {errors, warnings} = await validasiExplainer(
    naskah({type: 'stage', narasi: 'Air putih gak basi, kok ada kadaluwarsa?', items: [teks({delay: 0})]}),
    'token-listrik',
    {props: [{name: 'x', prompt: 'x'}], rencana: null},
  );
  assert.ok(![...errors, ...warnings].some((m) => /\bV[1-6]\b/.test(m)), [...errors, ...warnings].join(' | '));
});
