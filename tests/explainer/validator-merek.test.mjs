import test from 'node:test';
import assert from 'node:assert/strict';
import {cekMerek} from '../../scripts/lib/explainer-cek/merek.mjs';

const jalankan = (props) => {
  const warnings = [];
  cekMerek(props, {err: () => {}, warn: (w, m) => warnings.push(`${w}: ${m}`)});
  return warnings;
};
const ada = (pesan, kode) => pesan.some((m) => m.includes(kode));
const BAGUS = {
  name: 'uji-kemasan',
  merek: 'MICIN OKE SINI',
  prompt: 'plastic bag of MSG crystals with a red and yellow front label that reads exactly "MICIN OKE SINI" in bold capital letters',
};

test('prop bermerek yang benar lolos', () => {
  const w = jalankan([BAGUS]);
  assert.deepEqual(w, []);
});

test('P1: format merek harus "<PRODUK> OKE SINI" kapital, maks. 4 kata', () => {
  assert.ok(ada(jalankan([{...BAGUS, merek: 'Micin Oke Sini'}]), 'P1'));
  assert.ok(ada(jalankan([{...BAGUS, merek: 'MICIN GURIH SUPER ENAK OKE SINI'}]), 'P1'));
  assert.ok(ada(jalankan([{...BAGUS, merek: 'MICIN ENAK'}]), 'P1'));
});

test('P2: prompt wajib memuat reads exactly "<merek>"', () => {
  const w = jalankan([{...BAGUS, prompt: 'plastic bag of MSG crystals with a red label'}]);
  assert.ok(ada(w, 'P2'), w.join(' | '));
});

test('P3: lebih dari 2 prop bermerek jadi peringatan', () => {
  const w = jalankan([BAGUS, {...BAGUS, name: 'b'}, {...BAGUS, name: 'c'}]);
  assert.ok(ada(w, 'P3'), w.join(' | '));
});

test('P4: merek asli di prompt jadi peringatan, kata umum tidak', () => {
  const w = jalankan([{name: 'x', prompt: 'a pack of Ajinomoto MSG on a table'}]);
  assert.ok(ada(w, 'P4 prompt menyebut merek asli: ajinomoto'), w.join(' | '));
  assert.deepEqual(jalankan([{name: 'y', prompt: 'red apple and an egg shell, isolated'}]), []);
});
