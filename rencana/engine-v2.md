# Rencana implementasi: Engine v2 (poin 1–6)

## Context

Setelah tiga video (Borobudur, Gunung Kawi, Borobudur Short) dan rencana video 5–6 menit (kode plat), ada enam kekurangan engine:

1. Belum ada **paket upload YouTube** (thumbnail, judul/deskripsi/tag, chapter, subtitle SRT).
2. **Audio** seadanya: tanpa efek suara, musik tanpa ducking, volume tidak dinormalkan, tidak ada pencari musik bebas lisensi.
3. Hanya 4 jenis scene. Video 30+ scene jadi monoton: perlu **kartu bab, garis waktu, kutipan, peta dengan rute/pin**.
4. **Render** tanpa pengaturan: file besar (Gunung Kawi 297 MB / 2:47), tidak ada render preview cepat, versi kirim 720p masih manual.
5. Hanya foto. Belum bisa memakai **footage video arsip** (Wikimedia punya film berita "Nieuws uit Indonesië" dari Open Beelden).
6. Validator belum mengecek **ritme visual** (foto dipakai berulang: di Gunung Kawi satu foto muncul di 6 scene; shot terlalu cepat/lama).

Hasil cek teknis yang dipakai rencana ini:
- ffmpeg bawaan Remotion punya `loudnorm`, `amix`, `volume`, `sine`, decoder theora/vp8/vp9/vorbis/opus, encoder libx264/aac/libmp3lame. **Tidak** punya `anoisesrc`/`volumedetect`, jadi efek suara disintesis di Node.
- Wikimedia Commons: video (`filetype:video Batavia` 265 hasil) dan audio (`filetype:audio gamelan` 459 hasil) tersedia; lisensi bervariasi, jadi difilter seperti foto.

## Prinsip (berlaku untuk semua poin)

- **Video yang sudah ada tetap pixel-identik** secara visual. Fitur visual baru hanya aktif kalau naskah memakainya. Pengecualian yang disengaja: efek suara & normalisasi (audio saja).
- Semua fitur baru punya: field naskah yang terdokumentasi, aturan di `cek-naskah`, tampilan di `storyboard`, resep di `SKILL.md`. Dengan begitu model ringan tetap bisa memakainya.
- Semua angka tata letak lewat token `src/lib/layout.ts` (landscape + short).
- Setiap fase ditutup dengan: `npx tsc`, `cek-naskah` semua video LULUS, uji regresi pixel, lalu **commit setelah user setuju**.

## Urutan & ukuran

| Urutan | Fase | Ukuran | Bergantung pada |
|---|---|---|---|
| 0 | Fondasi: timeline bersama + uji regresi otomatis | S | – |
| 1 | Poin 6: validator ritme | S | 0 |
| 2 | Poin 1: paket YouTube | M | 0 |
| 3 | Poin 3: scene baru (bab, garis waktu, kutipan, rute/pin) | L | 0, 2 (bab → chapter) |
| 4 | Poin 2: audio (SFX, musik, loudness) | M | 3 (SFX untuk scene baru) |
| 5 | Poin 4: render (preview/final/kirim) | S | 4 (loudness final) |
| 6 | Poin 5: footage video | M | 0 |

S ≈ ½ sesi, M ≈ 1 sesi, L ≈ 1–2 sesi.

---

## Fase 0. Fondasi

**Tujuan:** menghapus duplikasi perhitungan waktu di script, dan membuat cek "pixel identik" jadi satu perintah.

- `scripts/lib/komposisi.mjs` (baru): `bukaKomposisi(slug)` → bundle + `selectComposition` (sekali per proses) + `browser`; `waktuScene(composition)` → daftar `{index, start, end, scene, words, shotStarts}` memakai `transitionFrames`, `sceneWords`, `shotStarts` dari `src/lib/kata.ts` (via `importTs`).
  - Dipakai ulang oleh `cek-frame.mjs`, `storyboard.mjs` (refactor), lalu `paket-youtube.mjs`, `render.mjs`.
- `scripts/uji-regresi.mjs` (baru):
  - `--simpan`: render frame acuan (5 frame tersebar per komposisi landscape + short yang ada di `daftar.ts`, kecuali yang dikerjakan agent lain) ke `out/baseline/`, simpan daftar frame di `out/baseline/daftar.json`.
  - tanpa flag: render ulang frame yang sama, bandingkan pixel (sharp), tampilkan jumlah pixel beda per frame dan durasi komposisi; exit 1 kalau ada beda.
- `package.json`: `"uji": "node scripts/uji-regresi.mjs"`.

**Selesai jika:** `npm run uji -- --simpan` lalu `npm run uji` → semua 0 pixel beda; `cek-frame` & `storyboard` menghasilkan output sama seperti sebelum refactor.

## Fase 1. Poin 6: Validator ritme

**Tujuan:** menangkap video yang terasa monoton/berulang sebelum render.

Tambahan di `scripts/cek-naskah.mjs` (bagian baru **RITME**, hanya peringatan), memakai `shotStarts` + perkiraan waktu kata (atau `kata.json`):
- **Durasi shot**: landscape < 1,5 dtk (terlalu cepat) atau > 7 dtk (diam terlalu lama); short < 1 dtk atau > 5 dtk.
- **Foto berulang**: file yang sama dipakai > 3 kali di satu video, atau di dua scene berturut-turut.
- **Gerak kamera** sama persis di dua shot berturut-turut; > 3 shot `print` beruntun.
- **Jenis scene** sama ≥ 5 scene berturut-turut (saran: sisipkan fact/bab/garis waktu; teks saran menyesuaikan fitur Fase 3).
- Ringkasan: jumlah shot, rata-rata durasi shot, foto unik vs total.

**Selesai jika:** Gunung Kawi memunculkan peringatan foto `07-…pesarean` dipakai > 3 kali; Borobudur tetap 0 error (peringatan boleh). Dokumentasikan di tabel "Masalah umum" SKILL.md.

## Fase 2. Poin 1: Paket upload YouTube

**Data naskah baru** (`src/types.ts`):
```ts
youtube?: {judul: string; deskripsi?: string; tags?: string[]};
thumbnail?: {judul: string; photo: string; credit?: string; sub?: string};   // photo via ...foto()
// per scene:
bab?: string;   // scene ini membuka bab baru → chapter YouTube
```

**Thumbnail**
- `src/Thumbnail.tsx` (baru): 1280×720, foto penuh + gradien gelap, judul raksasa ≤5 kata (Playfair 900, frasa `*bintang*` diberi stabilo kuning), garis/tag kecil, nama channel. Untuk video short: 1080×1920 (dipakai sebagai cover).
- `src/Root.tsx`: untuk setiap video yang punya `thumbnail`, daftarkan `<Still id={`${id}Thumb`}>` otomatis.

**Script `scripts/paket-youtube.mjs <slug>`** → `out/youtube/<slug>/`:
- `thumbnail.jpg` (renderStill komposisi `<Id>Thumb`).
- `deskripsi.txt`: judul, deskripsi, **chapters** (`0:00 Membaca plat` …, dari `bab` + waktu scene), daftar kredit foto (pindahkan logika `kredit.mjs` ke `scripts/lib/kredit.mjs` dan pakai ulang), catatan "Ilustrasi props dibuat dengan AI" kalau ada props, baris tag.
- `subtitle.id.srt`: dari `kata.json` + waktu scene; potongan ≤ 6 kata / ≤ 42 huruf, teks naskah (bukan transkrip Whisper), tanpa tanda `*`.
- Tanpa `kata.json` → SRT tetap dibuat dari perkiraan, dengan peringatan "timing perkiraan".

**Validator:** `youtube.judul` wajib saat paket dibuat, ≤ 100 huruf (saran ≤ 60); `thumbnail.judul` ≤ 5 kata; aturan chapter YouTube: bab pertama di scene 1, minimal 3 bab, tiap bab ≥ 10 dtk.

**Skill:** Langkah 9 ditambah `node scripts/paket-youtube.mjs <slug>`; resep `youtube`/`thumbnail`/`bab`.

**Selesai jika:** paket untuk Gunung Kawi (dengan `bab` & `thumbnail` ditambahkan sebagai uji) berisi thumbnail yang terbaca di ukuran kecil (cek juga versi 320×180), chapter sesuai storyboard, SRT terbuka benar di pemutar (cek manual 3 titik waktu).

## Fase 3. Poin 3: Jenis scene baru

Semua: landscape + short (token layout), mendukung `shots`/`tag`/`props`, timing ikut narasi, tampil di storyboard.

**a. `chapter` (kartu bab)**
```ts
{type: 'chapter', duration: 75, nomor: 2, judul: 'Mitos batalion Inggris', narasi?: '…', shots?: [...]}
```
- Tampilan: "BAB 2" (Cinzel, spasi lebar) + judul (Playfair) di atas foto blur gelap, garis emas menyapu. 2–3 dtk kalau tanpa narasi.
- Otomatis menjadi chapter YouTube (setara `bab`).
- Penyesuaian: `cek-naskah` & `narasi.mjs` mengizinkan scene `chapter` tanpa narasi (paragraf TTS hanya untuk scene bernarasi; `potong-narasi` sudah melewati scene tanpa narasi, cek ulang mapping nomor file `NN.wav` ↔ indeks scene).

**b. `timeline` (garis waktu)**
```ts
{type: 'timeline', duration: 90, narasi: '…',
 titik: [{tahun: 1811, label: 'Inggris menyerbu Jawa', di: 'sebelas'}, {tahun: 1894, label: 'Mobil pertama', di: 'sembilan'}, …]}
```
- Garis tergambar bertahap; setiap titik muncul (pin + tahun Cinzel + label mono) saat kata `di` diucapkan; titik aktif menyala emas, kamera bergeser mengikuti titik aktif bila titik > 4. Short: garis vertikal.
- Validator: 2–6 titik, `di` ada di narasi & berurutan, tahun naik.

**c. `kutipan`**
```ts
{type: 'kutipan', duration: 90, teks: '…', sumber: 'Raffles, 1817', narasi: '…', shots: [...]}
```
- Tanda kutip besar, teks Playfair italic muncul per baris mengikuti waktu narasi, sumber mono di bawah, foto blur/print di sisi. Validator: teks ≤ 30 kata, `sumber` wajib.

**d. Rute & pin di peta** (fitur shot `print`)
```ts
{...foto('peta.jpg'), layout: 'print',
 anotasi: [{x: 53, y: 56, bentuk: 'pin', label: 'Magelang'}],
 rute: {titik: [{x: 20, y: 40}, {x: 53, y: 56}], di: 'menuju', label: 'Jalur pos'}}
```
- `bentuk: 'pin'` = pin jatuh + pulsa; `rute` = garis putus-putus tergambar (stroke-dashoffset) mulai saat `di`, panah di ujung. Koordinat persen gambar (pakai `grid-foto`).

**Selesai jika:** contoh uji (scene sementara di video uji, dihapus setelahnya) untuk keempat fitur di landscape & short lolos `cek-frame`, storyboard menampilkan semuanya, `uji` regresi 0 pixel beda untuk video lama; resep keempatnya ditambahkan ke SKILL.md; rencana `kode-plat-kendaraan.md` diberi catatan opsional di mana garis waktu & kartu bab bisa dipakai (tanpa mengubah narasinya).

## Fase 4. Poin 2: Audio

**a. Efek suara (SFX) bebas lisensi**
- `scripts/buat-sfx.mjs` (baru): sintesis WAV di Node ke `public/sfx/` (di-commit): `whoosh` (noise tersaring menyapu), `dum` (stempel: sinus rendah meredam + klik), `tik` (angka selesai menghitung), `pop` (props/pin/titik timeline), `swell` (judul besar/kartu bab).
- Engine: komponen `Sfx` + konstanta volume; dipasang di: awal transisi (`whoosh`, kecuali `none`), stempel, akhir hitungan fakta, judul besar title, props masuk, titik timeline, kartu bab. Timing memakai fungsi yang sama dengan animasinya (diekspor dari scene/`lib`).
- Naskah: `sfx?: boolean` (default `true`; `false` mematikan).

**b. Musik latar + ducking**
- `scripts/cari-musik.mjs "<kata kunci>" --slug <slug>`: cari Commons `filetype:audio`, filter lisensi sama dengan foto, unduh, konversi ke `public/music/<slug>/NN.mp3` (libmp3lame), simpan `credits.json` (judul, author, lisensi, durasi).
- Engine: `music` memakai `volume={(f) => …}`: ±0,22 saat hening, turun ke ±0,07 saat ada kata narasi (dihitung dari waktu kata semua scene, ramp 10 frame), fade-in 1 dtk & fade-out 2 dtk, `loop` bila musik lebih pendek dari video.
- Kredit musik masuk `kredit` & `paket-youtube`.

**c. Normalisasi volume**
- `potong-narasi.mjs`: setiap `NN.wav` dinormalkan `loudnorm` (I=-18 LUFS, TP=-2) supaya antar-scene rata.
- Final mix dinormalkan di Fase 5 (target YouTube −14 LUFS, TP −1,5).

**Validator:** file SFX/musik ada; durasi musik vs video; peringatan bila `music` tanpa kredit.

**Selesai jika:** render audio-saja Borobudur: SFX terdengar di tiap transisi/stempel/hitungan, musik turun saat narasi (cek dengan `loudnorm print_format=json` pada potongan bernarasi vs jeda), tidak ada clipping; visual tetap 0 pixel beda (`npm run uji`).

## Fase 5. Poin 4: Render

`scripts/render.mjs <slug> [--preview | --final]` (+ `npm run render:preview`, `render:final`):
- **preview**: setengah resolusi, kualitas rendah, cepat (`--scale=0.5`, `--crf` tinggi). Untuk dicek sebelum final. Tetap ada watermark.
- **final**: 1080p (atau 1080×1920 short), `--crf` ±20 (cek ukuran grain), lalu ffmpeg: `loudnorm` dua tahap pada audio (−14 LUFS, TP −1,5), video `-c:v copy`.
- Otomatis membuat **versi kirim** ≤ 28 MB (720p, bitrate dihitung dari durasi), pengganti perintah manual di SKILL.md.
- Laporan: durasi, ukuran tiap file, waktu render.
- Opsional per naskah: `grain?: number` (0–1, default 1) untuk mengurangi grain bila ukuran file jadi masalah (default tidak mengubah tampilan).
- Cek dulu nama flag Remotion 4.0.539 dengan `npx remotion render --help` sebelum implementasi.

**Selesai jika:** final Gunung Kawi ukurannya turun nyata dari 297 MB tanpa beda kualitas yang terlihat di 5 frame perbandingan (zoom 100%); loudness terukur −14 ±1 LUFS; preview < 30% waktu render final.

## Fase 6. Poin 5: Footage video arsip

- `Shot.video?: string` (path `public/videos/<slug>/NN.mp4`) + `mulai?: number` (detik awal klip). Tetap pakai `...foto()`-style helper `videoDari(slug, credits)` supaya kredit wajib.
- `ShotView`: kalau `video`, render `OffthreadVideo` (bisu, `startFrom`) dengan gerak kamera halus yang sama (layout `full` / `print`).
- `scripts/cari-video.mjs "<kata kunci>" --slug <slug>`: Commons `filetype:video`, filter lisensi, unduh, konversi ke MP4 H.264 tanpa suara (maks 1080p), buat poster JPG + contact sheet, `credits.json` dengan `durasi`.
- `kredit`/`paket-youtube` membaca kredit video juga.
- Validator: file ada, `mulai` + durasi shot ≤ durasi klip, kredit ada; peringatan bila klip berwatermark (cek manual di contact sheet).
- Storyboard: cuplikan diambil dari frame video.

**Selesai jika:** satu klip "Nieuws uit Indonesië" Batavia dipakai sebagai shot di video uji (landscape & short), tampil benar di cek-frame/storyboard, kredit muncul di paket YouTube; video lama 0 pixel beda.

---

## Verifikasi akhir (setelah semua fase)

1. `npx tsc`; `cek-naskah` semua video LULUS; `npm run uji` 0 pixel beda (visual video lama).
2. Video uji end-to-end memakai semua fitur baru (bab, timeline, kutipan, rute, footage, SFX, musik) → `cek-frame`, `storyboard`, `render --preview`, `paket-youtube` → periksa manual.
3. SKILL.md: setiap fitur punya langkah/resep + baris "Masalah umum"; uji ulang dengan model ringan (Gemini) memakai rencana `kode-plat-kendaraan.md`.

## File utama yang disentuh

- Baru: `scripts/lib/komposisi.mjs`, `scripts/lib/kredit.mjs`, `scripts/{uji-regresi,paket-youtube,buat-sfx,cari-musik,cari-video,render}.mjs`, `src/Thumbnail.tsx`, `src/scenes/{ChapterScene,TimelineScene,KutipanScene}.tsx`, `src/components/Sfx.tsx`, `public/sfx/*.wav`.
- Diubah: `src/types.ts`, `src/Root.tsx`, `src/HistoryVideo.tsx`, `src/lib/{kata,layout}.ts`, `src/components/{ShotStack,Layout}.tsx`, `scripts/{cek-naskah,cek-frame,storyboard,kredit,narasi,potong-narasi}.mjs`, `.claude/skills/video-sejarah/SKILL.md`, `README.md`, `package.json`.
- Tidak disentuh: file video milik agent lain (mis. `alas-roban`).
