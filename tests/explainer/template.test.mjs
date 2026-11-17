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
import {execFileSync} from 'node:child_process';
import {templateLatar, templateNaskah} from '../../scripts/lib/explainer-template.mjs';

// Template short lama, diambil dari buat-explainer.mjs sebelum template dipindah (acuan "tidak berubah").
const templateLama = (slug, varName, title) => {
  const src = execFileSync('git', ['show', '9a63feb:scripts/buat-explainer.mjs'], {encoding: 'utf8'});
  const isi = src.split('const template = `')[1].split('`;\n\nawait fs.writeFile(dataFile')[0];
  return new Function('slug', 'varName', 'title', `return \`${isi}\`;`)(slug, varName, title);
};

test('templateRencana long menambah bagian Bab dan 4 baris joke', () => {
  const long = templateRencana('X', {long: true});
  assert.ok(long.includes('## Bab'));
  assert.ok(long.indexOf('## Bab') < long.indexOf('## Narasi'));
  assert.equal(bacaTabelHook(long).length, 5);
  assert.equal((long.split('## Komedi')[1].split('## Peta Visual')[0].match(/^\| \d \|/gm) ?? []).length, 4);
  assert.ok(!templateRencana('X').includes('## Bab'));
});

test('templateNaskah short sama persis dengan template lama', () => {
  const baru = templateNaskah({slug: 'uji', varName: 'uji', title: 'Uji'});
  assert.equal(baru, templateLama('uji', 'uji', 'Uji'));
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
