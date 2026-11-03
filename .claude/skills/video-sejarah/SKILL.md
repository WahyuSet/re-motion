---
name: video-sejarah
description: Membuat video motion edukasi/sejarah 16:9 dengan Remotion di project ini, dari riset topik sampai MP4 - foto sejarah bebas lisensi dari Wikimedia Commons dengan kredit otomatis, props digenerate lewat Google Flow Bridge, narasi TTS dari user yang dipotong & disinkronkan otomatis (faster-whisper), subtitle per kata, dan layout dokumenter (tag, judul berstabilo, anotasi, stempel, badge angka). Pakai skill ini setiap kali user minta video sejarah/edukasi baru, minta cari foto untuk topik, minta generate props, memberikan file audio narasi/TTS, atau minta render video.
---

# Video Sejarah (Remotion)

Ikuti langkah 0–9 **berurutan**. Setiap langkah punya perintah persis dan syarat "Selesai jika". Jangan lompat langkah, jangan mengarang perintah lain.

## Aturan keras

1. **Hanya edit file milik video itu**: `src/data/<slug>.ts`, `src/data/<slug>.props.json`, `src/data/<slug>.sumber.md`, dan isi `public/photos/<slug>/`, `public/audio/<slug>/`. Jangan ubah `src/components/`, `src/scenes/`, `src/lib/`, `src/Root.tsx`, atau `scripts/` kecuali user memintanya.
2. **Setelah setiap edit naskah**, jalankan `node scripts/cek-naskah.mjs <slug>` dan perbaiki semua `✗ ERROR` sesuai baris "Perbaiki:". Lanjut hanya kalau hasilnya `✓ LULUS`.
3. **Fakta**: hanya tulis fakta yang ada di `src/data/<slug>.sumber.md` dengan sumbernya. Ragu → tulis "sekitar"/"diperkirakan", atau buang.
4. **Foto**: hanya dari `scripts/cari-foto.mjs`, selalu lewat `...foto('nama.jpg')`. Jangan pakai gambar dari Google Images, Pinterest, situs berita, atau gambar AI sebagai "foto sejarah".
5. **Berhenti & tanya user** di titik yang ditandai 🛑. Jangan menunggu diam-diam, jangan melanjutkan dengan tebakan.
6. Selalu sebut ke user: apa yang sudah selesai, apa yang belum dicek, dan file mana yang dihasilkan.
7. **Visual harus sesuai narasi yang sedang dibacakan.** Pilih foto/props berdasarkan apa yang diucapkan di bagian itu, urutkan shot mengikuti urutan kalimat, dan ikat shot ke kata yang menyebut isinya dengan `di: '<kata>'` (shot/props muncul tepat saat kata itu diucapkan). Contoh: narasi "masjid … berdiri tak jauh dari klenteng" → shot masjid `di: 'masjid'`, lalu shot klenteng `di: 'Klenteng'`.
8. **Jangan render sebelum user menyetujui storyboard.** 🛑 Sebelum Langkah 9, kirim halaman storyboard (`out/storyboard/<slug>-N.jpg`) ke user, lalu tunggu persetujuan.

Istilah: **slug** = nama video huruf kecil-minus (`perang-diponegoro`). **Id** = slug dalam PascalCase (`PerangDiponegoro`), dipakai untuk render.

---

## Langkah 0 — Pastikan topik & siapkan video

🛑 **Topik ambigu? Tanya dulu.** Cari sebentar (WebSearch) apakah nama topik merujuk ke lebih dari satu hal (contoh: "Gunung Kawi" = pesarean di Malang **atau** candi tebing di Bali; "Singasari" = kerajaan **atau** kecamatan). Kalau ya, tanya user mana yang dimaksud, beri pilihan dengan keterangan singkat. Jangan memilih sendiri. Tanya juga target durasi kalau user belum menyebutnya (default 60–90 detik).

Durasi → jumlah scene: 1 menit ≈ 6–8 scene, 2 menit ≈ 12 scene, 3 menit ≈ 16–18 scene (±25 kata narasi per scene).

🛑 **Video panjang atau short?** Kalau user menyebut "short", "Shorts", "Reels", "TikTok", "vertikal", atau "9:16" → ikuti juga bagian **Mode Short (9:16)** di bawah. Kalau short tapi tidak jelas *turunan dari video panjang yang sudah ada* atau *topik baru*, tanya user.

```bash
node scripts/buat-video.mjs <slug>
```

Membuat `src/data/<slug>.ts` (template berisi TODO), `<slug>.props.json`, `<slug>.sumber.md`, folder `public/photos/<slug>/`, dan mendaftarkan video ke Studio.

**Selesai jika:** perintah mencetak "Terdaftar sebagai Composition".

## Langkah 1 — Riset fakta

1. Cari fakta dari minimal 2 sumber kredibel (Wikipedia + sumber resmi/akademik: UNESCO, museum, kemdikbud.go.id, jurnal).
2. Tulis setiap fakta + URL sumbernya di `src/data/<slug>.sumber.md`.
3. Kalau sumber berbeda soal angka/tahun, pakai versi yang paling umum dan tandai "sekitar".

**Selesai jika:** setiap angka, tahun, dan nama yang akan dipakai punya minimal 2 URL di `sumber.md`.

## Langkah 2 — Tulis naskah & narasi

Edit `src/data/<slug>.ts`. Susun jumlah scene sesuai durasi (lihat langkah 0): `title` → beberapa `photo`/`fact` → `outro`. Template berisi 4 scene; salin blok dari **Resep scene** untuk menambah.

Aturan `narasi` (teks yang dibacakan TTS dan sekaligus subtitle):
- **Setiap scene wajib punya narasi**, 15–25 kata (1–2 kalimat).
- Angka & tahun **ditulis dengan huruf**: `seribu delapan ratus empat belas`, `abad kesembilan`.
- Tanpa singkatan (`Masehi`, bukan `M.`), tanpa tanda kurung.
- Kata kunci dibungkus `*bintang*` (tidak ikut dibacakan). Wajib:
  - scene `title`: nama judul diucapkan dan dibintangi → `Inilah *Majapahit*.`
  - scene `fact`: angka yang diucapkan dibintangi → `*dua ribu enam ratus tujuh puluh dua* panel relief`

Isi field lain mengikuti **Resep scene** di bawah. Biarkan `shots: []` dulu (diisi di langkah 4).

**Bab (chapter YouTube)**, hanya video panjang ≥2 menit (short: jangan pakai): bagi cerita jadi 3–7 bagian. Tambahkan `bab: '<judul bab pendek>'` di scene yang **memulai** tiap bagian. Bab pertama wajib di scene 1, setiap bab minimal 10 detik (±2 scene). Contoh di `src/data/gunung-kawi.ts`: scene 1 `bab: 'Gunung Kawi'`, scene 4 `bab: 'Asal-usul pesarean'`, dst.

**Selesai jika:** `cek-naskah` tidak lagi menampilkan error tentang narasi/TODO/judul (error "shots kosong" masih wajar sampai langkah 4).

## Langkah 3 — Cari foto bebas lisensi

```bash
node scripts/cari-foto.mjs "<kata kunci>" --slug <slug>
```

- Jalankan **3–6 kali** dengan kata kunci berbeda (slug sama). Butuh ±2–4 foto per scene.
- Kata kunci bahasa Inggris/Belanda lebih banyak hasil. Arsip kolonial: tambahkan `KITLV`, `Tropenmuseum`, `Nationaal Archief`. Tokoh: `"<nama> portrait"`. Peta: `"map of Java 1817"`.
- Foto lama: tambah `--pd-only`. Hasil 0: coba kata kunci lain (Inggris/Belanda, nama daerah sekitar, nama arsip) atau `--min-width 800`. Jangan pakai `--source openverse`: sejak 2026 menolak request tanpa akun (HTTP 401).
- Tidak ada foto yang memotret langsung peristiwanya? Pakai foto **proksi** (peristiwa/tempat serupa dari era yang sama) dengan `tag` yang jujur, misalnya `'Pembukaan jalan di Jawa · KITLV'`, dan sebutkan scene proksi itu ke user saat mengirim storyboard.
- "dibatasi server, tunggu N detik" = normal, biarkan berjalan.
- **Lihat `public/photos/<slug>/_contact-sheet.jpg` dengan Read.** Hapus file JPG yang tidak relevan, ber-watermark, buram, atau salah objek (entri `credits.json` biarkan).

**Selesai jika:** ada cukup foto relevan untuk semua scene (±2–4 per scene) dan sudah dilihat di contact sheet.

## Langkah 4 — Isi shot & lapisan layout

Isi `shots` setiap scene dengan 2–4 foto, lalu tambahkan lapisan sesuai **Resep scene**.

- Shot: `{...foto('NN-nama.jpg')}`. Nama file **disalin persis** dari folder foto.
- **Ikat shot ke narasi**: untuk shot ke-2 dan seterusnya, tambahkan `di: '<kata>'` = satu kata dari narasi scene itu yang menyebut isi foto. Shot mulai tepat saat kata itu diucapkan. Urutan `di` harus sama dengan urutan kata di narasi. Shot pertama selalu mulai di awal scene (tanpa `di`). Shot tanpa `di` dibagi rata di sela-selanya.
  ```ts
  narasi: 'Karena itu, di kompleks ini masjid bergaya Demak berdiri tak jauh dari *Klenteng Dewi Kwan Im*.',
  shots: [
    {...foto('07-kompleks.jpg')},                       // mulai di awal: "Karena itu, di kompleks ini"
    {...foto('46-masjid-demak.jpg'), di: 'masjid'},     // muncul saat "masjid" diucapkan
    {...foto('29-kwan-im.jpg'), di: 'Klenteng'},         // muncul saat "Klenteng" diucapkan
  ],
  ```
  Kalau tidak ada foto yang cocok untuk suatu kata, lebih baik biarkan foto sebelumnya tampil lebih lama daripada memasang foto yang tidak nyambung.
- Props juga bisa `di: '<kata>'` (menggantikan `delay`).
- Foto arsip hitam-putih, potret, peta, dokumen → tambah `layout: 'print'`.
- Gerak kamera: biarkan kosong (otomatis bergantian) atau isi `move`: `push-in`, `pull-out`, `pan-left`, `pan-right`, `tilt-up`, `tilt-down`.
- Anotasi (lingkaran merah) hanya di shot `print`. Cari koordinatnya:
  ```bash
  node scripts/grid-foto.mjs public/photos/<slug>/NN-nama.jpg
  ```
  Lihat `out/grid/NN-nama.jpg` dengan Read, baca posisi objek pada garis `x..` dan `y..` → `anotasi: [{x: 53, y: 56, w: 8, h: 8, label: 'Nama tempat'}]`.

**Selesai jika:** `node scripts/cek-naskah.mjs <slug>` → `✓ LULUS`.

Lalu baca bagian **RITME** di hasil `cek-naskah` (peringatan tempo visual, tidak membuat GAGAL):
1. Perbaiki setiap baris `⚠` sesuai baris "Perbaiki:" (lihat juga tabel **Masalah umum**), lalu jalankan `cek-naskah` lagi.
2. Kalau suatu catatan tidak bisa diperbaiki (misalnya tidak ada foto bebas lisensi lain), biarkan, dan sebutkan ke user saat mengirim storyboard.
3. Baris `Ritme: N shot, rata-rata X dtk/shot ...` adalah ringkasan; idealnya rata-rata 2,5–4,5 dtk dan foto unik mendekati jumlah shot.

Boleh langsung cek tampilan sebelum ada audio: `node scripts/cek-frame.mjs <slug>` (durasi scene diperkirakan dari jumlah kata narasi, ±2,4 kata/detik). Video panjang (16+ scene) menghasilkan lembar kontak yang tinggi; potong jadi 3 bagian sebelum dilihat supaya tetap terbaca.

## Langkah 5 — Props (opsional)

Props = ilustrasi benda (kompas, naskah kuno, kapal) digenerate AI. Lewati langkah ini kalau tidak perlu.

1. Cek bridge (jalan di PowerShell maupun Bash; jangan pakai `curl`, di PowerShell itu alias yang bisa menggantung):
   ```bash
   node scripts/generate-props.mjs --cek
   ```
   - `SIAP` → lanjut ke poin 2. Bridge tidak bisa mendeteksi apakah tab Google Flow sudah terbuka; itu baru ketahuan saat generate.
   - `TIDAK SIAP` → **jangan berhenti menunggu**. Catat untuk laporan ke user: "Flow Bridge belum jalan (jalankan `D:\Learning\ai-content\tools\flow_bridge\run_bridge.ps1` dan buka tab Google Flow di Chrome), props dilewati." Lewati sisa langkah 5 dan langsung kerjakan langkah 6.
2. Isi `src/data/<slug>.props.json`: `[{"name": "kompas-kuno", "prompt": "an antique brass navigation compass"}]` (objek saja, bahasa Inggris, tanpa gaya; gaya ditambahkan otomatis).
3. `node scripts/generate-props.mjs --file src/data/<slug>.props.json` (objek berwarna hijau: tambah `--bg magenta`).
4. Lihat setiap `public/props/<name>.png` dengan Read. Ulang yang jelek: `node scripts/generate-props.mjs --name <name> --prompt "<objek>"`.
5. Pasang: `props: [{src: 'props/<name>.png', x: 80, y: 62, width: 300, animation: 'pop', delay: 20}]`. Jangan taruh di sepertiga bawah layar (subtitle) atau kiri atas (tag/judul/badge).

**Jangan** generate wajah tokoh sejarah nyata atau gambar yang terlihat seperti foto/dokumen asli.

## Langkah 6 — Ekspor naskah TTS

```bash
node scripts/narasi.mjs <slug>
```

Perbaiki peringatan ⚠ (angka/singkatan) kalau ada, lalu jalankan ulang.

🛑 **Berhenti.** Kirim ke user path `narasi/<slug>/naskah-full.txt` dan minta: "Generate TTS dari isi file ini jadi **satu file audio utuh**, lalu kirim path file audionya." Jangan lanjut sampai user memberikan file audio.

## Langkah 7 — Pasang audio narasi

Setelah user memberi path file audio:

```bash
node scripts/potong-narasi.mjs <slug> "<path file audio dari user>"
```

Butuh ±1 menit (transkrip faster-whisper). Baca tabel hasilnya:
- Kolom "Terdengar di awal potongan" harus diawali kalimat pertama narasi scene itu (salah eja seperti `2672`, `buda` itu wajar).
- Semua baris `ok` dan kecocokan ≥70% → lanjut.
- Ada `⚠` atau kecocokan <70%: 🛑 bilang ke user audio tidak cocok dengan naskah (ada kalimat dilewati/ditambah?), minta generate ulang dari `naskah-full.txt` terbaru.

Lalu di `src/data/<slug>.ts`, aktifkan dua baris di atas `scenes`:
```ts
  narasiAudio: 'audio/<slug>',
  narasiExt: 'wav',
```

**Selesai jika:** `cek-naskah` → `✓ LULUS` (cek ini juga memastikan file audio & `kata.json` cocok).

⚠ Kalau teks `narasi` diubah setelah ini, audio tidak cocok lagi → ulangi langkah 6–7. Menambah/menghapus tanda `*` saja tidak apa-apa.

## Langkah 8 — Cek visual

```bash
npx tsc
node scripts/cek-frame.mjs <slug>
```

`npx tsc` harus tanpa output. Lalu **lihat `out/cek/<slug>-lembar.jpg` dengan Read** (2 frame per scene). Periksa setiap kotak:
- Tidak ada layar hitam/kosong.
- Subtitle terbaca; tag, judul, badge angka tidak saling tumpuk.
- Anotasi menunjuk objek yang benar.
- Foto sesuai dengan yang dinarasikan.

Dua foto tampak bertumpuk samar di satu kotak = frame jatuh tepat di pergantian shot, itu normal. Detail satu frame: `out/cek/<slug>-NN-35.png` / `-85.png`.

**Selesai jika:** semua kotak lolos. Kalau ada masalah, perbaiki di `src/data/<slug>.ts`, lalu ulangi langkah 8.

### Storyboard & persetujuan user

```bash
node scripts/storyboard.mjs <slug>
```

Hasilnya `out/storyboard/<slug>-1.jpg`, `-2.jpg`, … (4 scene per halaman) + `out/storyboard/<slug>.md`. Tiap scene berisi: waktu mulai–selesai, transisi, tag/judul/angka/stempel, narasi, lalu **setiap shot** dengan cuplikan gambar, waktu mulai, lama tampil (misal `(3,2 dtk)`, angkanya sama dengan catatan RITME), dan **kata-kata yang diucapkan selama shot itu tampil**.

1. Lihat setiap halaman dengan Read. Untuk setiap shot, bandingkan cuplikan dengan kata-kata di bawahnya: apakah foto menunjukkan hal yang sedang diucapkan? Kalau tidak cocok, tambah/perbaiki `di`, tukar urutan shot, atau ganti foto. Jalankan ulang storyboard.
2. 🛑 **Kirim semua halaman storyboard ke user** dan tanya: "Storyboard sudah oke untuk dirender, atau ada scene/foto yang mau diganti?" Sebutkan juga scene yang fotonya kurang cocok karena tidak ada foto bebas lisensi yang pas.
3. Kalau user minta perubahan: ubah naskah, jalankan `cek-naskah` + `storyboard` lagi, kirim ulang. Lanjut ke Langkah 9 **hanya setelah user setuju**.

## Langkah 9 — Render & paket YouTube

1. Isi data upload di `src/data/<slug>.ts` (di atas `scenes`), salin dari **Resep paket YouTube** di bawah: `youtube` (judul, deskripsi, tags) dan `thumbnail` (judul ≤5 kata + foto). Video ≥2 menit: pastikan `bab` sudah ada (Langkah 2). Jalankan `node scripts/cek-naskah.mjs <slug>` → `✓ LULUS`.
2. Render dan buat paket:
   ```bash
   npx remotion render <Id> out/<slug>.mp4
   node scripts/paket-youtube.mjs <slug>
   ```
   Render ±5–10 menit; jalankan di background. `paket-youtube` butuh ±1 menit.
3. Lihat `out/youtube/<slug>/thumbnail.jpg` **dan** `thumbnail-kecil.jpg` dengan Read. Di versi kecil, judul harus terbaca dan stabilo kuning terlihat. Kalau tidak: perpendek `thumbnail.judul`, ganti foto (pilih yang bagian kirinya gelap/tenang; short: bagian bawahnya), atau atur `focus`, lalu ulangi `paket-youtube`.
4. Baca baris `⚠` di akhir output `paket-youtube` dan perbaiki sesuai isinya (lihat **Masalah umum**).

Kirim ke user:
- `out/<slug>.mp4` (1080p, untuk upload).
- Folder `out/youtube/<slug>/`: `thumbnail.jpg` (Thumbnail), `judul.txt` (kolom Judul), `deskripsi.txt` (kolom Deskripsi: sudah berisi chapter, kredit foto wajib CC BY / CC BY-SA, dan hashtag), `tags.txt` (kolom Tags), `subtitle.id.srt` (menu Subtitel → Unggah file → bahasa Indonesia).
- Kredit saja (tanpa paket): `node scripts/kredit.mjs <slug>` → `out/<slug>-kredit.txt`.
- Kalau user minta file dikirim tapi lebih dari 30 MB, buat versi preview 720p:
  ```bash
  node -e "import('./scripts/lib/ffmpeg.mjs').then(({ffmpeg})=>ffmpeg(['-y','-i','out/<slug>.mp4','-vf','scale=1280:720','-c:v','libx264','-b:v','3100k','-maxrate','3400k','-bufsize','6800k','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','out/<slug>-720p.mp4']))"
  ```

---

## Mode Short (9:16): YouTube Shorts, TikTok, Reels

Langkah 0–9 tetap sama, dengan perbedaan di bawah. Video short memakai `format: 'short'` (otomatis 1080×1920); semua elemen (tag, judul, subtitle, badge angka, kredit) sudah menyesuaikan sendiri. Jangan ubah komponen.

**Langkah 0, buat short:**
```bash
node scripts/buat-video.mjs <slug>-short --short --dari <slug-video-panjang>   # turunan: foto, kredit & sumber dari video panjang
node scripts/buat-video.mjs <slug> --short                                     # topik baru khusus short
```
- Turunan: Langkah 1 cukup memakai `<slug-panjang>.sumber.md` yang sudah disalin; Langkah 3 cukup memilih dari `public/photos/<slug-panjang>/_contact-sheet.jpg` (foto tambahan: `cari-foto ... --slug <slug-panjang>`). Narasi & TTS **tetap baru** (versi ringkas), jangan memotong audio video panjang.
- Topik baru: semua langkah seperti biasa.

**Aturan short** (dicek otomatis oleh `cek-naskah`):

| | Video panjang | Short |
|---|---|---|
| Durasi | 1–3 menit | **30–60 detik** (batas Shorts 3 menit) |
| Jumlah scene | 6–18 | **4–8** (template: 5) |
| Narasi per scene | 15–25 kata | **12–20 kata** |
| Judul | ≤5 kata | **≤4 kata** |
| Tag | ≤40 huruf | **≤26 huruf** |
| Scene pertama | pembuka | **hook ≤12 kata dalam 2 detik pertama**: pertanyaan atau fakta mengejutkan, lalu nama topik (`Inilah *Borobudur*.`) |
| Outro | ajakan follow | ajakan follow; turunan: "Tonton versi lengkapnya di channel ini" |

**Visual short:**
- Foto landscape di layar tegak terpotong jadi pita sempit. Gerak `pan-left`/`pan-right` **menyusuri lebar foto** (default otomatis di short), jadi pilih foto yang isinya menyebar horizontal untuk pan. Untuk foto yang harus terlihat utuh (peta, foto arsip, dokumen) pakai `layout: 'print'`.
- `focus: {x, y}` di short menentukan bagian foto yang dipotong untuk `push-in`/`pull-out` (misal `focus: {x: 30, y: 50}` = fokus ke sepertiga kiri).
- Anotasi **hanya** di shot `layout: 'print'` (foto full digeser pan, anotasi pasti meleset).
- **Area aman**: bagian atas 240 px, bawah 420 px, kanan 150 px, dan kiri 70 px tertutup tombol & caption aplikasi. Props dan stempel harus di dalam **x 7–86%, y 13–78%**. Di `cek-frame` area tertutup diberi warna merah. Tidak boleh ada teks atau objek penting di sana.
- Subtitle short otomatis 2–3 kata besar di tengah-bawah; tag per shot pindah ke kiri bawah (di atas kredit).

**Langkah 8–9:** `cek-frame` & `storyboard` otomatis tegak. Storyboard & persetujuan user tetap wajib. Render:
```bash
npx remotion render <Id> out/<slug>.mp4
```
File 1080×1920 siap diunggah ke Shorts, TikTok, dan Reels.

Contoh short turunan lengkap: `src/data/borobudur-short.ts`.

## Resep scene (salin, lalu ganti isinya)

**Title**: tanpa tag (sudah ada kicker), 2–3 shot `full`.
```ts
{
  type: 'title', duration: 90,
  kicker: 'Sejarah Nusantara',
  title: 'Majapahit',
  subtitle: 'Kerajaan terbesar di Nusantara',
  narasi: 'Di timur Pulau Jawa, pernah berdiri sebuah kerajaan besar. Inilah *Majapahit*, penguasa lautan Nusantara.',
  shots: [{...foto('03-a.jpg'), move: 'pan-right'}, {...foto('05-b.jpg'), move: 'push-in'}],
},
```

**Photo**: tag (tempat · waktu) + judul ≤5 kata + 2–4 shot, minimal satu shot dengan tag atau anotasi.
```ts
{
  type: 'photo', duration: 90, transition: 'dorong',
  tag: 'Trowulan · abad ke-14',
  judul: 'Ibu kota *Trowulan*',
  judulDi: 'Trowulan',                       // satu kata yang persis ada di narasi
  narasi: 'Pusat kerajaannya berada di *Trowulan*, yang kini masuk wilayah Kabupaten Mojokerto, Jawa Timur.',
  shots: [
    {...foto('07-situs-trowulan.jpg'), move: 'push-in'},
    {...foto('09-peta.jpg'), layout: 'print', di: 'Kabupaten', tag: 'Peta Jawa · 1817', anotasi: [{x: 70, y: 55, w: 8, h: 12, label: 'Trowulan'}]},
  ],
},
```

**Fact**: angka di `value`, angka yang diucapkan dibintangi, **tanpa tag scene** (bentrok dengan badge), tag per shot boleh.
```ts
{
  type: 'fact', duration: 90, transition: 'kartu',
  value: 1293, format: 'year',               // format: 'year' hanya untuk tahun
  label: 'Kerajaan berdiri',
  narasi: 'Kerajaan ini berdiri pada tahun *seribu dua ratus sembilan puluh tiga*, setelah Raden Wijaya mengusir pasukan Mongol.',
  shots: [{...foto('12-candi.jpg')}, {...foto('13-arca-raden-wijaya.jpg'), layout: 'print', di: 'Raden', tag: 'Arca Raden Wijaya'}],
  // opsional, untuk jumlah benda: ulang: {photo: 'photos/<slug>/14-g.jpg', jumlah: 32},
  // opsional, 1–2 kali per video: stempel: {teks: 'Berdiri', di: 'berdiri', x: 68, y: 46},
},
```

**Outro**: tag + kalimat penutup; kalimat terakhir narasi = ajakan follow (tombol CTA muncul di situ).
```ts
{
  type: 'outro', duration: 90, transition: 'kartu',
  tag: 'Warisan Majapahit',
  title: 'Jejaknya masih ada *hingga kini*',
  cta: 'Follow untuk sejarah lainnya',
  narasi: 'Jejak kebesarannya masih bisa kita lihat hingga hari ini. Ikuti channel ini untuk kisah sejarah Nusantara lainnya.',
  shots: [{...foto('15-h.jpg'), move: 'push-in'}],
},
```

## Resep paket YouTube (salin ke atas `scenes`, lalu ganti isinya)

```ts
  youtube: {
    judul: 'Sejarah Majapahit, Kerajaan Penguasa Lautan Nusantara',   // ≤100 huruf, ideal ≤60
    deskripsi: 'Satu paragraf 2–3 kalimat tentang isi video, hanya fakta dari sumber.md.',
    tags: ['majapahit', 'sejarah nusantara', 'trowulan', 'gajah mada', 'kerajaan hindu'],  // 3 pertama jadi hashtag
  },
  thumbnail: {judul: 'Penguasa *lautan Nusantara*', sub: 'Sejarah Jawa Timur', ...foto('07-situs-trowulan.jpg')},
```

- `youtube.deskripsi`: tulis paragraf pembuka saja. Chapter (`bab`), daftar kredit foto, dan hashtag ditambahkan otomatis oleh `paket-youtube`.
- `thumbnail.judul`: maks. 5 kata, berbeda dari judul video (thumbnail = rasa penasaran, judul = kata kunci pencarian). Tepat satu frasa `*bintang*` (stabilo kuning).
- `thumbnail` foto: lewat `...foto()` (kredit ikut masuk deskripsi). Pilih foto paling kuat & jelas; judul ditaruh di kiri bawah (short: tengah bawah), jadi bagian itu sebaiknya tidak ramai. Short: tambah `focus: {x, y}` kalau objek utama tidak di tengah foto.
- `thumbnail.sub` opsional: label kecil di atas judul (≤40 huruf, short ≤26).

**Watermark**: nama channel (`src/channel.ts`, sekarang "jejakala") otomatis tampil di kanan atas semua video, landscape maupun short. Jangan menambah watermark/logo sendiri. Hanya kalau user meminta: `watermark: false` (tanpa watermark) atau `watermark: 'teks lain'` di naskah.

**Transisi** (`transition` di scene ke-2 dan seterusnya): selang-seling `dorong` dan `kartu`; `none` antar dua scene fact berturut-turut; `zoom` atau `whip` paling banyak sekali per video.

**Batas**: judul ≤5 kata · tag ≤40 huruf · label anotasi ≤24 huruf · stempel ≤2 per video · 2–4 shot per scene.

**Ritme** (dicek di bagian RITME `cek-naskah`): tiap shot tampil 1,5–7 dtk (short: 1–5 dtk) · satu foto maks. 3 kali per video dan tidak di dua scene berturut-turut · dua shot full berurutan jangan bergerak sama · maks. 3 shot `print` beruntun · jenis scene yang sama maks. 4 berturut-turut.

---

## Masalah umum

| Gejala | Solusi |
|--------|--------|
| `cek-naskah`: "tidak bisa dibaca" | Salah ketik di `.ts` (koma, kurung, kutip). Jalankan `npx tsc` untuk lihat barisnya |
| `cari-foto`: 0 lolos filter | Ganti kata kunci (Inggris/Belanda, daerah sekitar) atau `--min-width 800`. Openverse tidak bisa dipakai (HTTP 401) |
| `generate-props --cek`: TIDAK SIAP | Bridge belum jalan atau extension belum terhubung. Beri tahu user, lewati props |
| `generate-props`: "Tab Google Flow belum terbuka" | Bridge jalan tapi tab Google Flow belum dibuka di Chrome. Beri tahu user; script otomatis berhenti mencoba props lain |
| `generate-props`: "Google Flow menolak/error" | Biasanya prompt kena filter konten. Ubah kata (hindari kekerasan, nama tokoh nyata), ulangi props itu saja |
| `generate-props`: timeout | Render Flow terlalu lama. Ulangi, atau `--concurrency 2` |
| `potong-narasi`: kecocokan rendah / ⚠ | Audio tidak sesuai naskah terbaru. Minta TTS ulang dari `naskah-full.txt` |
| `potong-narasi`: "Python + faster-whisper tidak ditemukan" | Pemotongan pakai jeda (kurang akurat). Beri tahu user; minta jeda ±1,5 dtk antar paragraf di TTS |
| Subtitle/hitungan angka tidak sinkron | `kata.json` usang → ulangi langkah 7 |
| `paket-youtube`: "Naskah belum punya youtube.judul" | Tambahkan blok `youtube` dari **Resep paket YouTube** |
| `paket-youtube`: "Chapter tidak dimasukkan ke deskripsi" | Jalankan `cek-naskah`, perbaiki error `bab` (bab pertama di scene 1, minimal 3 bab, tiap bab ≥10 detik), ulangi `paket-youtube` |
| `paket-youtube`: "timing subtitle masih PERKIRAAN" | Audio narasi belum dipasang. Selesaikan langkah 6–7, lalu ulangi `paket-youtube` |
| `cek-naskah`: "Bab ... hanya N detik" | Bab terlalu rapat. Hapus `bab` di scene itu, atau pindahkan ke scene yang lebih jauh |
| Judul thumbnail tidak terbaca di `thumbnail-kecil.jpg` | Perpendek `thumbnail.judul` (2–4 kata), ganti foto yang bagian judulnya lebih gelap/tenang |
| Short: teks/props kena area merah di `cek-frame` | Pindahkan props/stempel ke x 7–86%, y 13–78%; perpendek tag/judul |
| Short: foto hanya menampilkan bagian tidak penting | Atur `focus: {x, y}`, pakai `pan-left`/`pan-right`, atau `layout: 'print'` |
| Foto muncul tidak pas dengan kata yang diucapkan | Tambah `di: '<kata>'` di shot itu; cek di storyboard |
| `cek-naskah`: "di ... tidak ada di narasi" | Kata salah ketik, tidak ada di narasi scene itu, atau urutan `di` terbalik dengan urutan shot |
| Layar hitam di lembar kontak | Scene tanpa shot atau nama file foto salah → `cek-naskah` |
| Judul/badge bertumpuk dengan tag | Hapus `tag` scene di scene fact; di scene photo tag + judul sudah diatur posisinya |
| RITME: "Shot hanya tampil X dtk, terlalu cepat" | Dua `di` terlalu berdekatan di narasi. Hapus salah satu shot, atau ganti `di` dengan kata yang lebih jauh dari `di` shot sebelumnya/berikutnya |
| RITME: "Shot diam X dtk, terlalu lama" | Tambah shot baru dengan `di: '<kata>'` = kata di tengah bagian narasi yang tampil lama itu (cek kata-katanya di storyboard) |
| RITME: "Foto ... dipakai N kali" / "dipakai di dua scene berturut-turut" | Ganti foto itu di sebagian scene dengan foto lain dari contact sheet. Kurang foto → `cari-foto` dengan kata kunci baru (slug sama) |
| RITME: "Gerak kamera ... sama dengan shot sebelumnya" | Ganti `move` salah satu shot, atau hapus `move` supaya dipilih bergantian otomatis. Shot sebelumnya bisa shot terakhir scene sebelumnya |
| RITME: "N shot print berturut-turut" | Ubah salah satu shot di tengahnya jadi full (hapus `layout: 'print'`), atau sisipkan shot foto berwarna |
| RITME: "N scene photo berturut-turut" | Ubah satu scene di tengahnya jadi `fact` (angka/tahun yang memang disebut narasi), atau pindahkan scene fact yang ada ke tengah deretan itu |

Alasan desain (kenapa 2–4 shot, kenapa transisi tertentu, ukuran teks, dsb.): `referensi/desain.md`.

Contoh video lengkap yang lulus semua cek: `src/data/borobudur.ts`.
