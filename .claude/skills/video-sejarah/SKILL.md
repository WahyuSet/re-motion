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

**Selesai jika:** `cek-naskah` tidak lagi menampilkan error tentang narasi/TODO/judul (error "shots kosong" masih wajar sampai langkah 4).

## Langkah 3 — Cari foto bebas lisensi

```bash
node scripts/cari-foto.mjs "<kata kunci>" --slug <slug>
```

- Jalankan **3–6 kali** dengan kata kunci berbeda (slug sama). Butuh ±2–4 foto per scene.
- Kata kunci bahasa Inggris/Belanda lebih banyak hasil. Arsip kolonial: tambahkan `KITLV`, `Tropenmuseum`, `Nationaal Archief`. Tokoh: `"<nama> portrait"`. Peta: `"map of Java 1817"`.
- Foto lama: tambah `--pd-only`. Hasil 0: coba kata kunci lain, `--min-width 800`, atau `--source openverse`.
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

Boleh langsung cek tampilan sebelum ada audio: `node scripts/cek-frame.mjs <slug>` (durasi scene diperkirakan dari jumlah kata narasi, ±2,4 kata/detik). Video panjang (16+ scene) menghasilkan lembar kontak yang tinggi; potong jadi 3 bagian sebelum dilihat supaya tetap terbaca.

## Langkah 5 — Props (opsional)

Props = ilustrasi benda (kompas, naskah kuno, kapal) digenerate AI. Lewati langkah ini kalau tidak perlu.

1. Cek bridge: `curl http://127.0.0.1:8001/health` → harus `"extension_connected": true`.
   🛑 Kalau gagal/false: bilang ke user "Flow Bridge belum jalan (jalankan `D:\Learning\ai-content\tools\flow_bridge\run_bridge.ps1` dan buka tab Google Flow di Chrome)". **Lewati props**, lanjut langkah 6.
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

Hasilnya `out/storyboard/<slug>-1.jpg`, `-2.jpg`, … (4 scene per halaman) + `out/storyboard/<slug>.md`. Tiap scene berisi: waktu mulai–selesai, transisi, tag/judul/angka/stempel, narasi, lalu **setiap shot** dengan cuplikan gambar, waktu mulai, dan **kata-kata yang diucapkan selama shot itu tampil**.

1. Lihat setiap halaman dengan Read. Untuk setiap shot, bandingkan cuplikan dengan kata-kata di bawahnya: apakah foto menunjukkan hal yang sedang diucapkan? Kalau tidak cocok, tambah/perbaiki `di`, tukar urutan shot, atau ganti foto. Jalankan ulang storyboard.
2. 🛑 **Kirim semua halaman storyboard ke user** dan tanya: "Storyboard sudah oke untuk dirender, atau ada scene/foto yang mau diganti?" Sebutkan juga scene yang fotonya kurang cocok karena tidak ada foto bebas lisensi yang pas.
3. Kalau user minta perubahan: ubah naskah, jalankan `cek-naskah` + `storyboard` lagi, kirim ulang. Lanjut ke Langkah 9 **hanya setelah user setuju**.

## Langkah 9 — Render & kredit

```bash
npx remotion render <Id> out/<slug>.mp4
node scripts/kredit.mjs <slug>
```

Render ±5–10 menit; jalankan di background. Kirim ke user:
- `out/<slug>.mp4` (1080p, untuk upload).
- `out/<slug>-kredit.txt` → wajib ditempel di deskripsi YouTube (foto CC BY / CC BY-SA).
- Kalau user minta file dikirim tapi lebih dari 30 MB, buat versi preview 720p:
  ```bash
  node -e "import('./scripts/lib/ffmpeg.mjs').then(({ffmpeg})=>ffmpeg(['-y','-i','out/<slug>.mp4','-vf','scale=1280:720','-c:v','libx264','-b:v','3100k','-maxrate','3400k','-bufsize','6800k','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','out/<slug>-720p.mp4']))"
  ```

---

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

**Transisi** (`transition` di scene ke-2 dan seterusnya): selang-seling `dorong` dan `kartu`; `none` antar dua scene fact berturut-turut; `zoom` atau `whip` paling banyak sekali per video.

**Batas**: judul ≤5 kata · tag ≤40 huruf · label anotasi ≤24 huruf · stempel ≤2 per video · 2–4 shot per scene.

---

## Masalah umum

| Gejala | Solusi |
|--------|--------|
| `cek-naskah`: "tidak bisa dibaca" | Salah ketik di `.ts` (koma, kurung, kutip). Jalankan `npx tsc` untuk lihat barisnya |
| `cari-foto`: 0 lolos filter | Ganti kata kunci (Inggris/Belanda), `--min-width 800`, atau `--source openverse` |
| `generate-props`: tidak bisa dihubungi / 503 | Bridge belum jalan atau tab Google Flow belum terbuka. Lewati props |
| `generate-props`: HTTP 502 | Prompt kena filter. Ubah kata (hindari kekerasan, nama tokoh nyata) |
| `potong-narasi`: kecocokan rendah / ⚠ | Audio tidak sesuai naskah terbaru. Minta TTS ulang dari `naskah-full.txt` |
| `potong-narasi`: "Python + faster-whisper tidak ditemukan" | Pemotongan pakai jeda (kurang akurat). Beri tahu user; minta jeda ±1,5 dtk antar paragraf di TTS |
| Subtitle/hitungan angka tidak sinkron | `kata.json` usang → ulangi langkah 7 |
| Foto muncul tidak pas dengan kata yang diucapkan | Tambah `di: '<kata>'` di shot itu; cek di storyboard |
| `cek-naskah`: "di ... tidak ada di narasi" | Kata salah ketik, tidak ada di narasi scene itu, atau urutan `di` terbalik dengan urutan shot |
| Layar hitam di lembar kontak | Scene tanpa shot atau nama file foto salah → `cek-naskah` |
| Judul/badge bertumpuk dengan tag | Hapus `tag` scene di scene fact; di scene photo tag + judul sudah diatur posisinya |

Alasan desain (kenapa 2–4 shot, kenapa transisi tertentu, ukuran teks, dsb.): `referensi/desain.md`.

Contoh video lengkap yang lulus semua cek: `src/data/borobudur.ts`.
