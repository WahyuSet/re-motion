import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const FILE = '.claude/skills/video-3d/SKILL.md';
const baca = () => fs.readFileSync(FILE, 'utf8').replaceAll('\r\n', '\n');

test('SKILL.md ringkas dan bernama video-3d', () => {
  const isi = baca();
  assert.ok(isi.trimEnd().split('\n').length <= 60);
  assert.match(isi, /^---\nname: video-3d\n/);
});

test('SKILL.md memuat seluruh alur', () => {
  const isi = baca();
  for (const kata of ['3d:baru', 'cek:3d', '3d:uji', '3d:render', 'cek:explainer', 'latarVideo', 'referensi/katalog.md']) {
    assert.ok(isi.includes(kata), kata);
  }
});

test('SKILL.md memuat aturan berhenti', () => {
  const isi = baca();
  assert.ok(isi.includes('butuh set baru'));
  assert.match(isi, /Dilarang menulis.*Python/);
  assert.match(isi, /3 kali/);
});

test('skill video-explainer tidak berubah', () => {
  execFileSync('git', ['diff', '--quiet', '062115e', '--', '.claude/skills/video-explainer']);
});
