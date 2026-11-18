# PR #1 (`feat/explainer-long`) Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menutup temuan Important dan Minor hasil code review PR #1 (`feat/explainer-long`) sebelum merge ke `main`.

**Architecture:** Seluruh perbaikan dikerjakan pada branch `feat/explainer-long` di git worktree terpisah agar perubahan lokal yang belum di-commit di `main` (`src/explainer/daftar.ts`, `charger-nyolok`, `radiasi-hp`) tetap aman. Perbaikan difokuskan pada empat area kecil yang terisolasi: aturan & tampilan `bab` + pesan batas durasi, validasi runtime `format` & argumen CLI `--format`, portabilitas `template.test.mjs` + sinkronisasi template rencana, serta penambahan cakupan test validator format long.

**Tech Stack:** Remotion 4.0.539, React 19, TypeScript, Node `node:test` (`node --test`), esbuild (`importTs`), git worktree.

**Spec:** Hasil Code Review PR #1 (`WahyuSet/re-motion#1`, commit `a656d71` dibanding base `9a63feb`), merujuk pada aturan di `.claude/skills/video-explainer/referensi/long.md` dan plan awal `docs/superpowers/plans/2026-11-17-explainer-long.md`.

## Global Constraints

- **Jangan ubah workspace `main` yang sedang kotor**: jalankan seluruh edit, test, dan commit di worktree baru pada branch `feat/explainer-long` (`superpowers:using-git-worktrees`).
- Jangan ubah engine sejarah (`src/HistoryVideo.tsx`, `src/Thumbnail.tsx`, `src/theme.ts`, `src/types.ts`, `src/scenes/*`, `src/components/*`, `src/data/*`, `src/lib/safe.ts`, `src/lib/layout.ts`).
- Jangan ubah nilai `PROFIL.short` dan perilaku video short yang sudah ada (`tests/explainer/patokan.test.mjs` dan `tests/explainer/validator-kotak.test.mjs` harus tetap lulus tanpa modifikasi).
- Format pesan validator tetap: `lokasi: KODE pesan → PERBAIKI: langkah` dalam bahasa Indonesia.
- Semua perubahan kode harus lulus `npm run typecheck`, `node --test tests/explainer/*.test.mjs`, dan `node --test tests/lib/*.test.mjs`.

## Review Focus

1. **`bab` berisi spasi (`'   '`)** → harus dianggap kosong oleh `nomorBab`, `tampilBanner`, `segmenNarasi`, dan memicu peringatan `C1` di `cekBab` (bukan lolos sebagai bab valid).
2. **Judul `bab` > 30 huruf** → harus memicu peringatan `C4` di `cekBab`, dan `BabBanner` memakai `whiteSpace: 'nowrap'` supaya tidak turun ke baris 2 dan menabrak judul stage/beat/diagram di `top: '10%'`.
3. **Naskah `short` yang tetap memakai `bab` (mengabaikan warning `C0`)** → `tampilBanner` di `ExplainerVideo` tidak boleh merender `BabBanner` di pojok kanan atas area merah Shorts.
4. **CLI `node scripts/cek-frame.mjs <slug> --format` tanpa nilai** → harus gagal cepat dengan exit code 1 dan pesan error yang jelas, bukan diam-diam mengabaikan `--format`.
5. **Shallow clone / repo tanpa commit `9a63feb`** → `tests/explainer/template.test.mjs` harus lulus tanpa memanggil `git show` atau `new Function`.

---

### Task 0: Siapkan worktree terisolasi di branch `feat/explainer-long`

**Files:**
- Tidak ada file repo yang diubah; membuat worktree terpisah dari checkout `main`.

- [ ] **Step 1: Pastikan branch lokal `feat/explainer-long` sinkron dengan `origin/feat/explainer-long` dan buat worktree**

Gunakan skill `superpowers:using-git-worktrees` (atau perintah git berikut di luar folder repo utama, misalnya `..\remotion-pr1-fix`):

```bash
git fetch origin feat/explainer-long
git worktree add -B feat/explainer-long ../remotion-pr1-fix origin/feat/explainer-long
```

Jika `node_modules` tidak di-install ulang, buat junction ke `d:\Learning\remotion\node_modules` (atau jalankan `npm ci`) lalu verifikasi baseline di worktree sebelum mulai mengedit:

```bash
npm run typecheck
node --test tests/explainer/*.test.mjs
```

Expected: `tsc` keluar 0, seluruh 152 test di `tests/explainer/*.test.mjs` PASS.

---

### Task 1: Validasi `bab` kosong/panjang (`≤ 30`), `BabBanner` anti-wrap, filter format, dan pembulatan pesan batas

**Files:**
- Modify: `src/explainer/bab.ts:1-11`
- Modify: `src/explainer/BabBanner.tsx:10-44`
- Modify: `src/explainer/ExplainerVideo.tsx:127-142`
- Modify: `scripts/lib/explainer-cek/bab.mjs:1-32`
- Modify: `scripts/lib/explainer-cek/narasi.mjs:90-99, 130-139`
- Modify: `.claude/skills/video-explainer/SKILL.md:57`
- Modify: `.claude/skills/video-explainer/referensi/long.md:21`
- Test: `tests/explainer/bab.test.mjs`, `tests/explainer/validator-format.test.mjs`

**Interfaces:**
- Consumes: `FormatExplainer`, `profilDari` dari `src/explainer/format.ts` (tetap tanpa import React/Remotion di `bab.ts`).
- Produces:
  - `nomorBab(scenes: {bab?: string}[], index: number): number | null` — mengabaikan `bab` kosong/hanya spasi (`!bab?.trim()`).
  - `tampilBanner(index: number, scene: {bab?: string}, format: FormatExplainer = 'landscape'): boolean` — `index > 0 && format === 'landscape' && Boolean(scene.bab?.trim())`.
  - `MAX_JUDUL_BAB = 30` (di `bab.mjs`), `C1` untuk `bab` kosong/spasi (baik di scene 1 maupun scene lain dengan `bab: '   '`), dan `C4` untuk `bab.trim().length > 30`.

- [ ] **Step 1: Tulis test yang gagal di `tests/explainer/bab.test.mjs` dan `tests/explainer/validator-format.test.mjs`**

Tambahkan ke `tests/explainer/bab.test.mjs`:
```js
test('bab spasi-saja diabaikan dan banner tidak tampil di format short', () => {
  assert.equal(nomorBab([{bab: '   '}, {bab: 'Isi'}], 0), null);
  assert.equal(nomorBab([{bab: '   '}, {bab: 'Isi'}], 1), 1);
  assert.equal(tampilBanner(2, {bab: '   '}), false);
  assert.equal(tampilBanner(2, {bab: 'Isi'}, 'short'), false);
  assert.equal(tampilBanner(2, {bab: 'Isi'}, 'landscape'), true);
});
```

Tambahkan ke `tests/explainer/validator-format.test.mjs`:
```js
test('bab spasi-saja kena C1 dan judul bab > 30 huruf kena C4', () => {
  const spasi = kumpul();
  cekBab(
    {format: 'landscape', scenes: [stage(kata(40), {bab: '   '}), stage(kata(40), {bab: 'Isi'}), stage(kata(40), {bab: 'Akhir'})]},
    null,
    spasi.lapor,
    PROFIL.landscape,
  );
  assert.ok(ada(spasi.warnings, 'C1'), spasi.warnings.join('\n'));

  const panjang = kumpul();
  cekBab(
    {
      format: 'landscape',
      scenes: [
        stage(kata(40), {bab: 'Pembuka'}),
        stage(kata(40), {bab: 'Judul bab ini terlalu panjang melebihi tiga puluh huruf'}),
        stage(kata(40), {bab: 'Akhir'}),
      ],
    },
    null,
    panjang.lapor,
    PROFIL.landscape,
  );
  assert.ok(ada(panjang.warnings, 'C4'), panjang.warnings.join('\n'));
});

test('pesan batas durasi C3 dan D4/D3 tidak membulatkan ke angka batas', () => {
  const c3 = kumpul();
  cekBab(
    {format: 'landscape', scenes: [stage('Botol plastik itu.', {bab: 'Pendek'}), stage(kata(40), {bab: 'B'}), stage(kata(40), {bab: 'C'})]},
    [[[0, 9.2]], [[0, 20]], [[0, 20]]],
    c3.lapor,
    PROFIL.landscape,
  );
  assert.ok(c3.warnings.some((w) => w.includes('C3') && !w.includes('cuma 10 detik')), c3.warnings.join('\n'));

  const d4 = kumpul();
  cekDurasi({format: 'landscape', scenes: [stage('Botol.')]}, [[[0, 179.2]]], d4.lapor, PROFIL.landscape);
  assert.ok(d4.warnings.some((w) => w.includes('D4') && !w.includes('180 detik terlalu')), d4.warnings.join('\n'));
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `node --test tests/explainer/bab.test.mjs tests/explainer/validator-format.test.mjs`
Expected: FAIL pada ketiga test baru (`nomorBab` menganggap `'   '` sebagai bab, `C4` belum ada, `Math.round(9.7)` menghasilkan `10 detik`).

- [ ] **Step 3: Implementasikan perbaikan pada `bab.ts`, `BabBanner.tsx`, `ExplainerVideo.tsx`, `bab.mjs`, `narasi.mjs`, dan docs**

1. Di `src/explainer/bab.ts`:
   - Impor `type {FormatExplainer} from './format'`.
   - Pakai helper `const judulBab = (scene?: {bab?: string}) => scene?.bab?.trim() ?? '';` untuk `nomorBab` dan `tampilBanner(index, scene, format = 'landscape')`.
2. Di `src/explainer/BabBanner.tsx`:
   - Tambah `whiteSpace: 'nowrap'` pada style kontainer banner (baris 20-39) dan tampilkan `{judul.trim()}`.
3. Di `src/explainer/ExplainerVideo.tsx`:
   - Ubah baris 129: `const profil = profilDari(width, height);` lalu pakai `profil.watermark` untuk `posWatermark` dan teruskan `profil.format` ke `tampilBanner(i, scene, profil.format)`.
4. Di `scripts/lib/explainer-cek/bab.mjs`:
   - Tambah `const MAX_JUDUL_BAB = 30;` dan normalisasi `const judul = (s) => (typeof s?.bab === 'string' ? s.bab.trim() : '');`.
   - Untuk `profil?.format !== 'landscape'`: cek `scenes.some((s) => typeof s.bab === 'string' && s.bab.length > 0)` → `C0`.
   - Untuk `landscape`:
     - Scene 1 tanpa judul valid (`!judul(scenes[0])`) → `C1` (sekali saja).
     - Scene lain (`i > 0`) dengan `scenes[i].bab !== undefined && !judul(scenes[i])` → `C1` `field bab kosong`.
     - Kumpulkan segmen bab berdasarkan `judul(scenes[i])`.
     - Cek `C2` (`bernama.length < MIN_BAB`), `C4` (`b.judul.length > MAX_JUDUL_BAB` → warn `C4 judul bab "${b.judul}" terlalu panjang (${b.judul.length} huruf, batas ${MAX_JUDUL_BAB}). → PERBAIKI: Ringkas jadi pertanyaan atau klaim pendek <= ${MAX_JUDUL_BAB} huruf.`), dan `C3` memakai `Math.floor(b.detik)` di pesan (`b.detik < BAB_MIN_DETIK`).
5. Di `scripts/lib/explainer-cek/narasi.mjs`:
   - Di `segmenNarasi` (baris 95): pakai `const judul = s.bab?.trim();`.
   - Di `cekDurasi` (baris 135 & 137): pakai `Math.ceil(detik)` untuk pesan `D3` dan `Math.floor(detik)` untuk pesan `D4`.
6. Di `.claude/skills/video-explainer/referensi/long.md` (baris 21) dan `.claude/skills/video-explainer/SKILL.md` (baris 57): perbarui `C0-C3` → `C0-C4` dan `C1-C3` → `C1-C4`.

- [ ] **Step 4: Jalankan test & typecheck untuk verifikasi lulus**

Run:
```bash
npm run typecheck
node --test tests/explainer/bab.test.mjs tests/explainer/validator-format.test.mjs tests/explainer/validator-narasi.test.mjs tests/explainer/patokan.test.mjs
```
Expected: `tsc` 0 error, seluruh test PASS.

- [ ] **Step 5: Commit**

```bash
git add src/explainer/bab.ts src/explainer/BabBanner.tsx src/explainer/ExplainerVideo.tsx scripts/lib/explainer-cek/bab.mjs scripts/lib/explainer-cek/narasi.mjs .claude/skills/video-explainer/SKILL.md .claude/skills/video-explainer/referensi/long.md tests/explainer/bab.test.mjs tests/explainer/validator-format.test.mjs
git commit -m "fix(explainer): validasi panjang dan spasi bab, nowrap BabBanner, pesan batas durasi"
```

---

### Task 2: Validasi runtime `script.format` di `skema.mjs` & argumen `--format` di `cek-frame.mjs`

**Files:**
- Modify: `scripts/lib/explainer-cek/skema.mjs:5-42`
- Modify: `scripts/cek-frame.mjs:27-33`
- Test: `tests/explainer/validator-format.test.mjs`

**Interfaces:**
- Produces:
  - `export const FORMAT = ['short', 'landscape'];` di `scripts/lib/explainer-cek/skema.mjs`, dipanggil lewat `cekEnum(script?.format, FORMAT, 'format', 'naskah', lapor)` di `cekSkemaNaskah`.
  - Penolakan `--format` tanpa nilai (exit code 1) di `scripts/cek-frame.mjs`.

- [ ] **Step 1: Tulis test yang gagal di `tests/explainer/validator-format.test.mjs`**

Tambahkan test untuk `cekSkemaNaskah` / `validasiExplainer` dan cek CLI `cek-frame.mjs --format` tanpa nilai:
```js
import {execFileSync} from 'node:child_process';
import {cekSkemaNaskah} from '../../scripts/lib/explainer-cek/skema.mjs';

test('S1: format naskah tidak dikenal ditolak cekSkemaNaskah', () => {
  const errors = [];
  cekSkemaNaskah({format: 'long'}, {err: (w, m) => errors.push(`${w}: ${m}`), warn: () => {}});
  assert.ok(errors.some((e) => e.includes('S1') && e.includes('format')), errors.join('\n'));
});

test('cek-frame menolak flag --format tanpa nilai', () => {
  assert.throws(
    () => execFileSync(process.execPath, ['scripts/cek-frame.mjs', 'nasi-warm', '--format'], {encoding: 'utf8', stdio: 'pipe'}),
    (err) => err.status === 1 && err.stderr.includes('--format harus short atau landscape'),
  );
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `node --test tests/explainer/validator-format.test.mjs`
Expected: FAIL (`cekSkemaNaskah` belum mengecek `format`; `cek-frame.mjs` mencoba membundle Remotion alih-alih langsung gagal dengan exit code 1 di validasi argumen).

- [ ] **Step 3: Implementasikan perbaikan di `skema.mjs` dan `cek-frame.mjs`**

1. Di `scripts/lib/explainer-cek/skema.mjs`:
   - Tambah `export const FORMAT = ['short', 'landscape'];`.
   - Di `cekSkemaNaskah(script, lapor)`, tambah `cekEnum(script?.format, FORMAT, 'format', 'naskah', lapor);`.
2. Di `scripts/cek-frame.mjs` (baris 27-32):
   - Ubah `if (format && !['short', 'landscape'].includes(format))` menjadi `if (iFormat >= 0 && !['short', 'landscape'].includes(format))`, dengan pesan error `--format harus short atau landscape, bukan "${format ?? '(kosong)'}".`.

- [ ] **Step 4: Jalankan test untuk verifikasi lulus**

Run: `node --test tests/explainer/validator-format.test.mjs tests/explainer/validator-skema.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/explainer-cek/skema.mjs scripts/cek-frame.mjs tests/explainer/validator-format.test.mjs
git commit -m "fix(explainer): cek enum format di skema dan tolak --format tanpa nilai di cek-frame"
```

---

### Task 3: Hapus ketergantungan `git show` + `new Function` di `template.test.mjs` & selaraskan `templateRencana` long

**Files:**
- Modify: `tests/explainer/template.test.mjs:27-61`
- Modify: `scripts/lib/explainer-template.mjs:23-35`

**Interfaces:**
- Produces:
  - `tests/explainer/template.test.mjs` menguji `templateNaskah({slug: 'uji', varName: 'uji', title: 'Uji'})` dengan konstanta string snapshot statis (tanpa `child_process`/`git show` dan `new Function`).
  - `templateRencana('X', {long: true})` memuat 5 baris tabel `## Bab` (`1 Pembuka`, `2 TODO`, `3 TODO`, `4 TODO`, `5 Kesimpulan`) agar selaras dengan 5 `bab` pada `SCENE_LONG`.

- [ ] **Step 1: Perbarui `tests/explainer/template.test.mjs` dan tambahkan assertion jumlah baris bab di `templateRencana` long**

1. Di `tests/explainer/template.test.mjs`, sebelum mengedit `template.test.mjs`, ambil keluaran snapshot string lama dari `git show 9a63feb:scripts/buat-explainer.mjs` (untuk `slug = 'uji', varName = 'uji', title = 'Uji'`) sebagai `const EXPECTED_SHORT = ...;` statis, lalu hapus `import {execFileSync} from 'node:child_process';` dan fungsi `templateLama` beserta `new Function(...)`.
2. Di test `'templateRencana long menambah bagian Bab dan 4 baris joke'`, tambahkan assertion bahwa tabel `## Bab` memiliki tepat 5 baris data (`| 1 |` s.d. `| 5 |`), sama dengan jumlah `bab:` di `templateNaskah(..., {long: true})`:
   ```js
   const babRows = long.split('## Bab')[1].split('## Narasi')[0].match(/^\| \d \|/gm) ?? [];
   assert.equal(babRows.length, 5);
   ```

- [ ] **Step 2: Jalankan `tests/explainer/template.test.mjs` dan pastikan assertion `babRows.length === 5` gagal dulu**

Run: `node --test tests/explainer/template.test.mjs`
Expected: FAIL (`Expected values to be strictly equal: 4 !== 5`).

- [ ] **Step 3: Perbarui tabel `## Bab` di `scripts/lib/explainer-template.mjs` (baris 29-33)**

Ubah baris tabel `## Bab` di `templateRencana` menjadi 5 baris (`| 1 | Pembuka | 1-2 | TODO |`, `| 2 | TODO | TODO | TODO |`, `| 3 | TODO | TODO | TODO |`, `| 4 | TODO | TODO | TODO |`, `| 5 | Kesimpulan | TODO | TODO |`).

- [ ] **Step 4: Jalankan `tests/explainer/template.test.mjs` dan pastikan lulus**

Run: `node --test tests/explainer/template.test.mjs`
Expected: PASS, tanpa memanggil `git` atau `new Function`.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/explainer-template.mjs tests/explainer/template.test.mjs
git commit -m "test(explainer): ganti acuan git show dengan snapshot statis dan selaraskan 5 bab rencana"
```

---

### Task 4: Tambah cakupan test `K1`, `L1`, `V6` landscape + verifikasi menyeluruh

**Files:**
- Modify: `tests/explainer/validator-format.test.mjs`

**Interfaces:**
- Tests added untuk memverifikasi perilaku integrasi `validasiExplainer` pada `format: 'landscape'`:
  - `K1` memakai `jokeMinimal(profil, perkiraanDurasi(script, kataJson))` dari `cek-explainer.mjs`.
  - `L1` memakai `PROFIL.landscape.zonaJudul` (`hook: 36`, `stageBerjudul: 18`, `beat: 20`).
  - `V6` memakai kanvas `1920×1080` (`porsiTumpuk`).

- [ ] **Step 1: Tambahkan 3 test integrasi ke `tests/explainer/validator-format.test.mjs`**

1. **`K1` landscape mengikuti durasi video:**
   Buat script `landscape` dengan 3 scene `stage` masing-masing `kata(160)` (`480` kata → `perkiraanDurasi ≈ 201,5` detik → `jokeMinimal = 4`), kirim lewat `validasiExplainer(script, 'uji-komedi-long', {props: [], rencana})` memakai `rencana` berisi `## Komedi` dengan 3 baris joke → verifikasi `ada(warnings, 'K1')` (minimal 4). Uji dengan 4 baris joke valid → tidak ada `K1`.
2. **`L1` zona judul mengikuti format:**
   - Hook `landscape` dengan item `{kind: 'simbol', simbol: 'centang', x: 50, y: 30, width: 100}` (tepi atas `~25,4%` < `36%`) memicu `L1`, sedangkan `y: 55` (`~50,4%`) tidak memicu `L1`.
   - `stage` berjudul (`judul: 'TES'`) dengan `{kind: 'simbol', simbol: 'centang', x: 50, y: 24, width: 100}` lolos `L1` di `landscape` (tepi atas `~19,4%` >= `18%`), tetapi memicu `L1` di `short` (tepi atas `~21,4%` < `22%`).
3. **`V6` tumpang-tindih prop di kanvas `1920×1080`:**
   - Dua prop (`props/meme-kucing-jelasin.png` dan `props/meme-kucing-paw.png`, `width: 300`, `delay: 0`) di `x: 25, y: 50` dan `x: 75, y: 50` tidak memicu `V6`.
   - Dua prop sama (`width: 400`, `delay: 0`) di `x: 45, y: 50` dan `x: 50, y: 50` memicu `V6`.

- [ ] **Step 2: Jalankan test baru dan pastikan lulus (dan verifikasi dengan merusak assertion/input sementara jika perlu untuk memastikan assertion aktif)**

Run: `node --test tests/explainer/validator-format.test.mjs`
Expected: semua test PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/explainer/validator-format.test.mjs
git commit -m "test(explainer): tambah cakupan K1, L1, dan V6 untuk format landscape"
```

- [ ] **Step 4: Verifikasi akhir seluruh suite + smoke check di worktree**

Jalankan semua pemeriksaan berikut di worktree `feat/explainer-long`:
```bash
npm run typecheck
node --test tests/explainer/*.test.mjs
node --test tests/lib/*.test.mjs
node scripts/buat-explainer.mjs uji-long --long
node scripts/cek-explainer.mjs uji-long
```
Pastikan pada output `cek-explainer.mjs uji-long`: **tidak ada** peringatan `C0`, `C1`, `C2`, `C4`.
Setelah cek selesai, hapus file sementara `uji-long`:
```bash
git checkout -- src/explainer/daftar.ts
rm -f src/explainer/data/uji-long.*
```
*(Opsional sebelum merge ke `main`):* jika ada `out/baseline/` dari `main`, jalankan `npm run uji -- NasiWarm PotonganGaji KabelKendor AirKadaluwarsa BataZigzag KlipRoti` untuk memastikan 0 pixel beda pada video short.

- [ ] **Step 5: Push branch `feat/explainer-long` & bersihkan worktree setelah selesai**

```bash
git push origin feat/explainer-long
```
Lalu dari repo utama `d:\Learning\remotion`, hapus worktree sementara (`git worktree remove ../remotion-pr1-fix`) setelah PR #1 siap di-merge.
