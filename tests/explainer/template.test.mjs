import test from 'node:test';
import assert from 'node:assert/strict';
import {templateProps, templateRencana} from '../../scripts/lib/explainer-template.mjs';
import {bacaTabelHook, cekRencana} from '../../scripts/lib/explainer-cek/hook.mjs';

test('templateRencana memuat 5 baris kandidat hook dan heading wajib', () => {
  const teks = templateRencana('Air Kadaluwarsa');
  assert.ok(teks.startsWith('# Rencana: Air Kadaluwarsa'), teks.slice(0, 40));
  for (const h of ['## Hook', '## Thumbnail', '## Narasi', '## Peta Visual', 'Terpilih: #TODO']) {
    assert.ok(teks.includes(h), `tidak ada ${h}`);
  }
  assert.equal(bacaTabelHook(teks).length, 5);
});

test('templateRencana masih TODO sehingga R1 memperingatkan', () => {
  const warnings = [];
  cekRencana(templateRencana('X'), {err: () => {}, warn: (w, m) => warnings.push(`${w}: ${m}`)});
  assert.ok(warnings.some((w) => w.includes('R1')), warnings.join(' | '));
});

test('templateProps punya field untuk', () => {
  const props = templateProps();
  assert.equal(props.length, 1);
  assert.ok(props[0].name && props[0].prompt && props[0].untuk);
});

// ---- Format long (16:9) ----
import {templateLatar, templateNaskah} from '../../scripts/lib/explainer-template.mjs';

// Snapshot string template short lama (sebelum dipindah dari buat-explainer.mjs pada commit 9a63feb).
const EXPECTED_SHORT = `import type {ExplainerScript} from '../types';

// Naskah explainer "Uji". Ikuti .claude/skills/video-explainer/SKILL.md.
// Tulis dulu uji.rencana.md (hook, narasi, peta visual), lalu salin peta ke file ini.
// Cek dengan: npm run cek:explainer -- uji --peta
export const uji: ExplainerScript = {
  format: 'short',
  watermark: '@okesini-id',
  gayaTeks: 'stiker',
  // Isi dua baris ini SETELAH audio narasi dipotong (node scripts/potong-narasi.mjs uji <file-audio>):
  // narasiAudio: 'audio/uji',
  // narasiExt: 'wav',
  youtube: {
    judul: 'TODO Judul Uji',
    deskripsi: 'TODO Deskripsi singkat topik Uji.',
    tags: ['edukasi', 'explainer', 'okesini'],
  },
  // Judul 2 baris utuh dan natural (<= 28 huruf per baris). Baris 1 = sticker putih, Baris 2 = stabilo kuning + sticker putih.
  thumbnail: {
    baris1: 'TODO SUBJEK JELAS',
    baris2: 'KENAPA BISA BEGITU?',
    latar: 'latar/uji-1.png',
    src: 'props/meme-kucing-paw.png',
  },
  scenes: [
    {
      type: 'hook',
      duration: 105,
      latar: 'latar/uji-1.png',
      baris1: 'TODO SUBJEK JELAS',
      baris2: 'KENAPA BISA BEGITU?',
      // Hook Stop-Scroll (wajib 7-14 kata, 1 kalimat ~3 detik, langsung tembak kejanggalan tanpa pengantar):
      narasi: 'TODO kebiasaan singkat sehari-hari, kok bisa muncul *kejanggalan utama* ini?',
      items: [],
    },
    {
      type: 'stage',
      duration: 120,
      latar: 'latar/uji-2.png',
      narasi: 'TODO penjelasan visual pertama dengan celetukan *komedi* dan kata kunci *penting* di dalam kalimat.',
      items: [
        {
          kind: 'prop',
          src: 'props/meme-kucing-paw.png',
          x: 28,
          y: 54,
          width: 300,
          masuk: 'slide-up',
          delay: 0,
          sampai: 'penting',
          aksi: [
            {type: 'wiggle', di: 'penjelasan', rotate: 14, durasi: 18},
            {type: 'move', di: 'komedi', toX: 24, toY: 56, toRotate: -5, durasi: 16},
            {type: 'jump', di: 'penting', dy: 60, durasi: 18},
          ],
        },
        {
          kind: 'simbol',
          simbol: 'tanya',
          x: 46,
          y: 38,
          width: 130,
          masuk: 'pop',
          delay: 4,
          sampai: 'penting',
          aksi: [{type: 'peek', di: 'komedi', dx: 12, dy: -8, rotate: -14, durasi: 12, tahan: 20, sfx: 'boing'}],
        },
        {
          kind: 'teks',
          teks: 'TODO POIN KUNCI',
          x: 50,
          y: 45,
          ukuran: 44,
          warna: '#ffffff',
          kotak: '#1976d2',
          masuk: 'drop',
          sfx: 'boom',
          di: 'penting',
          aksi: [{type: 'squash', di: 'kalimat', durasi: 16}],
        },
      ],
    },
    {
      type: 'beat',
      duration: 55,
      teks: 'Oke, sini gue jelasin.',
      narasi: 'Oke, *sini gue jelasin* alasannya.',
      items: [
        {
          kind: 'prop',
          src: 'props/meme-kucing-jelasin.png',
          x: 50,
          y: 58,
          width: 360,
          masuk: 'pop',
          sfx: 'boing',
          aksi: [{type: 'wiggle', di: 'jelasin', rotate: 12, durasi: 16}],
        },
      ],
    },
    {
      type: 'stage',
      duration: 120,
      latar: 'latar/uji-4.png',
      narasi: 'TODO kesimpulan akhir yang menjawab pertanyaan di awal dengan *jelas*.',
      items: [
        {
          kind: 'simbol',
          simbol: 'centang',
          x: 50,
          y: 45,
          width: 180,
          masuk: 'pop',
          di: 'jelas',
        },
      ],
    },
  ],
};
`;

test('templateRencana long menambah bagian Bab (5 baris) dan 4 baris joke', () => {
  const long = templateRencana('X', {long: true});
  assert.ok(long.includes('## Bab'));
  assert.ok(long.indexOf('## Bab') < long.indexOf('## Narasi'));
  assert.equal(bacaTabelHook(long).length, 5);
  const babRows = long.split('## Bab')[1].split('## Narasi')[0].match(/^\| \d \|/gm) ?? [];
  assert.equal(babRows.length, 5);
  assert.equal((long.split('## Komedi')[1].split('## Peta Visual')[0].match(/^\| \d \|/gm) ?? []).length, 4);
  assert.ok(!templateRencana('X').includes('## Bab'));
});

test('templateNaskah short sama persis dengan template lama', () => {
  const baru = templateNaskah({slug: 'uji', varName: 'uji', title: 'Uji'});
  assert.equal(baru, EXPECTED_SHORT);
  assert.ok(baru.includes("format: 'short'") && !baru.includes('bab:'));
});

test('templateNaskah long: landscape dengan 5 bab dan latar unik', () => {
  const t = templateNaskah({slug: 'uji', varName: 'uji', title: 'Uji', long: true});
  assert.ok(t.includes("format: 'landscape'"));
  assert.equal((t.match(/bab: '/g) ?? []).length, 5);
  const latar = [...t.matchAll(/^ {6}latar: '(latar\/[^']+)'/gm)].map((m) => m[1]);
  assert.equal(new Set(latar).size, latar.length);
  const nama = templateLatar('uji', 'Uji', {long: true}).map((l) => `latar/${l.name}.png`);
  assert.deepEqual(nama, latar);
});
