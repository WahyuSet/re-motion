import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

const OPTS = {props: [], rencana: null};
const meme = {kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 54, masuk: 'pop'};
const beatBaik = {type: 'beat', duration: 55, teks: 'Oke, sini gue jelasin.', narasi: 'Oke, *sini gue jelasin* penyebabnya.', items: [meme]};
const stage = {type: 'stage', duration: 90, latar: 'latar/gandum-tropis-1.png', narasi: 'Botol plastik itu rapuh.', items: [{kind: 'teks', teks: 'OK', x: 50, y: 50, delay: 0}]};
const naskah = (beat) => ({format: 'short', scenes: [stage, beat]});
const cek = (beat, slug = 'uji-beat') => validasiExplainer(naskah(beat), slug, OPTS);
const ada = (pesan, kode) => pesan.some((m) => m.includes(kode));

test('beat standar lolos tanpa B1-B4', async () => {
  const {errors, warnings} = await cek(beatBaik);
  assert.ok(![...errors, ...warnings].some((m) => /\bB[1-4]\b/.test(m)), [...errors, ...warnings].join(' | '));
});

test('B1: beat dengan latar jadi error', async () => {
  const {errors} = await cek({...beatBaik, latar: 'latar/gandum-tropis-1.png'});
  assert.ok(ada(errors, 'B1'), errors.join(' | '));
});

test('B2: teks banner selain "Oke, sini gue jelasin." jadi peringatan', async () => {
  const {warnings} = await cek({...beatBaik, teks: 'Nah gini.'});
  assert.ok(ada(warnings, 'B2'), warnings.join(' | '));
});

test('B3: beat tanpa meme-kucing-jelasin jadi peringatan', async () => {
  const {warnings} = await cek({...beatBaik, items: [{...meme, src: 'props/meme-kucing-paw.png'}]});
  assert.ok(ada(warnings, 'B3'), warnings.join(' | '));
});

test('B4: item beat dengan sfx eksplisit jadi peringatan (banner sudah bunyi pop)', async () => {
  const {warnings} = await cek({...beatBaik, items: [{...meme, sfx: 'boing'}]});
  assert.ok(ada(warnings, 'B4'), warnings.join(' | '));
  const bisu = await cek({...beatBaik, items: [{...meme, sfx: false}]});
  assert.ok(!ada(bisu.warnings, 'B4'), bisu.warnings.join(' | '));
});

test('B1-B4 tidak berlaku untuk slug LEGACY', async () => {
  const {errors, warnings} = await cek({...beatBaik, latar: 'latar/gandum-tropis-1.png', teks: 'Nah.', items: []}, 'token-listrik');
  assert.ok(![...errors, ...warnings].some((m) => /\bB[1-4]\b/.test(m)), [...errors, ...warnings].join(' | '));
});
