import test from 'node:test';
import assert from 'node:assert/strict';
import {loadScript} from '../../scripts/lib/load-script.mjs';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

test('validasiExplainer passes on gandum-tropis and sadap-lims scripts', async () => {
  const gandum = await loadScript('gandum-tropis');
  const resGandum = await validasiExplainer(gandum, 'gandum-tropis');
  assert.deepEqual(resGandum.errors, []);

  const lims = await loadScript('sadap-lims');
  const resLims = await validasiExplainer(lims, 'sadap-lims');
  assert.deepEqual(resLims.errors, []);
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
        latar: 'latar/gandum-tropis-1.png',
        narasi: 'Beli token pertama lalu isi token kedua di meteran rumah.',
        items: [{kind: 'teks', teks: 'OK', x: 50, y: 40, di: 'lalu', sampai: 'token'}],
      },
      {
        type: 'beat',
        duration: 45,
        teks: 'Oke, sini gue jelasin.',
        narasi: 'Oke sini gue jelasin.',
      },
      {
        type: 'stage',
        duration: 60,
        latar: 'latar/gandum-tropis-2.png',
        narasi: 'Penjelasan selesai dengan rapi.',
        items: [],
      },
    ],
  };
  const {errors} = await validasiExplainer(repeatedWordScript, 'uji-ulang');
  assert.deepEqual(errors, []);
});

test('validasiExplainer warns on overly long hook/thumbnail lines (> 28 chars), hook narasi > 15 words, and errors on missing thumbnail.latar', async () => {
  const script = {
    format: 'short',
    thumbnail: {
      baris1: 'KALIMAT JUDUL BARIS SATU YANG TERLALU PANJANG SEKALI',
      baris2: 'BARIS DUA NORMAL?',
      latar: 'latar/tidak-ada-file.png',
    },
    scenes: [
      {
        type: 'hook',
        duration: 60,
        latar: 'latar/gandum-tropis-1.png',
        baris1: 'PENDEK',
        baris2: 'NORMAL?',
        narasi:
          'Kalimat pembuka ini sengaja ditulis sangat panjang sekali melebihi batas lima belas kata supaya memicu peringatan hook terlalu lama.',
      },
      {
        type: 'beat',
        duration: 45,
        teks: 'Oke, sini gue jelasin.',
        narasi: 'Oke sini gue jelasin.',
      },
      {
        type: 'stage',
        duration: 60,
        latar: 'latar/gandum-tropis-2.png',
        narasi: 'Penjelasan selesai.',
        items: [],
      },
    ],
  };
  const {errors, warnings} = await validasiExplainer(script, 'uji-thumb');
  assert.ok(errors.some((e) => e.includes('tidak-ada-file.png')));
  assert.ok(warnings.some((w) => w.includes('baris1')));
  assert.ok(warnings.some((w) => w.includes('Hook narasi terlalu panjang')));
});

