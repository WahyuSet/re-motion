---
name: video-explainer
description: Membuat video Cutout Motion Explainer 9:16 ("nahh gini") di src/explainer/ tanpa menyentuh engine sejarah. Alurnya rencana dulu (5 kandidat hook berskor, narasi, peta visual per klausa), baru props dan naskah; validator cek:explainer memaksa setiap klausa narasi punya visual. Narasi lisan diperiksa validator (kalimat pendek, tanpa gaya buku pelajaran, tanpa rujukan kabur), props cutout dari Google Flow Bridge, latar foto real per scene, subtitle kata-per-kata (faster-whisper). Pakai skill ini setiap kali user minta video explainer baru ("kenapa...", "kok bisa...", hitungan biaya, fisika/teknik sehari-hari).
---

# Video Explainer "nahh gini" (`src/explainer/`)

Kerjakan langkah 0-8 **berurutan**. Jangan lompat ke menulis `.ts` sebelum `.rencana.md` selesai.
Validator adalah hakim: kerjaan selesai kalau `npm run cek:explainer -- <slug>` hasilnya **0 error dan 0 peringatan**.
Setiap pesan validator berbentuk `lokasi: masalah → PERBAIKI: langkah`. Kerjakan langkah PERBAIKI-nya persis.

## Aturan Keras

1. Jangan sentuh engine sejarah: `src/HistoryVideo.tsx`, `src/Thumbnail.tsx`, `src/theme.ts`, `src/types.ts`, `src/scenes/*`, `src/components/*`, `src/data/*`.
2. File yang boleh diedit hanya milik video itu: `src/explainer/data/<slug>.{ts,rencana.md,props.json,latar.json,sumber.md}` dan `src/explainer/daftar.ts`.
3. Scene `hook`, `stage`, `diagram` wajib punya `latar: 'latar/<slug>-N.png'` yang unik per scene. Hanya `beat` yang tanpa latar. Jangan pakai `latarOpacity`/`latarBlur`.
4. `watermark: '@okesini-id'` (nama channel final, tampil di pojok kiri atas). Video LEGACY lama boleh tetap `false`.
5. Angka di `narasi` wajib huruf (`seratus ribu`, bukan `100.000`). Digit hanya boleh di `baris1`/`baris2`/teks panggung.
6. Posisi dicek dari **tepi kotak** prop (lebar = `width`, tinggi = `width` × rasio PNG asli), bukan titik tengahnya. Keempat tepi harus di area aman Shorts: kiri ≥ 7%, **kanan ≤ 86%** (sisi kanan tertutup tombol), atas ≥ 13%, bawah ≤ 78%. Tepi atas di bawah judul (hook ≥ 28%, stage berjudul ≥ 22%), tepi bawah di atas subtitle (≤ 73,5%). Prop potret tinggi (meteran, tiang, botol) butuh `width` kecil. `width` dalam piksel: prop utama 300-420, pendamping 220-280, simbol 100-180. (dicek validator: A1, L1, L2)
7. Scene `beat` selalu: tanpa `latar`, `teks: 'Oke, sini gue jelasin.'` (persis), dan item `props/meme-kucing-jelasin.png` (`masuk: 'pop'`, **tanpa** `sfx`, karena banner sudah berbunyi pop). Narasinya boleh dilanjutkan: "Oke, *sini gue jelasin* penyebabnya." (dicek validator: B1-B4)
8. Setiap klausa narasi punya visual yang **menggambarkan isi klausa itu** (dicek validator: V1, V3, V4). Kata benda yang disebut (mobil, tanggal, botol) harus kelihatan di layar saat diucapkan.
9. Setiap prop di `props.json` punya `untuk: "<frasa persis dari narasi>"` (dicek validator: V4).
10. Hanya pakai nilai dan field yang ada di `referensi/visual.md` (dicek validator: S1, S2).
11. Frame 0 hook harus lengkap: `utama` wajib ada dengan `masuk: 'none'`, `delay: 0`, tanpa `di`; gerakannya lewat `aksi`. Judul hook sudah statis di frame 0. Alasannya data channel: 88,8% penonton datang dari feed Shorts dan ±48% menggeser di detik pertama (dicek validator: H6).

## Alur Kerja

### Langkah 0: Kerangka
```bash
npm run baru:explainer -- <slug>
```
Membuat `.ts`, `.rencana.md`, `.props.json`, `.latar.json`, `.sumber.md`, dan mendaftarkan ke `daftar.ts`.

### Langkah 1: Riset
Tulis setiap fakta dan angka di `<slug>.sumber.md`, minimal 2 URL sumber. Fakta yang tidak ada sumbernya jangan masuk narasi. `sumber.md` itu **catatan**, boleh bergaya laporan; **jangan salin kalimatnya ke narasi**. Narasi ditulis ulang seperti orang bercerita (lihat `referensi/narasi.md`).

### Langkah 2: Hook & judul (di `.rencana.md`, bagian `## Hook`)
Baca `referensi/hook-judul.md`. Tulis 5 kandidat, 1 per rumus, beri skor 5 kriteria (0-2), isi `Total`, lalu tulis `Terpilih: #N` untuk Total tertinggi (minimal 7). Lalu isi bagian `## Thumbnail`: **Subjek lengkap** (benda + tempatnya), **Gambar** (prop yang menampilkan subjek lengkap, bukan potongannya), dan **Uji 1 detik**. Judul wajib memuat semua kata penting subjek, jadi bisa dipahami tanpa video. (dicek validator: R1-R3, H1-H5, T1)

### Langkah 3: Narasi (di `.rencana.md`, bagian `## Narasi`)
Baca `referensi/narasi.md`. Tulis narasi per scene (5-7 scene: hook → stage salah kaprah → beat → stage/diagram fakta → stage penutup). Lalu jalankan checklist "uji baca keras" di `referensi/narasi.md`. **Jangan pakai skill `humanizer-indonesia`**: skill itu dikalibrasi untuk tulisan akademik dan justru membuat naskah lisan kaku. (dicek validator: N1-N5)

### Langkah 3b: Komedi (di `.rencana.md`, bagian `## Komedi`)
Meme dan SFX bukan komedi; yang bikin ketawa adalah **kalimat joke di narasi**. Tulis 2-3 joke ke narasi pakai rumus di `referensi/narasi.md` bagian "Komedi", lalu isi tabel `| # | Jenis | Kalimat joke | Punchline | Visual gag |`. Punchline = kata lucu di **1-3 kata terakhir** kalimat. Setiap punchline wajib punya visual gag besar (prop/meme width >= 240 atau teks) dengan `di` di kata punchline dan SFX komedi. (dicek validator: K1-K3)

### Langkah 4: Peta visual (di `.rencana.md`, bagian `## Peta Visual`)
Pecah narasi tiap scene per klausa (dipotong di `, . ? ! ; :`). Untuk **setiap** klausa tulis 1 baris: `Klausa | Visual | File | Aksi`.
- Visual = benda/karakter yang **disebut atau dimaksud** klausa itu. "di dalam mobil" → prop mobil. "Tanggal di kemasan" → prop label tanggal.
- File = nama file prop/simbol/teks. Prop baru tulis `props/<slug>-<nama>.png`.
- Aksi = gerak di kata pemicu, contoh `jump@botol`.
Baris klausa punchline memakai visual gag dari tabel `## Komedi`. Meme reaksi, `peek`, dan teks celetukan cuma bumbu tambahan. Lihat `referensi/visual.md`.

### Langkah 5: Props & latar dari peta
Isi `<slug>.props.json` dari kolom File peta: `{"name", "prompt", "untuk"}`. `untuk` = frasa klausa yang diilustrasikan. Isi `<slug>.latar.json` 1 latar per scene non-beat. **Latar tidak boleh memuat benda yang juga jadi prop** (rice cooker, kulkas, tiang listrik, dsb.), karena prop akan menyatu dengan foto. Flow **mengabaikan larangan** seperti "no utility poles"; gambarkan pemandangan yang memang tidak punya benda itu (langit di atas atap, dinding polos), dan pilih latar yang kontras dengan warna prop. Lalu generate:
```bash
node scripts/generate-props.mjs --cek
node scripts/generate-props.mjs --file src/explainer/data/<slug>.latar.json --utuh --style "clean realistic modern photography, natural colors, full-bleed edge-to-edge camera frame, no border, no frame, no vintage paper effect, no sepia, high detail"
node scripts/generate-props.mjs --file src/explainer/data/<slug>.props.json --style "clean realistic studio product photography cutout, crisp edges, natural colors, soft even lighting, high detail"
```
`generate-props` otomatis menambahkan "single isolated object" ke prompt, jadi prop yang butuh konteks (kulkas dengan pintu terbuka, tiang dengan kabelnya) **wajib menyebut konteks itu di prompt**. Objek berwarna hijau digenerate dengan `--bg magenta` supaya tidak ikut terhapus. Uang di video Indonesia **wajib rupiah asli**, jangan uang fiktif atau dolar. Prompt yang lolos Flow (dicoba 2026-11-12): "neat stack of Indonesian rupiah banknotes, red one hundred thousand rupiah notes on top with blue fifty thousand rupiah notes underneath, slightly fanned out, realistic paper texture". Layar HP/aplikasi: minta "no numbers, no currency symbols" supaya tidak muncul dolar. Foto asli opsional: `node scripts/cari-foto.mjs "<kata kunci inggris>" --slug <slug> --limit 4 --min-width 800`, pasang dengan `bingkai: true`.

### Langkah 6: Tulis naskah `.ts`
Salin peta ke `src/explainer/data/<slug>.ts`. Setiap baris peta = 1 item atau 1 aksi dengan `di` = kata pertama klausa / kata pemicu. Contoh lengkap: `referensi/contoh-scene.md`. Isi `thumbnail` dari hook terpilih.

### Langkah 7: Validasi
```bash
npm run cek:explainer -- <slug> --peta
```
`--peta` mencetak tiap klausa dan visualnya; klausa bertanda `(kosong) ✗` wajib diisi. Ulangi sampai **0 error, 0 peringatan**. Lalu `node scripts/narasi.mjs <slug>` untuk naskah TTS.

### Langkah 8: Audio, cek frame, render
Setelah user memberi file audio TTS:
```bash
node scripts/potong-narasi.mjs <slug> "<path-file-audio>"
```
Aktifkan `narasiAudio: 'audio/<slug>'` dan `narasiExt: 'wav'`, jalankan Langkah 7 lagi, lalu:
```bash
node scripts/cek-frame.mjs <slug> --rapat
node scripts/storyboard.mjs <slug>
node scripts/render.mjs <slug> --preview
node scripts/render.mjs <slug> --final
node scripts/paket-youtube.mjs <slug>
```
`--rapat` mengambil frame di setiap item masuk dan saat serah-terima, bukan cuma 35%/85%. Periksa `out/cek/<slug>-lembar.jpg` dan `out/storyboard/<slug>-1.jpg`: tidak ada visual menumpuk, keluar area aman, atau layar kosong.

Semua hasil akhir ada di `out/explainer/<slug>/`: `<slug>.mp4`, `<slug>-720p.mp4`, `<slug>-preview.mp4`, `youtube.txt` (bagian `=== JUDUL ===`, `=== DESKRIPSI ===`, `=== TAGS ===` dalam 1 file), `subtitle.id.srt`, `thumbnail.jpg`, `thumbnail-kecil.jpg`.

## Definisi Selesai

- `.rencana.md` lengkap tanpa `TODO`, hook terpilih skor >= 7, minimal 2 joke di `## Komedi`.
- `npm run cek:explainer -- <slug>` → `✓ LULUS: <slug> (... 0 error, 0 peringatan)`. Kalau yang muncul `⚠ BELUM SELESAI`, belum selesai: kerjakan setiap PERBAIKI.
- Total durasi ≤ 60 detik (dicek validator: D3).
- `--peta` tidak menampilkan `(kosong) ✗`, dan setiap benda yang disebut narasi kelihatan di klausanya.
- `cek-frame --rapat` dan storyboard dicek visual (setelah audio ada): tidak ada prop di area merah, menumpuk, atau menabrak judul/subtitle.

## Video Patokan

Tiga video ini lolos validator tanpa peringatan dan sudah dirender final. **Sebelum Langkah 2, buka patokan yang cetakannya paling mirip dengan topikmu** dan tiru strukturnya (urutan scene, jumlah item, pola aksi, cara memilih latar). Isi file: `src/explainer/data/<slug>.{rencana.md,ts,props.json,latar.json,sumber.md}`.

| Slug | Cetakan | Rumus hook | Yang dicontohkan |
|---|---|---|---|
| `nasi-warm` | sains dapur / salah kaprah (scene `stage` saja) | kontras-angka | sebab-akibat dengan `move`, punchline hiperbola ("keras kayak kerupuk"), `peek` |
| `potongan-gaji` | hitungan potongan uang | kontras-angka | scene `diagram` mode `potongan` 4 langkah, prop pendamping berganti tiap langkah di `y` 66, uang rupiah asli |
| `kabel-kendor` | fisika/teknik di jalan, dua keadaan | taruhan | siang vs malam, kendor vs kencang, latar langit/dinding polos supaya prop tipis tetap kontras |

Topik baru yang tidak cocok dengan ketiganya tetap boleh; ambil patokan terdekat dan sebutkan bedanya di `.rencana.md`. Ketiga patokan dijaga test `tests/explainer/patokan.test.mjs`: kalau aturan validator berubah dan patokan jadi gagal, perbaiki patokannya juga.

Patokan dibuat sebelum aturan komedi K1-K3 (daftar `KOMEDI_LAMA` di `scripts/lib/explainer-cek/komedi.mjs`), jadi **jangan tiru narasinya untuk soal komedi**: ambil rumus joke dari `referensi/narasi.md`. Video baru tidak boleh dimasukkan ke `KOMEDI_LAMA`.

## Referensi

- `referensi/hook-judul.md`: 5 rumus hook, rubrik skor, aturan judul thumbnail.
- `referensi/narasi.md`: aturan narasi lisan (N1-N5), arti kata penghubung, contoh sebelum/sesudah dari video nyata.
- `referensi/visual.md`: katalog masuk/keluar/aksi/simbol/SFX/meme sesuai engine, pola koreografi, tata letak.
- `referensi/contoh-scene.md`: 1 scene lengkap yang lolos validator, untuk ditiru.
