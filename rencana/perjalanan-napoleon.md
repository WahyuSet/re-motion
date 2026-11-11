# Rencana implementasi: "Perjalanan Napoleon: Dari Korsika hingga Saint Helena" (Short 9:16, 45–55 detik)

Untuk dikerjakan AI agent di project ini. Riset, sumber, naskah narasi final, dan kata kunci foto **sudah disiapkan** di dokumen ini. Tugas agent: merakit mengikuti skill (`.claude/skills/video-sejarah/SKILL.md` bagian **Mode Short (9:16)**), memilih foto, mengecek, lalu berhenti di titik 🛑.

## Prompt untuk agent (tempel ini)

```text
Kamu bekerja di project Remotion di D:\Learning\remotion.
Baca dulu `.claude/skills/video-sejarah/SKILL.md` sampai habis (terutama bagian Mode Short 9:16), lalu baca `rencana/perjalanan-napoleon.md`.
Kerjakan rencana itu bagian demi bagian (Tahap 1 sampai Tahap 7), BERURUTAN, memakai perintah persis yang tertulis.
Narasi dan fakta sudah final: salin apa adanya, jangan menambah fakta baru dan jangan mengubah kata-kata narasi.
Berhenti dan lapor ke saya di setiap titik 🛑. Jangan render MP4 sebelum storyboard disetujui. Jangan git commit/push.
Setiap kali berhenti, laporkan: tahap yang selesai, hasil terakhir `node scripts/cek-naskah.mjs perjalanan-napoleon`, file yang diubah, hal yang ragu.
```

## Ringkasan keputusan (sudah disetujui user)

| | |
|---|---|
| Topik | Kebangkitan dan kejatuhan **Napoleon Bonaparte** (Korsika → Kaisar Prancis → Rusia & Waterloo → Saint Helena) |
| Format | Video **short 9:16** (`format: 'short'`, 1080×1920, untuk YouTube Shorts / TikTok / Reels) |
| Durasi | **±45–55 detik**, **7 scene** (±107 kata narasi, 14–17 kata per scene) |
| Slug / Id | `perjalanan-napoleon` / `PerjalananNapoleon` |
| Alur | Hook Eropa & Korsika (1769–1799) → Penobatan Kaisar Prancis & Kode Napoleon (1804) → Puncak Austerlitz & bencana musim dingin Rusia (1805–1812) → Garis waktu kejatuhan: Rusia, Elba, Waterloo (1812–1815) → Pengasingan di Saint Helena hingga makam di Paris (1815–1840) → Penutup |
| Watermark | Otomatis "jejakala" (jangan diubah) |
| Props AI | Opsional (Tahap 4). Video tetap lengkap tanpa props |

## Aturan khusus topik ini (Mode Short 9:16)

1. **Wajib memakai `format: 'short'`** dan dibuat dengan flag `--short`. Jangan menambahkan field `bab` atau scene `type: 'chapter'` karena YouTube Shorts tidak memakai chapter dan `cek-naskah.mjs` akan memberi peringatan.
2. **Batas teks short lebih ketat:**
   - Hook kalimat pertama di scene 1 maksimal **12 kata** (naskah ini: 10 kata).
   - `judul` di scene `photo` maksimal **4 kata** dengan satu frasa `*bintang*`.
   - `tag` (baik di scene maupun di shot) dan `thumbnail.sub` maksimal **26 huruf**.
   - `narasi` tiap scene **12–20 kata**, semua angka dan tahun ditulis dengan huruf tanpa digit, tanpa singkatan, dan tanpa tanda kurung.
3. **Area aman layar tegak (9:16):** Stempel dan props wajib berada di dalam **x 7–86%, y 13–78%** agar tidak tertutup tombol dan caption aplikasi Shorts/TikTok/Reels.
4. **Jangan membuat gambar wajah tokoh sejarah dengan AI (Aturan Langkah 5 SKILL.md).** Semua lukisan dan potret Napoleon Bonaparte, pertempuran, serta foto lokasi wajib diunduh dari Wikimedia Commons lewat `cari-foto.mjs`.
5. **Ritme visual short:** Tiap shot tampil 1–5 detik, tidak ada foto yang dipakai di dua scene berturut-turut, tidak ada dua shot `full` berurutan dengan `move` yang sama, dan maksimal 3 shot `layout: 'print'` beruntun.

---

## Tahap 1. Siapkan video short (Langkah 0 skill)

```bash
node scripts/buat-video.mjs perjalanan-napoleon --short
```
Topik, format (`short`), dan durasi sudah ditentukan → tidak perlu bertanya lagi.

**Selesai jika:** muncul `Terdaftar sebagai Composition "PerjalananNapoleon"`.

## Tahap 2. Isi sumber fakta (Langkah 1 skill)

Ganti seluruh isi `src/data/perjalanan-napoleon.sumber.md` dengan teks ini (salin persis):

```markdown
# Sumber fakta: Perjalanan Napoleon Bonaparte

## Asal-usul di Korsika dan kebangkitan saat Revolusi Prancis
- Napoleon Bonaparte lahir di Ajaccio, Pulau Korsika, pada 15 Agustus 1769, belajar sebagai perwira artileri, dan melejit saat Revolusi Prancis hingga menjadi Konsul Pertama lewat Kudeta 18 Brumaire (1799)
  - https://en.wikipedia.org/wiki/Napoleon
  - https://www.britannica.com/biography/Napoleon-I

## Penobatan Kaisar Prancis dan Kode Napoleon (1804)
- Pada 2 Desember 1804 di Katedral Notre-Dame, Paris, Napoleon menobatkan dirinya sebagai Kaisar Prancis (Emperor of the French)
  - https://en.wikipedia.org/wiki/Coronation_of_Napoleon
  - https://www.louvre.fr/en/explore/the-palace/the-coronation-of-napoleon
- Memberlakukan Code Napoléon (Kitab Undang-Undang Hukum Perdata Prancis, 1804) yang menjadi fondasi hukum sipil modern di Eropa dan berbagai belahan dunia
  - https://en.wikipedia.org/wiki/Napoleonic_Code
  - https://www.britannica.com/topic/Napoleonic-Code

## Puncak kejayaan Austerlitz (1805) dan invasi ke Rusia (1812)
- Memenangkan Pertempuran Austerlitz pada 2 Desember 1805 melawan pasukan gabungan Kekaisaran Rusia dan Austria
  - https://en.wikipedia.org/wiki/Battle_of_Austerlitz
  - https://www.britannica.com/event/Battle-of-Austerlitz
- Pada tahun 1812 memimpin Grande Armée menyerbu Rusia, namun terpaksa mundur di tengah musim dingin ekstrem yang menghancurkan sebagian besar pasukannya
  - https://en.wikipedia.org/wiki/French_invasion_of_Russia
  - https://www.britannica.com/event/French-invasion-of-Russia

## Pengasingan ke Elba (1814), Waterloo (1815), dan akhir hidup di Saint Helena (1821)
- Turun takhta dan diasingkan ke Pulau Elba pada April 1814, lalu kembali berkuasa selama Seratus Hari pada 1815 sebelum dikalahkan di Pertempuran Waterloo pada 18 Juni 1815
  - https://en.wikipedia.org/wiki/Battle_of_Waterloo
  - https://www.britannica.com/event/Battle-of-Waterloo
- Diasingkan oleh Inggris ke Pulau Saint Helena di Samudra Atlantik Selatan pada 1815 hingga wafat pada 5 Mei 1821; jenazahnya dipulangkan ke Paris pada 1840 dan dimakamkan di Les Invalides
  - https://en.wikipedia.org/wiki/Napoleon#Exile_on_Saint_Helena
  - https://www.britannica.com/biography/Napoleon-I
```

**Selesai jika:** file `src/data/perjalanan-napoleon.sumber.md` tersimpan.

## Tahap 3. Cari foto bebas lisensi (Langkah 3 skill)

Jalankan satu per satu, tunggu selesai:

```bash
node scripts/cari-foto.mjs "Napoleon Crossing the Alps David" --slug perjalanan-napoleon --limit 4 --pd-only --min-width 800
node scripts/cari-foto.mjs "Napoleon Bonaparte portrait" --slug perjalanan-napoleon --limit 5 --pd-only --min-width 800
node scripts/cari-foto.mjs "Bonaparte Pont d'Arcole" --slug perjalanan-napoleon --limit 3 --pd-only --min-width 800
node scripts/cari-foto.mjs "Coronation of Napoleon David" --slug perjalanan-napoleon --limit 4 --pd-only --min-width 1000
node scripts/cari-foto.mjs "Code Napoleon 1804" --slug perjalanan-napoleon --limit 3 --pd-only --min-width 600
node scripts/cari-foto.mjs "Battle of Austerlitz painting" --slug perjalanan-napoleon --limit 4 --pd-only --min-width 1000
node scripts/cari-foto.mjs "Napoleon retreat from Moscow 1812" --slug perjalanan-napoleon --limit 4 --pd-only --min-width 800
node scripts/cari-foto.mjs "Napoleon Elba painting" --slug perjalanan-napoleon --limit 3 --pd-only --min-width 800
node scripts/cari-foto.mjs "Battle of Waterloo painting" --slug perjalanan-napoleon --limit 4 --pd-only --min-width 1000
node scripts/cari-foto.mjs "Napoleon Saint Helena" --slug perjalanan-napoleon --limit 4 --pd-only --min-width 800
node scripts/cari-foto.mjs "Napoleon tomb Les Invalides Paris" --slug perjalanan-napoleon --limit 4 --min-width 800
node scripts/cari-foto.mjs "Arc de Triomphe Paris" --slug perjalanan-napoleon --limit 3 --min-width 1000
```

Lalu **lihat `public/photos/perjalanan-napoleon/_contact-sheet.jpg` dengan Read.** Hapus file JPG yang tidak relevan, berwatermark, atau buram.

**Selesai jika** tersedia minimal 14 foto unik yang relevan untuk 7 scene (2 shot per scene, tanpa ada foto yang dipakai ulang antar scene). Jika ada kata kunci yang menghasilkan 0 foto, coba kata kunci bahasa Inggris/Prancis sejenis maksimal 3 kali.

## Tahap 4. Props (opsional, Langkah 5 skill)

```bash
node scripts/generate-props.mjs --cek
```
- `TIDAK SIAP` → catat untuk laporan, lewati Tahap 4.
- `SIAP` → isi `src/data/perjalanan-napoleon.props.json`:
  ```json
  [
    {"name": "topi-bicorne", "prompt": "a classic early 19th century French black felt bicorne military hat with a small cockade"},
    {"name": "mahkota-laurel", "prompt": "an imperial golden laurel wreath crown on a cushion"}
  ]
  ```
  Jalankan `node scripts/generate-props.mjs --file src/data/perjalanan-napoleon.props.json`, periksa hasilnya dengan Read, lalu pasang di dalam area aman short (`x: 75, y: 58, width: 220, animation: 'pop'`):
  - `topi-bicorne` di scene 2 `di: 'perwira'`
  - `mahkota-laurel` di scene 3 `di: 'Kaisar'`

## Tahap 5. Tulis naskah short (Langkah 2 + 4 skill)

Isi `src/data/perjalanan-napoleon.ts` dengan `format: 'short'`, blok `youtube`, `thumbnail`, dan 7 `scenes` di bawah. **Format, narasi, tag, judul, judulDi, value, label, titik, stempel, dan transisi: salin persis.** Yang kamu isi sendiri adalah nama file di `shots` (dan `thumbnail`) sesuai isi `public/photos/perjalanan-napoleon/`, dengan shot ke-1 tanpa `di` dan shot ke-2 memakai `di` yang tertulis.

Blok di atas `scenes`:
```ts
  format: 'short',
  youtube: {
    judul: 'Perjalanan Napoleon: Dari Korsika hingga Pengasingan',
    deskripsi:
      'Kisah singkat kebangkitan dan kejatuhan Napoleon Bonaparte: dari perwira artileri asal Korsika yang menjadi Kaisar Prancis, hingga invasi Rusia, kekalahan di Waterloo, dan pengasingan di Saint Helena.',
    tags: [
      'napoleon bonaparte',
      'sejarah eropa',
      'revolusi prancis',
      'pertempuran waterloo',
      'sejarah dunia',
    ],
  },
  thumbnail: {
    judul: 'Taklukkan Eropa, *berakhir sendiri*',
    sub: 'Kisah Napoleon Bonaparte',
    ...foto('NN-napoleon-crossing-the-alps.jpg'),
  },
```

### Rincian 7 Scene (Mode Short 9:16)

**1 · title**
- duration: `60`
- kicker: `'Sejarah Dunia'`
- title: `'Perjalanan Napoleon'`
- narasi: `'Dari pulau kecil di Mediterania, ia menaklukkan hampir seluruh Eropa. Inilah *Perjalanan Napoleon* Bonaparte.'`
- Foto:
  1. Lukisan Napoleon melintasi Pegunungan Alpen (`move: 'pan-right'`)
  2. Potret Napoleon Bonaparte (`layout: 'print'`, `tag: 'Napoleon Bonaparte'`, `di: 'Inilah'`)

**2 · photo** · transisi `'dorong'`
- duration: `60`
- tag: `'Korsika · 1769–1799'`
- judul: `'Bangkit dari *Revolusi Prancis*'`
- judulDi: `'Revolusi'`
- narasi: `'Lahir di Pulau Korsika, perwira artileri muda ini melejit menjadi pemimpin tertinggi setelah *Revolusi Prancis*.'`
- Foto:
  1. Lukisan Napoleon muda di Jembatan Arcole / era Revolusi (`move: 'pan-left'`)
  2. Potret Napoleon sebagai Konsul Pertama (`layout: 'print'`, `tag: 'Konsul Pertama · 1799'`, `di: 'melejit'`)

**3 · fact** · transisi `'kartu'`
- duration: `60`
- value: `1804` · format: `'year'` · label: `'Dinobatkan jadi Kaisar'`
- narasi: `'Tahun *seribu delapan ratus empat*, ia menobatkan dirinya sebagai Kaisar Prancis dan menyusun kitab hukum sipil.'`
- Foto:
  1. Lukisan *The Coronation of Napoleon* di Notre-Dame (`move: 'pan-right'`, `tag: 'Penobatan · Notre-Dame'`)
  2. Potret Kaisar Napoleon / naskah *Code Napoléon* (`layout: 'print'`, `tag: 'Kaisar Prancis · 1804'`, `di: 'Kaisar'`)

**4 · photo** · transisi `'dorong'`
- duration: `60`
- tag: `'Eropa · 1805–1812'`
- judul: `'Puncak kuasa dan *bencana*'`
- judulDi: `'Rusia'`
- narasi: `'Setelah berjaya di Austerlitz, kekuatannya hancur saat menyerbu *Rusia* di tengah musim dingin yang membekukan.'`
- Foto:
  1. Lukisan kemenangan di Pertempuran Austerlitz (`move: 'pan-left'`, `tag: 'Pertempuran Austerlitz'`)
  2. Lukisan mundurnya pasukan Napoleon dari Rusia (`move: 'pan-right'`, `tag: 'Mundur dari Rusia · 1812'`, `di: 'menyerbu'`)

**5 · timeline** · transisi `'kartu'`
- duration: `60`
- tag: `'Kejatuhan · 1812–1815'`
- narasi: `'Mundur dari Rusia tahun seribu delapan ratus dua belas, ia dibuang ke Elba, lalu kalah di Waterloo.'`
- titik:
  - `{tahun: 1812, label: 'Mundur dari Rusia', di: 'Rusia'}`
  - `{tahun: 1814, label: 'Diasingkan ke Pulau Elba', di: 'Elba'}`
  - `{tahun: 1815, label: 'Tumbang di Waterloo', di: 'Waterloo'}`
- Foto:
  1. Lukisan Napoleon di Pulau Elba (`move: 'push-in'`, `tag: 'Pengasingan Elba · 1814'`)
  2. Lukisan Pertempuran Waterloo (`move: 'pan-left'`, `tag: 'Waterloo · Juni 1815'`, `di: 'dibuang'`)

**6 · photo** · transisi `'zoom'`
- duration: `60`
- tag: `'Saint Helena · 1815–1821'`
- judul: `'Akhir hidup di *pengasingan*'`
- judulDi: `'diasingkan'`
- stempel: `{teks: 'Diasingkan', di: 'diasingkan', x: 65, y: 42}`
- narasi: `'Napoleon akhirnya *diasingkan* ke Pulau Saint Helena hingga wafat, sebelum jenazahnya dipulangkan ke Kota Paris.'`
- Foto:
  1. Lukisan Napoleon di pengasingan Saint Helena (`layout: 'print'`, `tag: 'Pulau Saint Helena'`)
  2. Foto makam Napoleon di Les Invalides, Paris (`move: 'push-in'`, `tag: 'Makam · Les Invalides'`, `di: 'wafat'`)

**7 · outro** · transisi `'kartu'`
- duration: `60`
- tag: `'Warisan Napoleon'`
- title: `'Jejaknya mengubah *wajah Eropa*'`
- cta: `'Follow untuk sejarah lainnya'`
- narasi: `'Jejak hukum dan militernya mengubah Eropa selamanya. Ikuti channel ini untuk kisah sejarah dunia lainnya.'`
- Foto:
  1. Foto Arc de Triomphe di Paris (`move: 'pan-right'`)
  2. Lukisan ikonik Napoleon Bonaparte (`move: 'push-in'`, `di: 'Ikuti'`)

Setelah selesai menyusun naskah, jalankan:
```bash
npx tsc
node scripts/cek-naskah.mjs perjalanan-napoleon
```
Perbaiki semua `✗ ERROR` dan peringatan `⚠` sesuai petunjuk "Perbaiki:".

**Selesai jika:** `✓ LULUS: short 9:16, 7 scene, ±49 detik, 0 error, 0 peringatan, 0 catatan ritme.`

## Tahap 6. Naskah TTS (Langkah 6 skill)

```bash
node scripts/narasi.mjs perjalanan-napoleon
```

🛑 **Berhenti & lapor ke user**: kirim path `narasi/perjalanan-napoleon/naskah-full.txt`, minta TTS satu file audio utuh. Sertakan: hasil `cek-naskah`, status props (dibuat/dilewati), dan catatan foto proksi jika ada.

## Tahap 7. Setelah user mengirim audio (Langkah 7–9 skill)

```bash
node scripts/potong-narasi.mjs perjalanan-napoleon "<path audio dari user>"
```
- Semua baris `ok` dan kecocokan ≥70% → aktifkan `narasiAudio: 'audio/perjalanan-napoleon', narasiExt: 'wav',` di atas `scenes`.
- Ada `⚠` → 🛑 lapor ke user.

```bash
node scripts/cek-naskah.mjs perjalanan-napoleon
npx tsc
node scripts/cek-frame.mjs perjalanan-napoleon
node scripts/storyboard.mjs perjalanan-napoleon
```
Lihat `out/cek/perjalanan-napoleon-lembar.jpg` dan semua halaman storyboard (`out/storyboard/perjalanan-napoleon-N.jpg`) dengan Read. Pastikan tidak ada teks/props yang masuk area merah (area tertutup aplikasi) dan setiap shot cocok dengan kata yang sedang diucapkan.

🛑 **Berhenti & kirim semua halaman `out/storyboard/perjalanan-napoleon-N.jpg` ke user**. Render & buat paket YouTube hanya setelah user setuju:
```bash
node scripts/render.mjs perjalanan-napoleon
node scripts/paket-youtube.mjs perjalanan-napoleon
```

---

## Checklist akhir (untuk dilaporkan agent)

- [ ] `cek-naskah`: ✓ LULUS, `short 9:16`, 7 scene, ±45–55 detik, 0 error
- [ ] Hook kalimat pertama di scene 1 ≤12 kata, semua judul ≤4 kata, semua tag ≤26 huruf
- [ ] Narasi 7 scene sama persis dengan rencana (semua angka ditulis huruf, 14–17 kata per scene)
- [ ] Setiap shot ke-2 punya `di` yang sesuai narasi dan tidak ada foto dipakai berulang
- [ ] Transisi `zoom` hanya di scene 6; stempel hanya di scene 6 (di dalam area aman x 7–86%, y 13–78%)
- [ ] Tidak ada wajah tokoh yang digenerate AI (semua lukisan/foto dari Wikimedia Commons)
- [ ] Storyboard dikirim & disetujui sebelum render
