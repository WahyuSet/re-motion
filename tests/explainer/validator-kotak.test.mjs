import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';
import {BATAS_AMAN, kotakItem, ukuranGambar} from '../../scripts/lib/explainer-cek/kotak.mjs';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

const OPTS = {props: [], rencana: null};
const beat = {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.', items: [{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 54}]};
const naskah = (items) => ({format: 'short', scenes: [{type: 'stage', duration: 90, latar: 'latar/gandum-tropis-1.png', narasi: 'Botol plastik itu rapuh.', items}, beat]});
const ada = (pesan, kode) => pesan.some((m) => m.includes(` ${kode} `));

test('BATAS_AMAN sama dengan SAFE_SHORT di src/lib/safe.ts', async () => {
  const {SAFE_SHORT, FORMAT_SIZE} = await importTs('src/lib/safe.ts');
  const {width: W, height: H} = FORMAT_SIZE.short;
  assert.ok(Math.abs(BATAS_AMAN.kiri - (SAFE_SHORT.left / W) * 100) < 1e-9);
  assert.ok(Math.abs(BATAS_AMAN.kanan - (100 - (SAFE_SHORT.right / W) * 100)) < 1e-9);
  assert.ok(Math.abs(BATAS_AMAN.atas - (SAFE_SHORT.top / H) * 100) < 1e-9);
  assert.ok(Math.abs(BATAS_AMAN.bawah - (100 - (SAFE_SHORT.bottom / H) * 100)) < 1e-9);
});

test('kotakItem prop memakai rasio gambar asli', () => {
  // gambar potret 500x1000, width 270 px -> tinggi 540 px, pusat di (540, 960)
  const k = kotakItem({kind: 'prop', src: 'x.png', x: 50, y: 50, width: 270}, {w: 500, h: 1000});
  assert.ok(Math.abs(k.kiri - 37.5) < 1e-9 && Math.abs(k.kanan - 62.5) < 1e-9);
  assert.ok(Math.abs(k.atas - 35.9375) < 1e-9 && Math.abs(k.bawah - 64.0625) < 1e-9);
});

test('kotakItem grow-up berjangkar di bawah', () => {
  const k = kotakItem({kind: 'prop', src: 'x.png', x: 50, y: 60, width: 200, masuk: 'grow-up'}, {w: 100, h: 100});
  assert.ok(Math.abs(k.bawah - 60) < 1e-9);
});

test('kotakItem simbol tanya lebih tinggi dari lebarnya', () => {
  const k = kotakItem({kind: 'simbol', simbol: 'tanya', x: 50, y: 50, width: 160});
  assert.ok(k.bawah - k.atas > ((160 / 1920) * 100) * 1.2);
});

test('ukuranGambar membaca PNG asli dan null untuk file yang tidak ada', async () => {
  const u = await ukuranGambar('props/meme-kucing-jelasin.png');
  assert.ok(u.w > 0 && u.h > 0);
  assert.equal(await ukuranGambar('props/tidak-ada.png'), null);
});

test('A1: prop di x 74 dengan width 300 menembus tepi kanan aman', async () => {
  const {warnings} = await validasiExplainer(naskah([{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 74, y: 50, width: 300, delay: 0}]), 'uji-kotak', OPTS);
  assert.ok(ada(warnings, 'A1') && warnings.some((w) => w.includes('kanan')), warnings.join(' | '));
});

test('A1: prop di tengah dengan width wajar lolos', async () => {
  const {warnings} = await validasiExplainer(naskah([{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 50, width: 260, delay: 0}]), 'uji-kotak', OPTS);
  assert.ok(!ada(warnings, 'A1'), warnings.join(' | '));
});

test('V6: serah-terima sampai = di di posisi sama jadi peringatan, kecuali keluar none', async () => {
  const lama = {kind: 'prop', src: 'props/air-botol-retak.png', x: 40, y: 50, width: 260, delay: 0, sampai: 'rapuh'};
  const baru = {kind: 'prop', src: 'props/air-galon-sejuk.png', x: 42, y: 52, width: 260, di: 'rapuh'};
  const tumpuk = await validasiExplainer(naskah([lama, baru]), 'uji-kotak', OPTS);
  assert.ok(ada(tumpuk.warnings, 'V6'), tumpuk.warnings.join(' | '));
  const bersih = await validasiExplainer(naskah([{...lama, keluar: 'none'}, baru]), 'uji-kotak', OPTS);
  assert.ok(!ada(bersih.warnings, 'V6'), bersih.warnings.join(' | '));
});

test('V6: dua prop berjauhan tapi titik tengah dekat-sumbu tidak ditandai kalau kotaknya tidak bertumpuk', async () => {
  const a = {kind: 'prop', src: 'props/air-botol-retak.png', x: 30, y: 40, width: 120, delay: 0};
  const b = {kind: 'prop', src: 'props/air-galon-sejuk.png', x: 30, y: 54, width: 120, delay: 0};
  const {warnings} = await validasiExplainer(naskah([a, b]), 'uji-kotak', OPTS);
  assert.ok(!ada(warnings, 'V6'), warnings.join(' | '));
});
