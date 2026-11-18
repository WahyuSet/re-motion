<!-- DIBUAT OTOMATIS oleh npm run 3d:katalog. Jangan diedit. -->

# Katalog klip 3D

Pilih hanya dari daftar ini. Kalau tidak ada set yang cocok, berhenti dan laporkan "butuh set baru".

## rumah-luar

Cocok untuk: benda di dinding luar rumah: jendela, engsel, bukaan atas.

Syarat kalau dipakai di scene 1: `awal`: `terbuka`

### Isi

| Kunci | Pilihan | Bawaan |
|---|---|---|
| `jendela` | `kebalik`, `biasa`, `dua` | `kebalik` |
| `awal` | `tertutup`, `terbuka` | `tertutup` |

### Kamera

| Nama | Boleh di scene 1 | Area subjek (kiri, atas, kanan, bawah, persen layar) |
|---|---|---|
| `depan-dua` | ya | 10, 38, 86, 62 |
| `dekat-jendela` | tidak | 20, 30, 80, 62 |
| `dekat-engsel` | tidak | 18, 30, 82, 62 |
| `serong-debu` | tidak | 18, 28, 82, 62 |
| `prop-jendela` | tidak | hanya untuk `gambar` |

### Gerak

| Nama | Detik | Arti | Butuh | Syarat isi | Terus sampai akhir |
|---|---|---|---|---|---|
| `buka-jendela` | 1.2 | daun jendela membuka sampai miring | - | `awal`: `tertutup` | tidak |
| `kayang` | 0.8 | daun jendela kebalik terdorong makin miring lalu memantul | - | `jendela`: `kebalik` / `dua` | tidak |
| `engsel-nyala` | 0.5 | engsel menyala terang | - | - | ya |
| `karung-datang` | 1 | karung melayang menuju celah atas | - | `jendela`: `kebalik`; `awal`: `terbuka` | tidak |
| `karung-nyangkut` | 0.8 | karung masuk celah lalu goyang | `karung-datang` | - | ya |
| `debu-masuk` | 1.5 | debu terbang masuk lewat celah atas | - | `jendela`: `kebalik`; `awal`: `terbuka` | ya |

## potongan-udara

Cocok untuk: aliran udara di dalam rumah, dilihat sebagai potongan.

Syarat kalau dipakai di scene 1: -

### Isi

Tidak ada pilihan isi. Tulis `"isi": {}`.

### Kamera

| Nama | Boleh di scene 1 | Area subjek (kiri, atas, kanan, bawah, persen layar) |
|---|---|---|
| `potongan-tengah` | tidak | 10, 30, 86, 62 |

### Gerak

| Nama | Detik | Arti | Butuh | Syarat isi | Terus sampai akhir |
|---|---|---|---|---|---|
| `panas-naik` | 1.5 | panah merah naik dari lantai ke atas | - | - | ya |
| `panas-keluar` | 1.5 | panah merah keluar lewat bukaan atas | `panas-naik` | - | ya |
| `sejuk-masuk` | 1.5 | panah biru masuk dari bawah | - | - | ya |

## potongan-keramik

Cocok untuk: lantai keramik dilihat sebagai potongan: lapisan, pemuaian, keramik terangkat.

Syarat kalau dipakai di scene 1: -

### Isi

| Kunci | Pilihan | Bawaan |
|---|---|---|
| `panah` | `ada`, `tanpa` | `ada` |

### Kamera

| Nama | Boleh di scene 1 | Area subjek (kiri, atas, kanan, bawah, persen layar) |
|---|---|---|
| `potongan-lantai` | ya | 12, 30, 86, 66 |

### Gerak

| Nama | Detik | Arti | Butuh | Syarat isi | Terus sampai akhir |
|---|---|---|---|---|---|
| `dorong-samping` | 1.2 | panah merah mendorong dari kedua sisi | - | `panah`: `ada` | tidak |
| `keramik-naik` | 1.5 | dua keramik tengah terangkat membentuk tenda | - | - | tidak |

## ruang-primitif

Cocok untuk: ruangan sederhana dengan meja, kursi, dan benda yang bergerak.

Syarat kalau dipakai di scene 1: -

### Isi

Tidak ada pilihan isi. Tulis `"isi": {}`.

### Kamera

| Nama | Boleh di scene 1 | Area subjek (kiri, atas, kanan, bawah, persen layar) |
|---|---|---|
| `sudut-ruang` | ya | 12, 30, 86, 66 |

### Gerak

| Nama | Detik | Arti | Butuh | Syarat isi | Terus sampai akhir |
|---|---|---|---|---|---|
| `bola-gelinding` | 1.5 | bola menggelinding di lantai | - | - | tidak |
| `kardus-jatuh` | 0.8 | kardus jatuh dari meja | - | - | tidak |
