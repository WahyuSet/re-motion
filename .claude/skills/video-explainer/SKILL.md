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

## Sistem Komedi 3 Pilar (`"nahh gini"`)

Engine `src/explainer/` mendukung **3 pilar komedi terintegrasi** di [`Stage.tsx`](../../../src/explainer/Stage.tsx), [`timing.ts`](../../../src/explainer/timing.ts), dan [`buat-sfx-explainer.mjs`](../../../scripts/buat-sfx-explainer.mjs). Setiap video baru wajib mengombinasikan ketiganya:

### 1. Pilar Narasi (Analogi Receh & Celetukan Relatable)
- Selipkan 2–3 kalimat celetukan sehari-hari yang dekat dengan penonton Indonesia (di Hook, Salah Kaprah, atau Penutup).
- Hindari bahasa kaku seperti buku teks; gunakan perbandingan sehari-hari yang jenaka:
  - *Contoh:* `"Bunyi tit-tit meteran pas tengah malem itu horornya ngalahin film setan."`
  - *Contoh:* `"Bata disusun lurus itu kayak temen kelompok yang cuma numpang nama, diteken dikit langsung ambyar."`

### 2. Pilar SFX Komedi (`public/sfx/*.wav` + properti `sfx` di `StageItem` / `StageAction`)
Generator [`scripts/buat-sfx-explainer.mjs`](../../../scripts/buat-sfx-explainer.mjs) menyediakan 5 SFX komedi khusus selain SFX dasar (`pop`, `whoosh`, `tick`, `chime`, `sub`). Pasang lewat `sfx: '<nama>'` pada `StageItem` atau `StageAction` (atau `sfx: false` untuk membungkam):
- **`boing`** (`sfx/boing.wav`): Pegas komedi naik-turun (*otomatis berbunyi pada aksi `type: 'peek'`*, atau pasang di prop kaget/muncul nyeleneh).
- **`boom`** (`sfx/boom.wav`): Dentuman bass punchline (cocok saat fakta mengejutkan, potongan pajak muncul, atau beban jatuh menimpa).
- **`womp`** (`sfx/womp.wav`): Trombone sedih turun nada *womp-womp* (cocok saat salah kaprah terbongkar, dompet menangis, atau eksperimen gagal/roboh).
- **`slap`** (`sfx/slap.wav`): Tamparan/tepuk jidat komedi (cocok untuk simbol `silang` ❌ besar, stempel bantahan, atau objek penyet).
- **`ding`** (`sfx/ding.wav`): Lonceng cling terang (*otomatis berbunyi pada simbol `centang` ✅*, atau saat ide/jawaban benar muncul).

Contoh penggunaan di naskah:
```ts
{
  kind: 'prop',
  src: 'props/dompet-nangis.png',
  x: 74,
  y: 44,
  width: 240,
  di: 'dipotong',
  masuk: 'drop',
  sfx: 'womp',
  aksi: [
    {type: 'shake', di: 'habis', intensitas: 14, durasi: 18, sfx: 'boom'},
  ],
}
```

### 3. Pilar Visual Props & Gag Fisik
- **Cutout Karakter/Prop Komedi (Google Flow Bridge):** Di setiap `<slug>.props.json`, siapkan minimal **1–2 cutout prop khusus komedi/reaksi** (misal: karakter tepuk jidat, dompet kosong berdebu, kucing melongo, beban raksasa) dengan prompt `--style "clean realistic studio product photography cutout, crisp edges, natural colors, soft even lighting, high detail"`.
- **Visual Gag "Ngintip" (`type: 'peek'`):** Objek nongol miring dari pinggir layar dengan bunyi `boing` otomatis lalu sembunyi lagi:
  ```ts
  aksi: [{type: 'peek', di: 'kata punchline', dx: -18, dy: -6, rotate: -16, durasi: 12, tahan: 24}]
  ```
- **Slapstick Fisik (`drop` + `shake` + `grow` gepeng):** Objek jatuh (`masuk: 'drop', sfx: 'boom'`) menimpa objek di bawahnya hingga gepeng (`type: 'grow', toScaleX: 1.25, toScaleY: 0.72, sfx: 'slap'`).
- **Label Celetukan Mikro (Micro-Gag Text):** `StageItem` `kind: 'teks'` ukuran `28–32` miring (`rotate: -6`) di dekat prop sebagai komentar sarkas singkat yang tidak perlu dibaca narator (contoh: `"Dompet menangis"`, `"Beban hidup"`).

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

## Penyempurnaan Engine yang Sudah Aktif (Sejak Evaluasi `token-listrik`)

1. **Default Keluar `pop-out` Cepat (8 Frame Anti-Ghosting) di [`src/explainer/timing.ts`](../../../src/explainer/timing.ts):**
   - Default `item.keluar` kini adalah `'pop-out'` (8 frame mengecil + hilang) agar objek lama tidak meninggalkan bayangan transparan di atas objek baru.
2. **Lookahead Anti-Kata Yatim (Orphan Word) di `potongFrasa` ([`src/explainer/timing.ts`](../../../src/explainer/timing.ts)):**
   - Kata penutup kalimat (`/[.,!?;:]$/`) otomatis digabung ke frasa sebelumnya bila masih muat (`<= maxHuruf + 8`) sehingga tidak ada subtitle 1 kata sendirian seperti `"rupiah."` atau `"persen."`.
3. **Label Dinamis `"Sisa Bersih"` pada `DiagramScene` (`mode: 'potongan'`) ([`src/explainer/scenes/DiagramScene.tsx`](../../../src/explainer/scenes/DiagramScene.tsx)):**
   - Saat potongan langkah ke-1 sudah aktif (`activeSteps.length > 0`), label bar utama otomatis berubah dari `scene.awal.label` menjadi `"Sisa Bersih"`.
4. **Filter SFX `pop` di Awal Scene (`masukAt <= 2`) & 5 SFX Komedi ([`src/explainer/Stage.tsx`](../../../src/explainer/Stage.tsx)):**
   - Item pembuka di awal scene (`masukAt <= 2`) tidak memicu bunyi `pop` otomatis kecuali diberi `item.sfx` eksplisit.
5. **Aturan Tata Letak Vertikal (`HookScene` / `StageScene`):**
   - Beri jarak vertikal minimal `16–18%` antar-item yang ditumpuk di sisi yang sama agar badge teks, simbol `?`, dan prop tidak saling bersentuhan.
