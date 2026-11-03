# Video Sejarah — Remotion

Template video edukasi/sejarah 16:9 (1920×1080, 30fps) bergaya dokumenter: beberapa foto asli per scene dengan gerak kamera, foto arsip tampil sebagai cetakan berbingkai, subtitle yang menyala mengikuti suara narasi, judul dan angka yang muncul tepat saat diucapkan, transisi whip/zoom, props hasil generate AI, dan nuansa film arsip (grain, debu, cahaya hangat).

## Perintah

```bash
npm run dev        # buka Remotion Studio (preview + edit live) di http://localhost:3000
npm run render     # render jadi out/borobudur.mp4
npm run still      # render 1 frame ke out/preview.png
```

## Alur kerja bikin video baru

Panduan langkah demi langkah (juga dipakai AI agent sebagai skill, ditulis supaya bisa diikuti model ringan): [.claude/skills/video-sejarah/SKILL.md](.claude/skills/video-sejarah/SKILL.md). Alasan desain: [referensi/desain.md](.claude/skills/video-sejarah/referensi/desain.md).

| Langkah | Perintah | Hasil |
|---|---|---|
| 0. Siapkan | `npm run baru -- majapahit` | `src/data/majapahit.ts` (template), `.props.json`, `.sumber.md`, terdaftar sebagai `Majapahit` |
| 1–2. Riset & naskah | edit `src/data/majapahit.ts` + `.sumber.md` | |
| 3. Foto | `npm run foto -- "majapahit temple" --slug majapahit` | `public/photos/majapahit/` + `credits.json` + `_contact-sheet.jpg` |
| 4. Shot & layout | `npm run grid-foto -- public/photos/majapahit/09-peta.jpg` | grid koordinat untuk anotasi |
| 5. Props | `npm run props -- --file src/data/majapahit.props.json` | PNG transparan di `public/props/` |
| 6. Naskah TTS | `npm run narasi -- majapahit` | `narasi/majapahit/naskah-full.txt` |
| 7. Audio | `npm run potong-narasi -- majapahit "D:\path\tts.wav"` | `public/audio/majapahit/` + `kata.json` |
| 8. Cek | `npm run cek -- majapahit` lalu `npm run cek-frame -- majapahit` | daftar error + cara memperbaiki; `out/cek/majapahit-lembar.jpg` |
| 8b. Storyboard | `npm run storyboard -- majapahit` | `out/storyboard/majapahit-N.jpg`: cuplikan tiap shot + kata yang diucapkan saat shot tampil. **Wajib disetujui sebelum render** |
| 9. Render | `npx remotion render Majapahit out/majapahit.mp4` lalu `npm run kredit -- majapahit` | MP4 + `out/majapahit-kredit.txt` |

`npm run cek` memeriksa semua aturan (jumlah shot, judul ≤5 kata, angka di narasi, tanda bintang di scene fakta, file foto/audio ada, kredit, kecocokan `kata.json`) dan menulis cara memperbaikinya.

## Watermark channel

Nama channel di `src/channel.ts` (sekarang **jejakala**) tampil halus di kanan atas semua video. Ganti nama di file itu untuk semua video sekaligus, atau per video di naskah: `watermark: 'teks lain'` / `watermark: false`.

## Mode short (9:16): YouTube Shorts, TikTok, Reels

```bash
npm run baru -- borobudur-short --short --dari borobudur   # short turunan dari video panjang (foto & sumber sama)
npm run baru -- keris-short --short                         # short topik baru
```

Naskah short berisi `format: 'short'` → 1080×1920, 30–60 detik, 4–8 scene. Tag, judul, subtitle (2–3 kata besar), badge angka, dan kredit otomatis menyesuaikan layar tegak dan tetap di dalam area aman Shorts/TikTok/Reels. Foto landscape digeser (pan) menyusuri lebarnya. `npm run cek` memakai aturan short (durasi, hook, panjang judul, area aman), dan `npm run cek-frame` menandai area yang tertutup tombol aplikasi dengan warna merah. Contoh: `src/data/borobudur-short.ts`.

## Jenis scene

| `type`  | Isi | Cocok untuk |
|---------|-----|-------------|
| `title` | Judul menghentak muncul saat namanya diucapkan + kicker + subjudul | Pembuka |
| `photo` | Beberapa shot + subtitle sinkron + label lokasi | Inti cerita |
| `fact`  | Angka besar menghitung saat angkanya diucapkan + label | Statistik, tahun |
| `outro` | Kalimat penutup + tombol ajakan follow di kalimat terakhir narasi | Penutup |

Setiap scene punya `shots` (2–4 foto bergantian) dan `narasi` (teks yang dibacakan, sekaligus subtitle):

```ts
shots: [
  {...foto('03-candi.jpg'), move: 'push-in'},
  {...foto('10-arsip-1872.jpg'), layout: 'print'},
  {...foto('01-candi.jpg')},                 // move kosong = dipilih otomatis
],
narasi: 'Dindingnya dihiasi *dua ribu enam ratus tujuh puluh dua* panel relief.',
```

- `di: 'kata'`: shot (ke-2 dst.) mulai tepat saat kata itu diucapkan di narasi, supaya foto sesuai yang sedang dibacakan. Tanpa `di`, shot dibagi rata. Props juga bisa `di`.
- `move`: `push-in`, `pull-out`, `pan-left`, `pan-right`, `tilt-up`, `tilt-down`. `focus: {x, y}` = titik zoom (persen).
- `layout: 'print'`: foto tampil sebagai cetakan berbingkai di atas latar blur. Cocok untuk foto arsip, potret, dan peta.
- Kata dalam `*bintang*` di narasi jadi emas di subtitle dan memicu animasi (judul di `title`, hitungan angka di `fact`). Tanda bintang tidak ikut dibacakan TTS.
- `transition`: `dorong`, `kartu` (utama, selang-seling), `none` (potong langsung), `zoom` / `whip` (maks. sekali per video), `fade`, `slide`, `wipe`.

### Layout (diadaptasi dari [bang-motion](https://github.com/bangtutorial/bang-motion), MIT)

```ts
{
  type: 'photo',
  tag: 'Magelang · Jawa Tengah',            // label mono kiri atas
  judul: 'Dibangun *abad ke-9*',            // maks. 5 kata, *stabilo*
  judulDi: 'kesembilan',                    // muncul saat kata ini diucapkan
  stempel: {teks: 'Dibersihkan', di: 'dibersihkan', x: 68, y: 46},
  shots: [
    {
      ...foto('30-peta-jawa.jpg'),
      layout: 'print',
      tag: 'Peta Jawa · Raffles',           // label mono kanan atas selama shot ini
      anotasi: [{x: 53, y: 56, w: 7, h: 16, label: 'Kedu · Magelang'}], // persen gambar
    },
  ],
}
```

Scene `fact` juga bisa pakai `ulang: {photo, jumlah}` (grid foto berulang saat angka menghitung). Angka otomatis mengecil jadi badge di pojok setelah selesai menghitung, dan `format: 'year'` menampilkan tahun raksasa transparan di belakang.
- `format: 'year'` di scene `fact` supaya 1814 tidak jadi 1.814.
- `duration` hanya batas minimal (30 frame = 1 detik); durasi asli mengikuti audio narasi.

## Props

```ts
props: [
  {src: 'props/kompas.png', x: 16, y: 30, width: 240, animation: 'pop', delay: 20},
]
```

- `x`, `y`: posisi tengah props dalam **persen** layar.
- `animation`: `pop`, `drop`, `slide-left`, `slide-right`, `fade`.
- `delay`: frame mulai muncul (dari awal scene). `float: false` untuk mematikan gerak melayang.

`scripts/generate-props.mjs` otomatis menambahkan gaya visual dan background hijau ke prompt, lalu menghapus background-nya. Cukup tulis objeknya, misalnya `"an antique brass navigation compass"`.

## Audio

### Narasi TTS (satu file utuh, durasi otomatis)

1. Tulis `narasi` di setiap scene (angka ditulis sebagai kata, tanpa singkatan).
2. `npm run narasi -- borobudur` → `narasi/borobudur/naskah-full.txt` (teks untuk TTS) dan `naskah-tts.txt` (panduan).
3. Generate TTS di aplikasi lain jadi **satu file utuh**.
4. Potong otomatis per scene: `npm run potong-narasi -- borobudur "D:\path\narasi.wav"` → `public/audio/borobudur/01.wav`, `02.wav`, ... + `kata.json`.
   Audio ditranskrip dengan faster-whisper (Python) dan dicocokkan dengan naskah, jadi jeda antar paragraf tidak perlu panjang. Tanpa faster-whisper, script memotong berdasarkan jeda terpanjang.
5. Tambahkan di naskah: `narasiAudio: 'audio/borobudur', narasiExt: 'wav',`

Durasi tiap scene otomatis diperpanjang sampai narasinya selesai, dan subtitle menyala per kata sesuai `kata.json`.

### Musik

```ts
music: 'audio/musik.mp3',
musicVolume: 0.2,   // default 0.25, atau 0.12 kalau ada narasi
```

Kalau narasinya cuma satu file utuh, pakai `voiceover: 'audio/narasi.mp3'` dan atur `duration` tiap scene manual.

## Struktur

```
scripts/
  cari-foto.mjs       cari & unduh foto bebas lisensi + kredit
  generate-props.mjs  generate props via Flow Bridge + hapus background
  kredit.mjs          daftar kredit untuk deskripsi YouTube
  narasi.mjs          ekspor naskah narasi untuk TTS
  potong-narasi.mjs   potong narasi utuh jadi audio per scene
  buat-video.mjs      siapkan video baru dari template + daftarkan
  cek-naskah.mjs      validasi naskah terhadap semua aturan
  cek-frame.mjs       lembar kontak frame kunci tiap scene
  grid-foto.mjs       pratinjau foto ber-grid untuk koordinat anotasi
  storyboard.mjs      storyboard per scene untuk persetujuan sebelum render
narasi/          naskah TTS hasil ekspor
src/
  data/          naskah video (yang paling sering kamu edit)
  scenes/        tampilan tiap jenis scene
  components/    KenBurns, Prop, AnimatedText, Caption, FilmOverlay
  HistoryVideo.tsx   menyusun scene + transisi + audio
  theme.ts       warna & font
public/
  photos/ props/ audio/
```

Catatan: props `.svg` di `public/props/` cuma contoh, ganti dengan hasil generate. `scripts/cari-foto.mjs` hanya mengambil foto domain publik, CC0, CC BY, dan CC BY-SA, dan kreditnya otomatis tampil di layar lewat `foto()`.
