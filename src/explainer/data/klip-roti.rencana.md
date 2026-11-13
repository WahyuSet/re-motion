# Rencana: Klip Roti

Isi berurutan: Hook -> Narasi -> Komedi -> Peta Visual. Panduan: .claude/skills/video-explainer/referensi/hook-judul.md dan narasi.md

Patokan: `bensin-pagi` (salah kaprah benda sehari-hari, 6 scene stage, angka ditulis sebagai teks panggung).
Bedanya: scene 4 berisi daftar 5 warna yang muncul satu per satu (klip + teks hari), bukan hitungan; dan ada
3 joke tertulis (bensin-pagi dibuat sebelum aturan komedi), dengan callback "sandal jepit" di penutup.

Target durasi: ±102 kata x 2,65 kata/detik ≈ 38,5 detik bicara + jeda antar scene + tahan ≈ 43 detik.

## Hook
| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | Klip roti cuma lima warna, kok bisa kasih tahu umur rotimu? | WARNA KLIP ROTI | CUMA 5 WARNA? | 2 | 2 | 2 | 1 | 2 | 9 |
| 2 | bocoran | Warna klip roti itu bukan hiasan, tapi *kode rahasia*. | WARNA KLIP ROTI | TERNYATA ADA ARTINYA? | 2 | 2 | 2 | 2 | 2 | 10 |
| 3 | salah-kaprah | Kamu kira klip roti cuma penjepit, padahal warnanya punya arti. | WARNA KLIP ROTI | CUMA PENJEPIT? | 2 | 2 | 2 | 1 | 2 | 9 |
| 4 | taruhan | Klip roti yang kamu buang tiap pagi ternyata nyimpan kode rahasia. | WARNA KLIP ROTI | TERNYATA KODE RAHASIA | 2 | 2 | 2 | 2 | 2 | 10 |
| 5 | kok-kenapa | Rotinya sama persis, kok warna klipnya beda-beda? | WARNA KLIP ROTI | KOK BEDA-BEDA? | 2 | 2 | 2 | 2 | 1 | 9 |

Terpilih: #2

#2 dan #4 seri (10); dipilih #2 karena lebih pendek (9 kata). Jawabannya baru dibocorkan setengah ("kode rahasia", belum disebut kode apa).

## Thumbnail
Subjek lengkap: warna klip roti
Gambar: props/klip-roti-roti-klip.png
Uji 1 detik: orang yang cuma lihat gambarnya (roti tawar dalam plastik dijepit klip biru, di depannya klip hijau, merah, putih, kuning) tahu ini soal warna klip roti

## Narasi
### Scene 1 (hook)
Warna klip roti itu bukan hiasan, tapi *kode rahasia*.

### Scene 2 (stage, salah kaprah)
Selama ini klip roti cuma kita anggap penjepit. Habis rotinya, klipnya naik pangkat jadi tambalan *sandal jepit*.

### Scene 3 (beat)
Oke, *sini gue jelasin* arti warnanya.

### Scene 4 (stage, fakta 1: kode hari)
Di banyak pabrik roti, warna klip itu kode *hari dipanggang*. Biru Senin, hijau Selasa, merah Kamis, putih Jumat, kuning Sabtu.

### Scene 5 (stage, fakta 2: buat siapa kodenya + punchline)
Roti tawar toko cuma tahan sekitar *tujuh hari*. Nah, kodenya buat petugas, biar roti lama cepat ditarik dari rak. Bukan buat kamu yang ngubek rak sampai *paling belakang*.

### Scene 6 (stage, penutup)
Tapi kodenya bisa beda tiap merek. Jadi, cek *tanggal di klipnya*. Klip bekasnya? Balikin ke tugas mulianya, nambal *sandal jepit*.

Uji baca keras:
1. Satu kalimat satu gagasan: kalimat terpanjang 12 kata ("Nah, kodenya buat petugas, biar roti lama cepat ditarik dari rak."). Daftar warna dipecah per koma, tiap koma 2 kata.
2. Tanpa kata buku pelajaran (tidak ada sehingga/akan/memiliki/dapat/namun).
3. Subjek disebut: "kodenya" selalu merujuk "warna klip" yang baru disebut; "roti lama", "rak", "klip bekasnya" disebut bendanya.
4. Penghubung: "Nah" pindah ke inti (buat siapa kode itu), "Tapi" kontras (kode tidak seragam), "Jadi" solusi. Tanpa "padahal".
5. Klaim mutlak dilunakkan: "di banyak pabrik roti" (bukan semua), "sekitar tujuh hari", "bisa beda tiap merek".
6. Logika: kenapa perlu kode → roti cepat basi (tujuh hari) → petugas harus tarik roti lama → kode warna buat petugas → tapi tidak seragam → baca tanggal.
7. Kalimat selesai semua; "Klip bekasnya?" dijawab kalimat sesudahnya.

## Komedi
| # | Jenis | Kalimat joke | Punchline | Visual gag |
|---|---|---|---|---|
| 1 | sindiran | Habis rotinya, klipnya naik pangkat jadi tambalan sandal jepit. | sandal jepit | Sandal jepit putus yang ditambal klip roti (props/klip-roti-sandal-klip.png, 360px) pop besar di tengah tepat di kata "sandal" + SFX `boing`, teks celetukan "Naik pangkat!"; scene tahan 30 frame (>= 1,2 dtk). |
| 2 | sindiran | Bukan buat kamu yang ngubek rak sampai paling belakang. | paling belakang | Tangan merogoh rak roti sampai ke belakang (props/klip-roti-tangan-ngubek.png, 380px) masuk besar di tengah tepat di kata "paling" + SFX `fahh` + shake; scene tahan 30 frame. |
| 3 | callback | Balikin ke tugas mulianya, nambal sandal jepit. | sandal jepit | Sandal jepit tambalan klip balik lagi (360px) di tengah tepat di kata "sandal" + SFX `boing`, kucing jempol; scene terakhir ditahan otomatis 1 dtk. |

## Peta Visual
### Scene 1
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Warna klip roti itu bukan hiasan, | roti tawar berklip + klip biru lepas + teks "Hiasan?" disilang | props/klip-roti-roti-klip.png, props/klip-roti-klip-biru.png, teks "Hiasan?", simbol silang | wiggle roti@klip, drop klip-biru@roti, silang@hiasan |
| tapi *kode rahasia*. | teks "KODE RAHASIA" + tanda tanya | teks "KODE RAHASIA", simbol tanya | drop teks@kode (boom), pulse roti@rahasia, jump klip@rahasia |

### Scene 2
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Selama ini klip roti cuma kita anggap penjepit. | klip biru besar + kucing sinis | props/klip-roti-klip-biru.png, props/meme-kucing-sinis.png | slide-up klip delay 0, wiggle@anggap, jump@penjepit, peek kucing@penjepit |
| Habis rotinya, | bungkus roti kosong | props/klip-roti-bungkus-kosong.png | slide-left@Habis, squash@rotinya |
| klipnya naik pangkat jadi tambalan *sandal jepit*. | klip naik ke atas + teks "Naik pangkat!" lalu sandal jepit tambalan klip (gag) | props/klip-roti-sandal-klip.png, teks "Naik pangkat!" | move klip@naik, teks@pangkat, pop sandal@sandal (boing) |

### Scene 3 (beat)
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Oke, *sini gue jelasin* arti warnanya. | kucing jelasin | props/meme-kucing-jelasin.png | wiggle@jelasin |

### Scene 4
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Di banyak pabrik roti, | pabrik roti: roti keluar oven | props/klip-roti-pabrik-roti.png | slide-up delay 0, wiggle@pabrik |
| warna klip itu kode *hari dipanggang*. | teks "KODE HARI PANGGANG" | teks | pop teks@kode, pulse pabrik@dipanggang, move pabrik@warna |
| Biru Senin, | klip biru + teks "SENIN" | props/klip-roti-klip-biru.png, teks | pop klip@Biru, teks@Senin |
| hijau Selasa, | klip hijau + teks "SELASA" | props/klip-roti-klip-hijau.png, teks | pop klip@hijau, teks@Selasa |
| merah Kamis, | klip merah + teks "KAMIS" | props/klip-roti-klip-merah.png, teks | pop klip@merah, teks@Kamis |
| putih Jumat, | klip putih + teks "JUMAT" | props/klip-roti-klip-putih.png, teks | pop klip@putih, teks@Jumat |
| kuning Sabtu. | klip kuning + teks "SABTU" | props/klip-roti-klip-kuning.png, teks | drop klip@kuning, teks@Sabtu, jump@Sabtu |

### Scene 5
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Roti tawar toko cuma tahan sekitar *tujuh hari*. | roti tawar berklip + kalender seminggu + teks "± 7 HARI" | props/klip-roti-roti-klip.png, props/klip-roti-kalender.png, teks | pop roti delay 0, wiggle@tahan, pop kalender@tujuh, teks@hari |
| Nah, | roti bergeser | props/klip-roti-roti-klip.png | move roti@Nah |
| kodenya buat petugas, | petugas minimarket menarik roti dari rak | props/klip-roti-petugas.png | slide-left@petugas |
| biar roti lama cepat ditarik dari rak. | petugas menarik roti + teks "Roti lama ditarik" | props/klip-roti-petugas.png, teks | move petugas@ditarik, teks@lama |
| Bukan buat kamu yang ngubek rak sampai *paling belakang*. | kucing judes nunjuk lalu tangan merogoh rak sampai belakang (gag) | props/meme-kucing-judes.png, props/klip-roti-tangan-ngubek.png | pop judes@kamu (slap), pop tangan@paling (fahh), shake@belakang |

### Scene 6
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Tapi kodenya bisa beda tiap merek. | roti tawar berklip + tanda tanya | props/klip-roti-roti-klip.png, simbol tanya | pop roti delay 0, wiggle@beda, tanya@merek |
| Jadi, | roti bergeser | props/klip-roti-roti-klip.png | move roti@Jadi |
| cek *tanggal di klipnya*. | klip bertanggal + centang | props/klip-roti-klip-tanggal.png, simbol centang | pop klip-tanggal@tanggal, centang@klipnya (ding) |
| Klip bekasnya? | klip biru bekas + kucing mikir | props/klip-roti-klip-biru.png, props/meme-kucing-think.png | drop klip@Klip, wiggle@bekasnya |
| Balikin ke tugas mulianya, | klip pindah ke tengah | props/klip-roti-klip-biru.png | move klip@Balikin |
| nambal *sandal jepit*. | sandal jepit tambalan klip (gag callback) + kucing jempol | props/klip-roti-sandal-klip.png, props/meme-kucing-jempol.png | pop sandal@sandal (boing), jempol@nambal (ding) |
