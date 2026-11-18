import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {importTs} from '../../scripts/lib/load-script.mjs';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';
import {cekBab} from '../../scripts/lib/explainer-cek/bab.mjs';
import {cekDurasi} from '../../scripts/lib/explainer-cek/narasi.mjs';
import {cekSkemaNaskah} from '../../scripts/lib/explainer-cek/skema.mjs';

const {PROFIL} = await importTs('src/explainer/format.ts');
const OPTS = {props: [], rencana: null};
const LATAR = 'latar/gandum-tropis-1.png';
const MEME = 'props/meme-kucing-jelasin.png';
const beat = {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.', items: [{kind: 'prop', src: MEME, x: 50, y: 54}]};
const stage = (narasi, extra = {}) => ({type: 'stage', duration: 90, latar: LATAR, narasi, items: [], ...extra});
const kata = (n) => Array.from({length: n}, (_, i) => (i % 4 === 3 ? 'rapuh.' : ['Botol', 'plastik', 'itu'][i % 4])).join(' ');
const ada = (pesan, kode) => pesan.some((m) => m.includes(` ${kode} `));
const kumpul = () => {
  const warnings = [];
  return {warnings, lapor: {err: (w, m) => warnings.push(`${w}: ${m}`), warn: (w, m) => warnings.push(`${w}: ${m}`)}};
};

test('landscape: kotak dan batas subtitle dihitung di kanvas 1920x1080', async () => {
  // Simbol 100 px di y 75: tepi bawah ±79,6% di landscape (batas subtitle 85), di short melewati 73,5.
  const naskah = (format, y) => ({format, scenes: [stage('Botol plastik itu rapuh.', {items: [{kind: 'simbol', simbol: 'centang', x: 50, y, width: 100}]}), beat]});
  const l = await validasiExplainer(naskah('landscape', 75), 'uji-format', OPTS);
  for (const kode of ['A1', 'L2']) assert.ok(!ada(l.warnings, kode), l.warnings.join('\n'));
  const s = await validasiExplainer(naskah('short', 75), 'uji-format', OPTS);
  assert.ok(ada(s.warnings, 'L2'), s.warnings.join('\n'));
  const bawah = await validasiExplainer(naskah('landscape', 90), 'uji-format', OPTS);
  assert.ok(ada(bawah.warnings, 'L2'), bawah.warnings.join('\n'));
});

test('landscape: area aman kiri 3% (short 6,5%)', async () => {
  const naskah = (format) => ({format, scenes: [stage('Botol plastik itu rapuh.', {items: [{kind: 'simbol', simbol: 'centang', x: 7, y: 50, width: 100}]}), beat]});
  assert.ok(!ada((await validasiExplainer(naskah('landscape'), 'uji-format', OPTS)).warnings, 'A1'));
  assert.ok(ada((await validasiExplainer(naskah('short'), 'uji-format', OPTS)).warnings, 'A1'));
});

test('D3/D4 mengikuti batas durasi format', () => {
  const cek = (format, n) => {
    const {warnings, lapor} = kumpul();
    cekDurasi({format, scenes: [stage(kata(n))]}, null, lapor, PROFIL[format]);
    return warnings;
  };
  assert.ok(ada(cek('landscape', 100), 'D4'));
  assert.ok(!ada(cek('short', 100), 'D4'));
  assert.ok(ada(cek('short', 200), 'D3'));
  const panjang = cek('landscape', 500);
  assert.ok(!ada(panjang, 'D3') && !ada(panjang, 'D4'), panjang.join('\n'));
});

test('aturan bab C0-C2', () => {
  const cek = (format, babs) => {
    const {warnings, lapor} = kumpul();
    const script = {format, scenes: babs.map((b) => stage(kata(40), b ? {bab: b} : {}))};
    cekBab(script, null, lapor, PROFIL[format]);
    return warnings;
  };
  assert.ok(ada(cek('short', ['A', null, 'B']), 'C0'));
  assert.ok(ada(cek('landscape', [null, 'A', 'B', 'C']), 'C1'));
  assert.ok(ada(cek('landscape', ['A', null, 'B']), 'C2'));
  const lengkap = cek('landscape', ['A', 'B', 'C']);
  assert.deepEqual(lengkap, []);
});

test('C3 memakai waktu kata.json kalau ada', () => {
  const script = {format: 'landscape', scenes: [stage('Botol itu rapuh.', {bab: 'Pendek'}), stage(kata(40), {bab: 'B'}), stage(kata(40), {bab: 'C'})]};
  const tanpa = kumpul();
  cekBab(script, null, tanpa.lapor, PROFIL.landscape);
  assert.ok(ada(tanpa.warnings, 'C3'), tanpa.warnings.join('\n'));
  const dengan = kumpul();
  cekBab(script, [[[0, 12]], [[0, 20]], [[0, 20]]], dengan.lapor, PROFIL.landscape);
  assert.ok(!ada(dengan.warnings, 'C3'), dengan.warnings.join('\n'));
});

test('validasiExplainer menjalankan aturan bab', async () => {
  const {warnings} = await validasiExplainer({format: 'landscape', scenes: [stage(kata(40), {bab: 'A'}), beat, stage(kata(40), {bab: 'B'})]}, 'uji-format', OPTS);
  assert.ok(ada(warnings, 'C2'), warnings.join('\n'));
});

test('H1 batas kata hook mengikuti format', async () => {
  const hook = {type: 'hook', duration: 90, latar: LATAR, baris1: 'BOTOL PLASTIK', baris2: 'KOK RAPUH?', narasi: `Kok ${kata(29)}`, utama: {kind: 'prop', src: MEME, x: 50, y: 54, masuk: 'none', delay: 0}};
  const l = await validasiExplainer({format: 'landscape', scenes: [hook, beat, stage('Botol plastik itu rapuh.')]}, 'uji-format', OPTS);
  assert.ok(!ada(l.warnings, 'H1'), l.warnings.join('\n'));
  const s = await validasiExplainer({format: 'short', scenes: [hook, beat, stage('Botol plastik itu rapuh.')]}, 'uji-format', OPTS);
  assert.ok(ada(s.warnings, 'H1'), s.warnings.join('\n'));
});

test('N3 landscape dihitung per bab', async () => {
  const naskah = (n2) => ({
    format: 'landscape',
    scenes: [stage('Padahal botol itu rapuh.', {bab: 'A'}), beat, stage(`${n2} botol itu kuat.`, {bab: 'B'})],
  });
  const beda = await validasiExplainer(naskah('Padahal'), 'uji-format', OPTS);
  assert.ok(!ada(beda.warnings, 'N3'), beda.warnings.join('\n'));
  const sama = await validasiExplainer({format: 'landscape', scenes: [stage('Padahal botol itu rapuh. Padahal tutupnya kuat.', {bab: 'A'}), beat, stage('Botol itu kuat.', {bab: 'B'})]}, 'uji-format', OPTS);
  assert.ok(ada(sama.warnings, 'N3'), sama.warnings.join('\n'));
});

test('bab spasi-saja kena C1 dan judul bab > 30 huruf kena C4', () => {
  const spasi = kumpul();
  cekBab(
    {format: 'landscape', scenes: [stage(kata(40), {bab: '   '}), stage(kata(40), {bab: 'Isi'}), stage(kata(40), {bab: 'Akhir'})]},
    null,
    spasi.lapor,
    PROFIL.landscape,
  );
  assert.ok(ada(spasi.warnings, 'C1'), spasi.warnings.join('\n'));

  const panjang = kumpul();
  cekBab(
    {
      format: 'landscape',
      scenes: [
        stage(kata(40), {bab: 'Pembuka'}),
        stage(kata(40), {bab: 'Judul bab ini terlalu panjang melebihi tiga puluh huruf'}),
        stage(kata(40), {bab: 'Akhir'}),
      ],
    },
    null,
    panjang.lapor,
    PROFIL.landscape,
  );
  assert.ok(ada(panjang.warnings, 'C4'), panjang.warnings.join('\n'));
});

test('pesan batas durasi C3 dan D4/D3 tidak membulatkan ke angka batas', () => {
  const c3 = kumpul();
  cekBab(
    {format: 'landscape', scenes: [stage('Botol plastik itu.', {bab: 'Pendek'}), stage(kata(40), {bab: 'B'}), stage(kata(40), {bab: 'C'})]},
    [[[0, 9.2]], [[0, 20]], [[0, 20]]],
    c3.lapor,
    PROFIL.landscape,
  );
  assert.ok(c3.warnings.some((w) => w.includes('C3') && !w.includes('cuma 10 detik')), c3.warnings.join('\n'));

  const d4 = kumpul();
  cekDurasi({format: 'landscape', scenes: [stage('Botol.')]}, [[[0, 179.2]]], d4.lapor, PROFIL.landscape);
  assert.ok(d4.warnings.some((w) => w.includes('D4') && !w.includes('180 detik terlalu')), d4.warnings.join('\n'));
});

test('S1: format naskah tidak dikenal ditolak cekSkemaNaskah', () => {
  const errors = [];
  cekSkemaNaskah({format: 'long'}, {err: (w, m) => errors.push(`${w}: ${m}`), warn: () => {}});
  assert.ok(errors.some((e) => e.includes('S1') && e.includes('format')), errors.join('\n'));
});

test('cek-frame menolak flag --format tanpa nilai', () => {
  assert.throws(
    () => execFileSync(process.execPath, ['scripts/cek-frame.mjs', 'nasi-warm', '--format'], {encoding: 'utf8', stdio: 'pipe', timeout: 5000}),
    (err) => err.status === 1 && err.stderr.includes('--format harus short atau landscape'),
  );
});
