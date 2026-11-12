import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

const OPTS = {props: [], rencana: null};
const beat = {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.', items: [{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 54}]};
const stage = (narasi) => ({type: 'stage', duration: 120, latar: 'latar/gandum-tropis-1.png', narasi, items: [{kind: 'teks', teks: 'OK', x: 50, y: 50, delay: 0}]});
const naskah = (...narasi) => ({format: 'short', scenes: [...narasi.map(stage), beat]});
const cek = (...narasi) => validasiExplainer(naskah(...narasi), 'uji-narasi', OPTS);
const kode = (warnings, k) => warnings.filter((w) => w.includes(` ${k} `));

test('N1: kalimat lebih dari 16 kata jadi peringatan', async () => {
  const {warnings} = await cek('Apalagi kalau botolnya keseringan kena panas matahari di dalam mobil, zat dari dinding plastik ikut larut ke air minum.');
  assert.equal(kode(warnings, 'N1').length, 1, warnings.join(' | '));
});

test('N1: dua kalimat pendek lolos', async () => {
  const {warnings} = await cek('Lewat dua tahun, plastiknya mulai rapuh. Serpihan kecilnya bisa lepas ke air.');
  assert.equal(kode(warnings, 'N1').length, 0, warnings.join(' | '));
});

test('N2: kata buku pelajaran jadi peringatan beserta penggantinya', async () => {
  const {warnings} = await cek('Plastiknya rapuh sehingga serpihannya luruh ke air.');
  const n2 = kode(warnings, 'N2');
  assert.ok(n2.some((w) => w.includes('sehingga') && w.includes('jadi')), warnings.join(' | '));
  assert.ok(n2.some((w) => w.includes('luruh')), warnings.join(' | '));
});

test('N2: kata santai yang benar tidak ditandai', async () => {
  const {warnings} = await cek('Plastiknya rapuh, jadi serpihannya bisa lepas ke air.');
  assert.equal(kode(warnings, 'N2').length, 0, warnings.join(' | '));
});

test('N3: "padahal" lebih dari sekali per video jadi peringatan', async () => {
  const {warnings} = await cek('Banyak yang ngira aman, padahal hangat.', 'Padahal cangkangnya punya pori.');
  assert.equal(kode(warnings, 'N3').length, 1, warnings.join(' | '));
});

test('N4: rujukan kabur jadi peringatan', async () => {
  const {warnings} = await cek('Pabriknya naruh rak di situ.', 'Pori tadi nyedot bau.', 'Rak pintu bikin cepat rusak.');
  const n4 = kode(warnings, 'N4');
  assert.ok(n4.some((w) => w.includes('di situ')), warnings.join(' | '));
  assert.ok(n4.some((w) => w.includes('tadi')), warnings.join(' | '));
  assert.ok(n4.some((w) => w.includes('bikin cepat')), warnings.join(' | '));
});

test('N4: "bikin" diikuti benda tidak ditandai', async () => {
  const {warnings} = await cek('Reaksi yang sama bikin roti menguning.');
  assert.equal(kode(warnings, 'N4').length, 0, warnings.join(' | '));
});

test('N5: klaim mutlak jadi peringatan', async () => {
  const {warnings} = await cek('Semua kulkas punya rak telur, tapi gak boleh dipakai.');
  const n5 = kode(warnings, 'N5');
  assert.ok(n5.some((w) => w.includes('semua')), warnings.join(' | '));
  assert.ok(n5.some((w) => w.includes('gak boleh')), warnings.join(' | '));
});

test('N1-N5 tidak berlaku untuk slug LEGACY', async () => {
  const {warnings} = await validasiExplainer(naskah('Semua plastik rapuh sehingga luruh di situ, padahal padahal aman.'), 'token-listrik', OPTS);
  assert.ok(!warnings.some((w) => /\sN[1-5]\s/.test(w)), warnings.join(' | '));
});

test('N1: scene diagram boleh sampai 22 kata', async () => {
  const diagram = {
    type: 'diagram', mode: 'potongan', duration: 200, latar: 'latar/gandum-tropis-1.png',
    narasi: 'Dari lima juta, satu persen buat BPJS Kesehatan, dua persen buat Jaminan Hari Tua, dan satu persen buat Jaminan Pensiun.',
    awal: {label: 'Gaji', nilai: 'Rp5.000.000'},
    langkah: [{label: 'BPJS', potong: '-Rp50.000', sisa: 'Rp4.950.000', di: 'BPJS'}],
    hasil: {label: 'Sisa', nilai: 'Rp4.950.000', di: 'Pensiun'},
  };
  const {warnings} = await validasiExplainer({format: 'short', scenes: [diagram, beat]}, 'uji-narasi', OPTS);
  assert.equal(kode(warnings, 'N1').length, 0, warnings.join(' | '));
});

test('D3: perkiraan durasi lebih dari 60 detik jadi peringatan', async () => {
  const kalimat = 'Botol plastik itu rapuh kena panas terus. ';
  const panjang = kalimat.repeat(6).trim(); // 42 kata per scene
  const {warnings} = await cek(panjang, panjang, panjang, panjang);
  assert.equal(kode(warnings, 'D3').length, 1, warnings.join(' | '));
});

test('D3: video pendek lolos', async () => {
  const {warnings} = await cek('Botol plastik itu rapuh.', 'Plastiknya mulai lepas ke air.');
  assert.equal(kode(warnings, 'D3').length, 0, warnings.join(' | '));
});

test('CLI mencetak BELUM SELESAI selama masih ada peringatan', async () => {
  const {execFileSync} = await import('node:child_process');
  const out = execFileSync(process.execPath, ['scripts/cek-explainer.mjs', 'air-kadaluwarsa'], {encoding: 'utf8'});
  assert.ok(out.includes('BELUM SELESAI') && !out.includes('✓ LULUS'), out.slice(-300));
  const bersih = execFileSync(process.execPath, ['scripts/cek-explainer.mjs', 'kabel-kendor'], {encoding: 'utf8'});
  assert.ok(bersih.includes('✓ LULUS'), bersih.slice(-300));
});
