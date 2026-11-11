# Black Box Explainer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun video explainer baru bertema "Fungsi Black Box Pesawat" (slug: `black-box`) menggunakan engine Remotion explainer 9:16 ("nahh gini"), memadukan standar naskah `antislop-copywriting` dan `humanizer-indonesia`.

**Architecture:** Video explainer pendek vertikal 9:16 (1080×1920, 30fps) dengan 5 scene terpisah di `src/explainer/data/black-box.ts`. Memakai full real background per scene cerita/diagram, living cutout motion, pilar SFX komedi terikat kata (`boing`, `slap`, `ding`), dan subtitle 1 baris auto-wrap.

**Tech Stack:** Remotion 4.0, React 19, TypeScript, Faster-Whisper, Sharp.

**Spec:** Desain konseptual pada sesi brainstorming: judul 2 baris logis, hook stop-scroll 10 kata, bongkar FDR (Flight Data Recorder) vs CVR (Cockpit Voice Recorder).

## Global Constraints

- Engine Sejarah tidak boleh disentuh (`src/HistoryVideo.tsx`, `src/scenes/`, `src/components/`, dll.).
- Scene cerita non-beat wajib punya properti `latar` gambar real 100% tanpa efek sepia/lukisan.
- Narasi wajib bebas angka digit (semua angka/nominal dieja dengan huruf utuh).
- Hook narasi maksimal 8–14 kata (1 kalimat padat).
- Judul thumbnail & hook maksimal 28 karakter per baris.
- Bebas klise AI (tanpa signposting *"Mari kita bahas"*, tanpa jargon kosong *"revolusioner"*, bebas kalke asing).
- Seluruh koordinat panggung wajib di area aman Shorts (x: 8..92%, y: 12..76%).

## Review Focus

1. **Kata pemicu motion (`di` / `sampai`) tidak cocok dengan teks narasi** $\rightarrow$ Validator `cek-explainer.mjs` akan menggagalkan build jika ada typo atau kata pemicu yang hilang.
2. **Hook melebihi 14 kata** $\rightarrow$ Diperiksa validator; wajib tetap 10 kata padat.
3. **Format angka tidak dieja** $\rightarrow$ Dicegah agar pembacaan TTS dan Whisper timestamp tidak rusak.
4. **Tanda bintang `*kata kunci*` tidak berpasangan** $\rightarrow$ Wajib genap agar warna emas subtitle dan animasi pemicu tidak glitch.
5. **Dead air di awal scene** $\rightarrow$ Detik 0.0s di setiap scene wajib memiliki prop pembuka (`delay: 0` atau `di` pada kata ke-1/ke-2).

---

### Task 1: Inisialisasi Kerangka Video (`black-box`)

**Files:**
- Create: `src/explainer/data/black-box.ts`
- Create: `src/explainer/data/black-box.props.json`
- Create: `src/explainer/data/black-box.latar.json`
- Create: `src/explainer/data/black-box.sumber.md`
- Modify: `src/explainer/daftar.ts`

- [x] **Step 1:** Jalankan scaffolding explainer baru
  ```bash
  npm run baru:explainer -- black-box
  ```
- [x] **Step 2:** Verifikasi bahwa template file sudah terbuat di `src/explainer/data/` dan terdaftar di `src/explainer/daftar.ts`.

---

### Task 2: Riset & Catat Sumber Fakta Resmi

**Files:**
- Modify: `src/explainer/data/black-box.sumber.md`

- [x] **Step 1:** Tulis catatan data acuan resmi di `black-box.sumber.md`:
  - Definisi Black Box (Electronic Flight Data Recorder / Solid State FDR & CVR).
  - FDR: Merekam $\ge 1.000$ parameter penerbangan (kecepatan, ketinggian, sudut sayap, status kemudi, putaran mesin) selama minimal 25 jam.
  - CVR: Merekam 4 kanal audio kokpit (pilot, kopilot, area kokpit, headset) selama minimal 2 jam terakhir.
  - Daya tahan: Tahan benturan 3.400 G, suhu 1.100°C selama 1 jam, kedalaman laut hingga 6.000 meter dengan Underwater Locator Beacon (ULB) baterai 30-90 hari (37,5 kHz).
  - Cantumkan minimal 2 URL sumber kredibel (ICAO, FAA, atau KNKT).

---

### Task 3: Konfigurasi Prompt Latar Real & Props Cutout

**Files:**
- Modify: `src/explainer/data/black-box.latar.json`
- Modify: `src/explainer/data/black-box.props.json`

- [x] **Step 1:** Isi `src/explainer/data/black-box.latar.json` dengan prompt foto lokasi modern tajam 100%:
  - `black-box-1`: Kokpit pesawat modern berlampu instrumen malam hari.
  - `black-box-2`: Kabin pesawat penumpang dari lorong tengah.
  - `black-box-4`: Laboratorium forensik investigasi kecelakaan pesawat dengan teknisi.
  - `black-box-5`: Hanggar pesawat modern dengan pesawat parkir.
- [x] **Step 2:** Isi `src/explainer/data/black-box.props.json` dengan cutout objek dan meme reaksi:
  - `props/black-box-unit.png` (unit kotak FDR/CVR warna oranye terang dengan silinder pinger ULB).
  - `props/pesawat-radar.png` (grafik radar / pesawat siluet).
  - Pastikan aset meme reaksi yang ada (`props/meme-kucing-paw.png`, `props/meme-kucing-jelasin.png`) dimanfaatkan.

---

### Task 4: Susun Naskah & Koreografi Panggung (`black-box.ts`)

**Files:**
- Modify: `src/explainer/data/black-box.ts`

- [x] **Step 1:** Tulis struktur 5 scene lengkap:
  - **HookScene:**
    - `baris1`: `'FUNGSI BLACK BOX'`
    - `baris2`: `'BUKAN PENYELAMAT PESAWAT?'`
    - `narasi`: `'Pesawat jatuh dicari *black box*, emang apa sih fungsinya?'`
    - `utama`: prop black box oranye + tanda tanya.
  - **StageScene (Salah Kaprah):**
    - `narasi`: `'Banyak yang ngira ini alat penyelamat atau kamera langsung. Padahal pas terbang, kotaknya cuma pasif nyatet tanpa bisa mencegah kecelakaan.'`
    - `items`: Meme kucing mikir (`meme-kucing-paw.png`) + simbol larang ❌ + badge teks.
  - **BeatScene:**
    - `teks`: `'Oke, sini gue jelasin.'`
    - `narasi`: `'Oke, *sini gue jelasin* dua isi di dalamnya.'`
    - `items`: Meme kucing nerd (`meme-kucing-jelasin.png`, sfx: `'boing'`).
  - **StageScene (Bongkar FDR & CVR):**
    - `narasi`: `'Pertama, *FDR* yang ngerekam ribuan data teknis seperti kecepatan dan mesin. Kedua, *CVR* yang nyimpen suara percakapan pilot sampai bunyi alarm kokpit.'`
    - `items`: Dua kotak berdampingan (FDR & CVR), icon grafik data & audio wave, sfx pop & ding.
  - **StageScene (Kesimpulan & Nilai Sejati):**
    - `narasi`: `'Fungsi sejatinya adalah saksi bisu pengungkap fakta, supaya kesalahan yang sama *gak pernah terulang lagi* di dunia penerbangan.'`
    - `items`: Simbol centang ✅ (sfx: `'ding'`) + teks penutup.
- [x] **Step 2:** Pastikan seluruh kata pemicu `di` dan `sampai` cocok dengan teks narasi.

---

### Task 5: Validasi Otomatis & Ekspor Naskah TTS

**Files:**
- Modify: `src/explainer/data/black-box.ts` (jika ada perbaikan linter)

- [x] **Step 1:** Jalankan validator:
  ```bash
  npm run cek:explainer -- black-box
  ```
  Harus lulus dengan `0 error` (toleransi peringatan file audio belum ada).
- [x] **Step 2:** Ekspor naskah TTS:
  ```bash
  node scripts/narasi.mjs black-box
  ```
  Verifikasi berkas `narasi/black-box/naskah-full.txt` sudah terbuat dan siap dibacakan voiceover/TTS.
