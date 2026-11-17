import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';

const F = await importTs('src/explainer/format.ts');

test('naskah tanpa format dianggap short', () => {
  assert.equal(F.profilNaskah({}).format, 'short');
  assert.equal(F.profilNaskah(undefined).format, 'short');
  assert.equal(F.profilNaskah({format: 'landscape'}).format, 'landscape');
});

test('profilDari memilih format dari orientasi kanvas', () => {
  assert.equal(F.profilDari(1080, 1920).format, 'short');
  assert.equal(F.profilDari(1920, 1080).format, 'landscape');
});

test('area aman short sama dengan SAFE_SHORT', async () => {
  const {SAFE_SHORT, FORMAT_SIZE} = await importTs('src/lib/safe.ts');
  const {width: W, height: H} = FORMAT_SIZE.short;
  const a = F.PROFIL.short.aman;
  assert.ok(Math.abs(a.kiri - (SAFE_SHORT.left / W) * 100) < 1e-9);
  assert.ok(Math.abs(a.kanan - (100 - (SAFE_SHORT.right / W) * 100)) < 1e-9);
  assert.ok(Math.abs(a.atas - (SAFE_SHORT.top / H) * 100) < 1e-9);
  assert.ok(Math.abs(a.bawah - (100 - (SAFE_SHORT.bottom / H) * 100)) < 1e-9);
});

test('profil short sama dengan angka engine lama', () => {
  assert.deepEqual(F.PROFIL.short.hook, {top: '15%', side: 56, font1: 92, font2: 84, lebar1: 960, lebar2: 936});
  assert.equal(F.PROFIL.short.durasi.max, 60);
  assert.deepEqual(F.PROFIL.short.kanvas, {w: 1080, h: 1920});
  assert.deepEqual(F.PROFIL.landscape.kanvas, {w: 1920, h: 1080});
});

test('jokeMinimal mengikuti durasi di landscape', () => {
  assert.equal(F.jokeMinimal(F.PROFIL.short, 55), 2);
  assert.equal(F.jokeMinimal(F.PROFIL.landscape, 200), 4);
  assert.equal(F.jokeMinimal(F.PROFIL.landscape, 400), 7);
});
