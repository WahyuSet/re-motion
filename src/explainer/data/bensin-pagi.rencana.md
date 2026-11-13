# Rencana: Isi Bensin Pagi

Isi berurutan: Hook -> Narasi -> Peta Visual. Panduan: .claude/skills/video-explainer/referensi/hook-judul.md

Patokan terdekat: `nasi-warm` (sains sehari-hari, salah kaprah dibongkar, punchline hiperbola). Bedanya: ada satu
scene hitungan kecil (2 mL per liter, 60 mL per 30 liter) yang ditulis sebagai teks angka di panggung, bukan diagram.

## Hook
| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | Udara pagi lebih dingin beberapa derajat, kok bensinnya cuma nambah seteguk? | ISI BENSIN PAGI DI SPBU | CUMA NAMBAH SETEGUK? | 2 | 2 | 2 | 1 | 1 | 8 |
| 2 | bocoran | Yang nentuin isi bensinmu bukan jam, tapi tangki di bawah tanah. | ISI BENSIN PAGI DI SPBU | BUKAN SOAL JAM? | 1 | 2 | 2 | 1 | 1 | 7 |
| 3 | salah-kaprah | Kamu kira isi bensin pagi dapat lebih banyak, padahal bensinnya gak kenal pagi. | ISI BENSIN PAGI DI SPBU | DAPAT LEBIH BANYAK? | 1 | 2 | 2 | 2 | 1 | 8 |
| 4 | taruhan | Bangun subuh biar isi bensin lebih banyak, ternyata bonusnya cuma seteguk. | ISI BENSIN PAGI DI SPBU | DAPAT LEBIH BANYAK? | 2 | 2 | 2 | 1 | 2 | 9 |
| 5 | kok-kenapa | Bensin memuai kalau panas, kok isi pagi sama siang hasilnya sama? | ISI BENSIN PAGI DI SPBU | KOK HASILNYA SAMA? | 1 | 2 | 2 | 2 | 1 | 8 |

Terpilih: #4

## Thumbnail
Subjek lengkap: isi bensin pagi di SPBU
Gambar: props/bensin-pagi-pompa-motor.png
Uji 1 detik: orang yang cuma lihat gambarnya (selang pompa SPBU masuk ke tangki motor, cahaya pagi) tahu ini soal isi bensin

## Narasi
### Scene 1 (hook)
Bangun subuh biar isi bensin lebih banyak, ternyata bonusnya cuma *seteguk*.

### Scene 2 (stage, salah kaprah)
Banyak yang ngira pagi itu bensin lagi *padat-padatnya*, jadi satu liter isinya lebih banyak. Logikanya masuk sih, bensin memang *memuai* kalau panas.

### Scene 3 (beat)
Oke, *sini gue jelasin* kenapa bedanya kecil.

### Scene 4 (stage, fakta 1: tangki bawah tanah)
Masalahnya, bensin di SPBU disimpan di *tangki bawah tanah*. Tanah itu kayak selimut tebal, jadi suhunya *hampir gak berubah* dari pagi sampai sore.

### Scene 5 (stage, fakta 2: hitungan + punchline)
Anggap aja bensinnya beda *dua derajat*. Satu liter cuma nambah *dua mililiter*. Isi *tiga puluh liter*, bonusnya sekitar *enam puluh mililiter*, alias seteguk.

### Scene 6 (stage, penutup)
Jadi, waktu terbaik isi bensin ya pas *tangkinya mau habis*. Gak usah bangun subuh, mending *tidur cukup*.

Uji baca keras: tiap kalimat <= 18 kata, tanpa "padahal" (salah kaprah dibongkar lewat "Masalahnya"), tanpa kata
buku pelajaran, angka huruf. "Hampir gak berubah" dilunakkan dari pengukuran (tangki stabil, bukan tetap mutlak).
"Waktu terbaik ... pas tangkinya mau habis" meniru pernyataan Pertamina "waktu terbaik adalah saat konsumen membutuhkan".

## Peta Visual
### Scene 1
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Bangun subuh biar isi bensin lebih banyak, | pompa SPBU mengisi tangki motor + jam weker | props/bensin-pagi-pompa-motor.png, props/bensin-pagi-jam-weker.png | drop jam@subuh, jump jam@subuh, wiggle@bensin |
| ternyata bonusnya cuma *seteguk*. | gelas kecil berisi sedikit bensin + kucing speechless | props/bensin-pagi-gelas-seteguk.png | pop gelas@seteguk (womp), shake pompa@ternyata |

### Scene 2
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Banyak yang ngira pagi itu bensin lagi *padat-padatnya*, | kucing sinis (paw diganti: latar putih tidak bersih) | props/meme-kucing-sinis.png | wiggle@ngira, jump@padat-padatnya |
| jadi satu liter isinya lebih banyak. | botol bensin eceran satu liter + teks "Pagi = bonus?" | props/bensin-pagi-botol-liter.png, teks | drop botol@satu, teks@lebih (boing) |
| Logikanya masuk sih, | kucing mikir keras | props/meme-kucing-think.png | slide-left@Logikanya |
| bensin memang *memuai* kalau panas. | botol membesar + termometer | props/bensin-pagi-termometer.png | grow botol@memuai, move botol@memuai, pulse termometer@panas |

### Scene 3 (beat)
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Oke, *sini gue jelasin* kenapa bedanya kecil. | kucing jelasin | props/meme-kucing-jelasin.png | wiggle@jelasin |

### Scene 4
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Masalahnya, | tangki bawah tanah (potongan) | props/bensin-pagi-tangki-pendam.png | grow-up delay 0 |
| bensin di SPBU disimpan di *tangki bawah tanah*. | tangki berdenyut + teks "Tangki pendam" | props/bensin-pagi-tangki-pendam.png, teks | wiggle@SPBU, pulse@bawah |
| Tanah itu kayak selimut tebal, | selimut tebal jatuh | props/bensin-pagi-selimut.png | drop@selimut, squash@tebal |
| jadi suhunya *hampir gak berubah* dari pagi sampai sore. | termometer + teks celetukan "Pagi = sore" | props/bensin-pagi-termometer.png, teks | move tangki@jadi, slide-left termometer@suhunya, wiggle@hampir, teks@pagi |

### Scene 5
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Anggap aja bensinnya beda *dua derajat*. | termometer + teks "+2°C" | props/bensin-pagi-termometer.png, teks | pulse@dua |
| Satu liter cuma nambah *dua mililiter*. | botol satu liter + teks "+2 mL" | props/bensin-pagi-botol-liter.png, teks | drop botol@Satu, jump@nambah |
| Isi *tiga puluh liter*, | pompa SPBU mengisi motor (pengganti jeriken, Flow timeout) + teks "30 L" | props/bensin-pagi-pompa-motor.png, teks | slide-left@Isi, wiggle@tiga |
| bonusnya sekitar *enam puluh mililiter*, | teks "+60 mL" | teks | drop@enam (boom) |
| alias seteguk. | gelas seteguk + kucing titik ngintip | props/bensin-pagi-gelas-seteguk.png, props/meme-kucing-titik.png | pop gelas@alias, peek@seteguk |

### Scene 6
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Jadi, | indikator bensin di E | props/bensin-pagi-indikator-bensin.png | pop delay 0 |
| waktu terbaik isi bensin ya pas *tangkinya mau habis*. | indikator berdenyut | props/bensin-pagi-indikator-bensin.png | wiggle@terbaik, pulse@habis |
| Gak usah bangun subuh, | jam weker + silang | props/bensin-pagi-jam-weker.png, simbol silang | drop jam@subuh, silang@subuh |
| mending *tidur cukup*. | bantal + kucing jempol | props/bensin-pagi-bantal.png, props/meme-kucing-jempol.png | slide-up bantal@tidur, move@cukup, jempol@mending (ding) |
