# Rencana implementasi: "Kenapa plat kendaraan pakai kode huruf?" (5–6 menit)

Untuk dikerjakan AI agent (model ringan) di project ini. Riset, sumber, naskah narasi final, dan kata kunci foto **sudah disiapkan** di dokumen ini. Tugas agent: merakit mengikuti skill, memilih foto, mengecek, lalu berhenti di titik 🛑.

## Prompt untuk agent (tempel ini)

```text
Kamu bekerja di project Remotion di D:\Learning\remotion.
Baca dulu `.claude/skills/video-sejarah/SKILL.md` sampai habis, lalu baca `rencana/kode-plat-kendaraan.md`.
Kerjakan rencana itu bagian demi bagian (Tahap 1 sampai Tahap 7), BERURUTAN, memakai perintah persis yang tertulis.
Narasi dan fakta sudah final: salin apa adanya, jangan menambah fakta baru dan jangan mengubah kata-kata narasi.
Video ini panjang (32 scene): kerjakan scene per bab, jalankan cek-naskah setiap selesai satu bab.
Berhenti dan lapor ke saya di setiap titik 🛑. Jangan render MP4. Jangan git commit/push.
Setiap kali berhenti, laporkan: tahap yang selesai, hasil terakhir `node scripts/cek-naskah.mjs kode-plat-kendaraan`, file yang diubah, hal yang ragu.
```

## Ringkasan keputusan (sudah disetujui user)

| | |
|---|---|
| Topik | Asal-usul kode huruf di plat nomor kendaraan **Indonesia** |
| Format | Video panjang 16:9 (`format` tidak diisi = landscape) |
| Durasi | **±5–5,5 menit**, **32 scene** dalam 6 bab (±700 kata narasi) |
| Slug / Id | `kode-plat-kendaraan` / `KodePlatKendaraan` |
| Alur | Membaca plat → mitos batalion Inggris 1811 → mobil pertama 1894 membantah mitos → plat zaman Hindia Belanda (1900, 1917 karesidenan, 1920 luar Jawa) → setelah merdeka sampai plat putih 2022 |
| Watermark | Otomatis "jejakala" (jangan diubah) |
| Props AI | Opsional (Tahap 4). Video tetap lengkap tanpa props |

## Aturan khusus topik ini

1. **Cerita batalion Inggris 1811 = mitos/versi populer.** Selalu disajikan sebagai "cerita yang beredar". Invasi Inggris 1811-nya sendiri fakta; yang diragukan hanya hubungannya dengan kode plat.
2. **Tahun 1900 dan 1917** sumbernya ensiklopedia/artikel populer, bukan arsip resmi → narasi memakai "sekitar". Jangan dihapus.
3. Jangan menambah klaim yang tidak ada di narasi: rentang nomor urut per jenis kendaraan (sumbernya saling berbeda), "pola huruf mengikuti Jalan Daendels" (dugaan), alasan huruf tertentu tidak dipakai (tidak tercatat).
4. **Privasi**: untuk plat zaman sekarang pakai gambar *desain/contoh* plat dari Wikimedia, bukan foto mobil orang dengan nomor asli yang jelas. Foto mobil/kereta zaman kolonial boleh.
5. **TTS & kode huruf**: narasi menyebut kode seperti "AA", "AG", "CH", "CD". Itu sengaja. Saat user mengirim audio (Tahap 7), cek di tabel potong-narasi bahwa scene-scene ini tetap `ok`.

---

## Tahap 1. Siapkan video (Langkah 0 skill)

```bash
node scripts/buat-video.mjs kode-plat-kendaraan
```
Topik tidak ambigu, format & durasi sudah ditentukan → tidak perlu bertanya.

**Selesai jika:** muncul "Terdaftar sebagai Composition \"KodePlatKendaraan\"".

## Tahap 2. Isi sumber fakta (Langkah 1 skill)

Ganti seluruh isi `src/data/kode-plat-kendaraan.sumber.md` dengan teks ini (salin persis):

```markdown
# Sumber fakta: Kenapa plat kendaraan pakai kode huruf (Indonesia)

## Membaca plat
- Plat = kode wilayah (depan) + nomor urut 1–4 angka tanpa nol di depan + huruf seri (belakang); kode menunjukkan wilayah registrasi
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia
  - https://www.kompas.tv/info-publik/682896/cara-baca-nomor-kendaraan-bermotor-ini-arti-huruf-dan-angkanya
- Kode B dipakai Jakarta, Depok, Tangerang, Bekasi
  - https://www.kompas.tv/info-publik/682896/cara-baca-nomor-kendaraan-bermotor-ini-arti-huruf-dan-angkanya
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia
- Huruf pertama di belakang menunjukkan kota/kabupaten di dalam wilayah kode
  - https://www.kompas.tv/info-publik/682896/cara-baca-nomor-kendaraan-bermotor-ini-arti-huruf-dan-angkanya
  - https://auto2000.co.id/berita-dan-tips/plat-i-daerah-mana-tips
- Plat RI 1 untuk mobil presiden
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia
  - https://oto.detik.com/berita/d-7685986/urutan-pelat-nomor-pejabat-ri-mulai-dari-presiden-hingga-menteri

## Mitos batalion Inggris
- Versi populer: kode huruf dari batalion tentara Inggris; batalion yang menguasai Batavia = B (DIRAGUKAN)
  - https://oto.detik.com/berita/d-5680028/pelat-nomor-kendaraan-hitam-tulisan-putih-sudah-ada-sejak-zaman-belanda
  - https://auto2000.co.id/berita-dan-tips/sejarah-plat-nomor-di-indonesia
- Invasi Inggris ke Jawa 1811, pendaratan di Cilincing, Batavia direbut; Belanda berkuasa kembali 1816
  - https://en.wikipedia.org/wiki/Invasion_of_Java_(1811)
  - https://www.goodnewsfromindonesia.id/indonesiana/sejarah/asal-usul-pelat-nomor-kendaraan-pada-masa-kolonial-inggris-dan-hindia-belanda-di-indonesia
- Bantahan: jeda ±80 tahun sebelum ada kendaraan bermotor; tidak ada dokumen (pemerhati sejarah Kuncarsono Prasetyo)
  - https://www.detik.com/jatim/budaya/d-8066525/sejarah-pelat-nomor-kendaraan-l-surabaya
  - https://auto2000.co.id/berita-dan-tips/sejarah-plat-nomor-di-indonesia (1894 belum ada aturan plat)

## Mobil pertama
- Benz Victoria milik Pakubuwono X (Surakarta), 1894, dipesan dari Eropa, tiba lewat pelabuhan Semarang
  - https://www.cnnindonesia.com/otomotif/20260105133935-587-1313675/mobil-pertama-di-indonesia-ada-sejak-1894-julukannya-kereta-setan
  - https://oto.detik.com/mobil/d-4891888/7-fakta-mobil-pertama-orang-indonesia-yang-disimpan-belanda
- Dijuluki "kereta setan" karena berjalan tanpa kuda; kini di Museum Louwman, Belanda
  - https://oto.detik.com/mobil/d-4891888/7-fakta-mobil-pertama-orang-indonesia-yang-disimpan-belanda
  - https://www.cnnindonesia.com/otomotif/20260105133935-587-1313675/mobil-pertama-di-indonesia-ada-sejak-1894-julukannya-kereta-setan
- Sebelum mobil, angkutan umum di jalan adalah kereta kuda
  - https://oto.detik.com/mobil/d-4891888/7-fakta-mobil-pertama-orang-indonesia-yang-disimpan-belanda
  - https://www.cnbcindonesia.com/entrepreneur/20220217111137-25-316096/raja-mobil-ternyata-orang-ini-yang-pertama-punya-mobil-di-ri

## Zaman Hindia Belanda
- Sekitar 1900 plat diperkenalkan; belum ada standar; bahan beragam (kayu, kulit, karet, kain)
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia
  - https://www.goodnewsfromindonesia.id/indonesiana/sejarah/asal-usul-pelat-nomor-kendaraan-pada-masa-kolonial-inggris-dan-hindia-belanda-di-indonesia
- Kode awal singkatan daerah: CH Cirebon, SB Surabaya
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia
  - https://www.goodnewsfromindonesia.id/indonesiana/sejarah/asal-usul-pelat-nomor-kendaraan-pada-masa-kolonial-inggris-dan-hindia-belanda-di-indonesia
- 1917 sistem lebih teratur: wajib registrasi, kode berdasarkan karesidenan di Jawa
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia
  - https://www.detik.com/jatim/budaya/d-8066525/sejarah-pelat-nomor-kendaraan-l-surabaya
- Karesidenan = wilayah administrasi di bawah residen
  - https://en.wikipedia.org/wiki/Administrative_divisions_of_the_Dutch_East_Indies
  - https://id.wikipedia.org/wiki/Karesidenan
- Kode Jawa sekarang mengikuti bekas karesidenan: D Bandung, F Bogor/Sukabumi, Z Garut/Tasikmalaya, AA Kedu, AE Madiun, AG Kediri (AG: Kediri, Blitar, Tulungagung, Nganjuk, Trenggalek)
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia
  - https://www.detik.com/jatim/budaya/d-8066525/sejarah-pelat-nomor-kendaraan-l-surabaya
  - https://auto2000.co.id/berita-dan-tips/plat-nomor-seluruh-indonesia
- Huruf satu yang tidak dipakai sebagai kode wilayah: C, I, J, O, Q, U, V, X, Y (17 huruf dipakai: A B D E F G H K L M N P R S T W Z)
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia (tabel kode)
  - https://www.goodnewsfromindonesia.id/2021/05/18/alasan-tidak-digunakannya-huruf-c-pada-plat-kendaraan-bermotor-di-indonesia
- 1920 diperluas ke luar Jawa (Sumatra, Kalimantan, Sulawesi, Maluku); kode dua huruf, huruf pertama sering menandai pulau (B Sumatra, K Kalimantan, P Papua)
  - https://www.detik.com/jatim/budaya/d-8066525/sejarah-pelat-nomor-kendaraan-l-surabaya
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia

## Setelah merdeka
- Pola kode tetap dipakai setelah 1945
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia
  - https://www.goodnewsfromindonesia.id/indonesiana/sejarah/asal-usul-pelat-nomor-kendaraan-pada-masa-kolonial-inggris-dan-hindia-belanda-di-indonesia
- Warna (Perpol 7/2021 pasal 45): kuning umum, merah dinas pemerintah, hijau kawasan perdagangan bebas; kendaraan listrik bingkai biru; kedutaan kode CD (Corps Diplomatique)
  - https://www.cnnindonesia.com/otomotif/20210811113218-579-679107/polisi-ubah-warna-pelat-nomor-jadi-putih-tulisan-hitam/amp
  - https://en.wikipedia.org/wiki/Vehicle_registration_plates_of_Indonesia
- 2022 plat pribadi putih tulisan hitam (Perpol 7/2021); alasan: kamera ETLE sulit membaca plat hitam (5 terbaca S, 1 terbaca I)
  - https://www.cnnindonesia.com/otomotif/20220518210528-579-798274/alasan-harus-ganti-pelat-nomor-kendaraan-pribadi-jadi-putih/amp
  - https://oto.detik.com/berita/d-5682525/ini-alasan-pelat-nomor-diganti-warna-putih-tulisan-hitam
```

**Selesai jika:** file tersimpan. Tidak perlu riset tambahan.

## Tahap 3. Cari foto (Langkah 3 skill)

Jalankan satu per satu, tunggu selesai ("dibatasi server, tunggu" itu normal):

```bash
node scripts/cari-foto.mjs "Indonesian license plate" --slug kode-plat-kendaraan --limit 8 --min-width 600
node scripts/cari-foto.mjs "electric vehicle license plate Indonesia" --slug kode-plat-kendaraan --limit 2 --min-width 600
node scripts/cari-foto.mjs "Jakarta traffic" --slug kode-plat-kendaraan --limit 4 --min-width 1200
node scripts/cari-foto.mjs "traffic camera" --slug kode-plat-kendaraan --limit 2 --min-width 1000
node scripts/cari-foto.mjs "Invasion of Java 1811" --slug kode-plat-kendaraan --limit 3 --pd-only --min-width 800
node scripts/cari-foto.mjs "Pakubuwana X" --slug kode-plat-kendaraan --limit 2 --pd-only --min-width 600
node scripts/cari-foto.mjs "Louwman Museum Benz" --slug kode-plat-kendaraan --limit 3 --min-width 1000
node scripts/cari-foto.mjs "Benz Victoria 1894" --slug kode-plat-kendaraan --limit 2 --min-width 800
node scripts/cari-foto.mjs "sado Batavia" --slug kode-plat-kendaraan --limit 3 --min-width 800
node scripts/cari-foto.mjs "rijtuig Batavia KITLV" --slug kode-plat-kendaraan --limit 3 --min-width 800
node scripts/cari-foto.mjs "auto Batavia KITLV" --slug kode-plat-kendaraan --limit 6 --pd-only --min-width 800
node scripts/cari-foto.mjs "auto Soerabaja KITLV" --slug kode-plat-kendaraan --limit 4 --min-width 800
node scripts/cari-foto.mjs "automobiel Nederlands-Indie" --slug kode-plat-kendaraan --limit 3 --min-width 800
node scripts/cari-foto.mjs "Java residencies map" --slug kode-plat-kendaraan --limit 8 --min-width 800
node scripts/cari-foto.mjs "Atlas sekolah Hindia-Nederland map" --slug kode-plat-kendaraan --limit 6 --min-width 800
node scripts/cari-foto.mjs "Groote Postweg" --slug kode-plat-kendaraan --limit 3 --min-width 800
```

Lalu **lihat `public/photos/kode-plat-kendaraan/_contact-sheet.jpg` dengan Read.** Hapus file JPG yang tidak berhubungan, buram, berwatermark, atau berupa foto mobil pribadi modern dengan nomor plat jelas.

**Selesai jika** minimal tersedia: 4 gambar desain/contoh plat Indonesia, 3 foto lalu lintas modern, 1 lukisan/ilustrasi invasi 1811, 1 potret Pakubuwono X, 2 foto Benz tua, 3 foto kereta kuda/sado, 6 foto mobil zaman kolonial, 4 peta karesidenan. Kekurangan: coba kata kunci serupa (Belanda/Inggris) maksimal 3 kali, lalu lanjut dan catat untuk laporan. Foto boleh dipakai di lebih dari satu scene.

## Tahap 4. Props (opsional, Langkah 5 skill)

```bash
node scripts/generate-props.mjs --cek
```
- `TIDAK SIAP` → catat, lewati Tahap 4.
- `SIAP` → isi `src/data/kode-plat-kendaraan.props.json`:
  ```json
  [
    {"name": "plat-kolonial", "prompt": "an old 1920s black enamel vehicle license plate with white letters, blank without readable text"},
    {"name": "mobil-antik", "prompt": "an antique 1894 Benz Victoria horseless carriage, side view"},
    {"name": "kamera-tilang", "prompt": "a modern traffic enforcement camera on a pole"}
  ]
  ```
  `node scripts/generate-props.mjs --file src/data/kode-plat-kendaraan.props.json`, lihat hasilnya dengan Read, lalu pasang (`x: 80, y: 62, width: 320, animation: 'pop'`): `plat-kolonial` di scene 17 `di: 'aturan'`, `mobil-antik` di scene 12 `di: 'Benz'`, `kamera-tilang` di scene 31 `di: 'kamera'`.

## Tahap 5. Tulis naskah (Langkah 2 + 4 skill)

Ganti isi `scenes: [...]` di `src/data/kode-plat-kendaraan.ts` dengan 32 scene di bawah. **Narasi, tag, judul, judulDi, angka, stempel, transisi: salin persis.** Yang kamu isi sendiri hanya `shots`, memakai petunjuk **Foto**: shot 1 tanpa `di`, shot berikutnya dengan `di` yang tertulis. Nama file disalin dari `ls public/photos/kode-plat-kendaraan/`.

Format setiap scene (contoh scene 3):
```ts
{
  type: 'photo', duration: 90, transition: 'dorong',
  tag: 'Anatomi plat',
  judul: '*Tiga* bagian plat',
  judulDi: 'tiga',
  narasi: 'Setiap plat terdiri dari tiga bagian: huruf kode wilayah di depan, nomor urut di tengah, dan huruf seri di belakang.',
  shots: [
    {...foto('NN-desain-plat.jpg'), layout: 'print'},
    {...foto('NN-desain-plat-lain.jpg'), layout: 'print', di: 'nomor'},
  ],
},
```
Scene `title` memakai `kicker`, `title`, `subtitle`. Scene `fact` memakai `value`, `format: 'year'` (kalau tertulis), `label`. Scene `outro` memakai `title` dan `cta: 'Follow untuk sejarah lainnya'`. Semua `duration: 90`.

**Opsional fitur Engine v2 (tanpa mengubah narasi):**
- **Kartu bab (`type: 'chapter'`)**: scene pembuka bab (misal scene 8 *Cerita `*batalion Inggris*`* dengan `nomor: 2`, atau scene 27 *Warisan `*zaman kolonial*`* dengan `nomor: 6`) boleh memakai `type: 'chapter'` (otomatis jadi chapter YouTube; bungkus judul bab di narasi dengan `*bintang*` atau sisipkan kartu bab singkat `duration: 75` tanpa narasi sebelum scene pembuka bab). Bab lainnya cukup memakai `bab: '<judul bab>'` (dimulai dari scene 1 `bab: 'Membaca plat'`).
- **Garis waktu (`type: 'timeline'`)**: scene 9 (rentang 1811–1816: `titik: [{tahun: 1811, label: 'Mendarat di Cilincing', di: 'sebelas'}, {tahun: 1816, label: 'Belanda berkuasa lagi', di: 'enam'}]`) atau scene 14 (membandingkan 1811 invasi Inggris vs 1894 mobil pertama vs 1900 plat pertama) boleh memakai `type: 'timeline'` supaya loncatan tahun terlihat berdampingan.
- **Pin & rute di peta**: shot peta di scene 9 (Cilincing → Batavia), scene 12 (Semarang → Surakarta), atau scene 21–23 (peta karesidenan Jawa Barat/Kediri) boleh memakai `anotasi` dengan `bentuk: 'pin'` dan/atau `rute`.

### Bab 1. Membaca plat (scene 1–7)

**1 · title**
- kicker `Sejarah Nusantara` · title `Kode Plat Kendaraan` · subtitle `Dari karesidenan ke jalan raya`
- narasi: `Kenapa mobil di Jakarta berplat B, dan di Bandung berplat D? Jawabannya ternyata berakar dari zaman kolonial. Inilah kisah *kode plat* kendaraan.`
- Foto: lalu lintas modern (`move: 'pan-right'`); mobil kolonial Batavia `di: 'zaman'`

**2 · photo** · transisi `dorong`
- tag `Jalan raya · Indonesia` · judul `Huruf yang *jarang diperhatikan*` · judulDi `jarang`
- narasi: `Setiap hari kita melihat ribuan plat nomor di jalan. Tapi jarang yang tahu, huruf kecil di depannya menyimpan cerita lebih dari seratus tahun.`
- Foto: lalu lintas modern; desain plat Indonesia `layout: 'print'` `di: 'huruf'`

**3 · photo** · transisi `kartu`
- tag `Anatomi plat` · judul `*Tiga* bagian plat` · judulDi `tiga`
- narasi: `Setiap plat terdiri dari tiga bagian: huruf kode wilayah di depan, nomor urut di tengah, dan huruf seri di belakang.`
- Foto: desain plat `print` (opsional anotasi: `node scripts/grid-foto.mjs` lalu lingkari huruf depan, label `Kode wilayah`); desain plat lain `print` `di: 'nomor'`

**4 · photo** · transisi `dorong`
- tag `Kode wilayah` · judul `Huruf penanda *wilayah*` · judulDi `wilayah`
- narasi: `Huruf paling depan menunjukkan wilayah tempat kendaraan didaftarkan, bukan tempat tinggal pemiliknya sekarang. Mobil berplat B bisa saja dipakai warga kota lain.`
- Foto: lalu lintas modern (`pan-left`); desain plat `print` `di: 'Mobil'`

**5 · photo** · transisi `kartu`
- tag `Kode B` · judul `Satu kode, *banyak kota*` · judulDi `Depok,`
- narasi: `Satu kode juga bisa dipakai beberapa kota sekaligus. Kode B misalnya, dipakai Jakarta, Depok, Tangerang, dan Bekasi.`
- Foto: lalu lintas Jakarta; peta karesidenan/peta Jawa Barat `print` `di: 'Jakarta,'`

**6 · photo** · transisi `dorong`
- tag `Huruf seri` · judul `Petunjuk di *belakang*` · judulDi `belakang`
- narasi: `Huruf di belakang juga punya arti. Huruf pertamanya menunjukkan kota atau kabupaten tempat kendaraan terdaftar, di dalam wilayah kode itu.`
- Foto: desain plat `print`; lalu lintas modern `di: 'kota'`

**7 · photo** · transisi `kartu`
- tag `RI 1 · Presiden` · judul `Nomor tanpa *nol*` · judulDi `nol`
- narasi: `Nomor di tengah berisi satu sampai empat angka, tanpa angka nol di depan. Nomor yang paling istimewa adalah RI satu, untuk mobil presiden.`
- Foto: desain plat `print`; desain plat lain `print` `di: 'istimewa'`

### Bab 2. Mitos batalion Inggris (scene 8–10)

**8 · photo** · transisi `zoom`
- tag `Versi populer` · judul `Cerita *batalion Inggris*` · judulDi `batalion`
- narasi: `Lalu dari mana asal huruf-huruf itu? Di internet beredar cerita populer: kode ini berasal dari batalion tentara Inggris.`
- Foto: peta Jawa lama `print`; lukisan invasi 1811 `print` `di: 'batalion'`

**9 · photo** · transisi `dorong`
- tag `Invasi Jawa · 1811` · judul `Inggris *menyerbu Jawa*` · judulDi `mendarat`
- narasi: `Inggris memang pernah menyerbu Jawa pada tahun seribu delapan ratus sebelas. Pasukannya mendarat di Cilincing, merebut Batavia, dan berkuasa hingga tahun seribu delapan ratus enam belas.`
- Foto: lukisan pendaratan di Cilincing (Chillinching) `print`; peta/ilustrasi Batavia lama `print` `di: 'Batavia,'`

**10 · photo** · transisi `kartu`
- tag `Versi populer` · judul `Batalion B untuk *Batavia*` · judulDi `Batavia`
- narasi: `Menurut cerita itu, setiap batalion diberi huruf, dan batalion yang menguasai Batavia memakai huruf B. Kedengarannya masuk akal, tapi ada masalah besar.`
- Foto: lukisan invasi 1811 (shot ulang, `layout: 'full'`, `move: 'push-in'`); mobil kolonial Batavia `di: 'masalah'`

### Bab 3. Mobil pertama (scene 11–14)

**11 · fact** · transisi `dorong`
- value `1894` · format `year` · label `Mobil pertama tiba`
- narasi: `Mobil pertama baru tiba di Hindia Belanda pada tahun *seribu delapan ratus sembilan puluh empat*, hampir delapan puluh tahun setelah Inggris pergi.`
- Foto: Benz tua (Louwman / Benz Victoria), tag `Benz Victoria · 1894`; peta Jawa lama `print` `di: 'Inggris'`

**12 · photo** · transisi `kartu`
- tag `Pakubuwono X · Surakarta` · judul `Mobil sang *raja*` · judulDi `Pakubuwono`
- narasi: `Pemiliknya adalah Pakubuwono Kesepuluh, raja Surakarta. Mobil Benz Victoria itu dipesan dari Eropa, lalu tiba lewat pelabuhan Semarang.`
- Foto: potret Pakubuwono X `print`; Benz tua `di: 'Benz'`

**13 · photo** · transisi `dorong`
- tag `Julukan masyarakat` · judul `Sang *kereta setan*` · judulDi `setan.`
- narasi: `Karena bisa berjalan tanpa ditarik kuda, masyarakat menjulukinya kereta setan. Kini mobil bersejarah itu disimpan di Museum Louwman, Belanda.`
- Foto: Benz tua (`pan-right`); foto Benz di Museum Louwman `di: 'Museum'`, tag `Museum Louwman · Belanda`

**14 · photo** · transisi `kartu`
- tag `Mitos atau fakta?` · judul `Saat itu *belum ada* mobil` · judulDi `belum`
- stempel: `{teks: 'Diragukan', di: 'tidak'}`
- narasi: `Artinya, saat tentara Inggris datang, kendaraan bermotor belum ada. Cerita batalion itu juga tidak didukung dokumen sejarah yang jelas.`
- Foto: kereta kuda/sado `print`; lukisan invasi 1811 `print` `di: 'Cerita'`

### Bab 4. Plat zaman Hindia Belanda (scene 15–21)

**15 · photo** · transisi `dorong`
- tag `Batavia · abad ke-19` · judul `Zaman *kereta kuda*` · judulDi `kereta`
- narasi: `Sebelum mobil datang, jalanan Batavia dipenuhi kereta kuda seperti sado dan delman. Belum ada plat nomor seperti yang kita kenal sekarang.`
- Foto: sado Batavia; rijtuig Batavia `di: 'sado'`; kereta kuda lain `di: 'plat'`

**16 · fact** · transisi `kartu`
- value `1900` · format `year` · label `Plat pertama`
- narasi: `Plat kendaraan bermotor mulai diperkenalkan di Hindia Belanda sekitar tahun *seribu sembilan ratus*, seiring makin banyaknya mobil di Jawa.`
- Foto: mobil kolonial (`pan-right`); mobil kolonial lain `di: 'mobil'`

**17 · photo** · transisi `dorong`
- tag `Hindia Belanda · awal 1900-an` · judul `Plat yang masih *bebas*` · judulDi `aturan`
- narasi: `Awalnya belum ada aturan bentuk, ukuran, dan warna plat. Bahannya pun macam-macam, mulai dari kayu, kulit, karet, sampai kain.`
- Foto: mobil kolonial Batavia `print`; mobil kolonial Surabaya `print` `di: 'Bahannya'`

**18 · photo** · transisi `kartu`
- tag `CH · SB` · judul `Singkatan *nama kota*` · judulDi `singkatan`
- narasi: `Kodenya pun ditulis sebagai singkatan nama daerah. Misalnya CH untuk Cirebon, dan SB untuk Surabaya, kota pelabuhan yang sibuk.`
- Foto: mobil kolonial (`push-in`); mobil Surabaya KITLV `di: 'Surabaya,'`

**19 · fact** · transisi `dorong`
- value `1917` · format `year` · label `Kode per karesidenan`
- narasi: `Sekitar tahun *seribu sembilan ratus tujuh belas*, pemerintah kolonial menata ulang plat berdasarkan wilayah karesidenan di Jawa.`
- Foto: mobil kolonial; peta karesidenan `print` `di: 'karesidenan'`

**20 · photo** · transisi `kartu`
- tag `Karesidenan` · judul `Satu wilayah, *satu kode*` · judulDi `kode`
- narasi: `Karesidenan adalah wilayah administrasi yang dipimpin seorang residen. Setiap karesidenan mendapat kode hurufnya sendiri, dan pemilik kendaraan wajib mendaftar.`
- Foto: peta karesidenan `print`; peta karesidenan lain `print` `di: 'Setiap'`; mobil kolonial `di: 'pemilik'`

**21 · photo** · transisi `dorong`
- tag `Jawa Barat` · judul `Jejak *bekas karesidenan*` · judulDi `Bandung,`
- narasi: `Di Jawa Barat misalnya, D dipakai Bandung, F dipakai Bogor dan Sukabumi, dan Z dipakai Garut dan Tasikmalaya, mengikuti bekas wilayah karesidenan.`
- Foto: peta Priangan/Jawa Barat (`Midden-Priangan` di contact sheet) `print`; Groote Postweg Jawa Barat `di: 'Garut'`

### Bab 5. Karesidenan sampai luar Jawa (scene 22–26)

**22 · photo** · transisi `kartu`
- tag `Jawa Tengah & Jawa Timur` · judul `Jejak *karesidenan lama*` · judulDi `jejaknya`
- narasi: `Di Jawa Tengah dan Jawa Timur, jejaknya lebih jelas lagi: AA untuk bekas Karesidenan Kedu, AE untuk Madiun, dan AG untuk Kediri.`
- Foto: peta Karesidenan Kedu (`Kedoe` di contact sheet) `print`, anotasi opsional; peta karesidenan lain `print` `di: 'AE'`

**23 · photo** · transisi `dorong`
- tag `Kode AG` · judul `Satu kode, *banyak daerah*` · judulDi `AG`
- narasi: `Itulah kenapa kode AG sampai sekarang dipakai Kediri, Blitar, Tulungagung, Nganjuk, dan Trenggalek, bekas wilayah Karesidenan Kediri.`
- Foto: peta karesidenan Jawa Timur `print`; lalu lintas modern `di: 'Blitar,'`

**24 · fact** · transisi `kartu`
- value `9` · label `Huruf tak dipakai`
- narasi: `Ada *sembilan* huruf yang tidak dipakai sebagai kode wilayah satu huruf: C, I, J, O, Q, U, V, X, dan Y. Alasannya tidak tercatat jelas.`
- Foto: desain plat `print`; desain plat lain `print` `di: 'Alasannya'`

**25 · fact** · transisi `dorong`
- value `1920` · format `year` · label `Meluas ke luar Jawa`
- narasi: `Pada tahun *seribu sembilan ratus dua puluh*, sistem ini diperluas ke luar Jawa, seperti Sumatra, Kalimantan, Sulawesi, dan Maluku.`
- Foto: peta karesidenan luar Jawa (atlas sekolah) `print`; peta lain `print` `di: 'Sumatra,'`

**26 · photo** · transisi `kartu`
- tag `Kode dua huruf` · judul `Dua huruf, *luar Jawa*` · judulDi `dua`
- narasi: `Di luar Jawa kodenya dua huruf. Huruf pertama sering menandai pulau: B untuk Sumatra, K untuk Kalimantan, dan P untuk Papua.`
- Foto: desain plat (cari "Kalimantan Timur" di nama file) `print`; desain plat lain `print` `di: 'K'`

### Bab 6. Setelah merdeka (scene 27–32)

**27 · photo** · transisi `dorong`
- tag `Setelah 1945` · judul `Warisan *zaman kolonial*` · judulDi `merdeka,`
- narasi: `Setelah Indonesia merdeka, pola kode ini tetap dipakai. Kode-kode warisan karesidenan itu masih bisa kita lihat sampai sekarang.`
- Foto: mobil kolonial `print`; lalu lintas modern `di: 'warisan'`

**28 · photo** · transisi `kartu`
- tag `Perpol 7/2021` · judul `Arti *warna* plat` · judulDi `warna`
- narasi: `Warna plat juga punya arti. Kuning untuk angkutan umum, merah untuk kendaraan dinas pemerintah, dan hijau untuk kawasan perdagangan bebas.`
- Foto: desain plat umum/kuning `print`; desain plat lain `print` `di: 'merah'`

**29 · photo** · transisi `dorong`
- tag `Plat khusus` · judul `Kedutaan & *kendaraan listrik*` · judulDi `kedutaan`
- narasi: `Ada pula plat khusus. Mobil kedutaan memakai kode CD, singkatan dari Corps Diplomatique, dan kendaraan listrik diberi bingkai biru.`
- Foto: desain plat `print`; plat kendaraan listrik `print` `di: 'listrik'`

**30 · photo** · transisi `kartu`
- tag `Plat putih · 2022` · judul `Kini *putih*` · judulDi `putih`
- narasi: `Sejak tahun dua ribu dua puluh dua, plat kendaraan pribadi diganti menjadi putih dengan tulisan hitam, sesuai Peraturan Polri nomor tujuh tahun dua ribu dua puluh satu.`
- Foto: desain plat baru putih ("New Indonesian License Plate") `print`; lalu lintas modern `di: 'Peraturan'`

**31 · photo** · transisi `dorong`
- tag `Kamera ETLE` · judul `Demi *kamera tilang*` · judulDi `kamera`
- narasi: `Alasannya, kamera tilang elektronik sulit membaca plat hitam. Angka lima bisa terbaca huruf S, dan angka satu terbaca huruf I.`
- Foto: kamera lalu lintas; desain plat putih `print` `di: 'Angka'`

**32 · outro** · transisi `kartu`
- tag `Kode plat · Indonesia` · title `Jejak *karesidenan* di plat kita`
- narasi: `Jadi, huruf di plat kendaraanmu adalah jejak wilayah karesidenan zaman kolonial. Ikuti channel ini untuk kisah sejarah Nusantara lainnya.`
- Foto: lalu lintas modern (`push-in`); mobil kolonial `di: 'Ikuti'`

Setelah selesai tiap bab, dan sekali lagi di akhir:
```bash
npx tsc
node scripts/cek-naskah.mjs kode-plat-kendaraan
```
Perbaiki semua `✗ ERROR` sesuai "Perbaiki:". Peringatan boleh dibiarkan hanya kalau penyebabnya dicatat (misal foto yang pas tidak ada).

**Selesai jika:** `✓ LULUS`, 32 scene, perkiraan cek-naskah ±280–320 detik (dengan audio TTS asli biasanya jadi ±5,5 menit, karena TTS sedikit lebih lambat dari perkiraan).

## Tahap 6. Naskah TTS (Langkah 6 skill)

```bash
node scripts/narasi.mjs kode-plat-kendaraan
```

🛑 **Berhenti & lapor ke user**: kirim path `narasi/kode-plat-kendaraan/naskah-full.txt`, minta TTS satu file audio utuh. Sertakan: hasil cek-naskah, props dibuat/dilewati, kebutuhan foto yang tidak terpenuhi (Tahap 3).

## Tahap 7. Setelah user mengirim audio (Langkah 7–8 skill)

```bash
node scripts/potong-narasi.mjs kode-plat-kendaraan "<path audio dari user>"
```
- Semua baris `ok` dan kecocokan ≥70% → tambahkan `narasiAudio: 'audio/kode-plat-kendaraan', narasiExt: 'wav',` di atas `scenes`.
- Ada `⚠` → 🛑 lapor ke user (audio mungkin tidak sesuai naskah, atau kode huruf dibaca berbeda).

```bash
node scripts/cek-naskah.mjs kode-plat-kendaraan
npx tsc
node scripts/cek-frame.mjs kode-plat-kendaraan
node scripts/storyboard.mjs kode-plat-kendaraan
```
Lembar kontak 32 scene sangat tinggi: potong jadi 4 bagian sebelum dilihat. Lihat semua halaman storyboard (8 halaman) dengan Read. Untuk tiap shot: apakah foto sesuai kata yang sedang diucapkan? Perbaiki `di`/urutan/foto bila perlu, ulangi storyboard.

🛑 **Berhenti & kirim semua halaman `out/storyboard/kode-plat-kendaraan-N.jpg` ke user**, sebutkan scene yang memakai foto proksi. Render hanya setelah user setuju:
```bash
npx remotion render KodePlatKendaraan out/kode-plat-kendaraan.mp4
node scripts/kredit.mjs kode-plat-kendaraan
```

---

## Checklist akhir (untuk dilaporkan agent)

- [ ] `cek-naskah`: ✓ LULUS, 32 scene, ±5 menit
- [ ] Narasi 32 scene sama persis dengan rencana
- [ ] Setiap shot ke-2 dst. punya `di`
- [ ] Transisi `zoom` hanya di scene 8; stempel hanya di scene 14
- [ ] Mitos 1811 disebut sebagai "cerita yang beredar"
- [ ] Tidak ada foto plat mobil pribadi modern dengan nomor jelas
- [ ] Storyboard dikirim & disetujui sebelum render
