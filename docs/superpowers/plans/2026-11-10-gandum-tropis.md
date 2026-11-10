# Video Explainer "gandum-tropis" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun video motion explainer 9:16 baru "Kenapa Gandum Tidak Tumbuh di Indonesia?" (`gandum-tropis`) di `src/explainer/` lengkap dengan 6 scene, naskah sains populer, timing, aset, dan lolos uji validator.

**Architecture:** Menggunakan engine motion explainer Remotion (`src/explainer/`) dengan struktur 6 scene (`HookScene`, `StageScene` salah kaprah, `BeatScene` transisi, 2 `StageScene` sains vernalisasi & fotoperiodisme, dan `StageScene` penutup). Animasi menggunakan living cutout motion dan multi-action chaining (`timing.ts` & `Stage.tsx`).

**Tech Stack:** Remotion (React, TypeScript), Node.js scripts (`cek-explainer.mjs`, `narasi.mjs`, `generate-props.mjs`), Google Flow Bridge, faster-whisper.

**Spec:** `docs/superpowers/specs/2026-11-10-gandum-tropis-design.md`

## Global Constraints

- Resolusi 1080x1920 (format 9:16 YouTube Shorts).
- Durasi total naskah ~119 kata (estimasi durasi 50 sampai 55 detik, di bawah batas keras 60 detik).
- Seluruh angka di narasi wajib berupa kata huruf (`sepuluh juta`, `lima belas derajat`), bukan digit angka.
- Area aman koordinat: `x: 8..92%`, `y: 12..76%`.
- Jarak vertikal aman antar-elemen bertumpuk minimal 16-18%.
- Latar wajib full real foto modern 100% unik per scene (`latar: 'latar/<slug>-N.png'`), dilarang transparan/blur/krem (kecuali beat scene).
- Validator `npm run cek:explainer -- gandum-tropis` wajib lulus dengan 0 error dan 0 warning.
- Dilarang menyentuh engine sejarah di `src/data/`, `src/scenes/`, `src/HistoryVideo.tsx`, atau `src/Thumbnail.tsx`.

## Review Focus

- Detik 0.0s di setiap scene wajib memiliki minimal 1 visual pembuka (tanpa `di` atau `delay: 0` / kata ke-1 atau ke-2) agar tidak terjadi layar kosong.
- Pergantian fase objek di dalam satu scene harus memakai kata `sampai` objek lama sama persis dengan kata `di` objek baru untuk mencegah ghosting dan celah kosong.
- Tiga pilar komedi wajib aktif: celetukan narasi, 5 SFX komedi (`boom`, `boing`, `slap`, `ding`, `womp`), dan meme reaksi.
- Prop atau karakter yang tampil lebih dari 3 detik wajib memiliki 2 sampai 3 `aksi` berantai mengikuti kata narasi.
- Seluruh kata kunci narasi bertanda `*bintang*` harus berpasangan genap.

---

### Task 1: Inisialisasi Kerangka & Riset Fakta

**Files:**
- Create: `src/explainer/data/gandum-tropis.ts`
- Create: `src/explainer/data/gandum-tropis.props.json`
- Create: `src/explainer/data/gandum-tropis.latar.json`
- Create: `src/explainer/data/gandum-tropis.sumber.md`
- Modify: `src/explainer/daftar.ts`

**Interfaces:**
- Consumes: `scripts/buat-explainer.mjs`
- Produces: Komposisi `GandumTropis` terdaftar di `src/explainer/daftar.ts`

- [ ] **Step 1: Jalankan scaffolding video explainer baru**
  Run: `npm run baru:explainer -- gandum-tropis`
  Expected: File template `.ts`, `.props.json`, `.latar.json`, `.sumber.md` terbuat dan terdaftar di `daftar.ts`.

- [ ] **Step 2: Isi riset fakta ilmiah di `src/explainer/data/gandum-tropis.sumber.md`**
  Tuliskan fakta data impor gandum Indonesia (> 10 juta ton), biologi vernalisasi (butuh suhu < 15°C), fotoperiodisme (butuh siang 14-16 jam), serta sumber referensi terpercaya (FAO, Kementan, jurnal botani).

- [ ] **Step 3: Jalankan validator tahap inisialisasi**
  Run: `npm run cek:explainer -- gandum-tropis`
  Expected: Menampilkan daftar kebutuhan naskah dan aset yang belum selesai.

- [ ] **Step 4: Commit**
  ```bash
  git add src/explainer/daftar.ts src/explainer/data/gandum-tropis.*
  git commit -m "chore(explainer): scaffold video gandum-tropis dan catat sumber riset"
  ```

---

### Task 2: Konfigurasi Latar Belakang & Props Cutout

**Files:**
- Modify: `src/explainer/data/gandum-tropis.latar.json`
- Modify: `src/explainer/data/gandum-tropis.props.json`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-11-10-gandum-tropis-design.md` Bagian 6
- Produces: Prompt aset siap generate untuk latar foto modern dan cutout PNG

- [ ] **Step 1: Definisikan 5 latar unik di `src/explainer/data/gandum-tropis.latar.json`**
  Daftarkan `gandum-tropis-1` (meja makan mie), `gandum-tropis-2` (lahan desa subur), `gandum-tropis-4` (laboratorium botani sejuk), `gandum-tropis-5` (sawah terik lembap berkabut), dan `gandum-tropis-6` (sawah terasering indah cerah) dengan instruksi prompt foto modern realistis tanpa bingkai/sepia.

- [ ] **Step 2: Definisikan cutout props di `src/explainer/data/gandum-tropis.props.json`**
  Daftarkan:
  - `gandum-mie` (mangkok mie instan mengepul)
  - `gandum-karung-terigu` (karung gandum)
  - `gandum-tanaman-daun` (tanaman hijau tanpa bulir)
  - `gandum-alarm-beku` (alarm es beku)
  - `gandum-termometer-dingin` (termometer dingin < 15°C)
  - `gandum-bulir-emas` (bulir gandum matang tebal)
  - `gandum-jamur` (jamur fusarium tanaman)
  - `gandum-kedinginan` (gandum lemas bersyal dan koyo)
  - `padi-mahkota` (padi bermahkota raja)

- [ ] **Step 3: Pastikan referensi meme kucing yang sudah ada dapat diakses**
  Periksa keberadaan `public/props/meme-kucing-jelasin.png`, `public/props/meme-kucing-merenung.png`, dan `public/props/meme-kucing-paw.png`.

- [ ] **Step 4: Commit**
  ```bash
  git add src/explainer/data/gandum-tropis.latar.json src/explainer/data/gandum-tropis.props.json
  git commit -m "feat(explainer): konfigurasi daftar latar dan props gandum-tropis"
  ```

---

### Task 3: Peracikan Naskah & Visual Scene 1 sampai 3 (Hook, Salah Kaprah, Beat)

**Files:**
- Modify: `src/explainer/data/gandum-tropis.ts`

**Interfaces:**
- Consumes: Spec Bagian 5 (Scene 1, Scene 2, Scene 3)
- Produces: Definisi Scene 1 sampai 3 lengkap dengan teks narasi, timing kata pemicu, koordinat, dan aksi motion

- [ ] **Step 1: Tulis Scene 1 (`type: 'hook'`)**
  - Teks narasi: `"Indonesia juara makan *mie instan* dan gorengan tepung. Tapi pernah gak mikir, kenapa gak ada *sawah gandum* di kampung kita?"`
  - Hook teks baris 1: `KONSUMSI MIE JUARA`, baris 2: `KOK GAK TANAM SENDIRI?`.
  - Pasang prop `props/gandum-mie.png` pada `0.0s`, karung terigu `masuk: 'drop', sfx: 'boom'`, simbol tanya `sfx: 'boing'`, dan meme kucing mikir beraksi jump/wiggle.

- [ ] **Step 2: Tulis Scene 2 (`type: 'stage'`)**
  - Teks narasi: `"Banyak yang ngira, *tanah kita subur* banget, lempar tongkat aja tumbuh. Giliran gandum ditanam, daunnya sih lebat, tapi *bulirnya menolak keluar*!"`
  - Pasang meme kucing merenung di `0.0s`, tanaman gandum daun tanpa bulir, dan simbol `larang` dengan `sfx: 'slap'` serta teks mikro `"Zonk!"`.

- [ ] **Step 3: Tulis Scene 3 (`type: 'beat'`)**
  - Teks tampilan: `'Oke, sini gue jelasin.'`
  - Teks narasi: `"Oke, *sini gue jelasin* rahasia biologinya."`
  - Pasang `props/meme-kucing-jelasin.png` di tengah dengan `masuk: 'pop'`, `sfx: 'boing'`, dan aksi wiggle pada kata *jelasin*.

- [ ] **Step 4: Jalankan validator parsial**
  Run: `npm run cek:explainer -- gandum-tropis`
  Expected: Scene 1–3 lolos verifikasi tanda bintang dan kata pemicu.

- [ ] **Step 5: Commit**
  ```bash
  git add src/explainer/data/gandum-tropis.ts
  git commit -m "feat(explainer): implementasi scene 1-3 gandum-tropis"
  ```

---

### Task 4: Peracikan Naskah & Visual Scene 4 sampai 6 (Sains 1, Sains 2, Penutup)

**Files:**
- Modify: `src/explainer/data/gandum-tropis.ts`

**Interfaces:**
- Consumes: Spec Bagian 5 (Scene 4, Scene 5, Scene 6)
- Produces: Definisi Scene 4 sampai 6 lengkap dengan konsep sains, badge visual, dan kesimpulan

- [ ] **Step 1: Tulis Scene 4 (`type: 'stage'` - Vernalisasi)**
  - Teks narasi: `"Gandum punya alarm biologis bernama *vernalisasi*. Tanaman ini wajib ngerasain *hawa dingin* di bawah lima belas derajat berminggu-minggu, baru selnya mau *memproduksi biji*."`
  - Pasang badge visual `'VERNALISASI'` di `0.0s`.
  - Pasang jam alarm beku (`props/gandum-alarm-beku.png`, `aksi: shake, sfx: ding`), termometer dingin turun ke bawah nol, dan bulir gandum emas membal keluar (`sfx: ding`).

- [ ] **Step 2: Tulis Scene 5 (`type: 'stage'` - Fotoperiodisme & Jamur)**
  - Teks narasi: `"Kedua, gandum butuh *siang enam belas jam*. Di khatulistiwa, matahari cuma dua belas jam, ditambah *udara lembap* yang bikin gampang *busuk jamuran*!"`
  - Pasang badge visual `'FOTOPERIODISME'` di `0.0s`.
  - Pasang ikon jam matahari dengan silang merah (`simbol: 'larang', sfx: 'slap'`), simbol tetes air (`simbol: 'tetes-air'`), dan jamur pembusuk (`props/gandum-jamur.png`, `masuk: 'pop', sfx: 'womp'`, aksi squash).

- [ ] **Step 3: Tulis Scene 6 (`type: 'stage'` - Penutup)**
  - Teks narasi: `"Makanya, daripada maksa gandum yang gampang masuk angin, petani kita jelas milih *padi sang raja tropis*. Kamu *tim mie* atau *tim nasi*?"`
  - Pasang gandum kedinginan bersyal di `0.0s`, karakter padi bermahkota raja (`props/padi-mahkota.png`, `masuk: 'slide-left', sfx: 'ding'`), dan badge interaktif `MIE vs NASI` (`sfx: 'boing'`).

- [ ] **Step 4: Jalankan validator naskah penuh**
  Run: `npm run cek:explainer -- gandum-tropis`
  Expected: Seluruh 6 scene valid, jumlah kata huruf lolos, tidak ada angka digit, tidak ada jeda kosong.

- [ ] **Step 5: Commit**
  ```bash
  git add src/explainer/data/gandum-tropis.ts
  git commit -m "feat(explainer): implementasi scene 4-6 gandum-tropis"
  ```

---

### Task 5: Validasi Akhir & Ekspor Narasi TTS

**Files:**
- Modify: `src/explainer/data/gandum-tropis.ts` (metadata YouTube & Thumbnail)

**Interfaces:**
- Consumes: Seluruh script `gandum-tropis.ts`
- Produces: Teks narasi siap rekaman TTS (`out/narasi/gandum-tropis.txt`) dan verifikasi kelayakan naskah

- [ ] **Step 1: Lengkapi metadata YouTube & Thumbnail**
  Pastikan `youtube.judul`, `youtube.deskripsi`, `youtube.tags`, dan `thumbnail` terisi rapi dengan judul menarik:
  `Kenapa Gandum Tidak Tumbuh di Indonesia? Padahal Kita Juara Makan Mie!`.

- [ ] **Step 2: Ekspor teks narasi untuk TTS**
  Run: `node scripts/narasi.mjs gandum-tropis`
  Expected: File narasi bersih terbuat di `out/narasi/gandum-tropis.txt`.

- [ ] **Step 3: Jalankan validasi total `cek-explainer`**
  Run: `npm run cek:explainer -- gandum-tropis`
  Expected: 0 error.

- [ ] **Step 4: Commit**
  ```bash
  git add src/explainer/data/gandum-tropis.ts
  git commit -m "feat(explainer): finalisasi metadata dan ekspor naskah narasi gandum-tropis"
  ```
