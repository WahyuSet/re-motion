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

test('validasiExplainer allows repeated trigger word when sampai appears again after di', async () => {
  const repeatedWordScript = {
    format: 'short',
    scenes: [
      {
        type: 'stage',
        duration: 60,
        narasi: 'Beli token pertama lalu isi token kedua di meteran rumah.',
        items: [{kind: 'teks', teks: 'OK', x: 50, y: 40, di: 'lalu', sampai: 'token'}],
      },
      {
        type: 'beat',
        duration: 45,
        teks: 'nah',
        narasi: 'Nah begini.',
      },
      {
        type: 'stage',
        duration: 60,
        narasi: 'Penjelasan selesai dengan rapi.',
        items: [],
      },
    ],
  };
  const {errors} = await validasiExplainer(repeatedWordScript, 'uji-ulang');
  assert.deepEqual(errors, []);
});
