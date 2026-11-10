---
name: video-explainer
description: Membuat video Cutout Motion Explainer 9:16 ("nahh gini") di src/explainer/ tanpa menyentuh engine sejarah. Menggabungkan cutout objek PNG realistis (Google Flow Bridge) + foto asli berbingkai hitam (Wikimedia Commons), diagram interaktif (potongan biaya & grid bata), subtitle 1-baris di bawah, serta sinkronisasi kata-per-kata (faster-whisper). Pakai skill ini setiap kali user minta video explainer baru ("kenapa...", "kok bisa...", hitungan biaya, fisika/teknik sehari-hari).
---

# Video Explainer — Tema `"nahh gini"` (`src/explainer/`)

Ikuti langkah 0–7 **berurutan**. Engine ini **100% terpisah** dari engine sejarah (`src/data/`).

## Aturan Keras

1. **Jangan sentuh Engine Sejarah:** Dilarang mengubah `src/HistoryVideo.tsx`, `src/Thumbnail.tsx`, `src/theme.ts`, `src/types.ts`, `src/scenes/*`, `src/components/*`, atau `src/data/daftar.ts`.
2. **Hanya edit file milik video explainer itu:** `src/explainer/data/<slug>.ts`, `src/explainer/data/<slug>.props.json`, `src/explainer/data/<slug>.sumber.md`, dan `src/explainer/daftar.ts`.
3. **Watermark default:** Selalu gunakan `watermark: 'nahh gini'`.
4. **Anti Layar Kosong (Zero Dead Air):**
   - **Detik `0.0s` di setiap scene wajib punya visual pembuka** (`delay: 0` atau `di` pada 1–2 kata pertama). Saat kalimat pembuka berupa pertanyaan (*"Kenapa bisa beda?"*, *"Banyak yang mengira..."*), tampilkan karakter ekspresif sedang berpikir (`props/token-mikir.png` atau sejenisnya) + simbol `tanya` (`?`).
   - **Setiap klausa yang diucapkan harus punya pasangan visual** yang muncul tepat di kata pemicunya (`di: '<kata>'`). Jangan biarkan ada jeda `> 2,5 detik` tanpa perubahan visual.
   - Saat berganti fase di dalam 1 scene, **samakan kata `sampai` objek lama dan `di` objek baru** (contoh: `sampai: 'melainkan'` dan `di: 'melainkan'`) agar tidak ada celah layar kosong 0,5 detik di antaranya, dan hindari menaruh objek baru di koordinat `x, y` yang persis menimpa objek yang sedang `fade` keluar.
5. **Kombinasi Visual Wajib (Cutout PNG + Foto Asli Berbingkai):**
   - Gunakan **cutout PNG transparan realistis** dari `scripts/generate-props.mjs` dengan style:
     `--style "clean realistic studio product photography cutout, crisp edges, natural colors, soft even lighting, high detail"`
     *(Catatan: hindari kata `"banknote"` atau mata uang negara asli di prompt Flow karena kena filter kebijakan; gunakan `"3D stylized bundle of red paper notes with golden coins"`).*
   - Kombinasikan dengan **foto asli dari Wikimedia Commons** (`scripts/cari-foto.mjs`) menggunakan `bingkai: true` pada `StageItem`.
6. **Wajib Sisipkan Humor & Komedi Visual (Gaya Khas `"nahh gini"`):**
   - Setiap naskah explainer **wajib memiliki minimal 2–3 momen komedi/celetukan relatable** (baik di narasi maupun visual gag di panggung) agar tidak kaku seperti buku pelajaran.
   - Gunakan resep komedi di bagian **Resep Humor & Komedi Visual** di bawah.
7. **Validasi Wajib:** Setiap selesai mengedit naskah, jalankan:
   ```bash
   npm run cek:explainer -- <slug>
   ```
   Pastikan lulus dengan `0 error` dan `0 peringatan`.

---

## Resep Humor & Komedi Visual (`"nahh gini"`)

Engine `src/explainer/` sudah memiliki fitur animasi komedi bawaan di [`Stage.tsx`](../../../src/explainer/Stage.tsx) dan [`timing.ts`](../../../src/explainer/timing.ts). Gunakan 4 teknik ini di setiap video:

1. **Analogi Receh & Celetukan Relatable di Narasi:**
   - Selipkan 1 kalimat celetukan sehari-hari yang dekat dengan penonton Indonesia di Scene 1 (Hook) atau Scene 2 (Salah Kaprah).
   - *Contoh:* `"Bunyi tit-tit meteran pas tengah malem itu horornya ngalahin film setan"`, atau `"Bata disusun lurus itu kayak temen kelompok yang cuma numpang nama, diteken dikit langsung ambyar."`
2. **Visual Gag "Ngintip" (`aksi: [{type: 'peek'}]`):**
   - Saat narasi melempar punchline atau sindiran singkat, munculkan karakter/kucing/ekspresi kaget yang **nongol miring dari pinggir layar lalu ngumpet lagi**:
     ```ts
     aksi: [{type: 'peek', di: 'kata punchline', dx: -90, dy: -20, rotate: -14, durasi: 10, tahan: 14}]
     ```
3. **Slapstick Fisik (`drop` + `shake` + `grow` gepeng):**
   - Objek jatuh menimpa sesuatu (`masuk: 'drop'`) diikuti objek di bawahnya bergetar (`type: 'shake', intensitas: 14`) atau penyet/gepeng (`type: 'grow', toScaleX: 1.25, toScaleY: 0.72`).
4. **Label Celetukan Mikro (Micro-Gag Text):**
   - Tambahkan `StageItem` `kind: 'teks'` ukuran kecil (`ukuran: 28–32`, `rotate: -6`) di dekat prop sebagai komentar komedi visual yang tidak perlu diucapkan di narasi (contoh: label `"Dompet menangis"` di dekat potongan pajak, atau `"Beban hidup 100 kg"` di atas beban bata).

---

## Alur Kerja Langkah demi Langkah

### Langkah 0 — Siapkan Kerangka Video Baru
```bash
npm run baru:explainer -- <slug>
```
Membuat `src/explainer/data/<slug>.ts`, `<slug>.props.json`, `<slug>.sumber.md`, dan mendaftarkan komposisi di `src/explainer/daftar.ts`.

### Langkah 1 — Riset & Catat Sumber Fakta
Tulis fakta dan angka acuan (tarif resmi, rumus fisika, aturan daerah, dsb.) beserta minimal 2 URL sumber di `src/explainer/data/<slug>.sumber.md`.

### Langkah 2 — Generate Cutout PNG (Flow Bridge) & Cari Foto Asli (Wikimedia)
1. Isi daftar objek di `src/explainer/data/<slug>.props.json`, cek koneksi bridge, lalu generate:
   ```bash
   node scripts/generate-props.mjs --cek
   node scripts/generate-props.mjs --file src/explainer/data/<slug>.props.json --style "clean realistic studio product photography cutout, crisp edges, natural colors, soft even lighting, high detail"
   ```
2. Cari foto pendukung nyata dari Wikimedia Commons:
   ```bash
   node scripts/cari-foto.mjs "<kata kunci inggris>" --slug <slug> --limit 4 --min-width 800
   ```
3. Lihat hasil foto di `public/photos/<slug>/_contact-sheet.jpg` dan pilih yang paling jelas untuk dipasang dengan `bingkai: true`.

### Langkah 3 — Tulis Naskah & Rancang Visual per Kalimat
Susun 5–7 scene (`hook` → `stage` → `beat` `"nah"` → `diagram` / `stage` → `stage` penutup):
- Semua angka di dalam `narasi` **wajib ditulis sebagai kata huruf** (`seratus ribu`, `enam puluh satu koma tiga`).
- Semua `width` pada `StageItem` menggunakan satuan **piksel** (contoh: prop utama `300–420`, prop pendamping `220–280`, simbol `100–180`).
- Semua koordinat `x, y` wajib berada di area aman Shorts (`x: 8..92`, `y: 12..76`).
- Jalankan `npm run cek:explainer -- <slug>` dan `node scripts/narasi.mjs <slug>`.

### Langkah 4 — Potong Audio TTS & Sinkronkan Timestamp Kata
Setelah user memberikan file audio TTS utuh:
```bash
node scripts/potong-narasi.mjs <slug> "<path-file-audio>"
```
Aktifkan `narasiAudio: 'audio/<slug>'` dan `narasiExt: 'wav'` di `src/explainer/data/<slug>.ts`, lalu jalankan ulang `npm run cek:explainer -- <slug>`.

### Langkah 5 — Cek Frame & Storyboard
```bash
node scripts/cek-frame.mjs <slug>
node scripts/storyboard.mjs <slug>
```
Periksa `out/cek/<slug>-lembar.jpg` dan `out/storyboard/<slug>-1.jpg` untuk memastikan tidak ada visual yang menumpuk, keluar area aman merah, atau kosong.

### Langkah 6 — Render Preview, Final, & Paket YouTube
```bash
node scripts/render.mjs <slug> --preview
node scripts/render.mjs <slug> --final
node scripts/paket-youtube.mjs <slug>
```

---

## Backlog Penyempurnaan Engine (Terapkan Saat Mulai Video ke-2)

Catatan evaluasi jujur dari produksi video perdana (`token-listrik`) yang harus diterapkan ke engine `src/explainer/` pada video berikutnya:

1. **Default Keluar `pop-out` Cepat (Anti-Ghosting) di [`src/explainer/timing.ts`](../../../src/explainer/timing.ts):**
   - Ubah default `item.keluar` dari `'fade'` (12 frame linear) menjadi `'pop-out'` cepat (6–8 frame mengecil + hilang) agar objek lama tidak meninggalkan bayangan transparan di belakang objek baru yang masuk di tempat yang sama.
2. **Lookahead Anti-Kata Yatim (Orphan Word) di `potongFrasa` ([`src/explainer/timing.ts`](../../../src/explainer/timing.ts)):**
   - Saat memotong subtitle per 5 kata / 28 karakter, cek 1 kata berikutnya (`words[i + 1]`). Jika kata berikutnya diakhiri tanda baca kalimat (`/[.,!?;:]$/`), gabungkan ke frasa saat ini agar tidak ada subtitle 1 kata sendirian seperti `"rupiah."` atau `"persen."`.
3. **Label Dinamis `"Sisa Bersih"` pada `DiagramScene` (`mode: 'potongan'`) ([`src/explainer/scenes/DiagramScene.tsx`](../../../src/explainer/scenes/DiagramScene.tsx)):**
   - Saat potongan langkah ke-1 sudah aktif (`activeSteps.length > 0`), ubah teks label bar utama dari `scene.awal.label` (`"Beli Token"`) menjadi `"Sisa Bersih"` agar selaras dengan nominal yang sudah berkurang (`Rp97.500` -> `Rp88.637`).
4. **Filter SFX `pop` di Awal Scene (`masukAt <= 2`) ([`src/explainer/Stage.tsx`](../../../src/explainer/Stage.tsx)):**
   - Jangan bunyikan `<Sfx name="pop" at={masukAt} />` untuk item pembuka yang sudah tampil sejak awal scene (`masukAt <= 2`), supaya perpindahan antar-scene tidak selalu diawali bunyi `pop` yang monoton.
5. **Jarak Vertikal Item Kanan di `HookScene` / `StageScene`:**
   - Beri jarak vertikal minimal `16–18%` antar-item yang ditumpuk di sisi yang sama agar badge teks, simbol `?`, dan prop tidak saling bersentuhan.
