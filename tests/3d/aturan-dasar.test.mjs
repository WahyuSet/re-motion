import test from 'node:test';
import assert from 'node:assert/strict';
import {cek3dKonteks} from '../../scripts/3d/cek.mjs';
import {ktxUji} from './bantu.mjs';

const cek = async (ubah) => cek3dKonteks(await ktxUji((k) => (ubah?.(k), k)));
const klip = (k) => k.data.klip[0];
const klipHook = (tambahan) => (k) => {
  k.data.klip = [{scene: 1, set: 'uji', kamera: 'k', isi: {mode: 'b'}, gerak: [], ...tambahan}];
};

const adaError = (hasil, ...isi) => hasil.errors.some((e) => isi.every((t) => e.includes(t)));

test('rencana valid lolos tanpa pesan', async () => {
  assert.deepEqual(await cek(), {errors: [], warnings: []});
});

test('klip scene 1 yang memenuhi syarat hook lolos', async () => {
  assert.deepEqual((await cek(klipHook())).errors, []);
});

const kasus = [
  ['J1 JSON rusak menyebut baris dan kolom', (k) => { k.teks = '{\n  "slug": "x",\n  "klip": [}'; k.data = null; k.galatParse = (() => { try { JSON.parse(k.teks); } catch (e) { return e.message; } })(); }, ['J1', 'baris 3', 'kolom']],
  ['J1 file belum ada', (k) => { k.teks = null; k.data = null; }, ['J1', '3d:baru']],
  ['J2 slug berbeda', (k) => { k.data.slug = 'lain'; }, ['J2']],
  ['J2 naskah landscape', (k) => { k.script.format = 'landscape'; }, ['J2']],
  ['J2 naskah tidak ada', (k) => { k.script = null; }, ['J2']],
  ['J3 scene tidak ada', (k) => { klip(k).scene = 99; }, ['J3']],
  ['J3 scene beat', (k) => { klip(k).scene = 2; }, ['J3']],
  ['J3 scene bukan bilangan bulat', (k) => { klip(k).scene = 1.5; }, ['J3']],
  ['J3 scene dobel', (k) => { k.data.klip.push({...klip(k)}); }, ['J3']],
  ['C1 set tidak terdaftar', (k) => { klip(k).set = 'x'; }, ['C1', 'uji', 'adegan contoh']],
  ['C2 kamera tidak terdaftar', (k) => { klip(k).kamera = 'x'; }, ['C2']],
  ['C2 kamera prop di klip', (k) => { klip(k).kamera = 'p'; }, ['C2']],
  ['C2 kamera biasa di gambar', (k) => { k.data.gambar = [{nama: 'x', set: 'uji', kamera: 'k'}]; }, ['C2']],
  ['C3 kunci isi', (k) => { klip(k).isi = {x: 'a'}; }, ['C3']],
  ['C3 nilai isi', (k) => { klip(k).isi = {mode: 'z'}; }, ['C3']],
  ['C4 jenis gerak', (k) => { klip(k).gerak = [{jenis: 'x', di: 'maling'}]; }, ['C4']],
  ['C4 gerak dobel', (k) => { klip(k).gerak = [{jenis: 'g1', di: 'maling'}, {jenis: 'g1', di: 'lalu'}]; }, ['C4']],
  ['C5 butuh tidak ada', (k) => { klip(k).gerak = [{jenis: 'g2', di: 'maling'}]; }, ['C5', 'g1']],
  ['C6 syarat isi', (k) => { klip(k).gerak = [{jenis: 'g3', di: 'maling'}]; }, ['C6', 'mode']],
  ['H1 syarat hook', klipHook({isi: {mode: 'a'}}), ['H1', 'mode']],
  ['H2 kamera hook', klipHook({kamera: 'l'}), ['H2']],
];

for (const [nama, ubah, isi] of kasus) {
  test(nama, async () => {
    const hasil = await cek(ubah);
    assert.ok(adaError(hasil, ...isi), hasil.errors.join('\n') || 'tidak ada error');
    assert.ok(hasil.errors.every((e) => e.includes('→ PERBAIKI:')), hasil.errors.join('\n'));
  });
}
