# Explainer "Ngecas HP Cuma Sampai 80%" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Video Shorts explainer baru (slug `cas-80`) yang menjelaskan kenapa HP sekarang disarankan dicas sampai 80%, dirender ke `out/cas-80.mp4` beserta paket YouTube.

**Architecture:** Satu naskah data `src/explainer/data/cas-80.ts` (5 scene: hook → salah kaprah → beat → bongkar litium ion → solusi) di engine `src/explainer/` yang sudah ada. Tidak ada perubahan engine. Aset: 4 latar real + 6 props cutout lewat Flow Bridge, sisanya reuse props meme kucing yang sudah ada. Audio TTS disuplai user lalu dipotong per scene dengan `potong-narasi.mjs`.

**Tech Stack:** Remotion 4, TypeScript, Flow Bridge (`scripts/generate-props.mjs`), faster-whisper (`scripts/potong-narasi.mjs`), ffmpeg.

**Spec:** Keputusan sesi ini (topik + naskah di Task 1) · [rencana/explainer-next-video.md](../../../rencana/explainer-next-video.md) · [.claude/skills/video-explainer/SKILL.md](../../../.claude/skills/video-explainer/SKILL.md) · pelajaran revisi `black-box` (props wajib nyambung ke narasi, jangan over).

## Global Constraints

- Hanya buat/ubah `src/explainer/data/cas-80.*`, `src/explainer/daftar.ts`, aset `public/latar/cas-80-*.png`, `public/props/cas-*.png`, `public/audio/cas-80/`. Engine sejarah dan engine explainer tidak disentuh.
- Format `short`, 1080×1920, `watermark: false`.
- Narasi tanpa angka digit (eja: "delapan puluh", "seratus"), tanpa singkatan, tanda `*` berpasangan.
- Hook 8–14 kata, 1 kalimat; `baris1`/`baris2` maks 28 karakter.
- Koordinat item: x 8..92, y 12..76. Jarak vertikal antar item sisi yang sama ≥ 16%.
- Latar unik per scene non-beat, foto real 100%, tanpa `latarOpacity`/`latarBlur`.
- **Satu klausa = satu ide visual.** Setiap prop harus menggambarkan kata yang sedang diucapkan; tidak ada prop simbolik yang butuh ditafsir (pelajaran "gembok" di black-box). Maks 3 item aktif di layar selain prop sentral.
- Pergantian fase pakai pasangan `sampai: X` / `di: X` dengan kata yang sama.
- Copy lolos `antislop-copywriting` + `humanizer-indonesia`: tanpa "Tahukah kamu", tanpa "solusi", register lisan (kok, sih, tuh).

## Review Focus

1. **Klaim teknis keliru** (mis. "cas penuh bikin meledak" disajikan sebagai fakta) → narasi harus memposisikannya sebagai mitos; fakta di `cas-80.sumber.md` dengan ≥2 URL (Apple Support, Samsung, Battery University).
2. **Prop tidak nyambung kata** → setiap baris tabel koreografi Task 3 menyebut kata pemicu dan alasan visualnya; reviewer menolak item tanpa alasan.
3. **Layar sesak di Scene 4** (narasi teknis paling padat) → maks 3 item non-sentral aktif; cek di lembar kontak frame 35% dan 85%.
4. **Kata pemicu hilang setelah TTS** (Whisper salah dengar "litium ion", "delapan puluh") → `cek:explainer` 0 peringatan jumlah kata setelah `potong-narasi`.
5. **Render gagal karena font jaringan** → `src/theme.ts` sudah pakai font stack lokal; render harus jalan offline tanpa `delayRender` timeout.

---

### Task 1: Kerangka, Sumber, dan Naskah Narasi

**Files:**
- Create (via scaffold): `src/explainer/data/cas-80.ts`, `cas-80.props.json`, `cas-80.latar.json`, `cas-80.sumber.md`
- Modify (via scaffold): `src/explainer/daftar.ts`

**Interfaces:**
- Produces: export `cas80: ExplainerScript` di `cas-80.ts`, terdaftar sebagai `{id: 'Cas80', script: cas80}`. Narasi per scene (di bawah) adalah sumber kata pemicu untuk Task 3.

- [ ] **Step 1:** `npm run baru:explainer -- cas-80` → file di atas terbuat dan `daftar.ts` memuat `./data/cas-80`.
- [ ] **Step 2:** Isi `cas-80.sumber.md` dengan fakta + URL:
  - Litium ion menua lebih cepat saat lama di tegangan tinggi (dekat 100%) dan saat panas.
  - Cas penuh tidak berbahaya: HP punya pengaman pengisian (BMS) yang memutus arus saat penuh.
  - "Habiskan sampai nol dulu" adalah mitos era baterai nikel (memory effect); litium ion justru tertekan di level sangat rendah.
  - iPhone 15 ke atas: opsi batas 80%. Samsung One UI: "Protect battery" (85%, One UI 6.1 ada opsi 80%). Verifikasi angka ini di halaman resmi sebelum lanjut.
- [ ] **Step 3:** Isi metadata + narasi di `cas-80.ts` persis:

| Scene | type | narasi |
|---|---|---|
| 1 | hook | `HP dicas sampai seratus persen, kok malah disuruh berhenti di delapan puluh?` |
| 2 | stage | `Banyak yang ngira cas penuh bikin baterai *meledak*, atau harus dihabisin sampai nol dulu. Keduanya salah, HP sekarang udah punya *pengaman otomatis*.` |
| 3 | beat | `Oke, *sini gue jelasin* kenapa harus delapan puluh.` (teks: `Oke, sini gue jelasin.`) |
| 4 | stage | `Baterai HP itu *litium ion*. Makin mendekati penuh, tegangannya makin tinggi dan selnya makin *tertekan*. Apalagi kalau sambil panas, kapasitasnya pelan-pelan *menyusut*.` |
| 5 | stage | `Makanya iPhone dan Samsung keluaran baru punya fitur *batas pengisian*. Gak wajib sih, tapi kalau mau HP awet bertahun-tahun, ini cara paling gampang.` |

  Metadata: `thumbnail.baris1: 'CAS HP CUMA 80%'`, `baris2: 'BIAR BATERAI AWET?'`; hook `baris1/baris2` sama; `judul` scene 2/4/5: `SALAH KAPRAH` / `ISI BATERAI HP` / `FITUR BAWAAN`; `narasiAudio: 'audio/cas-80'`, `narasiExt: 'wav'`; `youtube.judul: 'Kenapa HP Sekarang Disarankan Dicas Cuma Sampai 80%?'`, 6–8 tag.
- [ ] **Step 4:** `npm run cek:explainer -- cas-80` → boleh ERROR hanya untuk latar/props yang belum ada; tidak boleh ada error narasi (digit, `*` ganjil, hook > 14 kata).
- [ ] **Step 5:** `git add src/explainer/data/cas-80.* src/explainer/daftar.ts && git commit -m "feat(explainer): kerangka dan naskah cas-80"`

---

### Task 2: Aset Latar dan Props (Flow Bridge)

**Files:**
- Modify: `src/explainer/data/cas-80.latar.json`, `src/explainer/data/cas-80.props.json`
- Create (generated): `public/latar/cas-80-{1,2,4,5}.png`, `public/props/cas-{hp-cas,charger,sel-litium,baterai-gembung,chip-pengaman,baterai-alkaline}.png`

**Interfaces:**
- Produces: path aset persis seperti di atas; dipakai Task 3.

- [ ] **Step 1:** `cas-80.latar.json` (nama → suasana, real modern, tanpa orang di depan):
  - `cas-80-1`: meja samping kasur malam hari, HP dicas, lampu tidur hangat
  - `cas-80-2`: ruang tamu rumah Indonesia siang, sofa, colokan dinding
  - `cas-80-4`: meja servis elektronik, mikroskop, solder, papan sirkuit
  - `cas-80-5`: meja kerja pagi, laptop, kopi, cahaya jendela
- [ ] **Step 2:** `cas-80.props.json` (objek tunggal, tanpa teks di layar HP):
  - `cas-hp-cas`: smartphone modern layar menyala ikon baterai mengisi, kabel USB-C tercolok
  - `cas-charger`: kepala charger dinding putih dengan kabel USB-C
  - `cas-sel-litium`: sel baterai litium ion pouch persegi tipis keperakan dengan tab konektor
  - `cas-baterai-gembung`: baterai HP pouch yang menggembung
  - `cas-chip-pengaman`: papan sirkuit kecil pengaman baterai (BMS) dengan chip
  - `cas-baterai-alkaline`: baterai AA lama (untuk mitos "habisin sampai nol" era baterai lama)
- [ ] **Step 3:** Jalankan:
  ```bash
  node scripts/generate-props.mjs --file src/explainer/data/cas-80.latar.json --utuh
  node scripts/generate-props.mjs --file src/explainer/data/cas-80.props.json --style "clean realistic studio product photography cutout, crisp edges, natural colors, soft even lighting, high detail"
  ```
  Expected: `Selesai: N berhasil, 0 gagal.` Jika timeout, ulangi dengan `--concurrency 1` hanya untuk yang gagal.
- [ ] **Step 4:** Buka setiap PNG dengan Read: cutout bersih, tanpa sisa latar hijau, tanpa teks palsu. Generate ulang yang gagal.
- [ ] **Step 5:** `git add src/explainer/data/cas-80.*.json public/latar/cas-80-* public/props/cas-* && git commit -m "feat(explainer): aset cas-80"`

---

### Task 3: Koreografi Visual Props

**Files:**
- Modify: `src/explainer/data/cas-80.ts`

**Interfaces:**
- Consumes: narasi Task 1, aset Task 2, props existing `meme-kucing-{paw,sinis,jelasin,merenung,jempol}.png`, `kamar-termometer.png`, simbol `tanya|larang|centang|retak`, sfx `boing|boom|womp|slap|ding`.

- [ ] **Step 1:** Isi `utama`/`items` sesuai tabel. Kolom "keluar" = nilai `sampai`.

**Scene 1 (hook, latar cas-80-1)**

| di | item | keluar | alasan |
|---|---|---|---|
| delay 0 (utama) | `cas-hp-cas` tengah, `aksi pulse di 'seratus'` | – | objek yang dibicarakan |
| `seratus` | teks `100%` hijau | `kok` | angka yang diucapkan |
| `kok` | `meme-kucing-paw` kiri, sfx boing | – | ekspresi heran |
| `delapan` | teks `80%?` kuning + simbol `tanya`, wiggle | – | pertanyaan inti |

**Scene 2 (stage, latar cas-80-2)**

| di | item | keluar | alasan |
|---|---|---|---|
| delay 0 | `meme-kucing-sinis` kiri | `Keduanya` | "banyak yang ngira" |
| `meledak` | `cas-hp-cas` kanan + simbol `retak`, sfx boom, shake | `atau` | mitos 1 |
| `atau` | `cas-baterai-alkaline` kanan + teks `HABISIN SAMPAI 0%` | `Keduanya` | mitos 2 |
| `Keduanya` | simbol `larang` + teks `DUA-DUANYA MITOS`, sfx slap | `pengaman` | bantahan |
| `pengaman` | `cas-chip-pengaman` tengah + teks `PENGAMAN OTOMATIS`, sfx ding | – | fakta |

**Scene 3 (beat):** `meme-kucing-jelasin` delay 0 sfx boing; di `delapan` teks `KENAPA 80%?` (pola sama dengan black-box Scene 3).

**Scene 4 (stage, latar cas-80-4)**

| di | item | keluar | alasan |
|---|---|---|---|
| delay 0 (sentral) | `cas-sel-litium` kiri, `aksi shake di 'tertekan'` | – | "baterai HP itu" |
| `litium` | teks `LITIUM ION` | `Makin` | nama yang diucapkan |
| `penuh` | teks `TEGANGAN NAIK ↑` kanan | `Apalagi` | tegangan makin tinggi |
| `tertekan` | `cas-baterai-gembung` kanan, sfx womp | `Apalagi` | sel tertekan |
| `panas` | `kamar-termometer` kanan, pulse | `menyusut` | panas |
| `menyusut` | teks `KAPASITAS TURUN` merah + `meme-kucing-merenung`, sfx womp | – | akibat |

**Scene 5 (stage, latar cas-80-5)**

| di | item | keluar | alasan |
|---|---|---|---|
| delay 0 (sentral) | `cas-hp-cas` tengah | – | objek |
| `batas` | teks `BATAS 80%` hijau, sfx ding, jump | – | nama fitur |
| `wajib` | teks `OPSIONAL` abu-abu | `awet` | "gak wajib sih" |
| `awet` | simbol `centang` + teks `BATERAI AWET` | – | manfaat |
| `gampang` | `meme-kucing-jempol` kanan, sfx ding | – | penutup positif |

- [ ] **Step 2:** `npm run cek:explainer -- cas-80` → Expected `✓ LULUS: cas-80 (5 scene, 0 peringatan).` (peringatan jumlah kata kata.json boleh muncul hanya sebelum Task 4).
- [ ] **Step 3:** `git commit -am "feat(explainer): koreografi cas-80"`

---

### Task 4: Audio TTS dan Sinkronisasi

**Files:**
- Create: `public/audio/cas-80/01.wav`..`05.wav`, `public/audio/cas-80/kata.json`

- [ ] **Step 1:** `node scripts/narasi.mjs cas-80` → kirim teks narasi ke user, minta 1 file WAV TTS.
- [ ] **Step 2:** Salin WAV user ke `public/audio/cas-80-raw.wav` (path pendek tanpa spasi, pelajaran black-box), lalu `node scripts/potong-narasi.mjs cas-80 "public\audio\cas-80-raw.wav"` → Expected kecocokan kata ≥ 90%.
- [ ] **Step 3:** `npm run cek:explainer -- cas-80` → `0 peringatan`. Bila kata pemicu salah dengar, ganti pemicu ke kata tetangga yang terdengar benar (jangan ubah narasi setelah audio jadi).
- [ ] **Step 4:** `git add public/audio/cas-80 && git commit -m "feat(explainer): audio cas-80"`

---

### Task 5: Cek Visual, Render Final, Paket YouTube

**Files:**
- Create: `out/cek/cas-80-lembar.jpg`, `out/cas-80.mp4`, `out/cas-80-720p.mp4`, `out/youtube/cas-80/*`

- [ ] **Step 1:** `node scripts/cek-frame.mjs cas-80` → Read `out/cek/cas-80-lembar.jpg`. Lolos jika: tiap frame menampilkan prop yang cocok dengan subtitle di frame itu, tidak ada teks di area merah, tidak ada prop menutupi badge, maks 3 item non-sentral.
- [ ] **Step 2:** Render frame tambahan untuk momen padat (Scene 4 di kata `tertekan` dan `menyusut`) lewat `bukaKomposisi`/`renderFrame` seperti di black-box; perbaiki tumpukan jika ada, ulangi Step 1.
- [ ] **Step 3:** `node scripts/render.mjs cas-80 --final` → Expected laporan dengan `Loudness ... -> -14.x LUFS` dan file `out/cas-80.mp4` 1080×1920.
- [ ] **Step 4:** `node scripts/paket-youtube.mjs cas-80` → Read `thumbnail-kecil.jpg`: judul terbaca.
- [ ] **Step 5:** `git commit -am "feat(explainer): render cas-80"` (file `out/` tidak di-commit bila ada di `.gitignore`).
