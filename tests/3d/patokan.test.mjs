import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';
import {cek3d} from '../../scripts/3d/cek.mjs';
import {loadScript} from '../../scripts/lib/load-script.mjs';

test('video patokan jendela-kebalik bersih di cek:3d', async () => {
  assert.deepEqual(await cek3d('jendela-kebalik'), {errors: [], warnings: []});
});

test('video patokan jendela-kebalik bersih di cek:explainer', async () => {
  const {errors, warnings} = await validasiExplainer(await loadScript('jendela-kebalik'), 'jendela-kebalik');
  assert.deepEqual({errors, warnings}, {errors: [], warnings: []});
});
