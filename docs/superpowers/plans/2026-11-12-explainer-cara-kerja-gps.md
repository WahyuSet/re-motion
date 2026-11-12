# Explainer "Bagaimana GPS Tahu Lokasi Kita?" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun video Shorts explainer baru bertema "Bagaimana GPS Tahu Lokasi Kita?" (slug: `cara-kerja-gps`, 1080×1920, 30fps) dengan engine explainer `"nahh gini"`: 4 latar lokasi real, 6 prop studio cutout via Flow Bridge, narasi yang lulus metrik `humanizer-indonesia` dan `antislop-copywriting` sambil tetap punya celetukan komedi, sinkronisasi audio TTS per kata, dan paket YouTube.

**Architecture:** Satu naskah data `src/explainer/data/cara-kerja-gps.ts` berisi 5 scene (`hook`, `stage` salah kaprah, `beat`, `stage` konstelasi satelit dan jam atom, `stage` trilaterasi empat satelit), terdaftar di `src/explainer/daftar.ts`. Engine inti tidak diubah. Aset latar (`--utuh`) dan cutout di-generate via `scripts/generate-props.mjs` (Flow Bridge), dipadukan dengan meme kucing yang sudah ada di `public/props/`.

**Tech Stack:** Remotion 4, TypeScript, Flow Bridge (`scripts/generate-props.mjs`), faster-whisper (`scripts/potong-narasi.mjs`), Python (`humanizer-indonesia/scripts/metrik.py`), ffmpeg.

**Spec:** [.claude/skills/video-explainer/SKILL.md](../../../.claude/skills/video-explainer/SKILL.md) · [rencana/explainer-next-video.md](../../../rencana/explainer-next-video.md) · metrik `humanizer-indonesia` (`--preset semiformal`) + `antislop-copywriting`. Keputusan user (2026-11-12): slug `cara-kerja-gps`; hook `Tanpa sinyal di hutan, kok GPS tetap jalan?` dengan thumbnail `TANPA SINYAL HP` / `KOK GPS TAHU LOKASI?`; struktur 5 scene hook, salah kaprah, beat, satelit dan jam atom, empat satelit jadi posisi.

## Global Constraints

- Hanya membuat/mengubah `src/explainer/data/cara-kerja-gps.*`, `src/explainer/daftar.ts`, `public/latar/cara-kerja-gps-*.png`, `public/props/gps-*.png`, `narasi/cara-kerja-gps/*`, `public/audio/cara-kerja-gps/*`. Engine sejarah dan engine explainer tidak disentuh.
- Format `short`, `watermark: false`, `narasiAudio: 'audio/cara-kerja-gps'`, `narasiExt: 'wav'`.
- Setiap scene non-beat wajib punya `latar: 'latar/cara-kerja-gps-N.png'` unik, foto modern 100%, tanpa `latarOpacity`/`latarBlur`, tanpa bingkai/sepia.
- Hook 1 kalimat 8 kata (±3,3 detik pada 2,4 kata/detik); jangan lebih dari 9 kata supaya tetap ±3-4 detik. `baris1`/`baris2` maksimal 28 karakter dan selaras dengan isi hook.
- Narasi lulus `metrik.py --preset semiformal`: rerata 13-17 kata, simpangan baku min 6,4, kepadatan kata pemadat 73-139 per 1.000 kata, triplet 0, penyangkalan antisipatif 0.
- Narasi lolos `antislop-copywriting`: tanpa intensifier kosong ("super akurat"), tanpa personifikasi benda mati, tanpa signposting, tanpa em dash. Humor lewat analogi konkret dan partikel tutur (*kok, kan, sedangkan*), bukan slang berlebihan.
- Pilar 1 komedi: minimal 2 celetukan relatable di narasi (Scene 2 dan Scene 4) plus partikel tutur.
- Narasi tanpa angka digit (eja huruf), tanpa singkatan, tanda `*` berpasangan genap.
- Koordinat item `x: 8..92`, `y: 12..76`; jarak vertikal antar-item sesisi minimal 16-18%.
- Zero Dead Air: tidak ada jeda lebih dari 2,5 detik (±6 kata) tanpa perubahan visual (item baru atau `aksi`). Estimasi 2,4 kata per detik.
- Pergantian fase memakai kata `sampai` item lama sama dengan `di` item baru. Jangan taruh item baru di x,y yang hampir persis dengan item yang sedang keluar (selisih minimal 6 poin di salah satu sumbu), kecuali kata `di` baru lebih akhir dari `sampai` lama.
- Maksimal 3 item non-sentral aktif bersamaan.
- Label micro-gag: `kind: 'teks'`, `ukuran: 28-32`, `rotate: -6`.
- Teks tanpa em dash di seluruh dokumen dan data.

## Review Focus

1. **Miskonsepsi cara kerja GPS** → Scene 2 mematahkan mitos secara eksplisit: HP tidak memancarkan sinyal balik, kuota hanya untuk gambar peta. Catat nuansa A-GPS di `sumber.md` agar tidak ada klaim terlalu mutlak.
2. **Kata pemicu tidak cocok narasi** → `cek:explainer` 0 error. Tabel koreografi sudah disimulasikan dengan `indexOfWord` asli (semua cocok).
3. **Dead air dan overcrowding saat pergantian fase** → periksa lembar kontak frame 35% dan 85% per scene.
4. **Whisper salah dengar `nanodetik`, `GPS`, `jam atom`** → bila `cek:explainer` melaporkan jumlah kata berbeda setelah `potong-narasi`, ganti kata pemicu ke kata tetangga, jangan ubah narasi.
5. **Sisa latar hijau atau teks palsu di cutout AI** → `read_file` setiap PNG sebelum Task 3.

---

### Task 1: Kerangka, Sumber, dan Narasi Terkalibrasi

**Files:**
- Create (via scaffold): `src/explainer/data/cara-kerja-gps.{ts,props.json,latar.json,sumber.md}`
- Modify (via scaffold): `src/explainer/daftar.ts`

**Interfaces:**
- Produces: `export const caraKerjaGps: ExplainerScript`, terdaftar sebagai `{id: 'CaraKerjaGps', script: caraKerjaGps}`.

- [ ] **Step 1: Scaffold**

Run: `npm run baru:explainer -- cara-kerja-gps`
Expected: empat file di `src/explainer/data/` terbuat dan `daftar.ts` memuat `./data/cara-kerja-gps`.

- [ ] **Step 2: Isi `cara-kerja-gps.sumber.md`** dengan fakta dan minimal 3 URL

- Receiver GPS ponsel hanya menerima sinyal radio dari satelit secara pasif, tanpa memancarkan balik. Data seluler hanya dipakai untuk memuat gambar peta dan (opsional) A-GPS yang mempercepat penguncian pertama. GPS tetap bekerja tanpa internet.
- Konstelasi GPS: lebih dari tiga puluh satelit operasional di orbit sekitar 20.200 km, masing-masing membawa jam atom dan memancarkan data posisi (efemeris) beserta catatan waktu.
- Receiver menghitung jarak dari selisih waktu tempuh sinyal. Empat satelit dibutuhkan untuk tiga dimensi posisi ditambah koreksi selisih jam receiver. (Dipakai sebagai catatan, tidak dinarasikan.)
- URL: `https://spaceplace.nasa.gov/gps/en/`, `https://www.gps.gov/systems/gps/`, dan satu rujukan FAA tentang GNSS. **Buka tiap URL dulu; ganti yang 404 dengan halaman resmi lain di `gps.gov`.** Verifikasi juga jumlah satelit operasional terbaru di `gps.gov` sebelum menulis "lebih dari tiga puluh".

- [ ] **Step 3: Isi metadata dan narasi `cara-kerja-gps.ts`** (narasi di bawah sudah diuji: rerata 15,1, simpangan baku 6,9, pemadat 80,9, semua baris LULUS)

Metadata:
- `format: 'short'`, `watermark: false`, `narasiAudio: 'audio/cara-kerja-gps'`, `narasiExt: 'wav'`
- `thumbnail`: `baris1: 'TANPA SINYAL HP'`, `baris2: 'KOK GPS TAHU LOKASI?'`, `latar: 'latar/cara-kerja-gps-1.png'`, `src: 'props/gps-hp-peta.png'`
- `youtube.judul`: `'Tanpa Sinyal HP, Kok GPS Tetap Tahu Lokasi Kita?'`
- `youtube.deskripsi`: `'Di tengah hutan tanpa sinyal, titik GPS di HP tetap jalan. Penerima GPS hanya menangkap sinyal radio dari satelit secara pasif, sementara kuota internet dipakai untuk mengunduh gambar peta.'`
- `youtube.tags`: `['cara kerja gps', 'satelit gps', 'sains populer', 'teknologi hp', 'edukasi', 'nahhgini']`

| Scene | type | latar | judul (judulDi) | duration min | narasi |
|---|---|---|---|---|---|
| 1 | `hook` | `cara-kerja-gps-1` | `baris1/baris2` sama dengan thumbnail | 105 | `Tanpa sinyal di hutan, kok *GPS* tetap jalan?` |
| 2 | `stage` | `cara-kerja-gps-2` | `SALAH KAPRAH` (`memancarkan`) | 300 | `Banyak orang mengira HP harus *memancarkan sinyal* balik ke satelit, atau wajib memakai kuota internet untuk menentukan posisi kita di peta. Padahal penerima GPS di dalam HP itu hanya *menangkap sinyal* radio secara pasif, ibarat radio mobil: kita kan tidak pernah bisa membalas penyiarnya. Kuota baru terpakai untuk mengunduh gambar petanya.` |
| 3 | `beat` | (krem) | `teks: 'Oke, sini gue jelasin.'` | 70 | `Oke, *sini gue jelasin* cara kerjanya.` |
| 4 | `stage` | `cara-kerja-gps-4` | `JAM ATOM SATELIT` (`tiga puluh`) | 270 | `Di orbit bumi sudah ada lebih dari *tiga puluh satelit* yang terus-menerus memancarkan data posisi beserta *catatan waktu* dari jam atom. Ketelitian jam itu sampai hitungan *nanodetik*, sedangkan jam dinding di rumah kita telat lima menit pun dibiarkan.` |
| 5 | `stage` | `cara-kerja-gps-5` | `EMPAT SATELIT` (`empat satelit`) | 280 | `Ketika HP kita dapat menangkap sinyal dari *empat satelit* sekaligus, selisih waktu tempuh tiap sinyal itu akan dihitung menjadi jarak ke masing-masing satelit. Titik perpotongan jarak tersebut menunjukkan *posisi kita* di permukaan bumi.` |

- [ ] **Step 4: Validasi dan metrik**

Run:
```bash
npm run cek:explainer -- cara-kerja-gps
node scripts/narasi.mjs cara-kerja-gps
python "C:/Users/WS/.gemini/config/skills/humanizer-indonesia/scripts/metrik.py" narasi/cara-kerja-gps/naskah-full.txt --preset semiformal
```
Expected: `cek:explainer` tanpa error narasi (error hanya soal file latar/props yang belum ada). `metrik.py`: semua baris berambang LULUS, pemadat 73-139, triplet 0, penyangkalan 0.

- [ ] **Step 5: Commit**

```bash
git add src/explainer/data/cara-kerja-gps.* src/explainer/daftar.ts narasi/cara-kerja-gps/
git commit -m "feat(explainer): kerangka dan naskah cara-kerja-gps"
```

---

### Task 2: Aset Latar Real dan Studio Cutout (Flow Bridge)

**Files:**
- Modify: `src/explainer/data/cara-kerja-gps.latar.json`, `src/explainer/data/cara-kerja-gps.props.json`
- Create (generated): `public/latar/cara-kerja-gps-{1,2,4,5}.png`, `public/props/gps-{hp-peta,antena-pancar,satelit,jam-atom,bumi-orbit,trilaterasi}.png`

**Interfaces:**
- Produces: path aset di atas, dipakai Task 3.

- [ ] **Step 1: Isi `cara-kerja-gps.latar.json`** (array `{name, prompt}`; tiap prompt diakhiri `clean realistic modern photography, natural colors, full-bleed edge-to-edge camera frame, no border, no frame, no text`)
  - `cara-kerja-gps-1`: jalur hiking hutan pinus tropis Indonesia siang hari, sinar matahari menembus pepohonan, tanpa orang
  - `cara-kerja-gps-2`: sudut jalan kota Jakarta siang hari dengan kafe dan menara telekomunikasi di kejauhan, tanpa orang di depan
  - `cara-kerja-gps-4`: pemandangan Bumi dari orbit, lengkung horizon biru bercahaya, lampu kota di sisi malam
  - `cara-kerja-gps-5`: pandangan udara persimpangan jalan kota Indonesia siang hari dengan taman dan atap bangunan

- [ ] **Step 2: Isi `cara-kerja-gps.props.json`** (tiap prompt diawali `clean realistic studio product photography cutout of`, diakhiri `no text, crisp edges, natural colors, soft even lighting, high detail`)
  - `gps-hp-peta`: smartphone tegak menampilkan peta jalan grafis dengan pin lokasi biru menyala
  - `gps-antena-pancar`: smartphone dengan antena parabola walkie-talkie raksasa di atasnya memancarkan cincin sinyal merah
  - `gps-satelit`: satelit navigasi bodi foil emas dengan dua panel surya biru
  - `gps-jam-atom`: modul jam atom presisi dengan cincin digital cyan menyala dan silinder vakum kuningan
  - `gps-bumi-orbit`: globe Bumi dikelilingi tiga cincin orbit emas dengan satelit mini
  - `gps-trilaterasi`: diorama empat satelit kecil memproyeksikan empat cincin tembus pandang yang bertemu di satu pin merah di atas blok kota miniatur

- [ ] **Step 3: Generate**

Run:
```bash
node scripts/generate-props.mjs --cek
node scripts/generate-props.mjs --file src/explainer/data/cara-kerja-gps.latar.json --utuh --style "clean realistic modern photography, natural colors, full-bleed edge-to-edge camera frame, no border, no frame, no vintage paper effect, no sepia, high detail"
node scripts/generate-props.mjs --file src/explainer/data/cara-kerja-gps.props.json --style "clean realistic studio product photography cutout, crisp edges, natural colors, soft even lighting, high detail"
```
Expected: `Selesai: 4 berhasil, 0 gagal` dan `Selesai: 6 berhasil, 0 gagal`. Bila timeout, ulangi yang gagal dengan `--concurrency 1`.

- [ ] **Step 4: Inspeksi** kesepuluh PNG dengan `read_file`: latar full-bleed tajam tanpa bingkai, cutout bersih tanpa sisa hijau atau teks acak. Generate ulang yang cacat dengan `--name`.

- [ ] **Step 5: Commit**

```bash
git add src/explainer/data/cara-kerja-gps.*.json public/latar/cara-kerja-gps-* public/props/gps-*
git commit -m "feat(explainer): aset cara-kerja-gps"
```

---

### Task 3: Koreografi Panggung

**Files:**
- Modify: `src/explainer/data/cara-kerja-gps.ts`

**Interfaces:**
- Consumes: narasi Task 1, aset Task 2, props existing `meme-kucing-{paw,sinis,jelasin,senyum,jempol}.png`, simbol `tanya|larang|panah|centang`, sfx `boing|boom|womp|slap|ding`.
- Produces: naskah yang lulus `cek:explainer` dengan 0 error.

- [ ] **Step 1: Isi `utama`/`items`/`aksi` sesuai tabel.** Kolom "sampai" kosong berarti item tampil sampai scene berakhir. Semua kata di kolom `di`/`sampai` sudah diverifikasi cocok dengan narasi final.

**Scene 1 (hook, latar `cara-kerja-gps-1`)**

| di | item (x, y, width/ukuran) | masuk | sampai | aksi / sfx |
|---|---|---|---|---|
| delay 0 (utama) | `gps-hp-peta` (32, 52, 290) | drop | | wiggle `hutan` rotate 12; move `GPS` toX 28 toY 54 toScale 1.05; jump `jalan?` dy 40 sfx boing |
| delay 0 | `meme-kucing-paw` (70, 52, 240) | slide-up | | wiggle `kok` rotate -14 |
| `tanpa sinyal` | teks `TANPA SINYAL 📵` (70, 32, 28) kotak `#d93829` | slide-left | `kok` | |
| `kok` | simbol `tanya` (74, 30, 105) | pop | | sfx boing; peek `tetap` dx -12 dy -8 rotate -14 durasi 12 tahan 18 |
| `tetap jalan` | teks `KOK TETAP JALAN?! 📍` (64, 70, 28) kotak `#f5c518` warna `#1d1812` rotate -3 | drop | | sfx ding |

**Scene 2 (stage, latar `cara-kerja-gps-2`, judul `SALAH KAPRAH`, judulDi `memancarkan`)**

| di | item | masuk | sampai | aksi / sfx |
|---|---|---|---|---|
| delay 0 | `meme-kucing-sinis` (24, 54, 260) | slide-up | `Padahal` | wiggle `mengira` rotate 12; move `menentukan` toX 21 toY 56 |
| `memancarkan` | `gps-antena-pancar` (70, 44, 250) | slide-left | `Padahal` | sfx boing; shake `satelit` intensitas 12 |
| `memancarkan` | teks `MITOS: MANCARIN SINYAL` (70, 64, 26) kotak `#d93829` | drop | `Padahal` | |
| `kuota` | simbol `larang` (70, 44, 150) | pop | `Padahal` | sfx slap |
| `Padahal` | `gps-hp-peta` (36, 50, 270) | pop | | sfx ding; pulse `GPS`; jump `mengunduh` dy 35 sfx boing |
| `menangkap sinyal` | teks `PENERIMA PASIF 📡` (70, 36, 28) kotak `#2e7d32` | drop | | sfx ding; pulse `menangkap sinyal` |
| `radio mobil` | teks micro-gag `RADIO MOBIL GAK BISA BALES 📻` (66, 56, 28) rotate -6 kotak `#37474f` | slide-left | `Kuota` | sfx boing; wiggle `membalas` rotate 10 |
| `gambar petanya` | teks `KUOTA = GAMBAR PETA 🗺️` (66, 56, 28) kotak `#1565c0` | drop | | sfx ding |

Catatan: kucing sinis di x 24 dan `gps-hp-peta` di x 36 berbeda 12 poin, jadi tidak saling menimpa saat kucing keluar di `Padahal`.

**Scene 3 (beat)**

| di | item | masuk | aksi / sfx |
|---|---|---|---|
| delay 0 | `meme-kucing-jelasin` (50, 56, 340) | pop | sfx boing; wiggle `jelasin` rotate 12 |
| `kerjanya.` | teks `CARA KERJA GPS` (50, 34, 36) kotak `#f5c518` warna `#1d1812` rotate -2 | drop | sfx ding |

**Scene 4 (stage, latar `cara-kerja-gps-4`, judul `JAM ATOM SATELIT`, judulDi `tiga puluh`)**

| di | item | masuk | sampai | aksi / sfx |
|---|---|---|---|---|
| delay 0 (sentral) | `gps-satelit` (30, 46, 280) | slide-right | | pulse `tiga puluh`; move `memancarkan` toX 28 toY 40 toScale 0.95; wiggle `catatan waktu` rotate 10 |
| `orbit` | `gps-bumi-orbit` (70, 54, 260) | pop | `memancarkan` | sfx boing |
| `tiga puluh` | teks `30+ SATELIT DI ORBIT 🛰️` (70, 32, 28) kotak `#1976d2` | pop | `memancarkan` | sfx ding |
| `memancarkan` | simbol `panah` (48, 46, 110) rotate 20 warna `#f5c518` | slide-right | `Ketelitian` | |
| `catatan waktu` | teks `POSISI + CATATAN WAKTU ⏱️` (68, 32, 26) kotak `#f5c518` warna `#1d1812` | drop | `Ketelitian` | sfx ding |
| `jam atom` | `gps-jam-atom` (70, 54, 230) | drop | `sedangkan` | sfx ding; pulse `atom` durasi 16 |
| `nanodetik` | teks `AKURASI NANODETIK ⏱️` (68, 32, 28) kotak `#1976d2` | drop | | sfx ding |
| `sedangkan` | `meme-kucing-senyum` (70, 54, 240) | slide-up | | sfx womp |
| `telat` | teks micro-gag `JAM DINDING: TELAT LIMA MENIT, YA UDAH 🙃` (56, 72, 28) rotate -6 kotak `#37474f` | slide-left | | sfx boing |

Catatan: `jam atom` keluar di `sedangkan` dan `meme-kucing-senyum` masuk di kata yang sama (serah terima tanpa celah), posisi sama sengaja dengan `sampai` = `di`.

**Scene 5 (stage, latar `cara-kerja-gps-5`, judul `EMPAT SATELIT`, judulDi `empat satelit`)**

| di | item | masuk | sampai | aksi / sfx |
|---|---|---|---|---|
| delay 0 (sentral) | `gps-trilaterasi` (30, 48, 290) | pop | | pulse `empat satelit`; move `dihitung` toX 28 toY 50; jump `posisi kita` dy 38 sfx ding |
| `empat satelit` | teks `MINIMAL 4 SATELIT 🛰️` (70, 34, 28) kotak `#1976d2` | slide-left | `Titik` | sfx ding |
| `selisih waktu` | teks `SELISIH WAKTU ⏱️` (70, 56, 28) kotak `#e65100` | drop | `dihitung` | aksi pulse `tiap sinyal` |
| `dihitung` | teks `JADI JARAK 📏` (70, 56, 28) kotak `#e65100` | drop | `Titik` | sfx boom; pulse `jarak`; pulse `masing-masing` |
| `Titik` | `meme-kucing-jempol` (72, 54, 240) | slide-up | | sfx boing; wiggle `perpotongan` rotate 10; jump `permukaan bumi` dy 40 |
| `posisi kita` | simbol `centang` (72, 32, 115) | pop | | sfx ding |
| `posisi kita` | teks `TITIK POTONG = POSISI KITA 🎯` (54, 72, 26) kotak `#2e7d32` | drop | | sfx ding |

- [ ] **Step 2: Validasi**

Run: `npm run cek:explainer -- cara-kerja-gps`
Expected: `✓ LULUS: cara-kerja-gps (5 scene, 1 peringatan)`. Satu-satunya peringatan yang boleh muncul adalah `kata.json tidak ditemukan` (audio belum dipotong).

- [ ] **Step 3: Commit**

```bash
git add src/explainer/data/cara-kerja-gps.ts
git commit -m "feat(explainer): koreografi cara-kerja-gps"
```

---

### Task 4: Audio TTS dan Sinkronisasi

**Files:**
- Create: `public/audio/cara-kerja-gps/01.wav`..`05.wav`, `public/audio/cara-kerja-gps/kata.json`

- [ ] **Step 1:** Kirim isi `narasi/cara-kerja-gps/naskah-full.txt` ke user, minta 1 file WAV TTS utuh.
- [ ] **Step 2:** Salin WAV ke `public/audio/cara-kerja-gps-raw.wav` (path pendek tanpa spasi), lalu:
```bash
node scripts/potong-narasi.mjs cara-kerja-gps "public/audio/cara-kerja-gps-raw.wav"
Remove-Item public/audio/cara-kerja-gps-raw.wav
```
Expected: `01.wav`..`05.wav` (dinormalisasi `loudnorm I=-18`) dan `kata.json` dengan kecocokan kata minimal 90%.
- [ ] **Step 3:** `npm run cek:explainer -- cara-kerja-gps` → `✓ LULUS: cara-kerja-gps (5 scene, 0 peringatan)`. Bila kata pemicu salah dengar, ganti pemicu ke kata tetangga, jangan ubah narasi.
- [ ] **Step 4:** `git add public/audio/cara-kerja-gps src/explainer/data/cara-kerja-gps.ts && git commit -m "feat(explainer): audio cara-kerja-gps"`

---

### Task 5: Cek Visual, Render Final, Paket YouTube

**Files:**
- Create: `out/cek/cara-kerja-gps-lembar.jpg`, `out/storyboard/cara-kerja-gps-1.jpg`, `out/cara-kerja-gps.mp4`, `out/cara-kerja-gps-720p.mp4`, `out/youtube/cara-kerja-gps/*`

- [ ] **Step 1:** `node scripts/cek-frame.mjs cara-kerja-gps` dan `node scripts/storyboard.mjs cara-kerja-gps`.
- [ ] **Step 2:** `read_file` `out/cek/cara-kerja-gps-lembar.jpg`. Lolos jika di frame 35% dan 85% tiap scene: prop sesuai subtitle, tidak ada tumpukan atau elemen di area merah, maksimal 3 item non-sentral. Khusus periksa Scene 2 (kata `radio mobil`, `gambar petanya`) dan Scene 4 (`sedangkan`, `telat`). Perbaiki koordinat lalu ulangi.
- [ ] **Step 3:** `node scripts/render.mjs cara-kerja-gps --final` lalu `node scripts/paket-youtube.mjs cara-kerja-gps`. Expected: `out/cara-kerja-gps.mp4` 1080×1920 dengan laporan `Loudness ... -> -14.x LUFS`, versi 720p maksimal 28 MB, dan paket `thumbnail.jpg`, `thumbnail-kecil.jpg`, `judul.txt`, `deskripsi.txt`, `tags.txt`, `subtitle.id.srt`.
- [ ] **Step 4:** `read_file` `out/youtube/cara-kerja-gps/thumbnail-kecil.jpg`: teks `TANPA SINYAL HP` / `KOK GPS TAHU LOKASI?` terbaca.
- [ ] **Step 5:** `git commit -am "feat(explainer): render cara-kerja-gps"` (file `out/` tidak di-commit bila ada di `.gitignore`).


