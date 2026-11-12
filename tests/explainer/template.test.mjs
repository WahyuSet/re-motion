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
