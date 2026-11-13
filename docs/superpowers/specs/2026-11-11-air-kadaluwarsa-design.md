# Spesifikasi Desain Video Explainer: `air-kadaluwarsa`

## 1. Identitas & Tujuan Video
- **Slug:** `air-kadaluwarsa`
- **Composition ID:** `AirKadaluwarsa` (dan `AirKadaluwarsaThumb`)
- **Format:** YouTube Shorts / Reels / TikTok `9:16` (`1080x1920`, `30fps`)
- **Topik:** Kenapa air mineral kemasan punya tanggal kadaluwarsa padahal air murni tidak bisa basi?
- **Target Durasi:** `36 sampai 42 detik` (`6 scene`, `81 kata` narasi)

## 2. Desain Thumbnail & Banner Hook (Opsi 3 + Stabilo Baris 2)
- **`baris1` (Sticker Outline Putih):** `AIR PUTIH GAK BASI` (18 karakter, `<= 28`)
- **`baris2` (Stabilo Kuning `#f5c518` + Outline Putih):** `KOK ADA KADALUWARSA?` (20 karakter, `<= 28`)
- **`thumbnail.latar`:** `latar/air-kadaluwarsa-1.png` (rak minimarket modern dengan deretan botol air mineral, digelapkan dengan gradien sinematik)
- **`thumbnail.src`:** `props/air-botol-expired.png` (botol air mineral bening dengan label tanggal kadaluwarsa merah mencolok)

## 3. Hook Narasi Stop-Scroll (~3 Detik)
- **Kalimat Hook (9 kata, 1 kalimat padat):**
  `"Air putih gak pernah basi, *kok botolnya ada kadaluwarsa*?"`
- **Alasan:** Langsung memakai istilah sehari-hari (*air putih*) yang selaras dengan judul thumbnail (`AIR PUTIH GAK BASI`), membenturkan fakta yang semua orang tahu dengan kejanggalan di botol minimarket dalam 3 detik pertama tanpa kalimat pengantar.

## 4. Fakta Ilmiah & Sumber Riset (`air-kadaluwarsa.sumber.md`)
1. **Air Murni ($H_2O$) Tidak Basi:** Molekul air tidak memiliki protein, gula, atau lemak yang bisa membusuk secara organik.
2. **Degradasi Plastik PET (Polyethylene Terephthalate - Kode 1):** Botol air mineral sekali pakai dibuat dari resin PET yang memiliki pori-pori mikroskopis. Setelah 1 sampai 2 tahun, ikatan polimer PET mulai terdegradasi dan meluruhkan partikel mikroplastik ke dalam air.
3. **Pelepasan Senyawa Antimoni & Asetaldehida Akibat Panas:** Saat botol plastik terpapar suhu tinggi (misalnya di bagasi mobil atau gudang panas), katalis logam berat antimoni trioksida dan senyawa asetaldehida larut ke dalam air, mengubah rasa air menjadi pahit/plastik dan berisiko bagi kesehatan.
4. **Sumber Acuan:**
   - International Bottled Water Association (IBWA) & US FDA Regulation on Bottled Water Shelf Life.
   - Studi *Water Research* (Westerhoff et al.): Pelepasan antimoni dari botol plastik PET ke dalam air minum pada suhu ruang dan suhu tinggi.

## 5. Daftar Aset Flow Bridge

### A. Latar Lokasi Real (`air-kadaluwarsa.latar.json` - 5 Scene Non-Beat)
1. `air-kadaluwarsa-1`: Rak pendingin minimarket modern berisi deretan botol air mineral bening, pencahayaan toko bersih.
2. `air-kadaluwarsa-2`: Aliran mata air pegunungan alami yang sangat jernih di antara bebatuan sungai bersih, cahaya pagi cerah.
3. `air-kadaluwarsa-3`: Meja laboratorium pengujian kualitas air modern dengan mikroskop dan gelas ukur kaca.
4. `air-kadaluwarsa-4`: Interior jok dan bagasi mobil yang terpapar sinar matahari siang terik dari jendela kaca.
5. `air-kadaluwarsa-5`: Meja dapur rumah minimalis yang teduh, sejuk, dan rapi dengan pencahayaan lembut.

### B. Cutout Props PNG (`air-kadaluwarsa.props.json` - 8 Props Baru + 3 Meme Kucing)
1. `air-botol-expired`: Botol plastik air mineral bening dengan cap tanggal kadaluwarsa merah besar di bagian tengah.
2. `air-susu-basi`: Kotak kemasan susu putih yang menggembung dengan noda hijau tanda basi.
3. `air-tetes-murni`: Tetesan air biru jernih berkilau 3D yang sangat murni dan segar.
4. `air-botol-retak`: Botol plastik air mineral yang mulai kusam, penyok, dan tampak retak halus pada dinding plastiknya.
5. `air-mikroplastik`: Ilustrasi 3D realistis kaca pembesar yang menyorot serpihan partikel mikroplastik warna-warni di dalam air.
6. `air-panas-matahari`: Botol plastik air mineral yang melengkung kepanasan dengan efek terik matahari oranye menyengat.
7. `air-galon-sejuk`: Rak penyimpanan botol dan galon air minum di sudut ruangan yang teduh dan sejuk.
8. `air-tumbler-stainless`: Botol minum tumbler stainless steel modern warna perak mengkilap dengan titik embun segar.

## 6. Naskah Narasi (Hasil Suntingan `humanizer-indonesia` & `antislop-copywriting`) & Koreografi 6 Scene

- **Scene 1 (`hook`, 105 frame):**
  - Narasi: `"Air putih gak pernah basi, *kok botolnya ada kadaluwarsa*?"`
  - Visual: `air-botol-expired` + `meme-kucing-paw` + simbol `tanya` (`boing`, `womp`).
- **Scene 2 (`stage`, 125 frame):**
  - Narasi: `"Banyak yang ngira airnya bisa *jamuran* atau basi seperti susu, padahal umur air di bumi sudah *jutaan tahun* dan tetap segar."`
  - Visual: Salah kaprah air basi seperti susu (`meme-kucing-merenung` + `air-susu-basi` + simbol `larang` `slap`) -> berganti di kata `'padahal'` ke `air-tetes-murni` (`ding`).
- **Scene 3 (`beat`, 55 frame):**
  - Narasi: `"Oke, *sini gue jelasin* alasan sebenarnya."`
  - Visual: `'Oke, sini gue jelasin.'` + `meme-kucing-jelasin` (`boing`).
- **Scene 4 (`stage`, 140 frame):**
  - Narasi: `"Tanggal di kemasan itu sebenarnya batas umur *botol plastiknya*. Lewat dari *dua tahun*, ikatan plastik mulai rapuh sehingga partikel *mikroplastik* ikut luruh ke dalam air."`
  - Visual: Degradasi botol plastik PET setelah dua tahun (`air-botol-retak` + `air-mikroplastik`, aksi `move`, `shake`, `pulse`, `boom`, `womp`).
- **Scene 5 (`stage`, 140 frame):**
  - Narasi: `"Apalagi kalau botolnya keseringan kena *panas matahari* di dalam mobil, zat kimia *antimoni* dari dinding plastik akan larut dan mengubah rasa air jadi *pahit seperti plastik*."`
  - Visual: Efek panas matahari di mobil melarutkan antimoni (`air-panas-matahari` + `meme-kucing-titik` kena `squash` `slap` + simbol `larang`).
- **Scene 6 (`stage`, 125 frame):**
  - Narasi: `"Karena itu, simpan stok air minum di *tempat teduh*, atau tuang ke *botol stainless* supaya air putih kita *tetap aman* diminum."`
  - Visual: Solusi simpan di tempat teduh dan pakai botol stainless (`air-galon-sejuk` + `air-tumbler-stainless` + simbol `centang` `ding`).
