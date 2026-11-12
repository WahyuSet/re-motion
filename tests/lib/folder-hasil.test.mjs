import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {folderHasil, formatYoutubeTxt, jenisVideo} from '../../scripts/lib/folder-hasil.mjs';

test('jenisVideo membedakan explainer dan sejarah', () => {
  assert.equal(jenisVideo('token-listrik'), 'explainer');
  assert.equal(jenisVideo('danau-toba'), 'sejarah');
});

test('folderHasil = out/<jenis>/<slug>', () => {
  assert.equal(folderHasil('token-listrik'), path.resolve('out', 'explainer', 'token-listrik'));
  assert.equal(folderHasil('danau-toba'), path.resolve('out', 'sejarah', 'danau-toba'));
});

test('formatYoutubeTxt menggabung judul, deskripsi, tags dalam 1 teks', () => {
  const teks = formatYoutubeTxt({judul: 'Judul A', deskripsi: 'Baris 1\n\nBaris 2', tags: 'a, b'});
  assert.equal(teks, '=== JUDUL ===\nJudul A\n\n=== DESKRIPSI ===\nBaris 1\n\nBaris 2\n\n=== TAGS ===\na, b\n');
});
