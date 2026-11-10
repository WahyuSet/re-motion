import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';

test('prepareExplainerScript populates estimated word timings and duration when narasiAudio is unset', async () => {
  const {prepareExplainerScript, getExplainerDuration} = await importTs('src/explainer/prep.ts');
  const raw = {
    format: 'short',
    scenes: [
      {
        type: 'hook',
        duration: 60,
        baris1: 'ISI TOKEN 100 RIBU',
        baris2: 'KOK KWH BEDA?',
        narasi: 'Pernah bingung nggak kenapa isi *token listrik* seratus ribu dapatnya beda?',
        items: [],
      },
      {
        type: 'beat',
        duration: 30,
        teks: 'nah',
        narasi: 'Nah gini alasannya.',
      },
    ],
  };
  const prepared = await prepareExplainerScript(raw, 30);
  assert.ok(Array.isArray(prepared.scenes[0].kata));
  assert.equal(prepared.scenes[0].kata.length, 11);
  assert.ok(prepared.scenes[0].duration >= 60);
  assert.equal(
    getExplainerDuration(prepared),
    prepared.scenes[0].duration + prepared.scenes[1].duration,
  );
});
