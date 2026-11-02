# Referensi desain: kenapa aturannya begitu

Baca ini kalau ingin memahami alasan di balik resep di SKILL.md, atau kalau user minta gaya yang berbeda. Untuk mengerjakan video, cukup ikuti SKILL.md.

Gaya video: dokumenter "jurnalisme visual" + "sketsa vintage", diadaptasi dari aturan desain [bang-motion](https://github.com/bangtutorial/bang-motion) (MIT): referensi `explainer.md` dan `anti-ppt.md`.

## Yang membuat video terasa seperti slideshow

| Gejala | Penyebab | Yang dipakai di template ini |
|--------|----------|------------------------------|
| Satu foto diam 8 detik | Ganti scene = ganti slide | 2–4 shot per scene, kamera selalu bergerak (`move`) |
| Foto + subtitle saja | Hanya 2 lapisan | Minimal 3 lapisan: tag, judul berstabilo, anotasi, stempel, badge angka, grid |
| Kicker + judul 2 baris + body | Hierarki teks layout slide | Judul maks. 5 kata, sisanya dibawa narasi/subtitle |
| Teks muncul tanpa sebab | Tidak terikat suara | Judul, angka, stempel, tombol CTA muncul tepat saat katanya diucapkan |
| Blur/whip/zoom di setiap cut | Bahasa preset editor | `dorong`/`kartu` sebagai transisi utama; `zoom`/`whip` maks. sekali, harus termotivasi |
| Angka besar menutupi foto sampai akhir scene | Angka = slide judul | Angka menghitung lalu mengecil jadi badge di pojok |
| Efek mencolok di mana-mana | Tidak ada momen istimewa | Stempel maks. 2, zoom maks. 1 |

## Elemen layout

- **Tag** (IBM Plex Mono, batas kuning): konteks "tempat · waktu" (kiri atas, per scene) atau "sumber/isi foto" (kanan atas, per shot). Gaya label jurnalisme visual.
- **Judul berstabilo** (Playfair 900): satu pernyataan pendek. Stabilo kuning hanya di frasa kunci, menyapu dari kiri setelah kata mendarat.
- **Anotasi**: elips merah gaya coretan tangan + label merah. Menunjuk detail yang sedang dibicarakan. Paling akurat di shot `print` karena gambarnya tidak terpotong.
- **Stempel** (Cinzel, merah, garis ganda): cap yang menghentak. Untuk momen penting (ditemukan, dibersihkan, diresmikan, dilarang).
- **Badge angka**: angka menghitung besar di tengah saat diucapkan, lalu menyusut ke kiri atas.
- **Tahun hantu** (Cinzel, garis emas transparan): otomatis di fact `format: 'year'`.
- **Grid berulang** (`ulang`): satu foto diulang jadi ubin yang bermunculan seiring angka, untuk memperlihatkan "sebanyak itu".
- **Foto cetak** (`layout: 'print'`): bingkai kertas miring di atas latar blur yang bergerak berlawanan (paralaks). Untuk foto arsip, potret, peta, dokumen.
- **Overlay film**: grain, debu melayang, cahaya hangat bergeser, vignette. Selalu ada, jadi tidak ada frame yang diam total.

## Transisi

| Nilai | Rasa | Kapan |
|-------|------|-------|
| `dorong` | Scene baru mendorong yang lama ke samping, paralaks, tanpa blur | Default, lanjut cerita |
| `kartu` | Scene baru datang dari kedalaman seperti kartu | Ganti topik/babak |
| `none` | Potong langsung | Antar dua scene fakta berturut-turut |
| `zoom` | Menyelam ke scene berikutnya | 1x, misal masuk ke masa lalu/foto lama |
| `whip` | Kibasan kamera dengan blur | 1x, momen kejutan |
| `fade`, `slide`, `wipe` | Klasik | Jarang; hanya kalau diminta |

## Ukuran & kontras (layar 1920×1080)

- Tag/label 30 px, subtitle 50 px, judul 92 px, angka fakta 300 px, kredit 26 px.
- Kontras dari "kantong gelap" gradien di atas & bawah layar, bukan dari glow tebal.

## Cek rasa satu frame (dari anti-PPT bang-motion)

1. Frame ini bisa jadi slide presentasi tanpa diubah? Kalau ya, tambah lapisan atau ganti layout shot.
2. Mata tahu harus melihat ke mana dalam 0,2 detik? Kalau tidak, kurangi elemen.
3. Ada yang bergerak karena kamera, bukan hanya elemen yang muncul? Harus selalu ada.

## Mengubah tampilan

Komponen visual ada di `src/components/` (Layout.tsx, ShotStack.tsx, Subtitle.tsx, transitions.tsx, FilmOverlay.tsx) dan `src/scenes/`. Warna & font di `src/theme.ts`. Ubah hanya kalau user meminta perubahan gaya; untuk video baru cukup edit file di `src/data/`.
