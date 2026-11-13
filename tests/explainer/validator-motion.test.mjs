import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';
import {hitungSfxKomedi} from '../../scripts/lib/explainer-cek/motion.mjs';

const OPTS = {props: [], rencana: null};
const beat = {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.'};
const naskah = (...scenes) => ({format: 'short', scenes: [...scenes, beat]});
const stage = (items) => ({type: 'stage', duration: 90, latar: 'latar/gandum-tropis-1.png', narasi: 'Botol plastik itu rapuh.', items});
const prop = (extra) => ({kind: 'prop', src: 'props/air-botol-retak.png', x: 50, y: 50, delay: 0, ...extra});
const ada = (pesan, kode) => pesan.some((m) => m.includes(kode));

test('M1: scene stage dengan 2 aksi jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(
    naskah(stage([prop({aksi: [{type: 'jump', di: 'plastik'}, {type: 'move', di: 'rapuh', toX: 40}]})]), stage([prop()])),
    'uji-motion',
    OPTS,
  );
  assert.ok(ada(warnings, 'scene 1 (stage): M1'), warnings.join(' | '));
});

test('M2: semua masuk pop (default) jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(naskah(stage([prop(), prop({x: 20, masuk: 'pop'})]), stage([prop()])), 'uji-motion', OPTS);
  assert.ok(ada(warnings, 'scene 1 (stage): M2'), warnings.join(' | '));
});

test('M2: dua jenis masuk lolos', async () => {
  const {warnings} = await validasiExplainer(naskah(stage([prop(), prop({x: 20, masuk: 'drop'})]), stage([prop()])), 'uji-motion', OPTS);
  assert.ok(!ada(warnings, 'scene 1 (stage): M2'), warnings.join(' | '));
});

test('M3: scene stage tanpa move jadi peringatan; hook tidak wajib move', async () => {
  const hook = {type: 'hook', duration: 90, latar: 'latar/gandum-tropis-2.png', baris1: 'A', baris2: 'B?', narasi: 'Botol plastik kok rapuh?', items: [prop()]};
  const {warnings} = await validasiExplainer(naskah(hook, stage([prop()])), 'uji-motion', OPTS);
  assert.ok(ada(warnings, 'scene 2 (stage): M3'), warnings.join(' | '));
  assert.ok(!ada(warnings, 'scene 1 (hook): M3'), warnings.join(' | '));
});

test('M4: video tanpa peek jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(naskah(stage([prop()]), stage([prop()])), 'uji-motion', OPTS);
  assert.ok(ada(warnings, 'M4'), warnings.join(' | '));
});

test('hitungSfxKomedi menghitung default jump/squash/centang/silang dan mengabaikan sfx:false', () => {
  const script = naskah(
    stage([
      prop({aksi: [{type: 'jump'}, {type: 'squash'}, {type: 'jump', sfx: false}]}),
      {kind: 'simbol', simbol: 'centang', x: 50, y: 30},
      {kind: 'simbol', simbol: 'silang', x: 50, y: 30, sfx: false},
      prop({sfx: 'pop'}),
    ]),
  );
  assert.equal(hitungSfxKomedi(script), 3);
});

test('M5: kurang dari 3 SFX komedi jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(naskah(stage([prop()]), stage([prop()])), 'uji-motion', OPTS);
  assert.ok(ada(warnings, 'M5'), warnings.join(' | '));
});

test('M6: tanpa teks ukuran<=32 berotasi jadi peringatan', async () => {
  const {warnings} = await validasiExplainer(naskah(stage([prop(), {kind: 'teks', teks: 'Lurus', x: 50, y: 20, ukuran: 30}])), 'uji-motion', OPTS);
  assert.ok(ada(warnings, 'M6'), warnings.join(' | '));
});

test('M6: teks celetukan kecil miring lolos', async () => {
  const {warnings} = await validasiExplainer(naskah(stage([prop(), {kind: 'teks', teks: 'Miring', x: 50, y: 20, ukuran: 30, rotate: -6}])), 'uji-motion', OPTS);
  assert.ok(!ada(warnings, 'M6'), warnings.join(' | '));
});
