# Explainer Ramah Model Rendah Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Validator, scaffold, engine kecil, dan skill `video-explainer` diperbarui supaya model AI rendah otomatis menghasilkan hook kuat dan visual yang cocok per klausa narasi.

**Architecture:** Aturan baru ditulis sebagai modul murni di `scripts/lib/explainer-cek/` (satu file per kelompok aturan) yang dipanggil `validasiExplainer`. Engine `src/explainer/` hanya mendapat 3 perbaikan kecil yang kompatibel ke belakang. Skill dipecah jadi `SKILL.md` ramping + `referensi/`.

**Tech Stack:** Node.js ESM (`.mjs`), TypeScript (Remotion), `node:test` + `node:assert/strict`, `importTs` dari `scripts/lib/load-script.mjs`.

**Spec:** `docs/superpowers/specs/2026-11-12-explainer-low-model-design.md`

## Global Constraints

- Jangan sentuh engine sejarah: `src/HistoryVideo.tsx`, `src/Thumbnail.tsx`, `src/theme.ts`, `src/types.ts`, `src/scenes/*`, `src/components/*`, `src/data/*`.
- Jangan ubah naskah video yang ada (`src/explainer/data/*.ts`, `*.props.json`, `*.latar.json`).
- Jangan commit file milik `air-kadaluwarsa` maupun `src/explainer/daftar.ts` (perubahan user yang belum di-commit). Selalu `git add` path spesifik, jangan `git add -A`.
- Kerja di branch `explainer-low-model` (buat dari `main` sebelum Task 1).
- `LEGACY` = `token-listrik`, `sadap-lims`, `gandum-tropis`, `baju-kuning`, `kamar-panas`, `bata-zigzag`, `bpa-free`, `efek-rumah-kaca`, `black-box`, `cas-80`. Aturan V*, M*, H*, R* dilewati untuk slug ini; S* berlaku untuk semua.
- Format pesan validator: `<lokasi>: <masalah> → PERBAIKI: <langkah>` (bagian `→ PERBAIKI` dihilangkan bila tidak ada fix).
- Pesan dan komentar dalam bahasa Indonesia.
- Regex akhir klausa = regex yang dipakai `potongFrasa`: `/[.,!?;:]$/`.
- Kata kontras (H2/H4): `kok`, `kenapa`, `padahal`, `cuma`, `ternyata`, `malah`, `bukan`.
- Jalankan test dengan `node --test tests/explainer/*.test.mjs` (bentuk folder gagal di Windows).
- Baseline error legacy sebelum pekerjaan ini: `kamar-panas` 5 error, `cas-80` 13 error, 8 slug lain 0 error. Jumlah error legacy tidak boleh bertambah.

## Review Focus

1. Frasa kunci yang ditutup tanda baca setelah bintang (`*kok botolnya ada kadaluwarsa*?`) harus dikenali sebagai satu frasa dan satu klausa. Test di Task 3.
2. Kata pemicu berulang: `aksi.di` dicari mulai setelah indeks `di` item (fallback dari indeks yang sama), persis seperti `waktuItem` di engine; validator tidak boleh menghitung kejadian di posisi yang berbeda dari render. Test di Task 3.
3. Scene `diagram` tidak punya `items` wajib; `langkah[].di`, `hasil.di`, `pembagi.di`, `rakitDi`, `beban.di`, `beban.angkaDi` harus dihitung sebagai kejadian visual untuk V1. Test di Task 3.
4. `props.json` yang hilang dianggap `[]`; yang JSON-nya rusak harus jadi **error** terbaca, bukan crash. Test di Task 3.
5. `.rencana.md` yang ditulis di Windows (CRLF) harus terbaca sama seperti LF. Test di Task 5.

---

### Task 1: Perbaikan engine (`grow.toScale`, alias `dim.to`, SFX `silang`)

**Files:**
- Modify: `src/explainer/timing.ts` (blok `case 'grow'` dan `case 'dim'` di `hitungTransformItem`)
- Modify: `src/explainer/types.ts` (`StageAction`)
- Modify: `src/explainer/Stage.tsx` (`defaultEnterSfx` di komponen `Stage`)
- Test: `tests/explainer/timing.test.mjs`

**Interfaces:**
- Produces: `StageAction.to?: number` (alias `toOpacity`). `grow` membaca `toScale` untuk X dan Y bila `toScaleX`/`toScaleY` tidak diisi. Simbol `silang` default SFX masuk `'slap'`.

Catatan: working tree sudah berisi perubahan user yang belum di-commit di ketiga file ini (simbol `silang`, `pulse.skala`). Pertahankan dan ikut di-commit di task ini.

- [ ] **Step 0: Buat branch**

Run: `git switch -c explainer-low-model`

- [ ] **Step 1: Tulis test yang gagal di `tests/explainer/timing.test.mjs`**

```js
test('grow memakai toScale untuk X dan Y', async () => {
  const {hitungTransformItem} = await importTs('src/explainer/timing.ts');
  const item = {kind: 'prop', x: 50, y: 50, float: false, masuk: 'none', aksi: [{type: 'grow', delay: 0, toScale: 1.5, durasi: 10}]};
  const tf = hitungTransformItem(item, 40, 30, [], 100);
  assert.ok(Math.abs(tf.scaleX - 1.5) < 1e-6);
  assert.ok(Math.abs(tf.scaleY - 1.5) < 1e-6);
});

test('grow: toScaleX menang atas toScale', async () => {
  const {hitungTransformItem} = await importTs('src/explainer/timing.ts');
  const item = {kind: 'prop', x: 50, y: 50, float: false, masuk: 'none', aksi: [{type: 'grow', delay: 0, toScale: 1.5, toScaleX: 2, durasi: 10}]};
  const tf = hitungTransformItem(item, 40, 30, [], 100);
  assert.ok(Math.abs(tf.scaleX - 2) < 1e-6);
  assert.ok(Math.abs(tf.scaleY - 1.5) < 1e-6);
});

test('dim menerima alias to', async () => {
  const {hitungTransformItem} = await importTs('src/explainer/timing.ts');
  const item = {kind: 'prop', x: 50, y: 50, float: false, masuk: 'none', aksi: [{type: 'dim', delay: 0, to: 0.5, durasi: 10}]};
  const tf = hitungTransformItem(item, 40, 30, [], 100);
  assert.ok(Math.abs(tf.opacity - 0.5) < 1e-6);
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `node --test tests/explainer/timing.test.mjs`
Expected: 3 test baru FAIL (scale tetap 1, opacity 0.25).

- [ ] **Step 3: Implementasi**
  - `timing.ts` `grow`: target X = `a.toScaleX ?? a.toScale`, target Y = `a.toScaleY ?? a.toScale`; interpolasi hanya bila target terdefinisi.
  - `timing.ts` `dim`: `const target = a.toOpacity ?? a.to ?? 0.25;`
  - `types.ts`: tambah `to?: number;` dengan komentar `/** Alias toOpacity untuk 'dim' */`.
  - `Stage.tsx`: di rantai `defaultEnterSfx`, tambahkan `item.simbol === 'silang' ? 'slap'` setelah cabang `centang`.

- [ ] **Step 4: Jalankan test + typecheck**

Run: `node --test tests/explainer/*.test.mjs` lalu `npm run typecheck`
Expected: semua PASS, tsc tanpa error.

- [ ] **Step 5: Commit**

```bash
git add src/explainer/timing.ts src/explainer/types.ts src/explainer/Stage.tsx tests/explainer/timing.test.mjs
git commit -m "feat(explainer): grow.toScale, alias dim.to, simbol silang + sfx slap"
```

---

### Task 2: Pagar skema S1/S2 + format pesan PERBAIKI + daftar LEGACY

**Files:**
- Create: `scripts/lib/explainer-cek/skema.mjs`
- Modify: `scripts/cek-explainer.mjs` (fungsi `err`/`warn`, loop item, konstanta `LEGACY`)
- Test: `tests/explainer/validator-skema.test.mjs`

**Interfaces:**
- Produces (dipakai Task 3-6):
  - `export const LEGACY: Set<string>` di `scripts/cek-explainer.mjs`.
  - Objek `lapor = {err(where, msg, fix?), warn(where, msg, fix?)}` dibuat di `validasiExplainer` dan diteruskan ke semua modul aturan.
  - `skema.mjs`: `export const MASUK, KELUAR, SIMBOL, SFX, TIPE_AKSI` (array string, nilai = union type di `src/explainer/types.ts`), `export const FIELD_AKSI: Record<string, string[]>`, `export const cekSkemaItem = (item, where, lapor) => void`.

`FIELD_AKSI`: field umum `type, di, delay, durasi, sfx` + per type:
`move: toX,toY,toScale,toRotate` · `peek: dx,dy,rotate,tahan` · `grow: toScale,toScaleX,toScaleY` · `dim: toOpacity,to` · `shake: intensitas` · `pulse: sampai,skala` · `jump: dy` · `wiggle: rotate` · `squash: (tidak ada)`.

- [ ] **Step 1: Tulis test yang gagal**

```js
test('S1: masuk/simbol/sfx/aksi.type tak dikenal jadi error', ...)
  // item {masuk: 'meledak', simbol: 'bintang', sfx: 'kentut', aksi: [{type: 'putar'}]}
  // assert 4 error, masing-masing memuat 'meledak', 'bintang', 'kentut', 'putar'
test('S1: sfx false diterima', ...)            // item {sfx: false} -> 0 error
test('S2: field aksi yang diabaikan engine jadi peringatan', ...)
  // aksi {type: 'shake', toScale: 2} -> warning memuat "toScale" dan "shake"
test('S2: alias dim.to dan grow.toScale tidak memicu peringatan', ...)
test('pesan memakai format → PERBAIKI:', ...)  // salah satu error S1 memuat '→ PERBAIKI:'
test('S* tetap berlaku untuk slug LEGACY', ...) // validasiExplainer(script, 'token-listrik') dengan masuk 'meledak' -> error
```
Panggil lewat `validasiExplainer(script, slug, {props: [], rencana: null})` (parameter `opts` ditambahkan di Step 3) dengan script minimal 3 scene yang valid selain item yang diuji.

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `node --test tests/explainer/validator-skema.test.mjs`
Expected: FAIL (modul belum ada).

- [ ] **Step 3: Implementasi**
  - `skema.mjs` sesuai Interfaces. S1 → `lapor.err`, S2 → `lapor.warn`. Nilai `sfx: false` valid.
  - `cek-explainer.mjs`: ubah signature jadi `validasiExplainer(script, slug = 'explainer', opts = {})`. Ubah `err`/`warn` ke format `${where}: ${msg} → PERBAIKI: ${fix}`. Panggil `cekSkemaItem` untuk setiap item (termasuk `utama`) di semua scene. Ekspor `LEGACY`.

- [ ] **Step 4: Jalankan semua test**

Run: `node --test tests/explainer/*.test.mjs`
Expected: PASS (test lama di `cli.test.mjs` tetap hijau karena memakai `includes`).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/explainer-cek/skema.mjs scripts/cek-explainer.mjs tests/explainer/validator-skema.test.mjs
git commit -m "feat(cek-explainer): pagar skema S1/S2 dan format pesan PERBAIKI"
```

---

### Task 3: Kecocokan visual-narasi V1-V6

**Files:**
- Create: `scripts/lib/explainer-cek/visual.mjs`
- Modify: `scripts/cek-explainer.mjs` (baca `props.json`, panggil aturan visual untuk slug non-LEGACY)
- Modify: `tests/explainer/cli.test.mjs` (fixture `uji-ulang`: scene 3 diberi 1 item `delay: 0`)
- Test: `tests/explainer/validator-visual.test.mjs`

**Interfaces:**
- Consumes: `lapor`, `LEGACY` (Task 2); `kata = {indexOfWord, parseWords}` dari `importTs('src/lib/kata.ts')`.
- Produces (dipakai Task 4 dan 6):
  - `pecahKlausa(words) => {mulai: number, akhir: number}[]` (indeks inklusif).
  - `kejadianScene(scene, words, kata) => {idx: number, label: string}[]`, terurut menurut `idx`. Sumber: item masuk (`di` → indeks kata; tanpa `di` dan `delay <= 15` → 0), `aksi.di` (logika kursor = `waktuItem`: cari dari `idxDi + 1`, fallback dari indeks yang sama), dan field scene `di`, `judulDi`, `rakitDi`, `beban.di`, `beban.angkaDi`, `pembagi.di`, `hasil.di`, `langkah[].di`. Label: item prop = nama file tanpa folder + ` (masuk)`; teks = `teks "<isi>"`; simbol = `simbol <nama>`; aksi = `<type>@<di>`.
  - `rentangItem(item, words, kata) => {masuk: number, keluar: number}` (`keluar = Infinity` bila tanpa `sampai`).
  - `cekVisualScene(scene, where, words, kata, lapor) => void` (V1, V2, V3, V6), untuk `type` `hook`, `stage`, `diagram`.
  - `cekProps(script, props, kata, lapor) => void` (V4, V5).
- `opts.props`: array dari `src/explainer/data/<slug>.props.json`; file tidak ada → `[]`; JSON rusak → `lapor.err('props.json', ...)` dan lanjut dengan `[]`.

- [ ] **Step 1: Tulis test yang gagal di `validator-visual.test.mjs`**

```js
test('pecahKlausa memotong di tanda baca', ...)
  // 'Air putih gak basi, kok ada kadaluwarsa?' -> [{mulai:0,akhir:3},{mulai:4,akhir:6}]
test('V1: klausa tanpa kejadian visual jadi error', ...)
  // narasi 2 klausa, item hanya di klausa 1 -> error memuat 'klausa' dan kutipan klausa 2
test('V1: klausa pertama tertutup item delay 0', ...)
test('V1: scene diagram dihitung dari langkah[].di', ...)          // Review Focus 3
test('V2: lebih dari 6 kata tanpa kejadian jadi peringatan', ...)
test('V3: frasa *kunci* diakhiri ? dikenali satu frasa', ...)      // Review Focus 1
  // narasi 'Air gak basi, *kok botolnya ada kadaluwarsa*?' tanpa item di frasa -> 1 warning memuat 'kok botolnya ada kadaluwarsa'
test('kejadianScene: aksi.di berulang mengikuti kursor engine', ...) // Review Focus 2
  // narasi 'token lalu token lagi', item di 'lalu', aksi di 'token' -> idx aksi = 2
test('V4: prop tanpa untuk jadi error', ...)
test('V4: frasa untuk tidak ada di narasi jadi error', ...)
test('V4: prop dipakai di scene lain dari frasa untuk jadi error', ...)
test('V5: prop di props.json tidak dipakai jadi peringatan', ...)
test('V6: dua prop beririsan waktu dan berdekatan jadi peringatan; simbol di atas prop tidak', ...)
test('props.json rusak jadi error, bukan crash', ...)               // Review Focus 4
  // validasiExplainer(script, 'uji-rusak', {propsRaw: '{rusak', rencana: null}) -> error memuat 'props.json'
test('slug LEGACY melewati V1-V6', ...)
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `node --test tests/explainer/validator-visual.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implementasi**
  - `visual.mjs` sesuai Interfaces. V1 & V4 → `err`; V2, V3, V5, V6 → `warn`. V6 hanya pasangan `kind: 'prop'` (atau item dengan `src`), syarat irisan `[masuk, keluar)` dan `|dx| < 18 && |dy| < 16`.
  - `cek-explainer.mjs`: muat props dengan urutan `opts.props` → `opts.propsRaw` (string, untuk test JSON rusak) → file. Untuk slug non-LEGACY panggil `cekVisualScene` per scene dan `cekProps` sekali.
  - `cli.test.mjs`: fixture `uji-ulang` scene 3 tambah `items: [{kind: 'teks', teks: 'OK', x: 50, y: 40, delay: 0}]`; fixture lain tidak perlu diubah karena hanya memakai `assert.ok(...some...)`.

- [ ] **Step 4: Jalankan semua test**

Run: `node --test tests/explainer/*.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/explainer-cek/visual.mjs scripts/cek-explainer.mjs tests/explainer/validator-visual.test.mjs tests/explainer/cli.test.mjs
git commit -m "feat(cek-explainer): aturan kecocokan visual-narasi V1-V6"
```

---

### Task 4: Kepadatan motion & komedi M1-M6

**Files:**
- Create: `scripts/lib/explainer-cek/motion.mjs`
- Modify: `scripts/cek-explainer.mjs` (ganti cek lama "Tidak ada `aksi` motion aktif" dengan M1 untuk non-LEGACY; slug LEGACY tetap memakai cek lama)
- Test: `tests/explainer/validator-motion.test.mjs`

**Interfaces:**
- Consumes: `lapor`, `LEGACY`.
- Produces: `cekMotionScene(scene, where, lapor) => void` (M1-M3), `cekMotionVideo(script, lapor) => void` (M4-M6), `hitungSfxKomedi(script) => number`.

Aturan hitung M5: SFX komedi = `boing`, `boom`, `womp`, `slap`, `ding`. Dihitung dari `item.sfx`, `aksi.sfx` eksplisit; default bila `sfx` tidak diisi: aksi `jump`/`peek` → boing, `squash` → slap; simbol `centang` → ding, `silang` → slap. `sfx: false` tidak dihitung.

- [ ] **Step 1: Tulis test yang gagal**

```js
test('M1: scene stage dengan 2 aksi jadi peringatan', ...)
test('M2: semua masuk pop (default) jadi peringatan', ...)
test('M3: scene stage tanpa move jadi peringatan; hook tidak wajib move', ...)
test('M4: video tanpa peek jadi peringatan', ...)
test('hitungSfxKomedi menghitung default jump/squash/centang/silang dan mengabaikan sfx:false', ...)
  // 1 jump + 1 squash + 1 centang + 1 aksi jump sfx:false -> 3
test('M6: tanpa teks ukuran<=32 berotasi jadi peringatan', ...)
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `node --test tests/explainer/validator-motion.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implementasi** sesuai Interfaces; semua M* → `warn`, pesan memuat kode aturan (`M1`...`M6`).

- [ ] **Step 4: Jalankan semua test**

Run: `node --test tests/explainer/*.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/explainer-cek/motion.mjs scripts/cek-explainer.mjs tests/explainer/validator-motion.test.mjs
git commit -m "feat(cek-explainer): aturan kepadatan motion dan komedi M1-M6"
```

---

### Task 5: Hook, judul, dan `.rencana.md` (H1-H4, R1-R2)

**Files:**
- Create: `scripts/lib/explainer-cek/hook.mjs`
- Modify: `scripts/cek-explainer.mjs` (hapus `legacyHookSlugs` dan cek baris >28 lama; panggil modul baru; baca rencana)
- Test: `tests/explainer/validator-hook.test.mjs`

**Interfaces:**
- Consumes: `lapor`, `LEGACY`.
- Produces: `cekHook(script, kata, lapor, {legacy: boolean}) => void`, `cekRencana(teks: string | null, lapor) => void`, `bacaTabelHook(teks: string) => {no: number, total: number}[]`, `KATA_KONTRAS: string[]`.
- `opts.rencana`: string isi file; `null` = tidak ada; `undefined` = baca `src/explainer/data/<slug>.rencana.md`.

Aturan:
- H3 (baris `hook` dan `thumbnail` <= 28 karakter) berlaku untuk **semua** slug (perilaku lama). H1, H2, H4, R1, R2 hanya non-LEGACY.
- Pesan H1 untuk narasi > 14 kata wajib memuat teks `Hook narasi terlalu panjang` (dipakai test lama di `cli.test.mjs`). Untuk < 7 kata: `Hook narasi terlalu pendek`.
- R2: baris data tabel di bawah `## Hook` sampai heading berikutnya = baris yang diawali `|`, bukan header (sel pertama `#`) dan bukan pemisah (`|---`). Kolom pertama = nomor, kolom terakhir = `Total`. Wajib >= 5 baris dengan `Total` angka; `Terpilih: #N` harus menunjuk nomor yang ada dengan `Total >= 7`.

- [ ] **Step 1: Tulis test yang gagal**

```js
test('H1: hook 6 kata -> terlalu pendek; 16 kata -> terlalu panjang', ...)
test('H2: hook tanpa kata kontras jadi peringatan; "kok" lolos', ...)
test('H4: baris2 tanpa ?, digit, atau kata kontras jadi peringatan', ...)
test('H3 tetap berlaku untuk slug LEGACY', ...)
test('R1: rencana null atau berisi TODO jadi peringatan', ...)
test('bacaTabelHook membaca 5 baris dan kolom Total', ...)
test('bacaTabelHook membaca file CRLF sama dengan LF', ...)          // Review Focus 5
test('R2: Terpilih menunjuk Total < 7 jadi peringatan', ...)
test('R2: kurang dari 5 kandidat jadi peringatan', ...)
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `node --test tests/explainer/validator-hook.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implementasi** sesuai Interfaces; semua H*/R* → `warn`.

- [ ] **Step 4: Jalankan semua test**

Run: `node --test tests/explainer/*.test.mjs`
Expected: PASS (termasuk test lama `Hook narasi terlalu panjang`).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/explainer-cek/hook.mjs scripts/cek-explainer.mjs tests/explainer/validator-hook.test.mjs
git commit -m "feat(cek-explainer): rubrik hook, judul, dan rencana H1-H4 R1-R2"
```

---

### Task 6: Mode `--peta`

**Files:**
- Create: `scripts/lib/explainer-cek/peta.mjs`
- Modify: `scripts/cek-explainer.mjs` (blok `isMain`: bila `process.argv.includes('--peta')`, cetak peta sebelum hasil validasi)
- Test: `tests/explainer/validator-peta.test.mjs`

**Interfaces:**
- Consumes: `pecahKlausa`, `kejadianScene` (Task 3).
- Produces: `formatPeta(script, kata) => string`.

Format per klausa (scene `beat` ikut dicetak):
```
S<n> │ <teks klausa asli dengan *bintang*>
     │   → <label1> · <label2>        (atau "→ (kosong) ✗" bila tidak ada kejadian)
```

- [ ] **Step 1: Tulis test yang gagal**

```js
test('formatPeta menandai klausa kosong dengan ✗', ...)
test('formatPeta menampilkan label prop dan aksi di klausa yang benar', ...)
  // item src 'props/air-botol-retak.png' delay 0 + aksi shake@'plastiknya' -> baris klausa 1 memuat 'air-botol-retak.png' dan 'shake@plastiknya'
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `node --test tests/explainer/validator-peta.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implementasi** `formatPeta` dan flag CLI. Argumen slug tetap `process.argv[2]`; `--peta` boleh di posisi mana pun setelahnya.

- [ ] **Step 4: Jalankan test + coba CLI**

Run: `node --test tests/explainer/*.test.mjs` lalu `node scripts/cek-explainer.mjs air-kadaluwarsa --peta`
Expected: test PASS; CLI mencetak peta 6 scene diikuti hasil validasi.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/explainer-cek/peta.mjs scripts/cek-explainer.mjs tests/explainer/validator-peta.test.mjs
git commit -m "feat(cek-explainer): mode --peta untuk melihat celah visual per klausa"
```

---

### Task 7: Scaffold `.rencana.md` dan contoh `props.json`

**Files:**
- Create: `scripts/lib/explainer-template.mjs`
- Modify: `scripts/buat-explainer.mjs` (pakai template, tulis `.rencana.md`, ganti `'[]\n'` props, perbarui komentar `.ts` dan pesan "Langkah berikutnya")
- Test: `tests/explainer/template.test.mjs`

**Interfaces:**
- Consumes: `cekRencana` (Task 5), `FIELD_AKSI` tidak diperlukan.
- Produces: `templateRencana(title: string) => string` (isi persis template di spec bagian 2, dengan `<Judul>` diganti `title`), `templateProps() => {name: string, prompt: string, untuk: string}[]` (1 entri, `name: 'TODO-nama-prop'`, `prompt: 'TODO deskripsi objek, studio product photography cutout, isolated on clean background'`, `untuk: 'TODO frasa persis dari narasi'`).

Pesan "Langkah berikutnya" yang baru (urutan alur spec bagian 2):
```
  1. Isi sumber fakta        -> src/explainer/data/<slug>.sumber.md
  2. Isi rencana (hook, narasi, peta visual) -> src/explainer/data/<slug>.rencana.md
  3. Isi props.json & latar.json dari peta (tiap prop wajib punya "untuk")
  4. Generate latar & props  -> node scripts/generate-props.mjs --file ... (lihat SKILL.md langkah 5)
  5. Salin peta ke naskah    -> src/explainer/data/<slug>.ts
  6. Cek naskah              -> npm run cek:explainer -- <slug> --peta
```

- [ ] **Step 1: Tulis test yang gagal**

```js
test('templateRencana memuat 5 baris kandidat hook dan heading wajib', ...)
  // memuat '## Hook', '## Narasi', '## Peta Visual', 'Terpilih: #TODO'; bacaTabelHook(...) panjang 5
test('templateRencana masih TODO sehingga R1 memperingatkan', ...)
test('templateProps punya field untuk', ...)
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `node --test tests/explainer/template.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implementasi** modul template dan ubah `buat-explainer.mjs`. Jangan jalankan `buat-explainer.mjs` dengan slug sungguhan di task ini (skrip menulis ke `daftar.ts` yang berisi perubahan user belum di-commit).

- [ ] **Step 4: Jalankan semua test**

Run: `node --test tests/explainer/*.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/explainer-template.mjs scripts/buat-explainer.mjs tests/explainer/template.test.mjs
git commit -m "feat(buat-explainer): scaffold rencana.md dan contoh props dengan untuk"
```

---

### Task 8: Tulis ulang skill `video-explainer`

**Files:**
- Modify: `.claude/skills/video-explainer/SKILL.md` (tulis ulang penuh, ~120 baris)
- Create: `.claude/skills/video-explainer/referensi/hook-judul.md`, `narasi.md`, `visual.md`, `contoh-scene.md`

**Isi wajib (dari spec bagian 3):**
- `SKILL.md`: frontmatter `name`/`description` dipertahankan (boleh dirapikan, tetap memicu untuk permintaan explainer baru); aturan keras maks. 10 butir (engine sejarah, latar unik per scene non-beat, file yang boleh diedit, `watermark: false`, angka huruf, area aman `x 8..92 y 12..76`, beat "Oke, sini gue jelasin." + `meme-kucing-jelasin.png`, 0 error/0 peringatan); langkah 0-8 persis tabel spec bagian 2 dengan perintah lengkap (gaya Flow Bridge `--style` untuk latar dan props disalin dari SKILL.md lama); definisi selesai; tautan ke 4 file referensi. Aturan yang dicek mesin ditandai `(dicek validator: V1)` dsb.
- `hook-judul.md`: 5 rumus (`kontras-angka`, `bocoran`, `salah-kaprah`, `taruhan`, `kok-kenapa`) dengan contoh dari spec, rubrik 5 kriteria 0-2 (tabel spec), ambang 7, aturan `baris1`/`baris2` (<= 28 karakter, baris2 diakhiri `?`/angka/kata kontras, digit boleh di thumbnail tapi tidak di narasi), 3 contoh judul lama yang bagus.
- `narasi.md`: ringkasan larangan antislop (signposting, kosakata hampa, tigaan paksa, "bukan sekadar X tapi Y", penutup chatbot) dan humanizer (kalke, partikel tutur, kalimat aktif pendek), angka huruf, aturan jangan hapus kata pemicu, 1 contoh sebelum/sesudah. Sebut bahwa skill `humanizer-indonesia` dan `antislop:antislop-copywriting` dipanggil di langkah 3.
- `visual.md`: tabel `masuk` (8 nilai), `keluar` (6 nilai, default `pop-out` 8 frame), `simbol` (8 nilai), SFX (10 nama + default otomatis: masuk `pop`, `centang`→ding, `silang`→slap, `larang`/`retak`→dum; aksi `jump`/`peek`→boing, `squash`→slap, `shake`→dum), tabel 9 aksi dengan field = `FIELD_AKSI` Task 2 dan default asli dari `timing.ts` (`pulse` 8% / `skala`, `jump dy` 64, `wiggle rotate` 14, `peek` `dx -14 rotate -15 tahan 35`, `shake intensitas` 10, `dim` 0.25, `durasi` 18, aksi tanpa `di` = 12 frame setelah masuk); katalog meme (dari SKILL.md lama); pola rantai & sebab-akibat; aturan tata letak (jarak vertikal 16-18%, `sampai` lama = `di` baru).
- `contoh-scene.md`: 1 scene `stage` lengkap + potongan `props.json` dengan `untuk`, yang lolos V1-V6, M1-M3, S1-S2.

- [ ] **Step 1: Tulis kelima file**

- [ ] **Step 2: Verifikasi contoh lolos validator**

Salin scene dari `contoh-scene.md` ke script uji sementara di scratchpad (3 scene: hook minimal, beat, scene contoh) lalu panggil `validasiExplainer(script, 'uji-contoh', {props: <potongan props contoh>, rencana: null})` lewat `node -e`.
Expected: 0 error; tidak ada peringatan berkode V*, M1-M3, S*.

- [ ] **Step 3: Verifikasi ukuran dan konsistensi**

Run: `wc -l .claude/skills/video-explainer/SKILL.md .claude/skills/video-explainer/referensi/*.md`
Expected: `SKILL.md` <= 140 baris. Lalu `grep -n "4b\|Penyempurnaan Engine" .claude/skills/video-explainer/SKILL.md` → tidak ada hasil.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/video-explainer/SKILL.md .claude/skills/video-explainer/referensi
git commit -m "docs(skill): video-explainer ramping + referensi hook, narasi, visual, contoh"
```

---

### Task 9: Verifikasi akhir

**Files:** tidak ada perubahan (laporan saja).

- [ ] **Step 1: Test + typecheck**

Run: `node --test tests/explainer/*.test.mjs` lalu `npm run typecheck`
Expected: semua PASS, tsc tanpa error.

- [ ] **Step 2: Legacy tidak bertambah error**

Run: `for s in token-listrik sadap-lims gandum-tropis baju-kuning kamar-panas bata-zigzag bpa-free efek-rumah-kaca black-box cas-80; do node scripts/cek-explainer.mjs $s 2>&1 | tail -1; done`
Expected: `kamar-panas` 5 error, `cas-80` 13 error, 8 lainnya LULUS (jumlah peringatan boleh naik karena S2).

- [ ] **Step 3: Uji lapangan `air-kadaluwarsa`**

Run: `node scripts/cek-explainer.mjs air-kadaluwarsa --peta`
Expected: GAGAL dengan V4 (props tanpa `untuk`) dan V1/V3 di scene 4-5; peta menunjukkan klausa kosong. Laporkan daftar pesan ke user, jangan ubah naskahnya.
