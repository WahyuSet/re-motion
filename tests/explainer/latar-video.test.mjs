import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

const naskah = (latarVideo) => ({
  format: 'short',
  scenes: [{type: 'stage', duration: 60, latarVideo, narasi: 'Kata awal muncul lalu selesai.', items: []}],
});

test('latarVideo menggantikan latar, tapi filenya harus ada', async () => {
  const {errors} = await validasiExplainer(naskah('klip/tidak-ada.mp4'), 'uji-latar-video');
  assert.ok(errors.some((e) => e.includes('tidak ditemukan')));
  assert.ok(!errors.some((e) => e.includes('Wajib memiliki background')));
});

test('latarVideo harus berupa file video', async () => {
  const {errors} = await validasiExplainer(naskah('audio/air-es/01.wav'), 'uji-latar-video');
  assert.ok(errors.some((e) => e.includes('harus file video')));
});
