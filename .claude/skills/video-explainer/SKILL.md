---
name: video-explainer
description: Membuat video Cutout Motion Explainer 9:16 ("nahh gini") di src/explainer/ tanpa menyentuh engine sejarah. Alurnya rencana dulu (5 kandidat hook berskor, narasi, peta visual per klausa), baru props dan naskah; validator cek:explainer memaksa setiap klausa narasi punya visual. Narasi disaring antislop-copywriting + humanizer-indonesia, props cutout dari Google Flow Bridge, latar foto real per scene, subtitle kata-per-kata (faster-whisper). Pakai skill ini setiap kali user minta video explainer baru ("kenapa...", "kok bisa...", hitungan biaya, fisika/teknik sehari-hari).
---

# Video Explainer "nahh gini" (`src/explainer/`)

Kerjakan langkah 0-8 **berurutan**. Jangan lompat ke menulis `.ts` sebelum `.rencana.md` selesai.
Validator adalah hakim: kerjaan selesai kalau `npm run cek:explainer -- <slug>` hasilnya **0 error dan 0 peringatan**.
Setiap pesan validator berbentuk `lokasi: masalah → PERBAIKI: langkah`. Kerjakan langkah PERBAIKI-nya persis.

## Aturan Keras

1. Jangan sentuh engine sejarah: `src/HistoryVideo.tsx`, `src/Thumbnail.tsx`, `src/theme.ts`, `src/types.ts`, `src/scenes/*`, `src/components/*`, `src/data/*`.
2. File yang boleh diedit hanya milik video itu: `src/explainer/data/<slug>.{ts,rencana.md,props.json,latar.json,sumber.md}` dan `src/explainer/daftar.ts`.
3. Scene `hook`, `stage`, `diagram` wajib punya `latar: 'latar/<slug>-N.png'` yang unik per scene. Hanya `beat` yang tanpa latar. Jangan pakai `latarOpacity`/`latarBlur`.
4. `watermark: false` sampai nama channel final ditentukan.
5. Angka di `narasi` wajib huruf (`seratus ribu`, bukan `100.000`). Digit hanya boleh di `baris1`/`baris2`/teks panggung.
6. Koordinat item: `x` 8..92, `y` 12..76 (area aman Shorts). `width` dalam piksel: prop utama 300-420, pendamping 220-280, simbol 100-180.
7. Scene `beat` selalu: `teks: 'Oke, sini gue jelasin.'` + `props/meme-kucing-jelasin.png` (`masuk: 'pop'`, `sfx: 'boing'`).
8. Setiap klausa narasi punya visual yang **menggambarkan isi klausa itu** (dicek validator: V1, V3, V4). Kata benda yang disebut (mobil, tanggal, botol) harus kelihatan di layar saat diucapkan.
9. Setiap prop di `props.json` punya `untuk: "<frasa persis dari narasi>"` (dicek validator: V4).
10. Hanya pakai nilai dan field yang ada di `referensi/visual.md` (dicek validator: S1, S2).

## Alur Kerja

### Langkah 0: Kerangka
```bash
npm run baru:explainer -- <slug>
```
Membuat `.ts`, `.rencana.md`, `.props.json`, `.latar.json`, `.sumber.md`, dan mendaftarkan ke `daftar.ts`.

### Langkah 1: Riset
Tulis setiap fakta dan angka di `<slug>.sumber.md`, minimal 2 URL sumber. Fakta yang tidak ada sumbernya jangan masuk narasi.

### Langkah 2: Hook & judul (di `.rencana.md`, bagian `## Hook`)
Baca `referensi/hook-judul.md`. Tulis 5 kandidat, 1 per rumus, beri skor 5 kriteria (0-2), isi `Total`, lalu tulis `Terpilih: #N` untuk Total tertinggi (minimal 7). (dicek validator: R1, R2, H1-H4)

### Langkah 3: Narasi (di `.rencana.md`, bagian `## Narasi`)
Baca `referensi/narasi.md`. Tulis narasi per scene (5-7 scene: hook → stage salah kaprah → beat → stage/diagram fakta → stage penutup). Lalu jalankan skill `humanizer-indonesia` dan `antislop:antislop-copywriting` pada narasi itu.

### Langkah 4: Peta visual (di `.rencana.md`, bagian `## Peta Visual`)
Pecah narasi tiap scene per klausa (dipotong di `, . ? ! ; :`). Untuk **setiap** klausa tulis 1 baris: `Klausa | Visual | File | Aksi`.
- Visual = benda/karakter yang **disebut atau dimaksud** klausa itu. "di dalam mobil" → prop mobil. "Tanggal di kemasan" → prop label tanggal.
- File = nama file prop/simbol/teks. Prop baru tulis `props/<slug>-<nama>.png`.
- Aksi = gerak di kata pemicu, contoh `jump@botol`.
Tambahkan 2-3 momen komedi (meme reaksi, `peek`, teks celetukan). Lihat `referensi/visual.md`.

### Langkah 5: Props & latar dari peta
Isi `<slug>.props.json` dari kolom File peta: `{"name", "prompt", "untuk"}`. `untuk` = frasa klausa yang diilustrasikan. Isi `<slug>.latar.json` 1 latar per scene non-beat. Lalu generate:
```bash
node scripts/generate-props.mjs --cek
node scripts/generate-props.mjs --file src/explainer/data/<slug>.latar.json --utuh --style "clean realistic modern photography, natural colors, full-bleed edge-to-edge camera frame, no border, no frame, no vintage paper effect, no sepia, high detail"
node scripts/generate-props.mjs --file src/explainer/data/<slug>.props.json --style "clean realistic studio product photography cutout, crisp edges, natural colors, soft even lighting, high detail"
```
Hindari kata "banknote" atau nama mata uang di prompt (kena filter); pakai "3D stylized bundle of red paper notes with golden coins". Foto asli opsional: `node scripts/cari-foto.mjs "<kata kunci inggris>" --slug <slug> --limit 4 --min-width 800`, pasang dengan `bingkai: true`.

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
node scripts/cek-frame.mjs <slug>
node scripts/storyboard.mjs <slug>
node scripts/render.mjs <slug> --preview
node scripts/render.mjs <slug> --final
node scripts/paket-youtube.mjs <slug>
```
Periksa `out/cek/<slug>-lembar.jpg` dan `out/storyboard/<slug>-1.jpg`: tidak ada visual menumpuk, keluar area aman, atau layar kosong.

Semua hasil akhir ada di `out/explainer/<slug>/`: `<slug>.mp4`, `<slug>-720p.mp4`, `<slug>-preview.mp4`, `youtube.txt` (bagian `=== JUDUL ===`, `=== DESKRIPSI ===`, `=== TAGS ===` dalam 1 file), `subtitle.id.srt`, `thumbnail.jpg`, `thumbnail-kecil.jpg`.

## Definisi Selesai

- `.rencana.md` lengkap tanpa `TODO`, hook terpilih skor >= 7.
- `npm run cek:explainer -- <slug>` → `✓ LULUS ... 0 peringatan`.
- `--peta` tidak menampilkan `(kosong) ✗`, dan setiap benda yang disebut narasi kelihatan di klausanya.
- Storyboard dicek visual (setelah audio ada).

## Referensi

- `referensi/hook-judul.md`: 5 rumus hook, rubrik skor, aturan judul thumbnail.
- `referensi/narasi.md`: saringan antislop + humanizer, contoh sebelum/sesudah.
- `referensi/visual.md`: katalog masuk/keluar/aksi/simbol/SFX/meme sesuai engine, pola koreografi, tata letak.
- `referensi/contoh-scene.md`: 1 scene lengkap yang lolos validator, untuk ditiru.
