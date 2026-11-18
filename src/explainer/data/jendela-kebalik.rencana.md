# Rencana: Jendela Kebalik

Patokan terdekat: `kabel-kendor` (teknik sehari-hari, dua keadaan: jendela biasa vs kebalik).
Beda dari patokan: latar tiap scene berupa **klip 3D Blender** (`latarVideo`, diminta user), bukan foto Flow.
Rencana klip: `jendela-kebalik.3d.json`, render: `npm run 3d:render -- jendela-kebalik`.
Overlay (stiker, simbol, meme) ditaruh di luar area jendela pada klip.

## Hook
| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | Jendela biasa bukanya di bawah, kok jendela ini malah bukanya di atas? | JENDELA BUKA ATAS | KOK BUKAN DI BAWAH? | 2 | 2 | 1 | 2 | 2 | 9 |
| 2 | bocoran | Jendela kebalik ini bukan salah tukang, tapi sengaja biar maling nyangkut. | JENDELA KEBALIK | BUKAN SALAH TUKANG | 2 | 2 | 1 | 1 | 2 | 8 |
| 3 | salah-kaprah | Kamu kira tukangnya salah pasang, padahal jendela kebalik ini sengaja. | JENDELA KEBALIK | SENGAJA DIPASANG? | 2 | 2 | 1 | 2 | 2 | 9 |
| 4 | taruhan | Jendela yang dipasang kebalik ini ternyata bikin maling susah masuk. | JENDELA KEBALIK | MALING SUSAH MASUK | 2 | 1 | 1 | 1 | 2 | 7 |
| 5 | kok-kenapa | Di Jawa banyak jendela dipasang kebalik, kok malah dibiarin? | JENDELA DI JAWA | KOK DIPASANG KEBALIK? | 2 | 2 | 1 | 2 | 2 | 9 |

Terpilih: #5

Seri skor 9 dengan #1 dan #3; #5 paling pendek (9 kata) dan sama dengan topik yang diminta.

## Thumbnail
Subjek lengkap: jendela di Jawa
Gambar: props/jendela-kebalik-jendela.png
Uji 1 detik: gambar jendela kayu yang daunnya miring terbuka di atas dengan engsel kuning di bawah, langsung kelihatan "kebalik"

## Narasi
### Scene 1 (hook)
Di Jawa banyak jendela dipasang *kebalik*, kok malah dibiarin?

### Scene 2 (stage, salah kaprah)
Banyak yang ngira tukangnya salah pasang. Soalnya engselnya di *bawah*, bukaannya malah di *atas*. Jendelanya kayak lagi *kayang*.

### Scene 3 (beat)
Oke, *sini gue jelasin* kenapa jendelanya sengaja dibalik.

### Scene 4 (stage, alasan 1)
Alasan pertama, biar aman dari *maling*. Engselnya di bawah, jadi jendelanya cuma kebuka miring. Maling yang nekat masuk malah *nyangkut kayak jemuran*. Anak kecil juga susah manjat keluar.

### Scene 5 (stage, alasan 2)
Alasan kedua, *udara panas*. Udara panas lebih ringan, jadi naik ke atas. Udara panas keluar lewat bukaan atas. Udara sejuk masuk gantiin. Sirkulasi udaranya jadi *lancar*.

### Scene 6 (stage, penutup)
Jendela engsel bawah dulu umum di Indonesia. Sejak tahun sembilan puluhan, pelan-pelan ditinggal. Kekurangannya, *debu* gampang masuk. Jadi bukan salah pasang, jendelanya cuma *beda angkatan*.

Uji baca keras: tiap kalimat 1 gagasan, maks. 11 kata; tanpa "sehingga/akan/memiliki"; "padahal" tidak dipakai; klaim tidak mutlak ("banyak", "susah", "gampang").

## Komedi
| # | Jenis | Kalimat joke | Punchline | Visual gag |
|---|---|---|---|---|
| 1 | personifikasi | Jendelanya kayak lagi kayang. | kayang | Stiker besar "LAGI KAYANG" (ukuran 64) drop di kata "kayang" + SFX `boing`, kucing titik peek; scene tahan 24 frame. |
| 2 | hiperbola | Maling yang nekat masuk malah nyangkut kayak jemuran. | kayak jemuran | Meme kucing syok 280 px drop di kata "kayak" + SFX `fahh`, karung maling di klip 3D sedang nyangkut di celah atas jendela; tertahan sampai akhir scene. |
| 3 | callback | Jadi bukan salah pasang, jendelanya cuma beda angkatan. | beda angkatan | Stiker besar "BEDA ANGKATAN" (ukuran 56) drop di kata "beda" + SFX `ack`; scene tahan 30 frame. |

## Peta Visual
### Scene 1
Klip 01: dua jendela, kiri biasa (bukaan bawah), kanan kebalik (bukaan atas), keduanya membuka.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Di Jawa banyak jendela dipasang *kebalik*, | dua jendela di klip + tanda tanya + stiker NORMAL / KEBALIK | simbol tanya (utama), teks "NORMAL", teks "KEBALIK" | utama frame 0, wiggle@banyak, pop NORMAL@jendela, drop KEBALIK@kebalik |
| kok malah dibiarin? | tanda tanya lompat, stiker KEBALIK goyang | simbol tanya, teks "KEBALIK" | jump@dibiarin, shake KEBALIK@dibiarin |

### Scene 2
Klip 02: dekat ke jendela kebalik, engsel bawah menyala, daun membuka di atas.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Banyak yang ngira tukangnya salah pasang. | stiker SALAH PASANG? | teks "SALAH PASANG?" | drop delay 0, wiggle@tukangnya |
| Soalnya engselnya di *bawah*, | panah ke engsel + stiker ENGSEL BAWAH | simbol panah, teks "ENGSEL BAWAH" | pop panah@engselnya, jump@bawah, pop teks@bawah |
| bukaannya malah di *atas*. | stiker BUKA DI ATAS, panah pindah ke atas | teks "BUKA DI ATAS", simbol panah | pop teks@bukaannya, move panah@atas |
| Jendelanya kayak lagi *kayang*. | kucing titik + gag LAGI KAYANG | props/meme-kucing-titik.png, teks "LAGI KAYANG" | pop meme@Jendelanya, drop teks@kayang (boing), peek meme@kayang |

### Scene 3
Beat standar: kanvas krem, banner "Oke, sini gue jelasin.", meme kucing jelasin.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Oke, *sini gue jelasin* kenapa jendelanya sengaja dibalik. | kucing jelasin | props/meme-kucing-jelasin.png | pop, wiggle@jelasin |

### Scene 4
Klip 04: jendela kebalik terbuka, karung maling melayang masuk lalu nyangkut di celah atas.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Alasan pertama, biar aman dari *maling*. | stiker ANTI MALING + celetukan netizen | teks "ANTI MALING", teks "anti maling bos" | drop delay 0, wiggle@maling, pop celetukan@aman |
| Engselnya di bawah, | panah ke engsel | simbol panah | pop@Engselnya |
| jadi jendelanya cuma kebuka miring. | stiker CUMA MIRING | teks "CUMA MIRING" | pop@kebuka, jump panah@miring |
| Maling yang nekat masuk malah *nyangkut kayak jemuran*. | karung nyangkut di klip + stiker NYANGKUT! + gag kucing syok | teks "NYANGKUT!", props/meme-kucing-syok.png | move panah@Maling, pop teks@nyangkut, drop meme@kayak (fahh) |
| Anak kecil juga susah manjat keluar. | stiker ANAK AMAN + centang | teks "ANAK AMAN", simbol centang | pop teks@Anak, pop centang@keluar |

### Scene 5
Klip 05: potongan rumah, panah merah (panas) naik lalu keluar lewat bukaan atas jendela, panah biru (sejuk) masuk dari pintu.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Alasan kedua, *udara panas*. | stiker UDARA PANAS | teks "UDARA PANAS" | drop delay 0, wiggle@udara |
| Udara panas lebih ringan, | stiker LEBIH RINGAN | teks "LEBIH RINGAN" | pop@lebih |
| jadi naik ke atas. | panah naik | simbol panah | pop@naik, move@atas |
| Udara panas keluar lewat bukaan atas. | stiker KELUAR dekat jendela, panah pindah ke bukaan | teks "KELUAR", simbol panah | pop teks@keluar, move panah@bukaan |
| Udara sejuk masuk gantiin. | stiker UDARA SEJUK di dekat panah biru | teks "UDARA SEJUK" | slide-right@sejuk |
| Sirkulasi udaranya jadi *lancar*. | centang | simbol centang | pop@Sirkulasi, jump@lancar |

### Scene 6
Klip 06: jendela kebalik terbuka, debu berjatuhan masuk lewat bukaan atas.

| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Jendela engsel bawah dulu umum di Indonesia. | prop jendela kebalik (render Blender) + stiker DULU UMUM | props/jendela-kebalik-jendela.png, teks "DULU UMUM" | pop prop delay 0, pop teks@dulu, wiggle prop@umum |
| Sejak tahun sembilan puluhan, | stiker 90-AN | teks "90-AN" | drop@Sejak |
| pelan-pelan ditinggal. | prop jendela meredup | props/jendela-kebalik-jendela.png | dim@ditinggal, shake 90-AN@ditinggal |
| Kekurangannya, *debu* gampang masuk. | debu di klip + stiker MINUS + kucing tutup hidung | teks "MINUS: DEBU MASUK", props/meme-kucing-tutuphidung.png | pop teks@Kekurangannya, pop meme@debu |
| Jadi bukan salah pasang, | silang | simbol silang | move prop@Jadi, pop silang@bukan |
| jendelanya cuma *beda angkatan*. | gag BEDA ANGKATAN | teks "BEDA ANGKATAN" | drop@beda (ack) |
