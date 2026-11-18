import test from 'node:test';
import assert from 'node:assert/strict';
import {cek3dKonteks} from '../../scripts/3d/cek.mjs';
import {ktxUji} from './bantu.mjs';

const cek = async (ubah) => cek3dKonteks(await ktxUji((k) => (ubah?.(k), k)));
const gerak = (k, daftar, isi = {}) => {
  k.data.klip[0].gerak = daftar;
  k.data.klip[0].isi = isi;
};

const kasus = [
  ['W1 kata.json tidak ada', (k) => { k.kataJson = null; }, ['W1']],
  ['W1 entri scene tidak ada', (k) => { delete k.kataJson['2']; }, ['W1']],
  ['W1 jumlah kata berbeda dari narasi', (k) => { k.kataJson['2'].pop(); }, ['W1', '8', '7']],
  ['W2 kata tidak ada', (k) => gerak(k, [{jenis: 'g1', di: 'zebra'}]), ['W2', 'maling', 'nyangkut']],
  ['W2 di kosong', (k) => gerak(k, [{jenis: 'g1'}]), ['W2']],
  ['W3 kemunculan berlebih', (k) => gerak(k, [{jenis: 'g1', di: 'maling', ke: 3}]), ['W3', '2 kali']],
  ['W4 gerak melewati akhir scene', (k) => {
    k.katalog.set.uji.gerak.g3.detik = 3;
    gerak(k, [{jenis: 'g3', di: 'diam'}], {mode: 'b'});
  }, ['W4']],
  ['W5 mulai sebelum gerak yang dibutuhkan selesai', (k) => gerak(k, [{jenis: 'g1', di: 'nyangkut'}, {jenis: 'g2', di: 'lalu'}]), ['W5', 'g1']],
];

for (const [nama, ubah, isi] of kasus) {
  test(nama, async () => {
    const {errors} = await cek(ubah);
    assert.ok(errors.some((e) => isi.every((t) => e.includes(t))), errors.join('\n') || 'tidak ada error');
  });
}

test('huruf besar, ke, dan frasa diterima; mulai boleh tepat saat gerak sebelumnya selesai', async () => {
  const {errors} = await cek((k) => gerak(k, [{jenis: 'g1', di: 'MALING', ke: 2}, {jenis: 'g2', di: 'lalu diam'}]));
  assert.deepEqual(errors, []);
});
