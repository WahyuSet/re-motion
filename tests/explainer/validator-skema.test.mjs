import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

const OPTS = {props: [], rencana: null};

const naskahDengan = (item) => ({
  format: 'short',
  scenes: [
    {
      type: 'stage',
      duration: 60,
      latar: 'latar/gandum-tropis-1.png',
      narasi: 'Kata awal muncul di sini.',
      items: [{kind: 'teks', teks: 'OK', x: 50, y: 40, delay: 0, ...item}],
    },
    {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.'},
    {
      type: 'stage',
      duration: 60,
      latar: 'latar/gandum-tropis-2.png',
      narasi: 'Penjelasan selesai.',
      items: [{kind: 'teks', teks: 'OK', x: 50, y: 40, delay: 0}],
    },
  ],
});

test('S1: masuk/simbol/sfx/aksi.type tak dikenal jadi error', async () => {
  const {errors} = await validasiExplainer(
    naskahDengan({masuk: 'meledak', simbol: 'bintang', sfx: 'kentut', aksi: [{type: 'putar'}]}),
    'uji-skema',
    OPTS,
  );
  for (const kata of ['meledak', 'bintang', 'kentut', 'putar']) {
    assert.ok(errors.some((e) => e.includes(`"${kata}"`)), `error untuk ${kata} tidak ada: ${errors.join(' | ')}`);
  }
});

test('S1: sfx false diterima', async () => {
  const {errors} = await validasiExplainer(naskahDengan({sfx: false, aksi: [{type: 'jump', sfx: false}]}), 'uji-skema', OPTS);
  assert.ok(!errors.some((e) => e.includes('S1')), errors.join(' | '));
});

test('S2: field aksi yang diabaikan engine jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(naskahDengan({aksi: [{type: 'shake', toScale: 2}]}), 'uji-skema', OPTS);
  assert.ok(warnings.some((w) => w.includes('S2') && w.includes('toScale') && w.includes('shake')), warnings.join(' | '));
});

test('S2: alias dim.to dan grow.toScale tidak memicu peringatan', async () => {
  const {warnings} = await validasiExplainer(
    naskahDengan({aksi: [{type: 'dim', to: 0.3}, {type: 'grow', toScale: 1.2}]}),
    'uji-skema',
    OPTS,
  );
  assert.ok(!warnings.some((w) => w.includes('S2')), warnings.join(' | '));
});

test('pesan memakai format → PERBAIKI:', async () => {
  const {errors} = await validasiExplainer(naskahDengan({masuk: 'meledak'}), 'uji-skema', OPTS);
  assert.ok(errors.some((e) => e.includes('meledak') && e.includes('→ PERBAIKI:')), errors.join(' | '));
});

test('S* tetap berlaku untuk slug LEGACY', async () => {
  const {errors} = await validasiExplainer(naskahDengan({masuk: 'meledak'}), 'token-listrik', OPTS);
  assert.ok(errors.some((e) => e.includes('meledak')), errors.join(' | '));
});
