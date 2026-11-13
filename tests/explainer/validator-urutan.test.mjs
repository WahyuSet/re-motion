import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

const OPTS = {props: [], rencana: null};
const beat = {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.', items: [{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 54}]};
const naskah = (scene) => ({format: 'short', scenes: [{duration: 120, latar: 'latar/gandum-tropis-1.png', ...scene}, beat]});
const ada = (pesan, kode) => pesan.some((m) => m.includes(kode));

const stageAksi = (aksi) => ({
  type: 'stage',
  narasi: 'Botol itu panas lalu retak dan pecah.',
  items: [{kind: 'prop', src: 'props/air-botol-retak.png', x: 50, y: 50, delay: 0, aksi}],
});

test('U1: aksi kedua yang katanya diucapkan sebelum aksi pertama jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(
    naskah(stageAksi([{type: 'shake', di: 'retak'}, {type: 'jump', di: 'panas'}])),
    'uji-urutan',
    OPTS,
  );
  assert.ok(ada(warnings, 'U1') && warnings.some((w) => w.includes('panas')), warnings.join(' | '));
});

test('U1: aksi berurutan sesuai narasi lolos', async () => {
  const {warnings} = await validasiExplainer(
    naskah(stageAksi([{type: 'jump', di: 'panas'}, {type: 'shake', di: 'retak'}])),
    'uji-urutan',
    OPTS,
  );
  assert.ok(!ada(warnings, 'U1'), warnings.join(' | '));
});

const diagram = (awal, langkah) => ({
  type: 'diagram',
  mode: 'potongan',
  narasi: 'Gaji lima juta dipotong pajak, sisanya cukup.',
  awal: {label: 'Gaji', nilai: awal},
  langkah,
  hasil: {label: 'Sisa', nilai: 'Rp4.950.000', di: 'sisanya'},
  items: [{kind: 'teks', teks: 'OK', x: 50, y: 66, delay: 0}],
});
const pajak = (sisa) => [{label: 'Pajak', potong: '-Rp50.000', sisa, di: 'dipotong'}];

test('D1: nominal awal pakai kata (juta/ribu) jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(naskah(diagram('Rp5 juta', pajak('Rp4.950.000'))), 'uji-urutan', OPTS);
  assert.ok(ada(warnings, 'D1'), warnings.join(' | '));
});

test('D2: sisa yang lebih besar dari nilai sebelumnya jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(naskah(diagram('Rp5.000.000', pajak('Rp5.050.000'))), 'uji-urutan', OPTS);
  assert.ok(ada(warnings, 'D2'), warnings.join(' | '));
});

test('D1/D2: nominal konsisten lolos', async () => {
  const {warnings} = await validasiExplainer(naskah(diagram('Rp5.000.000', pajak('Rp4.950.000'))), 'uji-urutan', OPTS);
  assert.ok(!ada(warnings, 'D1') && !ada(warnings, 'D2'), warnings.join(' | '));
});
