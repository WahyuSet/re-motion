# Video Explainer "air-kadaluwarsa" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun video motion explainer 9:16 baru "Kenapa Air Mineral Kemasan Ada Tanggal Kadaluwarsanya?" (`air-kadaluwarsa`) di `src/explainer/` dengan hook stop-scroll 3 detik, thumbnail Opsi 3 + stabilo kuning, 5 latar lokasi real, dan 8 cutout props via Flow Bridge.

**Architecture:** Menggunakan engine motion explainer Remotion (`src/explainer/`) dengan struktur 6 scene (`HookScene` stop-scroll 9 kata, `StageScene` salah kaprah susu basi vs air abadi, `BeatScene` transisi kucing jelasin, `StageScene` degradasi plastik PET & mikroplastik, `StageScene` bahaya panas matahari & zat antimoni, serta `StageScene` solusi tempat sejuk & tumbler stainless).

**Tech Stack:** Remotion (React, TypeScript), Node.js CLI scripts (`buat-explainer.mjs`, `generate-props.mjs`, `cek-explainer.mjs`, `narasi.mjs`, `potong-narasi.mjs`, `paket-youtube.mjs`, `render.mjs`), Google Flow Bridge, faster-whisper.

**Spec:** `docs/superpowers/specs/2026-11-11-air-kadaluwarsa-design.md`

## Global Constraints

- Resolusi `1080x1920` (`9:16` Shorts, `30fps`).
- Hook narasi di Scene 1 wajib 1 kalimat *stop-scroll* (`8-14 kata`, ~3 detik) tanpa kalimat pemanasan.
- Judul `thumbnail` dan `HookScene` wajib 2 baris utuh secara logika (`<= 28 karakter` per baris): `baris1: 'AIR PUTIH GAK BASI'` (18 karakter) dan `baris2: 'KOK ADA KADALUWARSA?'` (20 karakter).
- Semua angka di dalam `narasi` wajib ditulis dengan huruf (`dua tahun`, `jutaan tahun`), tanpa digit angka.
- Koordinat wajib berada di dalam area aman Shorts (`x: 8..92`, `y: 12..76`) dengan jarak vertikal antar-elemen bertumpuk minimal `16-18%`.
- Setiap scene non-beat wajib memiliki foto latar lokasi real unik (`latar: 'latar/air-kadaluwarsa-N.png'`).
- Dilarang menyentuh file milik engine sejarah (`src/HistoryVideo.tsx`, `src/Thumbnail.tsx`, `src/data/*`).
- Dilarang menggunakan karakter em dash di dalam teks, komentar, maupun subtitle.

## Review Focus

- `HookScene` narasi tidak boleh melebihi 14 kata agar lolos aturan baru di `scripts/cek-explainer.mjs` tanpa peringatan.
- Pergantian fase visual di Scene 2 (`sampai: 'padahal'` pada item lama dan `di: 'padahal'` pada item baru) harus sinkron di kata yang sama agar tidak ada celah kosong atau *ghosting*.
- Semua kata pemicu (`di` dan `sampai`) harus ada persis di dalam string `narasi` scene masing-masing.
- Ketika Flow Bridge mengalami timeout pada salah satu item, retry per item dengan `--name` dan `--prompt` sampai ke-5 latar dan ke-8 props lengkap di `public/latar/` dan `public/props/`.
- `npm run cek:explainer -- air-kadaluwarsa` dan `npm run typecheck` harus lulus dengan `0 error` dan `0 peringatan`.

---

### Task 1: Scaffolding Kerangka, Sumber Riset, & Daftar Aset Flow Bridge

**Files:**
- Create: `src/explainer/data/air-kadaluwarsa.ts`
- Create: `src/explainer/data/air-kadaluwarsa.latar.json`
- Create: `src/explainer/data/air-kadaluwarsa.props.json`
- Create: `src/explainer/data/air-kadaluwarsa.sumber.md`
- Modify: `src/explainer/daftar.ts`

**Interfaces:**
- Consumes: `scripts/buat-explainer.mjs`, `docs/superpowers/specs/2026-11-11-air-kadaluwarsa-design.md`
- Produces: Komposisi `AirKadaluwarsa` di `src/explainer/daftar.ts`, daftar 5 latar di `air-kadaluwarsa.latar.json`, dan daftar 8 cutout props di `air-kadaluwarsa.props.json`

- [ ] **Step 1: Jalankan script scaffolding explainer**

Run: `npm run baru:explainer -- air-kadaluwarsa`
Expected: Membuat `src/explainer/data/air-kadaluwarsa.{ts,props.json,latar.json,sumber.md}` dan mendaftarkan `AirKadaluwarsa` di `src/explainer/daftar.ts`.

- [ ] **Step 2: Tulis catatan riset ilmiah di `src/explainer/data/air-kadaluwarsa.sumber.md`**

Catat fakta degradasi botol plastik PET (kode 1) setelah 2 tahun, peluruhan mikroplastik dan katalis antimoni trioksida saat terkena suhu panas, serta minimal 2 URL sumber ilmiah (IBWA/FDA dan jurnal *Water Research*).

- [ ] **Step 3: Isi 5 definisi latar lokasi real di `src/explainer/data/air-kadaluwarsa.latar.json`**

Tulis array JSON berisi 5 objek (`utuh: true`):
1. `air-kadaluwarsa-1`: `"wide realistic modern photography of a bright convenience store cooler shelf filled with clear bottled mineral water, clean lighting, full-bleed camera frame no border, high detail"`
2. `air-kadaluwarsa-2`: `"wide realistic modern nature photography of a crystal clear mountain spring stream flowing over clean rocks in bright morning sunlight, full-bleed camera frame no border, high detail"`
3. `air-kadaluwarsa-3`: `"wide realistic modern photography of a clean water quality testing laboratory workbench with microscope and glass beakers, soft daylight, full-bleed camera frame no border, high detail"`
4. `air-kadaluwarsa-4`: `"wide realistic modern photography of a car interior backseat and trunk under hot bright midday sunlight shining through the window, full-bleed camera frame no border, high detail"`
5. `air-kadaluwarsa-5`: `"wide realistic modern photography of a cool shaded minimalist kitchen counter with clean wooden surface and soft natural light, full-bleed camera frame no border, high detail"`

- [ ] **Step 4: Isi 8 definisi cutout props di `src/explainer/data/air-kadaluwarsa.props.json`**

Tulis array JSON berisi 8 objek prop:
1. `air-botol-expired`: `"clear plastic mineral water bottle with a bold red expiration date stamp label on the middle, studio product photography cutout, isolated on clean background, high detail"`
2. `air-susu-basi`: `"bloated white milk carton box with greenish sour spoiled stains, studio product photography cutout, isolated on clean background"`
3. `air-tetes-murni`: `"3D glossy crystal clear pure blue water droplet with fresh sparkle glint, studio product photography cutout, isolated on clean background"`
4. `air-botol-retak`: `"aged crumpled clear plastic water bottle with fine microscopic cracks and degraded texture, studio product photography cutout, isolated on clean background"`
5. `air-mikroplastik`: `"magnifying glass zooming in on tiny colorful microplastic particles floating in water droplet, studio product photography cutout, isolated on clean background"`
6. `air-panas-matahari`: `"warped plastic water bottle glowing warm orange under intense heat radiation, studio product photography cutout, isolated on clean background"`
7. `air-galon-sejuk`: `"neatly stored mineral water bottles and dispenser gallon in a cool shaded rack, studio product photography cutout, isolated on clean background"`
8. `air-tumbler-stainless`: `"sleek modern silver stainless steel insulated water tumbler bottle with fresh cold condensation drops, studio product photography cutout, isolated on clean background"`

---

### Task 2: Implementasi Naskah 6 Scene & Koreografi Motion di `air-kadaluwarsa.ts`

**Files:**
- Modify: `src/explainer/data/air-kadaluwarsa.ts`

**Interfaces:**
- Consumes: `ExplainerScript` dari `src/explainer/types.ts`
- Produces: Export `airKadaluwarsa: ExplainerScript` lengkap dengan metadata YouTube, thumbnail Opsi 3 + stabilo, dan 6 scene

- [ ] **Step 1: Tulis metadata `youtube`, `thumbnail`, dan 6 scene di `src/explainer/data/air-kadaluwarsa.ts`**

Pastikan nilai berikut terpasang persis:
- `thumbnail`: `baris1: 'AIR PUTIH GAK BASI'`, `baris2: 'KOK ADA KADALUWARSA?'`, `latar: 'latar/air-kadaluwarsa-1.png'`, `src: 'props/air-botol-expired.png'`.
- **Scene 1 (`hook`, `duration: 105`, `latar: 'latar/air-kadaluwarsa-1.png'`):**
  - `baris1: 'AIR PUTIH GAK BASI'`, `baris2: 'KOK ADA KADALUWARSA?'`
  - `narasi: 'Air putih gak pernah basi, *kok botolnya ada kadaluwarsa*?'`
  - `utama`: `props/air-botol-expired.png` (`x: 32, y: 52, width: 310, masuk: 'pop'`, aksi `wiggle` di `'basi'`, `shake` di `'kadaluwarsa'` + `sfx: 'womp'`)
  - `items`: `props/meme-kucing-paw.png` (`x: 74, y: 56, width: 280, masuk: 'slide-up'`, aksi `wiggle` di `'kok'`) dan `simbol: 'tanya'` (`x: 76, y: 32, width: 120, di: 'kok', sfx: 'boing'`)
- **Scene 2 (`stage`, `duration: 125`, `latar: 'latar/air-kadaluwarsa-2.png'`):**
  - `narasi: 'Banyak yang ngira airnya bisa *jamuran* atau basi seperti susu, padahal umur air di bumi sudah *jutaan tahun* dan tetap segar.'`
  - Fase 1 (`sampai: 'padahal'`): `props/meme-kucing-merenung.png` (`x: 28, y: 56`), `props/air-susu-basi.png` (`x: 70, y: 48`), `simbol: 'larang'` (`x: 70, y: 44, di: 'susu', sfx: 'slap'`), `teks: 'Air bukan susu!'` (`x: 70, y: 26, di: 'susu'`)
  - Fase 2 (`di: 'padahal'`): `props/air-tetes-murni.png` (`x: 50, y: 52`, aksi `pulse` di `'jutaan tahun'`, `jump` di `'tetap segar'` + `sfx: 'ding'`), `teks: 'Jutaan Tahun Segar'` (`x: 50, y: 28, di: 'padahal'`)
- **Scene 3 (`beat`, `duration: 55`):**
  - `teks: 'Oke, sini gue jelasin.'`, `narasi: 'Oke, *sini gue jelasin* alasan sebenarnya.'`
  - `items`: `props/meme-kucing-jelasin.png` (`x: 50, y: 54, width: 350, masuk: 'pop', sfx: 'boing'`, aksi `wiggle` di `'jelasin'`)
- **Scene 4 (`stage`, `duration: 140`, `latar: 'latar/air-kadaluwarsa-3.png'`):**
  - `narasi: 'Tanggal di kemasan itu sebenarnya batas umur *botol plastiknya*. Lewat dari *dua tahun*, ikatan plastik mulai rapuh sehingga partikel *mikroplastik* ikut luruh ke dalam air.'`
  - `items`: `props/air-botol-retak.png` (`x: 30, y: 52, width: 280, masuk: 'drop'`, aksi `shake` di `'botol plastiknya'` + `sfx: 'boom'`, `wiggle` di `'dua tahun'`, `move` di `'rapuh'` ke `toX: 26, toY: 54`), `teks: 'Plastik PET (Kode 1)'` (`x: 30, y: 28, di: 'botol plastiknya'`), `props/air-mikroplastik.png` (`x: 72, y: 50, width: 270, masuk: 'slide-right', di: 'rapuh'`, aksi `pulse` di `'mikroplastik'`, `shake` di `'luruh'` + `sfx: 'womp'`), `teks: 'Luruh ke Air!'` (`x: 72, y: 28, masuk: 'drop', sfx: 'boom', di: 'mikroplastik'`)
- **Scene 5 (`stage`, `duration: 140`, `latar: 'latar/air-kadaluwarsa-4.png'`):**
  - `narasi: 'Apalagi kalau botolnya keseringan kena *panas matahari* di dalam mobil, zat kimia *antimoni* dari dinding plastik akan larut dan mengubah rasa air jadi *pahit seperti plastik*.'`
  - `items`: `props/air-panas-matahari.png` (`x: 28, y: 50, width: 280, masuk: 'slide-left'`, aksi `pulse` di `'panas matahari'`, `shake` di `'antimoni'` + `sfx: 'boom'`), `teks: 'Panas = Kimia Larut'` (`x: 28, y: 26, di: 'panas matahari'`), `props/meme-kucing-titik.png` (`x: 68, y: 54, width: 290, masuk: 'pop', di: 'antimoni'`, aksi `wiggle` di `'larut'`, `squash` di `'pahit'` + `sfx: 'slap'`), `simbol: 'larang'` (`x: 68, y: 30, width: 130, di: 'pahit', sfx: 'womp'`)
- **Scene 6 (`stage`, `duration: 125`, `latar: 'latar/air-kadaluwarsa-5.png'`):**
  - `narasi: 'Karena itu, simpan stok air minum di *tempat teduh*, atau tuang ke *botol stainless* supaya air putih kita *tetap aman* diminum.'`
  - `items`: `props/air-galon-sejuk.png` (`x: 28, y: 52, width: 270, masuk: 'slide-up'`, aksi `pulse` di `'tempat teduh'`, `wiggle` di `'tuang'`), `props/air-tumbler-stainless.png` (`x: 72, y: 50, width: 280, masuk: 'pop', di: 'botol stainless'`, aksi `jump` di `'tetap aman'` + `sfx: 'boing'`), `simbol: 'centang'` (`x: 72, y: 28, width: 140, di: 'tetap aman', sfx: 'ding'`), `teks: 'Aman & Segar!'` (`x: 50, y: 18, ukuran: 32, kotak: '#388e3c', di: 'tetap aman'`)

- [ ] **Step 2: Jalankan `typecheck`**

Run: `npm run typecheck`
Expected: Exit code 0 (0 TypeScript errors).

---

### Task 3: Generate Latar & Cutout Props via Flow Bridge + Validasi Penuh

**Files:**
- Create: `public/latar/air-kadaluwarsa-1.png` .. `public/latar/air-kadaluwarsa-5.png`
- Create: `public/props/air-botol-expired.png`, `public/props/air-susu-basi.png`, `public/props/air-tetes-murni.png`, `public/props/air-botol-retak.png`, `public/props/air-mikroplastik.png`, `public/props/air-panas-matahari.png`, `public/props/air-galon-sejuk.png`, `public/props/air-tumbler-stainless.png`
- Create: `narasi/air-kadaluwarsa/naskah-full.txt`

**Interfaces:**
- Consumes: `src/explainer/data/air-kadaluwarsa.latar.json`, `src/explainer/data/air-kadaluwarsa.props.json`
- Produces: Seluruh file PNG latar & cutout props di `public/`, naskah TTS di `narasi/air-kadaluwarsa/naskah-full.txt`, preview thumbnail & lembar cek frame

- [ ] **Step 1: Cek koneksi Flow Bridge dan generate 5 background real**

Run:
```bash
node scripts/generate-props.mjs --cek
node scripts/generate-props.mjs --file src/explainer/data/air-kadaluwarsa.latar.json --utuh
```
Expected: 5 file `public/latar/air-kadaluwarsa-{1..5}.png` berhasil dibuat (jika ada yang timeout, ulangi item tersebut dengan `--name <nama> --prompt "<prompt>" --utuh`).

- [ ] **Step 2: Generate 8 cutout props PNG transparan via Flow Bridge**

Run:
```bash
node scripts/generate-props.mjs --file src/explainer/data/air-kadaluwarsa.props.json
```
Expected: 8 file `public/props/air-*.png` berhasil dibuat dan dihapus background hijaunya (jika ada yang timeout, ulangi per item dengan `--name` dan `--prompt`).

- [ ] **Step 3: Jalankan validator `cek:explainer` dan ekspor naskah TTS**

Run:
```bash
npm run cek:explainer -- air-kadaluwarsa
node scripts/narasi.mjs air-kadaluwarsa
```
Expected: `✓ LULUS: air-kadaluwarsa (6 scene, 0 peringatan)` dan file `narasi/air-kadaluwarsa/naskah-full.txt` terbuat.

- [ ] **Step 4: Render preview thumbnail & lembar kontak frame (`cek-frame`)**

Run:
```bash
node scripts/paket-youtube.mjs air-kadaluwarsa
node scripts/cek-frame.mjs air-kadaluwarsa
```
Expected: `out/youtube/air-kadaluwarsa/thumbnail.jpg` dan `out/cek/air-kadaluwarsa-lembar.jpg` ter-render rapi dan siap diperiksa sebelum tahap rekaman audio TTS.
