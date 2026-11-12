import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';
import {bacaThumbnail} from '../../scripts/lib/explainer-cek/hook.mjs';

const beat = {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.', items: [{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 54}]};
const naskah = ({baris1 = 'RAK TELUR DI PINTU KULKAS', src = 'props/air-botol-retak.png'} = {}) => ({
  format: 'short',
  thumbnail: {baris1, baris2: 'KOK BIKIN CEPAT RUSAK?', latar: 'latar/gandum-tropis-1.png', src},
  scenes: [
    {
      type: 'hook',
      duration: 100,
      latar: 'latar/gandum-tropis-1.png',
      baris1,
      baris2: 'KOK BIKIN CEPAT RUSAK?',
      narasi: 'Kulkas dikasih rak telur di pintu, kok malah bikin telur cepat rusak?',
      items: [{kind: 'prop', src: 'props/air-botol-retak.png', x: 40, y: 56, delay: 0}],
    },
    beat,
  ],
});
const rencana = (thumb) =>
  [
    '## Hook',
    '| # | Rumus | Narasi | b1 | b2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
    ...[1, 2, 3, 4, 5].map((n) => `| ${n} | r | a | b | c | 2 | 2 | 2 | 1 | 2 | 9 |`),
    '',
    'Terpilih: #1',
    '',
    thumb,
    '',
    '## Narasi',
    'isi',
  ].join('\r\n');
const THUMB_OK = '## Thumbnail\nSubjek lengkap: rak telur di pintu kulkas\nGambar: props/air-botol-retak.png\nUji 1 detik: orang tahu ini soal telur di pintu kulkas';
const PROPS = [{name: 'air-botol-retak', prompt: 'x', untuk: 'rak telur di pintu'}];
const cek = (script, thumb = THUMB_OK, slug = 'uji-thumb2') =>
  validasiExplainer(script, slug, {props: PROPS, rencana: rencana(thumb)});
const ada = (pesan, kode) => pesan.some((m) => m.includes(` ${kode} `));

test('bacaThumbnail membaca subjek dan gambar (CRLF)', () => {
  assert.deepEqual(bacaThumbnail(rencana(THUMB_OK)), {
    subjek: 'rak telur di pintu kulkas',
    gambar: 'props/air-botol-retak.png',
    uji: 'orang tahu ini soal telur di pintu kulkas',
  });
});

test('judul yang memuat subjek lengkap lolos H5 dan T1', async () => {
  const {warnings} = await cek(naskah());
  assert.ok(!ada(warnings, 'H5') && !ada(warnings, 'T1') && !ada(warnings, 'R3'), warnings.join(' | '));
});

test('H5: judul tanpa "kulkas" jadi peringatan untuk thumbnail dan hook', async () => {
  const {warnings} = await cek(naskah({baris1: 'ADA RAK TELUR DI PINTU'}));
  const h5 = warnings.filter((w) => w.includes(' H5 '));
  assert.equal(h5.length, 2, warnings.join(' | '));
  assert.ok(h5.every((w) => w.includes('kulkas')), warnings.join(' | '));
});

test('T1: thumbnail.src berbeda dari Gambar di rencana jadi peringatan', async () => {
  const {warnings} = await cek(naskah({src: 'props/meme-kucing-paw.png'}));
  assert.ok(ada(warnings, 'T1'), warnings.join(' | '));
});

test('T1: Gambar yang bukan prop di props.json jadi peringatan', async () => {
  const thumb = THUMB_OK.replace('props/air-botol-retak.png', 'props/meme-kucing-paw.png');
  const {warnings} = await cek(naskah({src: 'props/meme-kucing-paw.png'}), thumb);
  assert.ok(ada(warnings, 'T1'), warnings.join(' | '));
});

test('R3: rencana tanpa bagian Thumbnail atau subjek jadi peringatan', async () => {
  const {warnings} = await cek(naskah(), '');
  assert.ok(ada(warnings, 'R3'), warnings.join(' | '));
});

test('H5/T1/R3 tidak berlaku untuk slug LEGACY', async () => {
  const {warnings} = await cek(naskah({baris1: 'ADA RAK TELUR DI PINTU'}), '', 'token-listrik');
  assert.ok(!ada(warnings, 'H5') && !ada(warnings, 'T1') && !ada(warnings, 'R3'), warnings.join(' | '));
});
