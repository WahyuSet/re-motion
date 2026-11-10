# Explainer Thumbnail Refactor & Title Rules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor [`ExplainerThumb.tsx`](../../../src/explainer/ExplainerThumb.tsx) menggunakan desain Foto Latar Gelap + Teks Stiker Outline Putih + Stabilo Kuning pada `baris2` (dengan *auto-scale* ukuran font), serta memperbarui judul di naskah explainer, validator [`cek-explainer.mjs`](../../../scripts/cek-explainer.mjs), dan dokumentasi [`SKILL.md`](../../../.claude/skills/video-explainer/SKILL.md).

**Architecture:** Memisahkan perhitungan ukuran font deterministik (`fitThumbFontSize`) agar dapat diuji langsung di Node.js tanpa ketergantungan DOM/Remotion, lalu menggunakannya di [`ExplainerThumb.tsx`](../../../src/explainer/ExplainerThumb.tsx) dan [`HookScene.tsx`](../../../src/explainer/scenes/HookScene.tsx) untuk mencegah teks patah baris. [`ExplainerThumb.tsx`](../../../src/explainer/ExplainerThumb.tsx) mengambil gambar latar dari `script.thumbnail?.latar ?? hook?.latar`, melapisinya dengan gradien gelap kontras, merender `baris1` dengan *stroke* putih tebal, dan membungkus `baris2` di dalam pita stabilo kuning (`#f5c518`) ber-outline putih.

**Tech Stack:** Remotion (React, TypeScript), Node.js test runner (`node --test`), `sharp`.

**Spec:** `docs/superpowers/specs/2026-11-11-explainer-thumbnail-design.md`

## Global Constraints

- Dilarang mengubah file milik engine sejarah (`src/Thumbnail.tsx`, `src/HistoryVideo.tsx`, `src/theme.ts`, `src/types.ts`).
- `baris1` dan `baris2` pada thumbnail wajib selalu tampil 1 baris utuh per klausa (`whiteSpace: 'nowrap'`) dengan *auto-scale* ukuran font (`fitThumbFontSize`).
- Batas panjang judul visual (`baris1` & `baris2`): maksimal 28 karakter per baris (ideal 2 sampai 5 kata dengan kalimat yang utuh secara logika).
- Seluruh naskah explainer (`token-listrik`, `sadap-lims`, `gandum-tropis`) harus lulus `npm run cek:explainer -- <slug>` dengan 0 error dan 0 warning.

## Review Focus

- Judul sepanjang 24 sampai 26 karakter (seperti `"KENAPA BAHAN BAKU TEPUNG"` dan `"TIDAK ADA DI KEBUN KITA?"`) tidak boleh terpotong di tepi layar `1080px` atau patah menjadi 2 baris.
- Ketika `script.thumbnail.latar` tidak diisi secara eksplisit, `ExplainerThumb` harus otomatis memakai `latar` dari scene `hook` pertama; jika scene `hook` juga tidak punya `latar`, fallback ke warna gelap `#111a22` tanpa crash.
- Validator `cek-explainer.mjs` harus menolak (`error`) jika `thumbnail.latar` menunjuk ke file yang tidak ada di `public/`, dan memberi peringatan (`warning`) jika `baris1` atau `baris2` melebihi 28 karakter.
- Teks dengan outline putih (`paintOrder: 'stroke fill'`) harus tetap terbaca tajam di atas pita stabilo kuning (`#f5c518`).

---

### Task 1: Helper Auto-Scale Font Judul & Unit Test (`timing.ts` + `types.ts`)

**Files:**
- Modify: `src/explainer/types.ts:180-186`
- Modify: `src/explainer/timing.ts`
- Modify: `tests/explainer/timing.test.mjs`

**Interfaces:**
- Consumes: `ExplainerThumbData` di `src/explainer/types.ts`
- Produces:
  - `ExplainerThumbData` dengan opsional `latar?: string` dan `stabilo?: string`
  - `fitThumbFontSize(teks: string, maxFont?: number, maxWidth?: number): number` di `src/explainer/timing.ts`

- [ ] **Step 1: Tambahkan unit test `fitThumbFontSize` di `tests/explainer/timing.test.mjs`**

```js
test('fitThumbFontSize keeps maxFont for short titles and scales down proportionally for 24-char titles', async () => {
  const {fitThumbFontSize} = await importTs('src/explainer/timing.ts');
  assert.equal(fitThumbFontSize('HP DISADAP', 80, 912), 80);
  const longSize = fitThumbFontSize('KENAPA BAHAN BAKU TEPUNG', 80, 912);
  assert.ok(longSize < 80 && longSize >= 52, `expected scaled font between 52 and 79, got ${longSize}`);
});
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal sebelum implementasi**

Run: `node --test tests/explainer/timing.test.mjs`
Expected: FAIL karena `fitThumbFontSize` belum diekspor dari `src/explainer/timing.ts`.

- [ ] **Step 3: Perbarui `ExplainerThumbData` di `src/explainer/types.ts` dan implementasikan `fitThumbFontSize` di `src/explainer/timing.ts`**

Di `src/explainer/types.ts`:
```ts
export type ExplainerThumbData = {
  baris1: string;
  baris2?: string;
  src?: string;
  latar?: string;
  stabilo?: string;
  items?: StageItem[];
};
```

Di `src/explainer/timing.ts`:
```ts
export const fitThumbFontSize = (
  teks: string,
  maxFont = 80,
  maxWidth = 912,
): number => {
  const clean = teks.trim();
  if (!clean.length) return maxFont;
  const estCharWidth = 0.65;
  const fitted = Math.floor(maxWidth / (clean.length * estCharWidth));
  return Math.max(42, Math.min(maxFont, fitted));
};
```

- [ ] **Step 4: Jalankan test untuk memverifikasi lulus**

Run: `node --test tests/explainer/timing.test.mjs`
Expected: PASS

---

### Task 2: Refactor Komponen `ExplainerThumb.tsx` & `HookScene.tsx`

**Files:**
- Modify: `src/explainer/ExplainerThumb.tsx`
- Modify: `src/explainer/scenes/HookScene.tsx`

**Interfaces:**
- Consumes: `fitThumbFontSize` dari `src/explainer/timing.ts`, `ExplainerScript` dari `src/explainer/types.ts`
- Produces: Komponen `ExplainerThumb` dan `HookSceneView` dengan desain Opsi 3 (Foto Latar Gelap + Teks Outline Putih + Stabilo Kuning di Baris 2)

- [ ] **Step 1: Refactor `src/explainer/ExplainerThumb.tsx`**
  - Ambil `latar = thumb?.latar ?? (hook?.type === 'hook' ? hook.latar : undefined)`.
  - Render `<Img src={staticFile(latar)} />` *full-bleed* (`objectFit: 'cover'`) di bawah lapisan gradien gelap `linear-gradient(180deg, rgba(11, 19, 27, 0.88) 0%, rgba(11, 19, 27, 0.62) 45%, rgba(11, 19, 27, 0.88) 100%)`.
  - Hitung ukuran font `f1 = fitThumbFontSize(baris1, 80, 912)` dan `f2 = baris2 ? fitThumbFontSize(baris2, 74, 888) : 74`.
  - Render `baris1` dengan warna `#111a22`, `WebkitTextStroke: '${Math.max(18, Math.round(f1 * 0.3))}px #ffffff'`, `paintOrder: 'stroke fill'`, `whiteSpace: 'nowrap'`, dan bayangan hitam tegas.
  - Render `baris2` di dalam pita stabilo (`background: thumb?.stabilo ?? '#f5c518'`, `padding: '14px 34px'`, `borderRadius: 16`, `transform: 'rotate(-1deg)'`, `boxShadow: '0 12px 0 rgba(0,0,0,0.55)'`) dengan teks `#111a22` ber-outline putih (`WebkitTextStroke: '${Math.max(16, Math.round(f2 * 0.28))}px #ffffff'`, `paintOrder: 'stroke fill'`, `whiteSpace: 'nowrap'`).
  - Render prop utama (`width: 560`) di bagian tengah-bawah (`paddingTop: 240`) dengan *drop-shadow* dalam.

- [ ] **Step 2: Selaraskan tampilan judul di `src/explainer/scenes/HookScene.tsx`**
  - Gunakan `fitThumbFontSize` pada `scene.baris1` dan `scene.baris2` serta gaya `baris1` ber-outline putih dan `baris2` berpita stabilo kuning (`#f5c518`) agar pembuka video selaras dengan thumbnail dan tidak pernah patah baris.

- [ ] **Step 3: Jalankan pengecekan tipe TypeScript**

Run: `npm run typecheck`
Expected: PASS tanpa error kompilasi.

---

### Task 3: Perbarui Judul Naskah, Validator `cek-explainer.mjs`, & `SKILL.md`

**Files:**
- Modify: `scripts/cek-explainer.mjs`
- Modify: `tests/explainer/cli.test.mjs`
- Modify: `src/explainer/data/token-listrik.ts`
- Modify: `src/explainer/data/sadap-lims.ts`
- Modify: `src/explainer/data/gandum-tropis.ts`
- Modify: `.claude/skills/video-explainer/SKILL.md`

**Interfaces:**
- Consumes: `validasiExplainer(script, slug)` di `scripts/cek-explainer.mjs`
- Produces: Validasi panjang judul & `thumbnail.latar`, naskah explainer dengan judul baru yang tervalidasi

- [ ] **Step 1: Tambahkan test validasi judul & `thumbnail.latar` di `tests/explainer/cli.test.mjs`**

```js
test('validasiExplainer warns on overly long hook/thumbnail lines (> 28 chars) and errors on missing thumbnail.latar', async () => {
  const script = {
    format: 'short',
    thumbnail: {
      baris1: 'KALIMAT JUDUL BARIS SATU YANG TERLALU PANJANG SEKALI',
      baris2: 'BARIS DUA NORMAL?',
      latar: 'latar/tidak-ada-file.png',
    },
    scenes: [
      {type: 'hook', duration: 60, latar: 'latar/token-kos.png', baris1: 'PENDEK', baris2: 'NORMAL?', narasi: 'Satu kalimat pembuka.'},
      {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.'},
      {type: 'stage', duration: 60, latar: 'latar/token-jalan.png', narasi: 'Penjelasan selesai.', items: []},
    ],
  };
  const {errors, warnings} = await validasiExplainer(script, 'uji-thumb');
  assert.ok(errors.some((e) => e.includes('tidak-ada-file.png')));
  assert.ok(warnings.some((w) => w.includes('baris1')));
});
```

- [ ] **Step 2: Jalankan test untuk memverifikasi gagal sebelum implementasi**

Run: `node --test tests/explainer/cli.test.mjs`
Expected: FAIL

- [ ] **Step 3: Implementasikan validasi di `scripts/cek-explainer.mjs` dan perbarui judul di ke-3 naskah explainer + `SKILL.md`**
  - Di `scripts/cek-explainer.mjs`:
    - Cek `script?.thumbnail?.latar` dengan `existsPublic`.
    - Beri peringatan (`warn`) bila `thumbnail.baris1`, `thumbnail.baris2`, `hook.baris1`, atau `hook.baris2` melebihi `28` karakter.
  - Di `src/explainer/data/token-listrik.ts`:
    - `thumbnail` & `HookScene`: `baris1: 'TOKEN 100 RIBU'`, `baris2: 'ISINYA CUMA 61 kWh?'`
  - Di `src/explainer/data/sadap-lims.ts`:
    - `thumbnail` & `HookScene`: `baris1: 'HP DISADAP'`, `baris2: 'TANPA KITA SADARI?'`
  - Di `src/explainer/data/gandum-tropis.ts`:
    - `thumbnail` & `HookScene`: `baris1: 'KENAPA BAHAN BAKU TEPUNG'`, `baris2: 'TIDAK ADA DI KEBUN KITA?'`, `src: 'props/gandum-karung-terigu.png'`, `latar: 'latar/gandum-tropis-2.png'`
  - Di `.claude/skills/video-explainer/SKILL.md`:
    - Tambahkan aturan penulisan judul natural 2 baris + desain thumbnail Opsi 3 berstabilo.

- [ ] **Step 4: Jalankan seluruh test dan validator ke-3 naskah + render ulang paket thumbnail**

Run:
```bash
node --test tests/explainer/*.test.mjs
npm run cek:explainer -- token-listrik
npm run cek:explainer -- sadap-lims
npm run cek:explainer -- gandum-tropis
node scripts/paket-youtube.mjs sadap-lims
node scripts/paket-youtube.mjs gandum-tropis
```
Expected: Seluruh unit test PASS, validator `0 error, 0 peringatan`, serta `out/youtube/sadap-lims/thumbnail.jpg` dan `out/youtube/gandum-tropis/thumbnail.jpg` ter-generate dengan desain baru.
