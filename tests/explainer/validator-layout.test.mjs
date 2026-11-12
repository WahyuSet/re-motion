import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

const OPTS = {props: [], rencana: null};
const beat = {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.', items: [{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 54}]};
const naskah = (scene) => ({format: 'short', scenes: [{duration: 90, latar: 'latar/gandum-tropis-1.png', ...scene}, beat]});
const teks = (extra) => ({kind: 'teks', teks: 'OK', x: 50, delay: 0, ...extra});
const ada = (pesan, kode) => pesan.some((m) => m.includes(kode));

test('L1: tepi atas item hook di zona judul (< 28%) jadi peringatan', async () => {
  const hook = {type: 'hook', baris1: 'A', baris2: 'B?', narasi: 'Botol plastik kok rapuh?', items: [teks({y: 26})]};
  const {warnings} = await validasiExplainer(naskah(hook), 'uji-layout', OPTS);
  assert.ok(ada(warnings, 'L1'), warnings.join(' | '));
});

test('L1: stage tanpa judul boleh pakai y rendah, stage berjudul tidak', async () => {
  const tanpa = await validasiExplainer(naskah({type: 'stage', narasi: 'Botol plastik itu rapuh.', items: [teks({y: 24})]}), 'uji-layout', OPTS);
  assert.ok(!ada(tanpa.warnings, 'L1'), tanpa.warnings.join(' | '));
  const berjudul = await validasiExplainer(naskah({type: 'stage', judul: 'JUDUL', narasi: 'Botol plastik itu rapuh.', items: [teks({y: 22})]}), 'uji-layout', OPTS);
  assert.ok(ada(berjudul.warnings, 'L1'), berjudul.warnings.join(' | '));
});

test('L2: item dengan y > 70 jadi peringatan zona subtitle', async () => {
  const {warnings} = await validasiExplainer(naskah({type: 'stage', narasi: 'Botol plastik itu rapuh.', items: [teks({y: 72})]}), 'uji-layout', OPTS);
  assert.ok(ada(warnings, 'L2'), warnings.join(' | '));
});

test('L2: y 70 pas masih aman', async () => {
  const {warnings} = await validasiExplainer(naskah({type: 'stage', narasi: 'Botol plastik itu rapuh.', items: [teks({y: 70})]}), 'uji-layout', OPTS);
  assert.ok(!ada(warnings, 'L2'), warnings.join(' | '));
});

test('L1/L2 tidak berlaku untuk slug LEGACY', async () => {
  const hook = {type: 'hook', baris1: 'A', baris2: 'B?', narasi: 'Botol plastik kok rapuh?', items: [teks({y: 30}), teks({y: 74})]};
  const {warnings} = await validasiExplainer(naskah(hook), 'token-listrik', OPTS);
  assert.ok(!ada(warnings, 'L1') && !ada(warnings, 'L2'), warnings.join(' | '));
});
