# Panduan & Checklist Next Video Explainer (`"nahh gini"`)

Dokumen ini mencatat standar wajib untuk pembuatan **video explainer ke-2 dan seterusnya** di [`src/explainer/`](../src/explainer/), termasuk integrasi **humor & komedi di Narasi, SFX, dan Visual Props** serta perbaikan hasil evaluasi video perdana (`token-listrik`).

Acuan skill utama: [`.claude/skills/video-explainer/SKILL.md`](../.claude/skills/video-explainer/SKILL.md).

---

## 1. Tiga Pilar Humor & Komedi (`Narasi` + `SFX` + `Visual Props`)

Setiap video baru tema `"nahh gini"` **wajib** memiliki minimal **2–3 momen komedi** yang menggabungkan ketiga pilar ini secara bersamaan:

### A. Komedi di Narasi
- Jangan menulis narasi kaku seperti buku pelajaran. Sisipkan **analogi receh atau keluhan relatable sehari-hari** di:
  1. **Scene 1 (Hook) / Scene 2 (Salah Kaprah):** Kalimat yang langsung kena ke pengalaman penonton.
     - *Contoh:* `"Bunyi tit-tit meteran pas tengah malem itu horornya ngalahin film setan."`
     - *Contoh:* `"Susunan bata sejajar lurus itu kayak temen kelompok yang cuma numpang nama, diteken dikit langsung ambyar."`
  2. **Scene 3/4 (Bongkar Fakta / Hitungan):** Celetukan singkat saat potongan/beban muncul.
     - *Contoh:* `"Belum juga nyala lampunya, dompet udah kena sunat duluan."`

### B. Komedi di SFX (`public/sfx/*.wav`)
Gunakan properti `sfx: '<nama>'` pada `StageItem` (saat objek masuk) atau `StageAction` (saat objek bereaksi di kata tertentu):

| Nama SFX | File WAV | Kapan Dipakai | Contoh di Naskah |
|---|---|---|---|
| `'boing'` | `public/sfx/boing.wav` | Prop komedi nongol mendadak / aksi `peek` (otomatis bunyi di `peek`) | `sfx: 'boing'` |
| `'boom'` | `public/sfx/boom.wav` | Punchline berat, fakta mengejutkan, atau beban jatuh (`masuk: 'drop'`) | `masuk: 'drop', sfx: 'boom'` |
| `'womp'` | `public/sfx/womp.wav` | *Sad trombone* saat salah kaprah patah, uang kepotong, atau tembok roboh | `sfx: 'womp'` |
| `'slap'` | `public/sfx/slap.wav` | Tepuk jidat / tamparan komedi saat bantahan `silang` ❌ atau objek gepeng | `sfx: 'slap'` |
| `'ding'` | `public/sfx/ding.wav` | Lonceng cling saat solusi benar / simbol `centang` ✅ muncul (otomatis) | `sfx: 'ding'` |

*(Jika butuh generate ulang file WAV: `node scripts/buat-sfx-explainer.mjs`)*

### C. Komedi di Visual Props & Living Cutout Motion (Anti-Kaku)
1. **Auto Living Motion (Aktif Otomatis di Semua `prop` & `simbol`):**
   - Semua cutout PNG dan simbol di panggung **otomatis bergerak hidup** tanpa perlu disetel manual: mengayun naik-turun (`±7px`), goyang miring ala potongan kertas (*paper-cutout tilt* `±1.8°`), dan *breathing scale* (`±1.5%`) dengan **fase acak per posisi (`phase offset`)** agar beberapa prop di layar tidak bergerak serempak seperti robot.
   - Saat prop jatuh (`masuk: 'drop'`), pendaratannya otomatis membal (*squash & stretch*).
2. **Meme Visual Reaksi/Mikir (Kucing/Monyet Cutout PNG):**
   - **Sangat disarankan & wajib diprioritaskan** untuk visual orang bingung / bertanya-tanya daripada karakter 3D generik.
   - Sudah tersedia library siap pakai di `public/props/`:
     - `props/meme-kucing-paw.png`: Kucing pose mikir serius (tangan di dagu ala patung *The Thinker*).
     - `props/meme-kucing-titik.png`: Kucing bengong sticker titik-titik `...`.
     - `props/meme-kucing-think.png`: Kucing oren pose *"Let me think"*.
     - `props/meme-monyet-mikir.png`: Monyet garuk dagu nengok ke atas.
   - Pasangkan dengan aksi motion:
     ```ts
     {
       kind: 'prop',
       src: 'props/meme-kucing-paw.png',
       x: 28,
       y: 56,
       width: 320,
       masuk: 'slide-up',
       aksi: [{type: 'wiggle', di: 'mengira', rotate: 12, durasi: 18}],
     }
     ```
3. **Aksi Motion Ekspresif di `aksi` (`peek`, `jump`, `wiggle`, `squash`, `move`, `shake`, `pulse`):**
   - **`type: 'peek'` (Ngintip):** Karakter/prop nongol miring dari pinggir layar tepat di kata punchline + bunyi `boing`, lalu ngumpet lagi:
     ```ts
     aksi: [{type: 'peek', di: 'horornya', dx: -18, dy: -6, rotate: -16, durasi: 12, tahan: 24}]
     ```
   - **`type: 'jump'` (Melompat Antusias):** Prop melompat ke atas lengkap dengan *squash & stretch* + bunyi `boing` otomatis saat namanya disebut:
     ```ts
     aksi: [{type: 'jump', di: 'kaget', dy: 70, durasi: 16}]
     ```
   - **`type: 'wiggle'` (Goyang Kertas Kiri-Kanan):** Prop bergoyang pendulum `±14°` saat sedang dibahas atau bingung (cocok untuk karakter mikir / tanda tanya):
     ```ts
     aksi: [{type: 'wiggle', di: 'bingung', rotate: 16, durasi: 20}]
     ```
   - **`type: 'squash'` (Penyet Membal):** Prop gepeng ke bawah lalu membal balik + bunyi `slap` otomatis (cocok saat tertimpa beban atau potongan pajak):
     ```ts
     aksi: [{type: 'squash', di: 'dipotong', durasi: 16}]
     ```
4. **Label Celetukan Mikro (Micro-Gag Text):**
   - Item `kind: 'teks'` ukuran kecil (`ukuran: 28–32`, `rotate: -6`) di dekat prop sebagai komentar visual lucu (misal: `"Dompet menangis"`, `"Beban hidup"`).

---

## 2. Aturan Sinkronisasi Visual & Anti Layar Kosong (Hasil Evaluasi Video #1)

1. **Watermark tetap:** `watermark: 'nahh gini'`.
2. **Zero Dead Air (Detik `0.0s` Wajib Ada Visual):**
   - Setiap scene (`hook`, `stage`, `diagram`) wajib langsung menampilkan visual pembuka sejak frame `0` (`delay: 0` atau `di` pada kata ke-1/ke-2).
   - Saat kalimat pembuka berupa pertanyaan/kebingungan, langsung pasang karakter mikir (`props/token-mikir.png` atau prop ekspresi sejenis) + tanda tanya (`simbol: 'tanya'`).
3. **Pergantian Fase Tanpa Celah & Tanpa Ghosting:**
   - Samakan kata `sampai` objek lama dengan kata `di` objek baru (contoh: `sampai: 'melainkan'` dan `di: 'melainkan'`).
   - Engine kini otomatis menggunakan `keluar: 'pop-out'` (8 frame) sehingga tidak ada bayangan transparan (*ghosting*) di atas objek baru.
4. **Jarak Vertikal Aman (`16–18%`):**
   - Jangan menumpuk badge teks, simbol `?`, dan prop terlalu rapat di sisi yang sama; beri selisih `y` minimal `16–18%`.
5. **Full Real Background Lokasi Unik per Scene + Cutout PNG + Foto Asli Wikimedia:**
   - **Setiap scene (`hook`, `stage`, `diagram`) wajib memiliki `latar: 'latar/<nama>.png'` yang BEDA-BEDA (unik per scene)** sesuai suasana lokasi narasi di scene tersebut (generate lewat `node scripts/generate-props.mjs --utuh --name <nama> --prompt "<lokasi>"`).
   - Background ditampilkan **Full Real (100% terang tanpa transparan)** dengan *slow camera zoom* (`1.02x` -> `1.10x`) dan kotak *pill* krem otomatis di belakang subtitle.
   - Validator `npm run cek:explainer` otomatis memberi peringatan jika ada gambar `latar` yang dipakai berulang di scene lain.
   - Setiap video wajib memadukan cutout PNG transparan realistis (`scripts/generate-props.mjs`) dan foto nyata berbingkai hitam (`scripts/cari-foto.mjs` dengan `bingkai: true`).

---

## 3. Urutan Perintah Saat Mulai Next Video

```bash
# 0. Buat kerangka naskah baru (sudah berisi contoh hook komedi + SFX + props)
npm run baru:explainer -- <slug>

# 1. Generate cutout PNG (termasuk 1-2 prop komedi) & cari foto asli Wikimedia
node scripts/generate-props.mjs --file src/explainer/data/<slug>.props.json --style "clean realistic studio product photography cutout, crisp edges, natural colors, soft even lighting, high detail"
node scripts/cari-foto.mjs "<keyword>" --slug <slug> --limit 4 --min-width 800

# 2. Validasi naskah & ekspor teks narasi untuk TTS
npm run cek:explainer -- <slug>
node scripts/narasi.mjs <slug>

# 3. Potong audio TTS & sinkronkan kata per kata (faster-whisper)
node scripts/potong-narasi.mjs <slug> "<path-audio.wav>"
npm run cek:explainer -- <slug>

# 4. Cek frame & storyboard
node scripts/cek-frame.mjs <slug>
node scripts/storyboard.mjs <slug>

# 5. Render final & paket YouTube
node scripts/render.mjs <slug> --final
node scripts/paket-youtube.mjs <slug>
```
