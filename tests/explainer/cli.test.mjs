import test from 'node:test';
import assert from 'node:assert/strict';
import {loadScript} from '../../scripts/lib/load-script.mjs';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

test('validasiExplainer passes on token-listrik starter script', async () => {
  const script = await loadScript('token-listrik');
  const {errors} = await validasiExplainer(script, 'token-listrik');
  assert.deepEqual(errors, []);
});

test('validasiExplainer catches inverted sampai < di, missing trigger word, and unsafe y coordinate', async () => {
  const badScript = {
    format: 'short',
    scenes: [
      {
        type: 'stage',
        duration: 60,
        narasi: 'Kata awal muncul lalu kata akhir menutup kalimat ini dengan jelas.',
        items: [
          {
            kind: 'prop',
            src: 'props/token-meteran.svg',
            x: 50,
            y: 88,
            di: 'akhir',
            sampai: 'awal',
            aksi: [{type: 'shake', di: 'tidakada'}],
          },
        ],
      },
    ],
  };
  const {errors} = await validasiExplainer(badScript, 'uji-gagal');
  assert.ok(errors.some((e) => e.includes('sampai')));
  assert.ok(errors.some((e) => e.includes('tidakada')));
  assert.ok(errors.some((e) => e.includes('area aman') || e.includes('y=')));
});
