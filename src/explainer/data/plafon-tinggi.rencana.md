# Rencana: Plafon Tinggi

Patokan terdekat: `jendela-kebalik` (rumah, dua keadaan, semua latar klip 3D Blender).
Beda dari patokan: perbandingan plafon rendah dan tinggi memakai set baru `potongan-plafon`.
Rencana klip: `plafon-tinggi.3d.json`, render: `npm run 3d:render -- plafon-tinggi` (skill `video-3d`).
Overlay (stiker, simbol, meme) ditaruh di pita atas dan bawah, di luar zona subjek kamera.

## Hook
| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | Rumah zaman dulu tanpa AC, kok bisa lebih adem dari rumah sekarang? | RUMAH ZAMAN DULU | TANPA AC KOK ADEM? | 2 | 2 | 2 | 2 | 1 | 9 |
| 2 | bocoran | Plafon rumah zaman dulu tinggi bukan buat gaya, tapi buat ngusir panas. | PLAFON RUMAH DULU | BUKAN BUAT GAYA | 2 | 2 | 2 | 1 | 2 | 9 |
| 3 | salah-kaprah | Kamu kira plafon tinggi biar mewah, padahal itu cara ngakalin panas. | PLAFON TINGGI | BUKAN BIAR MEWAH | 2 | 2 | 1 | 1 | 2 | 8 |
| 4 | taruhan | Plafon rumah nenek yang tinggi itu ternyata pendingin ruangan gratis. | PLAFON RUMAH NENEK | PENDINGIN GRATIS? | 2 | 1 | 2 | 2 | 1 | 8 |
| 5 | kok-kenapa | Plafon rumah zaman dulu tinggi banget, kok malah bikin adem? | RUMAH ZAMAN DULU | PLAFONNYA KOK TINGGI? | 2 | 2 | 2 | 2 | 2 | 10 |

Terpilih: #5

#1 butuh klaim "lebih adem dari rumah sekarang" yang tidak ada sumbernya. #5 paling pendek dan jawabannya belum dibuka.

## Thumbnail
Subjek lengkap: plafon rumah zaman dulu
Gambar: props/plafon-tinggi-potongan.png
Uji 1 detik: potongan dua rumah berdampingan, plafon kanan jauh lebih tinggi dari kiri

## Narasi
### Scene 1 (hook)
Plafon rumah zaman dulu tinggi banget, kok malah bikin *adem*?

### Scene 2 (stage, salah kaprah)
Banyak yang ngira biar kelihatan *mewah*. Biar tamu yang datang langsung *minder*. Padahal alasannya soal *panas*.

### Scene 3 (beat)
Oke, *sini gue jelasin* kenapa plafonnya dibikin tinggi.

### Scene 4 (stage, alasan 1)
Udara panas lebih ringan, jadi *naik ke atas*. Panasnya numpuk di bawah *plafon*. Kalau plafonnya rendah, panasnya turun sampai *kepala*. Kalau tinggi, panasnya *ngekos di atas*.

### Scene 5 (stage, alasan 2)
Alasan kedua, *genteng*. Siang hari genteng panas banget, terus panasnya mancar ke bawah. Makin jauh dari genteng, makin *adem*. Ada *lubang angin* juga, buat buang panasnya keluar.

### Scene 6 (stage, penutup)
Kalau rumahnya pakai AC, plafon tinggi malah bikin AC kerja *lebih berat*. Jadi plafon tinggi itu bukan biar tamu minder. Tapi biar penghuninya *gak kepanasan*.

Uji baca keras: tiap kalimat 1 gagasan, maks. 13 kata; tanpa "sehingga/akan/memiliki"; "padahal" sekali; klaim tidak mutlak; angka tinggi plafon tidak disebut karena tidak bersumber.

## Komedi
| # | Jenis | Kalimat joke | Punchline | Visual gag |
|---|---|---|---|---|
| 1 | sindiran | Biar tamu yang datang langsung minder. | minder | Meme kucing judes 260 px drop di kata "minder" + SFX `fahh`, tertahan sampai kata "panas". |
| 2 | personifikasi | Kalau tinggi, panasnya ngekos di atas. | ngekos di atas | Stiker besar "NGEKOS DI ATAS" (ukuran 56, miring) drop di kata "ngekos" + SFX `boing`; lapisan panas di klip 3D menumpuk jauh di atas kursi; scene tahan 24 frame. |
| 3 | callback | Tapi biar penghuninya gak kepanasan. | gak kepanasan | Meme kucing senyum 240 px drop di kata "gak" + SFX `ack`; scene terakhir ditahan engine. |

## Peta Visual
### Scene 1
Klip 01 (`potongan-dua`): potongan rumah plafon rendah (kiri) dan tinggi (kanan), tanpa gerak supaya stiker bebas.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Plafon rumah zaman dulu tinggi banget, | dua potongan rumah + tanda tanya + stiker ZAMAN DULU di bawah rumah tinggi | simbol tanya (utama), teks "ZAMAN DULU" | utama frame 0, wiggle@Plafon, pop teks@zaman |
| kok malah bikin *adem*? | stiker ADEM di atas rumah tinggi, tanda tanya lompat | teks "ADEM", simbol tanya | drop teks@adem, jump tanya@adem |

### Scene 2
Klip 02 (`dekat-tinggi`): ruang plafon tinggi, tanpa gerak.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Banyak yang ngira biar kelihatan *mewah*. | stiker MEWAH? + celetukan "rumah sultan" | teks "MEWAH?", teks "rumah sultan" | drop delay 0, wiggle@mewah, pop celetukan@mewah |
| Biar tamu yang datang langsung *minder*. | gag kucing judes | props/meme-kucing-judes.png | move MEWAH?@tamu, drop meme@minder (fahh) |
| Padahal alasannya soal *panas*. | stiker SOAL PANAS | teks "SOAL PANAS" | jump meme@Padahal, drop teks@panas |

### Scene 3
Beat standar: kanvas krem, banner "Oke, sini gue jelasin.", meme kucing jelasin.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Oke, *sini gue jelasin* kenapa plafonnya dibikin tinggi. | kucing jelasin | props/meme-kucing-jelasin.png | pop, wiggle@jelasin |

### Scene 4
Klip 04 (`potongan-dua`): panah panas naik di kedua ruang, lapisan panas menumpuk di bawah plafon, garis kepala muncul. Di ruang rendah lapisan turun sampai garis kepala.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Udara panas lebih ringan, | stiker LEBIH RINGAN | teks "LEBIH RINGAN" | drop delay 0, wiggle@ringan |
| jadi *naik ke atas*. | panah naik di klip + stiker NAIK | teks "NAIK" | pop@naik, move@atas |
| Panasnya numpuk di bawah *plafon*. | lapisan panas di klip + stiker NUMPUK DI PLAFON | teks "NUMPUK DI PLAFON" | pop@Panasnya, shake@plafon |
| Kalau plafonnya rendah, | stiker RENDAH di atas rumah kiri | teks "RENDAH" | pop@Kalau |
| panasnya turun sampai *kepala*. | garis kepala di klip + stiker KENA KEPALA | teks "KENA KEPALA" | pop@kepala |
| Kalau tinggi, | stiker TINGGI di atas rumah kanan | teks "TINGGI" | pop@tinggi |
| panasnya *ngekos di atas*. | gag NGEKOS DI ATAS | teks "NGEKOS DI ATAS" | drop@ngekos (boing) |

### Scene 5
Klip 05 (`dekat-tinggi`): genteng berpendar, panah oranye turun dari plafon, panah panas naik, lubang angin terbuka dan panas keluar, panah biru masuk di bawah.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Alasan kedua, *genteng*. | genteng berpendar di klip + stiker GENTENG | teks "GENTENG" | drop@genteng, wiggle@kedua |
| Siang hari genteng panas banget, | stiker PANAS BANGET | teks "PANAS BANGET" | pop@Siang, shake@banget |
| terus panasnya mancar ke bawah. | panah oranye turun di klip + stiker MANCAR KE BAWAH | teks "MANCAR KE BAWAH" | pop@terus |
| Makin jauh dari genteng, | stiker MAKIN JAUH | teks "MAKIN JAUH" | pop@Makin |
| makin *adem*. | stiker MAKIN ADEM | teks "MAKIN ADEM" | pop@adem |
| Ada *lubang angin* juga, | lubang angin terbuka di klip + stiker LUBANG ANGIN | teks "LUBANG ANGIN" | pop@Ada, wiggle@lubang |
| buat buang panasnya keluar. | panah keluar di klip + stiker BUANG PANAS | teks "BUANG PANAS" | pop@buat, move@keluar |

### Scene 6
Klip 06 (`dekat-rendah`): ruang plafon rendah, panah biru (udara AC) masuk.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Kalau rumahnya pakai AC, | panah biru di klip + stiker PAKAI AC | teks "PAKAI AC" | pop@Kalau, wiggle@AC |
| plafon tinggi malah bikin AC kerja *lebih berat*. | stiker AC KERJA BERAT | teks "AC KERJA BERAT" | pop@plafon, shake@berat |
| Jadi plafon tinggi itu bukan biar tamu minder. | prop potongan dua rumah (thumbnail) + silang | props/plafon-tinggi-potongan.png, simbol silang | pop prop@Jadi, pop silang@bukan, wiggle prop@minder |
| Tapi biar penghuninya *gak kepanasan*. | gag kucing senyum | props/meme-kucing-senyum.png | drop@gak (ack) |
