import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {isiLengkap, muatKatalog} from '../../scripts/3d/lib/katalog.mjs';
import {buatMarkdown, FILE_MD} from '../../scripts/3d/katalog-md.mjs';

const katalog = muatKatalog();
const daftarSet = Object.entries(katalog.set);

test('katalog memuat semua set resmi', () => {
  assert.deepEqual(Object.keys(katalog.set).sort(), ['potongan-keramik', 'potongan-plafon', 'potongan-udara', 'ruang-primitif', 'rumah-luar']);
  assert.equal(katalog.versi, 1);
});

test('zona subjek setiap kamera berada di area aman Shorts', () => {
  for (const [nama, set] of daftarSet) {
    for (const [namaKamera, k] of Object.entries(set.kamera)) {
      if (k.prop) {
        assert.ok(!k.hook, `${nama}/${namaKamera}: kamera prop tidak boleh hook`);
        continue;
      }
      const [kiri, atas, kanan, bawah] = k.zona_subjek;
      const label = `${nama}/${namaKamera}`;
      assert.ok(kanan - kiri >= 50, `${label} lebar`);
      assert.ok(kiri >= 7, `${label} kiri`);
      assert.ok(kanan <= 86, `${label} kanan`);
      assert.ok(atas >= 13, `${label} atas`);
      assert.ok(bawah <= 73.5, `${label} bawah`);
      if (k.hook) assert.ok(atas >= 28, `${label} hook di bawah judul`);
    }
  }
});

test('isi, butuh, dan syarat hanya menunjuk nilai yang terdaftar', () => {
  for (const [nama, set] of daftarSet) {
    for (const [kunci, def] of Object.entries(set.isi)) {
      assert.ok(def.pilihan.includes(def.bawaan), `${nama}.${kunci}`);
    }
    for (const [kunci, nilai] of Object.entries(set.syarat_hook)) {
      assert.ok(set.isi[kunci]?.pilihan.includes(nilai), `${nama} syarat_hook ${kunci}`);
    }
    for (const [jenis, g] of Object.entries(set.gerak)) {
      for (const b of g.butuh ?? []) assert.ok(set.gerak[b], `${nama}/${jenis} butuh ${b}`);
      for (const [kunci, nilai] of Object.entries(g.syarat_isi ?? {})) {
        for (const v of nilai) assert.ok(set.isi[kunci]?.pilihan.includes(v), `${nama}/${jenis} syarat ${kunci}=${v}`);
      }
    }
  }
});

test('isiLengkap mengisi nilai bawaan', () => {
  assert.deepEqual(isiLengkap(katalog.set['rumah-luar'], {awal: 'terbuka'}), {jendela: 'kebalik', awal: 'terbuka'});
});

test('nama @gerak di file set sama persis dengan katalog', () => {
  for (const [nama, set] of daftarSet) {
    const file = `scripts/blender/set/${set.file}`;
    if (!fs.existsSync(file)) continue;
    const tertulis = [...fs.readFileSync(file, 'utf8').matchAll(/@gerak\("([^"]+)"\)/g)].map((m) => m[1]).sort();
    assert.deepEqual(tertulis, Object.keys(set.gerak).sort(), nama);
  }
});

test('referensi/katalog.md sama dengan hasil generator', () => {
  assert.equal(fs.readFileSync(FILE_MD, 'utf8').replaceAll('\r\n', '\n'), buatMarkdown(katalog));
});
