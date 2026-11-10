---
name: video-explainer
description: Membuat video Cutout Motion Explainer 9:16 ("nahh gini") di src/explainer/ tanpa menyentuh engine sejarah. Menggabungkan cutout objek PNG realistis (Google Flow Bridge) + foto asli berbingkai hitam (Wikimedia Commons), diagram interaktif (potongan biaya & grid bata), subtitle 1-baris di bawah, serta sinkronisasi kata-per-kata (faster-whisper). Pakai skill ini setiap kali user minta video explainer baru ("kenapa...", "kok bisa...", hitungan biaya, fisika/teknik sehari-hari).
---

# Video Explainer — Tema `"nahh gini"` (`src/explainer/`)

Ikuti langkah 0–7 **berurutan**. Engine ini **100% terpisah** dari engine sejarah (`src/data/`).

## Aturan Keras

1. **Jangan sentuh Engine Sejarah:** Dilarang mengubah `src/HistoryVideo.tsx`, `src/Thumbnail.tsx`, `src/theme.ts`, `src/types.ts`, `src/scenes/*`, `src/components/*`, atau `src/data/daftar.ts`.
2. **WAJIB Full Real Background Unik per Scene (100% Opasitas, Foto Modern Tanpa Bingkai/Sepia):**
   > ⛔ **PERINGATAN KERAS:** Setiap scene cerita & diagram (`type: 'hook'`, `'stage'`, `'diagram'`) **WAJIB** memiliki properti `latar: 'latar/<slug>-N.png'` yang diisi **foto lokasi modern real 100%** (*full-bleed edge-to-edge*, warna natural, **dilarang efek lukisan/sepia/bingkai kertas tua**, bukan warna krem polos, bukan transparan, bukan blur). Hanya scene jeda `type: 'beat'` yang menggunakan kanvas krem. Validator `npm run cek:explainer` akan langsung **GAGAL (ERROR)** bila ada scene non-beat tanpa `latar`.
   - Latar di-generate via Flow Bridge utuh (`--utuh` wajib memakai style fotografi modern full-frame tanpa bingkai/sepia):
     ```bash
     node scripts/generate-props.mjs --file src/explainer/data/<slug>.latar.json --utuh --style "clean realistic modern photography, natural colors, full-bleed edge-to-edge camera frame, no border, no frame, no vintage paper effect, no sepia, high detail"
     ```
   - Dilarang menduplikasi gambar latar yang sama di scene berbeda (tiap scene punya sudut/lokasi unik).
   - Dilarang memakai `latarOpacity` atau `latarBlur` (engine otomatis me-render 100% tajam dengan *slow zoom*).
3. **Hanya edit file milik video explainer itu:** `src/explainer/data/<slug>.ts`, `src/explainer/data/<slug>.props.json`, `src/explainer/data/<slug>.latar.json`, `src/explainer/data/<slug>.sumber.md`, dan `src/explainer/daftar.ts`.
4. **Watermark default:** Kosongkan dulu (`watermark: false`) di naskah sampai nama channel final ditentukan.
4a. **Desain Thumbnail & Aturan Penulisan Judul (`thumbnail` & `HookScene`):**
   - **Desain Thumbnail (`ExplainerThumb.tsx`):** Menggunakan foto lokasi real (`thumbnail.latar` atau otomatis dari `hook.latar`) yang digelapkan dengan gradien sinematik (`#0b131b`), dipadukan dengan **`baris1` ber-outline putih tebal** dan **`baris2` di atas pita stabilo kuning (`#f5c518`) ber-outline putih** serta *auto-scale* ukuran font (`fitThumbFontSize`) agar selalu tampil 1 baris utuh per klausa.
   - **Aturan Penulisan Judul (Singkat, Padat, Jelas, & Utuh Secara Logika):**
     - Maksimal **28 karakter per baris** (`2-5 kata` per baris). Validator `cek-explainer.mjs` akan memberi peringatan bila melebihi 28 karakter.
     - **Jaga Jembatan Logika & Bahasa Natural:** Jangan memotong kata sampai maknanya lompat atau kaku seperti robot. Gunakan pola **`[Subjek/Objek Jelas]` + `[Pertanyaan/Kejanggalan Natural]`**:
       - `token-listrik`: `baris1: 'TOKEN 100 RIBU'`, `baris2: 'ISINYA CUMA 61 kWh?'`
       - `sadap-lims`: `baris1: 'HP DISADAP'`, `baris2: 'TANPA KITA SADARI?'`
       - `gandum-tropis`: `baris1: 'KENAPA BAHAN BAKU TEPUNG'`, `baris2: 'TIDAK ADA DI KEBUN KITA?'`
4b. **Aturan Hook Narasi Stop-Scroll 3 Detik (Wajib untuk Next Video):**
   - **Maksimal 8 sampai 14 Kata (1 Kalimat Padat, Durasi ~3 sampai 4 Detik / `95-120 frame`):** Di Shorts, penonton memutuskan scroll dalam 1,5 sampai 3 detik pertama. Dilarang menulis 2 kalimat atau lebih dari 14 kata di `HookScene` (validator `cek-explainer.mjs` otomatis memberi peringatan jika `> 15 kata`).
   - **Rumus 2 Potong Langsung Tembak (`[Fakta/Kebiasaan 4 kata], [kok/kenapa kejanggalan 5 kata]?`):**
     - **Haram Kalimat Pemanasan / Berita:** Dilarang membuka dengan *"Isu X lagi ramai dibahas..."*, *"Pernah gak sih lo mikir..."*, *"Tahukah kamu kalau..."*, atau kalimat pengantar panjang.
     - **Contoh Hook Stop-Scroll yang Benar (9-10 kata, ~3 detik):**
       - *"Kita juara makan mie instan, kok gak punya sawah gandum?"* (10 kata)
       - *"Tanpa klik link aneh, kok HP tetap bisa disadap?"* (9 kata)
       - *"Beli token seratus ribu, kok masuknya cuma enam puluh satu?"* (10 kata)
       - *"Kenapa tukang bangunan gak pernah nyusun bata sejajar lurus?"* (9 kata)
       - *"Nyalain kipas pas gerah, kok badan malah makin lengket?"* (9 kata)
3b. **Jeda Ritme `BeatScene` (`type: 'beat'`):**
   - Gunakan kalimat transisi **`teks: 'Oke, sini gue jelasin.'`** (bukan `"nah"`), ditemani karakter meme kucing berkacamata yang sedang menjelaskan (`props/meme-kucing-jelasin.png`) lengkap dengan aksi gerak:
     ```ts
     {
       type: 'beat',
       duration: 55,
       teks: 'Oke, sini gue jelasin.',
       narasi: 'Oke, *sini gue jelasin* alasannya.',
       items: [
         {
           kind: 'prop',
           src: 'props/meme-kucing-jelasin.png',
           x: 50,
           y: 52,
           width: 340,
           masuk: 'pop',
           sfx: 'boing',
           aksi: [{type: 'wiggle', di: 'jelasin', rotate: 12, durasi: 16}],
         },
       ],
     }
     ```
4. **Anti Layar Kosong (Zero Dead Air):**
   - **Detik `0.0s` di setiap scene wajib punya visual pembuka** (`delay: 0` atau `di` pada 1–2 kata pertama). Saat kalimat pembuka berupa pertanyaan (*"Kenapa bisa beda?"*, *"Banyak yang mengira..."*), tampilkan karakter ekspresif sedang berpikir (`props/token-mikir.png` atau sejenisnya) + simbol `tanya` (`?`).
   - **Setiap klausa yang diucapkan harus punya pasangan visual** yang muncul tepat di kata pemicunya (`di: '<kata>'`). Jangan biarkan ada jeda `> 2,5 detik` tanpa perubahan visual.
   - Saat berganti fase di dalam 1 scene, **samakan kata `sampai` objek lama dan `di` objek baru** (contoh: `sampai: 'melainkan'` dan `di: 'melainkan'`) agar tidak ada celah layar kosong 0,5 detik di antaranya, dan hindari menaruh objek baru di koordinat `x, y` yang persis menimpa objek yang sedang `fade` keluar.
4b. **High-Density Motion Wajib (Motion Diperbanyak di Setiap Kalimat):**
   - **Minimal 3–5 `aksi` aktif per scene (`HookScene` & `StageScene`):** Dilarang membiarkan prop hanya punya animasi `masuk` lalu diam sampai keluar. Setiap klausa (`tiap 1,5–2 detik`) wajib memicu aksi gerak (`jump`, `wiggle`, `squash`, `peek`, `move`, `shake`, `pulse`, `grow`) yang terikat ke kata narasi (`di: '<kata>'`).
   - **Multi-Aksi Berantai pada Prop Utama (`2–3 aksi` per item):** Prop atau karakter yang tampil lebih dari 3 detik (seperti `utama` di `HookScene` atau objek fokus di `StageScene`) **wajib memiliki array `aksi` berisi 2–3 gerakan berurutan** mengikuti kata-kata narasi:
     ```ts
     aksi: [
       {type: 'wiggle', di: 'kata-awal', rotate: 14, durasi: 18},
       {type: 'move', di: 'kata-tengah', toX: 36, toY: 50, toScale: 1.1, toRotate: -4, durasi: 16},
       {type: 'jump', di: 'kata-punchline', dy: 65, durasi: 18, sfx: 'boing'},
     ]
     ```
   - **Wajib Pakai Perpindahan Posisi (`type: 'move'`) & Koreografi Sebab-Akibat:** Gunakan `{type: 'move', di: '<kata>', toX, toY, toScale, toRotate, durasi}` agar objek benar-benar bergeser/berpindah tempat di panggung, serta kombinasikan reaksi antar-objek pada kata `di` yang sama (contoh: Objek A `masuk: 'drop'` atau `type: 'move'` menghantam Objek B → Objek B memicu `{type: 'squash', di: '<kata>', durasi: 16, sfx: 'slap'}`).
   - **Variasi Animasi Masuk (`masuk`) & Keluar (`keluar`):** Jangan semua item memakai `masuk: 'pop'`. Dalam 1 scene, kombinasikan minimal 3 gaya masuk: `'drop'` (jatuh dari atas + otomatis membal *squash-and-stretch*), `'slide-left'` / `'slide-right'`, `'slide-up'` / `'grow-up'`, dan `'pop'`.
5. **Kombinasi Visual Wajib (Full Real Background Lokasi per Scene + Cutout PNG + Foto Asli Berbingkai):**
   - **Setiap scene cerita/diagram wajib punya Full Real Background lokasi yang UNIK (`latar: 'latar/<nama>.png'`)** dari Flow Bridge (`node scripts/generate-props.mjs --utuh --name <nama> --prompt "<lokasi sesuai narasi scene>"`) — dilarang memakai gambar latar yang sama berulang di beberapa scene.
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

### 3. Pilar Visual Props, High-Density Motion, & Gag Fisik
- **Auto Living Cutout Motion (Aktif Otomatis):** Semua `prop` dan `simbol` otomatis bergerak halus selama tampil di layar (mengayun vertikal `±7px` + goyang sudut *paper-cutout* `±1.8°` + *breathing scale* `±1.5%` dengan fase acak per posisi `x, y` agar tidak kaku). Saat `masuk: 'drop'`, objek otomatis membal (*squash & stretch*) saat mendarat.
- **Cutout Karakter/Meme Reaksi Komedi:** Prioritaskan **meme ikonik binatang mikir/bingung/merenung** yang jauh lebih lucu dan relatable dibanding karakter 3D kaku, lalu padukan dengan cutout Flow Bridge (dompet kosong, beban raksasa, palu):
  - `props/meme-kucing-paw.png`: Kucing pose mikir serius (tangan di dagu ala *The Thinker*) — untuk pembuka pertanyaan/penasaran.
  - `props/meme-kucing-merenung.png`: Kucing oren pakai rompi duduk tegak di bak pasir menatap kosong merenung — untuk momen melamun, merenung nasib/beban hidup, atau kena realita pahit (*sfx: `'womp'`).
  - `props/meme-kucing-titik.png`: Kucing bengong stiker titik-titik `...` — untuk reaksi *speechless* / gagal paham.
  - `props/meme-kucing-think.png`: Kucing oren *"Let me think"* — untuk momen ngitung atau mikir keras.
  - `props/meme-monyet-mikir.png`: Monyet garuk dagu nengok ke atas — untuk kebingungan kocak.
  - `props/meme-kucing-jelasin.png` & `props/meme-kucing-guru.png`: Kucing menjelaskan/profesor — khusus untuk `BeatScene` (`"Oke, sini gue jelasin."`) atau kesimpulan.
- **Katalog Lengkap 9 Jenis `aksi` (`StageAction`) — Wajib Dipakai Padat (3–5 Aksi per Scene):**

| `type` | Efek Gerak Visual | Default SFX | Kapan Wajib Dipakai | Contoh Sintaks |
| :--- | :--- | :--- | :--- | :--- |
| **`jump`** | Melompat ke atas (`dy`, default `60px`) + *squash & stretch* saat lepas landas dan mendarat | `'boing'` | Saat objek/karakter disebut namanya, kaget, atau antusias | `{type: 'jump', di: 'kata', dy: 70, durasi: 18}` |
| **`wiggle`** | Goyang pendulum *paper-cutout* kiri-kanan (`±rotate°`, default `14°`) + sedikit membesar | — | Saat karakter bingung, berpikir, mengejek, atau menjelaskan | `{type: 'wiggle', di: 'kata', rotate: 15, durasi: 20}` |
| **`squash`** | Gepeng membal ke bawah (`scaleX: 1.28, scaleY: 0.72` + turun `14px`) lalu kembali | `'slap'` | Saat objek tertimpa beban dari atas, tertekan, atau kena mental | `{type: 'squash', di: 'kata', durasi: 16}` |
| **`peek`** | Nongol miring (`dx, dy, rotate`), tahan sebentar (`tahan`), lalu ngumpet balik | `'boing'` | Saat celetukan komedi, tanda tanya nyeleneh, atau karakter ngintip | `{type: 'peek', di: 'kata', dx: -16, dy: -8, rotate: -14, durasi: 12, tahan: 22}` |
| **`move`** | Berpindah posisi permanen ke `toX, toY` (+ opsional `toScale`, `toRotate`) dengan pegas | — | Saat objek mendekat, bergeser memberi ruang, atau menabrak objek lain | `{type: 'move', di: 'kata', toX: 68, toY: 48, toScale: 1.1, toRotate: 6, durasi: 16}` |
| **`shake`** | Getar cepat horizontal + rotasi (`intensitas`, default `10`) | — (sering `sfx: 'womp'`/`'boom'`) | Saat panik, kipas muter kencang, benda macet/terkunci, atau marah | `{type: 'shake', di: 'kata', intensitas: 12, durasi: 18, sfx: 'womp'}` |
| **`pulse`** | Denyut membesar-kembali (`scale` naik `+18%`) | — | Saat kata kunci ditekankan atau energi/panas memancar | `{type: 'pulse', di: 'kata', durasi: 18}` |
| **`grow`** | Ubah skala permanen ke `toScale` (atau `toScaleX` & `toScaleY` terpisah) | — | Saat benda membengkak, mengecil permanen, atau gepeng kustom | `{type: 'grow', di: 'kata', toScale: 1.22, durasi: 14}` |
| **`dim`** | Redupkan opasitas objek lama (`to: 0.25`) tanpa menghilangkannya | — | Saat fokus berpindah ke objek sebelahnya | `{type: 'dim', di: 'kata', to: 0.3, durasi: 12}` |

- **Pola Koreografi Reaksi Berantai (Multi-Action & Cause-Effect):**
  Jangan biarkan prop cuma punya 1 aksi. Gunakan 2 pola ini di setiap scene:
  1. **Pola Rantai pada 1 Karakter/Prop Utama (2–3 `aksi` berurutan):**
     ```ts
     {
       kind: 'prop',
       src: 'props/meme-kucing-paw.png',
       x: 28,
       y: 54,
       width: 310,
       masuk: 'slide-up',
       delay: 0,
       sampai: 'Padahal',
       aksi: [
         {type: 'wiggle', di: 'mengira', rotate: 14, durasi: 18},
         {type: 'move', di: 'satu jendela', toX: 24, toY: 56, toRotate: -5, durasi: 16},
         {type: 'jump', di: 'langsung sejuk', dy: 55, durasi: 16},
       ],
     }
     ```
  2. **Pola Tabrakan / Sebab-Akibat Antar 2 Objek pada Kata `di` yang Sama:**
     Saat Objek A jatuh (`masuk: 'drop'`) atau bergeser (`type: 'move'`) di kata `'tertimpa'`, Objek B yang berada di bawah/dekatnya otomatis memicu `{type: 'squash', di: 'tertimpa'}` atau `{type: 'shake', di: 'tertimpa'}` pada kata yang persis sama.
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

### Langkah 2 — Generate Background Lokasi Real & Cutout Props (Flow Bridge)
1. Isi daftar background di `src/explainer/data/<slug>.latar.json` (pastikan prompt mendeskripsikan foto lokasi nyata) dan generate background lokasi utuh (`public/latar/`) dengan style foto modern tanpa bingkai/sepia:
   ```bash
   node scripts/generate-props.mjs --file src/explainer/data/<slug>.latar.json --utuh --style "clean realistic modern photography, natural colors, full-bleed edge-to-edge camera frame, no border, no frame, no vintage paper effect, no sepia, high detail"
   ```
2. Isi daftar props di `src/explainer/data/<slug>.props.json`, cek koneksi bridge, lalu generate cutout PNG transparan (`public/props/`):
   ```bash
   node scripts/generate-props.mjs --cek
   node scripts/generate-props.mjs --file src/explainer/data/<slug>.props.json --style "clean realistic studio product photography cutout, crisp edges, natural colors, soft even lighting, high detail"
   ```
3. Cari foto pendukung nyata dari Wikimedia Commons:
   ```bash
   node scripts/cari-foto.mjs "<kata kunci inggris>" --slug <slug> --limit 4 --min-width 800
   ```
4. Lihat hasil foto di `public/photos/<slug>/_contact-sheet.jpg` dan pilih yang paling jelas untuk dipasang dengan `bingkai: true`.

### Langkah 3 — Tulis Naskah & Rancang Visual per Kalimat
Susun 5–7 scene (`hook` → `stage` → `beat` `"Oke, sini gue jelasin."` + `props/meme-kucing-jelasin.png` → `diagram` / `stage` → `stage` penutup):
- Set `watermark: false` di level `ExplainerScript`.
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

## Checklist Wajib untuk Next Video (`"nahh gini"`)

Sebelum mulai render setiap video explainer berikutnya, pastikan semua poin di bawah ini terpenuhi:

- [ ] **Hook Narasi Stop-Scroll 3 Detik (8 sampai 14 Kata, 1 Kalimat):**
  - `narasi` di `HookScene` wajib singkat dan langsung menembak kejanggalan di detik pertama (`8-14 kata`, 1 kalimat, durasi `~3-4 detik` / `95-120 frame`).
  - Gunakan rumus 2 potong: `[Fakta/Aksi 4 kata], [kok/kenapa kejanggalannya 5 kata]?` tanpa kalimat pengantar berita (*"Isu X lagi ramai..."*, *"Pernah gak sih..."*).
- [ ] **Thumbnail & Judul 2 Baris Natural (Opsi 3 + Stabilo Baris 2):**
  - `baris1` dan `baris2` di `thumbnail` serta `HookScene` menggunakan kalimat pendek yang utuh dan masuk akal secara logika (`2-5 kata`, `<= 28 karakter` per baris). Dilarang memotong kata secara telegrap yang bikin makna rancu.
  - `thumbnail` memiliki `latar` foto lokasi nyata (atau otomatis memakai `hook.latar`) dan `src` prop cutout utama di tengah.
  - Engine otomatis merender foto latar gelap sinematik, `baris1` teks gelap dengan sticker outline putih bulat, `baris2` di dalam blok stabilo kuning (`#f5c518`) miring `-1deg` + outline putih, serta `fitThumbFontSize` agar teks selalu muat 1 baris.
- [ ] **Watermark & Beat Scene Standar Baru:**
  - `watermark: false` di `ExplainerScript` (kosongkan dulu).
  - Scene `beat` memakai `teks: 'Oke, sini gue jelasin.'` (dan narasi `"Oke, *sini gue jelasin* ..."`) + karakter meme kucing menjelaskan (`props/meme-kucing-jelasin.png`, `masuk: 'pop'`, `sfx: 'boing'`).
- [ ] **Full Real Background Unik per Scene (Wajib):**
  - Setiap scene cerita & diagram (`hook`, `stage`, `diagram`) **wajib memiliki `latar: 'latar/<slug>-N.png'` yang unik** sesuai lokasi narasinya. Dilarang membiarkan background krem polos tanpa latar (kecuali scene `beat`), dan dilarang menduplikasi gambar latar yang sama di beberapa scene.
  - File latar sudah di-generate ke `public/latar/` via `node scripts/generate-props.mjs --file src/explainer/data/<slug>.latar.json --utuh`.
- [ ] **Pilar 1, Komedi di Narasi (Minimal 2-3 Celetukan Relatable di Scene 2/3/4):**
  - Biarkan **Scene 1 (Hook)** fokus 1 kalimat *stop-scroll* (`8-14 kata`).
  - Taruh 1 kalimat celetukan sehari-hari / hiperbola komedi di **Salah Kaprah (Scene 2)**.
  - Taruh 1 kalimat punchline / sindiran ringan saat fakta utama atau hitungan terbongkar (**Scene 3/4**).
  - Semua angka tetap ditulis dalam huruf (`seratus ribu`, `tiga puluh persen`) tanpa digit.
- [ ] **Pilar 2 — Komedi di SFX (`boing`, `boom`, `womp`, `slap`, `ding`):**
  - Minimal **3 SFX komedi** terpasang di sepanjang video lewat properti `sfx` pada `StageItem` atau `StageAction`:
    - `sfx: 'boing'` saat ada prop/karakter nongol nyeleneh atau `type: 'peek'`.
    - `sfx: 'womp'` saat salah kaprah terbongkar, uang terpotong, atau eksperimen gagal.
    - `sfx: 'boom'` atau `sfx: 'slap'` saat punchline jatuh (`masuk: 'drop'`), bantahan `silang` ❌, atau beban menghantam objek.
    - `sfx: 'ding'` saat solusi/kesimpulan benar (`centang` ✅) muncul.
- [ ] **Pilar 3 — Komedi di Visual Props (Cutout Reaksi + Gag Fisik):**
  - Di `<slug>.props.json`, wajib ada minimal **1–2 cutout PNG khusus reaksi/komedi** (contoh: karakter mikir/tepuk jidat, dompet kosong menangis, kucing melongo, beban batu raksasa) selain prop objek teknis utama.
  - Gunakan minimal **1 aksi `peek`** (nongol miring dari tepi layar lalu ngumpet lagi) dan **1 aksi slapstick** (`drop` + `squash` / `shake` / `jump`) yang sinkron dengan kata punchline di narasi (`di: '<kata>'`).
  - Tambahkan minimal **1 label celetukan mikro** (`kind: 'teks'`, `ukuran: 28–32`, `rotate: -6`) di dekat prop sebagai komentar visual lucu.
- [ ] **High-Density Motion (Motion Diperbanyak di Setiap Kalimat):**
  - Setiap `HookScene` dan `StageScene` memiliki minimal **3–5 `aksi` aktif** yang tersebar di sepanjang kalimat (`jump`, `wiggle`, `squash`, `peek`, `move`, `shake`, `pulse`).
  - Prop utama / karakter yang tampil lebih dari 3 detik memiliki **2–3 `aksi` berantai** (`aksi: [{type: 'wiggle', ...}, {type: 'move', ...}, {type: 'jump', ...}]`), tidak diam menunggu keluar.
  - Minimal ada **1–2 aksi `type: 'move'`** per scene untuk perpindahan posisi objek di panggung atau koreografi sebab-akibat antar dua objek (`drop`/`move` → objek di bawahnya `squash`).
  - Animasi `masuk` dalam 1 scene bervariasi (`drop`, `slide-left`, `slide-right`, `slide-up`, `grow-up`, `pop`), tidak monoton `pop` semua.
- [ ] **Zero Dead Air & Tata Letak Rapi:**
  - Detik `0.0s` di setiap scene wajib langsung menampilkan prop pembuka (`delay: 0` atau `di` pada kata ke-1/ke-2).
  - Saat pergantian fase di dalam 1 scene, kata `sampai` objek lama **wajib sama** dengan kata `di` objek baru (`keluar: 'pop-out'` otomatis 8 frame).
  - Jarak vertikal antar-item yang satu kolom minimal `16–18%` agar tidak bersentuhan.

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
