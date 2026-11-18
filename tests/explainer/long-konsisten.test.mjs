import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {importTs} from '../../scripts/lib/load-script.mjs';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';
import {cekAlurLong} from '../../scripts/lib/explainer-cek/bab.mjs';
import {formatDariFile, masalahLatarLong, UKURAN_FLOW} from '../../scripts/lib/flow-format.mjs';

const {PROFIL} = await importTs('src/explainer/format.ts');
const T = await importTs('src/explainer/timing.ts');
const {prepareExplainerScript} = await importTs('src/explainer/prep.ts');

const L = PROFIL.landscape;
const S = PROFIL.short;
const OPTS = {props: [], rencana: null};
const LATAR = 'latar/gandum-tropis-1.png';
const NARASI = 'Botol plastik itu rapuh kena panas.';
const prop = (src, extra = {}) => ({kind: 'prop', src: `props/${src}.png`, x: 30, y: 55, width: 300, delay: 0, masuk: 'pop', ...extra});
const stage = (items, extra = {}) => ({type: 'stage', duration: 90, latar: LATAR, narasi: NARASI, items, ...extra});
const naskah = (...scenes) => ({format: 'landscape', scenes: [...scenes, stage([]), stage([])]});
const ada = (pesan, kode, lokasi = '') => pesan.some((m) => m.includes(` ${kode} `) && m.startsWith(lokasi));
const cek = async (script) => (await validasiExplainer(script, 'uji-long', OPTS)).warnings;
const words = [{word: 'satu', start: 0, end: 10, highlight: false}];
const kumpul = () => {
  const warnings = [];
  return {warnings, lapor: {err: (w, m) => warnings.push(`${w}: ${m}`), warn: (w, m) => warnings.push(`${w}: ${m}`)}};
};

test('nilai short tidak berubah', () => {
  assert.deepEqual(S.subtitle, {side: 72, bottom: 430, fontSize: 40});
  assert.deepEqual(S.gerak, {slideX: 520, keluarX: 480, pulseFrame: null, pulseHalus: false});
  assert.equal(S.bannerStage.fontSize, 48);
  assert.equal(S.beat.fontSize, 52);
  assert.equal(S.ritme, null);
});

test('landscape: subtitle dan judul stage muat di zonanya', () => {
  const {h} = L.kanvas;
  const tinggiSubtitle = L.subtitle.fontSize * 1.25 + 20;
  assert.ok(((h - L.subtitle.bottom - tinggiSubtitle) / h) * 100 >= L.subtitleAtas);
  const bawahJudul = (parseFloat(L.bannerStage.top) / 100) * h + 24 + L.bannerStage.fontSize * 1.25;
  assert.ok((bawahJudul / h) * 100 <= L.zonaJudul.stageBerjudul);
});

test('pulse tanpa durasi: short sampai akhir scene, long singkat dan melemah', () => {
  const item = {x: 50, y: 50, aksi: [{type: 'pulse', delay: 0, skala: 1.2}]};
  assert.equal(T.waktuItem(item, words, 300).aksi[0].endAt, 300);
  assert.equal(T.waktuItem(item, words, 300, L.gerak).aksi[0].endAt, L.gerak.pulseFrame);
  const akhir = T.hitungTransformItem({...item, float: false, masuk: 'none'}, L.gerak.pulseFrame, 30, words, 300, L.gerak);
  assert.ok(Math.abs(akhir.scaleX - 1) < 1e-9);
});

test('slide di long mulai dari luar area item, short tetap 520 px', () => {
  const item = {x: 50, y: 50, masuk: 'slide-left', float: false};
  assert.equal(T.hitungTransformItem(item, 0, 30, words, 90).tx, 520);
  assert.equal(T.hitungTransformItem(item, 0, 30, words, 90, L.gerak).tx, L.gerak.slideX);
});

test('item nempel menempel ke tepi layar dan tidak mengambang', () => {
  const tf = {x: 50, y: 50, originY: 'center'};
  assert.deepEqual(T.jangkarItem({x: 50, y: 50}, tf), {left: '50%', top: '50%', anchor: 'translate(-50%, -50%)', origin: '50% 50%'});
  assert.equal(T.jangkarItem({x: 50, y: 50, nempel: 'kanan-bawah'}, tf).left, '100%');
  assert.equal(T.jangkarItem({x: 50, y: 50, nempel: 'kiri-bawah'}, tf).top, '100%');
  const diam = T.hitungTransformItem({x: 50, y: 50, masuk: 'none', nempel: 'bawah'}, 40, 30, words, 90, L.gerak);
  assert.equal(diam.ty, 0);
});

test('gerak latar: short selalu zoom-in, long bergantian dan tetap menutup layar', () => {
  for (const i of [0, 1, 2, 3]) assert.deepEqual(T.gerakLatar(i, 0.5, 'short'), {scale: 1.06, geserX: 0});
  assert.notDeepEqual(T.gerakLatar(0, 0.5, 'landscape'), T.gerakLatar(2, 0.1, 'landscape'));
  for (const i of [0, 1, 2, 3]) {
    for (const p of [0, 0.5, 1]) {
      const {scale, geserX} = T.gerakLatar(i, p, 'landscape');
      assert.ok(Math.abs(geserX) <= ((scale - 1) / 2) * 100, `scene ${i} p ${p}`);
    }
  }
});

test('scene pembuka bab di long otomatis bertransisi; short dan pilihan naskah dihormati', async () => {
  const dasar = {type: 'beat', duration: 30, teks: 'x', narasi: 'Halo semua.'};
  const scenes = [{...dasar, bab: 'A'}, {...dasar}, {...dasar, bab: 'B'}, {...dasar, bab: 'C', transition: 'none'}];
  const long = await prepareExplainerScript({format: 'landscape', scenes}, 30);
  assert.deepEqual(long.scenes.map((s) => s.transition), ['none', 'none', 'whip', 'none']);
  const short = await prepareExplainerScript({format: 'short', scenes}, 30);
  assert.ok(short.scenes.every((s) => s.transition === 'none'));
});

test('generate-props membaca format dari naskah dan menolak latar potret', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'flow-format-'));
  await fs.writeFile(path.join(dir, 'a.ts'), "export const a = {\n  format: 'landscape',\n};\n");
  await fs.writeFile(path.join(dir, 'b.ts'), "export const b = {\n  format: 'short',\n};\n");
  assert.equal(await formatDariFile(path.join(dir, 'a.latar.json')), 'landscape');
  assert.equal(await formatDariFile(path.join(dir, 'b.props.json')), 'short');
  assert.equal(await formatDariFile(path.join(dir, 'c.latar.json')), null);
  await fs.rm(dir, {recursive: true});
  assert.equal(UKURAN_FLOW.short, '1024x1024');
  assert.equal(UKURAN_FLOW.landscape, '1792x1024');
  assert.ok(masalahLatarLong({width: 768, height: 1376}));
  assert.ok(masalahLatarLong({width: 800, height: 450}));
  assert.equal(masalahLatarLong({width: 1376, height: 768}), null);
});

test('G1: latar potret di video long jadi peringatan, di short tidak', async () => {
  assert.ok(ada(await cek(naskah(stage([]))), 'G1'));
  assert.ok(!ada(await cek({...naskah(stage([])), format: 'short'}), 'G1'));
});

test('L3: teks long terlalu kecil; short tidak dibatasi', async () => {
  const s = stage([{kind: 'teks', teks: 'KECIL', x: 50, y: 50, ukuran: 34}]);
  assert.ok(ada(await cek(naskah(s)), 'L3'));
  assert.ok(!ada(await cek({...naskah(s), format: 'short'}), 'L3'));
});

test('M7 dan M8: scene long jarang kejadian dan move terlalu pendek', async () => {
  const narasi = Array.from({length: 40}, () => 'botol').join(' ');
  const s = stage([prop('air-botol-retak', {aksi: [{type: 'move', di: 'botol', toX: 34}]})], {narasi});
  const w = await cek(naskah(s));
  assert.ok(ada(w, 'M7', 'scene 1'), w.join('\n'));
  assert.ok(ada(w, 'M8', 'scene 1'), w.join('\n'));
  const jauh = stage([prop('air-botol-retak', {aksi: [{type: 'move', di: 'botol', toX: 60}]})]);
  assert.ok(!ada(await cek(naskah(jauh)), 'M8', 'scene 1'));
});

test('M9: objek utama di sisi yang sama lebih dari 3 scene', async () => {
  const kiri = () => stage([prop('air-botol-retak')]);
  const w = await cek({format: 'landscape', scenes: [kiri(), kiri(), kiri(), kiri()]});
  assert.ok(ada(w, 'M9', 'scene 4'), w.join('\n'));
  const selang = await cek({format: 'landscape', scenes: [kiri(), kiri(), stage([prop('air-botol-retak', {x: 70})]), kiri()]});
  assert.ok(!ada(selang, 'M9'));
});

test('M10: bab isi wajib punya peragaan proses', async () => {
  const bab = (n, items = []) => stage(items, {bab: n});
  const w = await cek({format: 'landscape', scenes: [bab('Pembuka'), bab('Isi'), bab('Kesimpulan')]});
  assert.ok(ada(w, 'M10', 'bab "Isi"'), w.join('\n'));
  const peraga = [
    prop('air-botol-retak', {x: 20, aksi: [{type: 'move', di: 'rapuh', toX: 42}]}),
    prop('meme-kucing-jelasin', {x: 70, masuk: 'grow-up'}),
  ];
  assert.ok(!ada(await cek({format: 'landscape', scenes: [bab('Pembuka'), bab('Isi', peraga), bab('Kesimpulan')]}), 'M10'));
});

test('V7 dan V8: meme terpotong melayang dan meme tembus', async () => {
  const w = await cek(naskah(stage([prop('meme-kucing-kaget')])));
  assert.ok(ada(w, 'V7', 'scene 1 (stage) item 1'), w.join('\n'));
  assert.ok(!ada(w, 'V8'));
  const nempel = await cek(naskah(stage([prop('meme-kucing-kaget', {nempel: 'kiri-bawah'})])));
  assert.ok(!ada(nempel, 'V7'), nempel.join('\n'));
  assert.ok(ada(await cek(naskah(stage([prop('meme-kucing-paw', {nempel: 'kiri-bawah'})]))), 'V8'));
  assert.ok(!ada(await cek({...naskah(stage([prop('meme-kucing-kaget')])), format: 'short'}), 'V7'));
});

test('nempel: bebas area aman tepi, tapi tidak boleh masuk kolom subtitle', async () => {
  const pas = await cek(naskah(stage([prop('meme-kucing-kaget', {width: 320, nempel: 'kiri-bawah'})])));
  assert.ok(!ada(pas, 'A1', 'scene 1') && !ada(pas, 'L2', 'scene 1'), pas.join('\n'));
  assert.ok(ada(await cek(naskah(stage([prop('meme-kucing-kaget', {width: 620, nempel: 'kiri-bawah'})]))), 'L2', 'scene 1'));
  assert.ok(ada(await cek({...naskah(stage([prop('meme-kucing-kaget', {nempel: 'kiri-bawah'})])), format: 'short'}), 'L4'));
});

test('C5 dan C6: posisi jawaban hook dan kail antar bab', () => {
  const script = {format: 'landscape', scenes: Array.from({length: 10}, () => ({narasi: NARASI}))};
  const rencana = (nomor, kail = 'Lalu?') => `## Bab\nJawaban hook: scene ${nomor}\n\n| # | Judul bab | Scene | Pertanyaan | Kail ke bab berikutnya |\n|---|---|---|---|---|\n| 1 | A | 1-5 | x | ${kail} |\n| 2 | B | 6-10 | y | |\n\n## Narasi\n`;
  const jalan = (teks) => {
    const {warnings, lapor} = kumpul();
    cekAlurLong(script, teks, null, lapor, L);
    return warnings;
  };
  assert.deepEqual(jalan(rencana(8)), []);
  assert.ok(ada(jalan(rencana(3)), 'C5', 'scene 3'));
  assert.ok(ada(jalan('## Bab\n| # | Judul |\n|---|---|\n| 1 | A |\n'), 'C5'));
  assert.ok(ada(jalan('## Bab\n| # | Judul |\n|---|---|\n| 1 | A |\n'), 'C6'));
  assert.ok(ada(jalan(rencana(8, '')), 'C6'));
});
