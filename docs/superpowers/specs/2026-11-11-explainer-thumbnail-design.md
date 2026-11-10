# Design Spec: Refactor Thumbnail Explainer ("nahh gini") & Aturan Penulisan Judul

Dokumen spesifikasi desain untuk refactor komponen [`ExplainerThumb.tsx`](../../../src/explainer/ExplainerThumb.tsx) dan penguatan aturan penulisan judul di [`SKILL.md`](../../../.claude/skills/video-explainer/SKILL.md) serta validator [`cek-explainer.mjs`](../../../scripts/cek-explainer.mjs).

---

## 1. Intent & Why
- **Masalah Saat Ini:**
  1. [`ExplainerThumb.tsx`](../../../src/explainer/ExplainerThumb.tsx) masih menggunakan latar warna krem polos (`#ddd5b8`) dan dua kotak hitam statis (`#0d0d0d`, `fontSize: 64`) tanpa perataan tengah (`textAlign: 'center'`) maupun penyesuaian ukuran huruf otomatis (*auto-fit*). Ketika baris ke-2 agak panjang, teks patah menjadi 2 baris rata kiri di dalam kotak hitam lebar.
  2. Penulisan judul (`baris1` & `baris2`) di naskah sebelumnya kadang kehilangan konteks logis bila dipotong terlalu ekstrem (contoh: `"JUARA MAKAN MIE / MANA KEBUNNYA?"` yang mengaburkan subjek gandum/tepung), atau sebaliknya terlalu kaku seperti laporan berita.
- **Tujuan (Why):**
  Meningkatkan daya tarik visual (*clickability* & keterbacaan di ukuran kecil `180x320` px) lewat desain **Opsi 3 + Stabilo Baris 2** (Foto latar lokasi asli yang digelapkan + tipografi stiker ber-outline putih tebal + blok stabilo kuning kontras pada `baris2`), serta menetapkan standar penulisan judul yang **singkat, padat, jelas, dan tetap mengalir natural secara logika**.

---

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- **Visual Thumbnail (`ExplainerThumb.tsx`):**
  - Menampilkan foto lokasi asli (`thumbnail.latar` atau fallback otomatis ke `hook.latar`) dengan lapisan gradien gelap (`#0b131b`, opasitas `0.88 -> 0.62 -> 0.88`) agar teks dan prop utama menonjol tajam.
  - **`baris1` (Topik / Subjek Utama):** Teks gelap (`#111a22`) dengan **outline putih tebal** (`paintOrder: 'stroke'`, `-webkit-text-stroke` / SVG stroke) dan *hard drop-shadow* hitam tanpa kotak latar.
  - **`baris2` (Pertanyaan / Konflik Utama):** Dilapisi **pita stabilo kuning (`#f5c518`)** sedikit miring (`rotate(-1deg)`) dengan bayangan tegas, dan teks di atasnya tetap memakai warna gelap (`#111a22`) ber-outline putih tebal.
  - **Auto-Scale Ukuran Huruf (`fitThumbFontSize`):** Ukuran font `baris1` dan `baris2` otomatis menyesuaikan panjang karakter (`maxFont: 80px` pada kanvas `1080x1920`, menyusut proporsional bila teks mencapai 20-26 karakter) agar **selalu 1 baris utuh per klausa** dan tidak pernah patah baris atau keluar batas aman.
- **Standar Penulisan Judul Baru (`SKILL.md`, `cek-explainer.mjs`, & Naskah):**
  - Struktur 2 baris wajib memiliki **jembatan logika yang utuh dan bahasa Indonesia natural**:
    - `token-listrik`: `TOKEN 100 RIBU` / `ISINYA CUMA 61 kWh?`
    - `sadap-lims`: `HP DISADAP` / `TANPA KITA SADARI?`
    - `gandum-tropis`: `KENAPA BAHAN BAKU TEPUNG` / `TIDAK ADA DI KEBUN KITA?`
  - Validator [`cek-explainer.mjs`](../../../scripts/cek-explainer.mjs) memeriksa keberadaan `thumbnail.baris1` & `thumbnail.baris2`, panjang maksimal per baris (`<= 28` karakter, `2-5` kata per baris), serta memastikan `thumbnail.latar` (jika diisi eksplisit) ada di `public/`.

### Non-Goals
- Tidak mengubah komponen [`Thumbnail.tsx`](../../../src/Thumbnail.tsx) milik engine video sejarah.
- Tidak mengubah animasi panggung `Stage.tsx` atau `DiagramScene.tsx`.

### Anti-Goals
- Dilarang memotong kata sampai menghilangkan subjek/logika kalimat (seperti menghubungkan *"mie"* langsung ke *"kebun"* tanpa menyebut *"bahan baku tepung"* atau *"gandum"*).
- Dilarang membiarkan teks `baris1` atau `baris2` terbungkus (*wrap*) menjadi 2 baris di dalam 1 elemen baris yang sama.

---

## 3. Approaches Considered

1. **Pendekatan 1: Die-Cut Sticker di atas Kanvas Solid Gelap**
   - *Trade-off:* Bersih, tetapi kehilangan konteks suasana lokasi nyata yang sudah di-generate di `public/latar/`.
2. **Pendekatan 2: Kotak Banner Pita Ber-Border Putih**
   - *Trade-off:* Terlihat kaku karena dua kotak bertumpuk memakan banyak ruang vertikal.
3. **Pendekatan 3 + Stabilo Baris 2 (DIPILIH): Foto Latar Gelap + Teks Stiker Outline Putih + Stabilo Kuning di Baris 2**
   - *Alasan dipilih:* Menggabungkan kedalaman foto lokasi asli (`latar`), keterbacaan tinggi dari huruf ber-outline putih tebal di `baris1`, dan fokus mata instan pada pertanyaan di `baris2` berkat blok stabilo kuning (`#f5c518`).

---

## 4. Spesifikasi Teknis Perubahan

1. **[`src/explainer/types.ts`](../../../src/explainer/types.ts):**
   - Tambahkan properti opsional `latar?: string` dan `stabilo?: string` pada `ExplainerThumbData`.
2. **[`src/explainer/ExplainerThumb.tsx`](../../../src/explainer/ExplainerThumb.tsx):**
   - Resolusi latar: `const latar = thumb?.latar ?? hook?.latar`. Bila `latar` tersedia, render `<Img src={staticFile(latar)} />` *full-cover* + overlay gradien gelap `linear-gradient(180deg, rgba(11,19,27,0.88) 0%, rgba(11,19,27,0.62) 45%, rgba(11,19,27,0.88) 100%)`.
   - Fungsi helper `fitThumbFontSize(text: string, maxFont: number, maxWidth: number): number` untuk menghitung ukuran font deterministik agar setiap baris muat dalam lebar aman `912px` (kanvas `1080px`).
   - Render `baris1` dengan teks `#111a22`, outline putih (`WebkitTextStroke` + `paintOrder: 'stroke fill'`), dan bayangan jatuh tegas.
   - Render `baris2` di dalam pita stabilo (`background: thumb?.stabilo ?? '#f5c518'`, `borderRadius: 16`, `transform: 'rotate(-1deg)'`, `boxShadow: '0 12px 0 rgba(0,0,0,0.55)'`) dengan teks `#111a22` ber-outline putih tebal.
3. **Update Data Naskah (`token-listrik.ts`, `sadap-lims.ts`, `gandum-tropis.ts`):**
   - `token-listrik.ts`: `baris1: 'TOKEN 100 RIBU'`, `baris2: 'ISINYA CUMA 61 kWh?'`
   - `sadap-lims.ts`: `baris1: 'HP DISADAP'`, `baris2: 'TANPA KITA SADARI?'`
   - `gandum-tropis.ts`: `baris1: 'KENAPA BAHAN BAKU TEPUNG'`, `baris2: 'TIDAK ADA DI KEBUN KITA?'`
4. **Update Validator [`scripts/cek-explainer.mjs`](../../../scripts/cek-explainer.mjs) & Panduan [`.claude/skills/video-explainer/SKILL.md`](../../../.claude/skills/video-explainer/SKILL.md):**
   - Validasi `thumbnail.latar` (jika ada) di `public/`, serta peringatan/error bila `baris1` atau `baris2` melebihi 28 karakter.
   - Dokumentasikan panduan penulisan judul natural + stabilo di `SKILL.md`.
