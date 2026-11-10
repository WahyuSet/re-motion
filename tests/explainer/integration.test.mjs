import test from 'node:test';
import assert from 'node:assert/strict';
import {loadScript} from '../../scripts/lib/load-script.mjs';

test('loadScript loads both history slugs (borobudur) and explainer slugs (token-listrik)', async () => {
  const sejarah = await loadScript('borobudur');
  assert.ok(Array.isArray(sejarah.scenes) && sejarah.scenes.length > 0);

  const explainer = await loadScript('token-listrik');
  assert.equal(explainer.format, 'short');
  assert.ok(Array.isArray(explainer.scenes) && explainer.scenes.length >= 5);
  assert.equal(explainer.scenes[0].type, 'hook');
  assert.ok(explainer.scenes.some((s) => s.type === 'beat'));
  assert.ok(explainer.scenes.some((s) => s.type === 'stage'));
  assert.ok(explainer.scenes.some((s) => s.type === 'diagram' && s.mode === 'potongan'));
});
