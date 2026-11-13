# Rencana: Kucing Jatuh Telentang, Kok Mendarat Pakai Kaki? (remake)

Isi berurutan: Hook -> Narasi -> Komedi -> Peta Visual. Panduan: .claude/skills/video-explainer/referensi/hook-judul.md dan narasi.md

Patokan terdekat: `nasi-warm` (sains sehari-hari, scene `stage` saja, sebab-akibat dengan `move`). Bedanya:
subjeknya hewan, jadi penjelasan dibuat bertahap per pose kucing (telentang -> nekuk -> kaki depan dilipat ->
mendarat) dengan prop kucing oren yang sama supaya terasa satu kucing. Remake dari versi legacy (watermark mati,
tanpa rencana, tanpa joke); prop `refleks-kucing-mendarat` dan `refleks-kucing-depan-belakang` dipakai ulang.

## Hook
| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | Kucing jatuh sejauh apa pun, kok ngebutnya cuma setengah manusia? | KUCING JATUH | CUMA SETENGAH NGEBUT? | 1 | 2 | 1 | 2 | 1 | 7 |
| 2 | bocoran | Yang bikin kucing mendarat pakai kaki bukan ekornya, tapi pinggangnya. | KUCING MENDARAT | BUKAN KARENA EKOR? | 2 | 2 | 2 | 1 | 1 | 8 |
| 3 | salah-kaprah | Kamu kira kucing punya sembilan nyawa, padahal dia cuma jago muter di udara. | KUCING 9 NYAWA? | CUMA JAGO MUTER | 1 | 2 | 2 | 1 | 1 | 7 |
| 4 | taruhan | Kucing oren gendut di rumahmu ternyata paling susah mendarat pakai kaki. | KUCING OREN GENDUT | SUSAH MENDARAT? | 2 | 1 | 2 | 1 | 2 | 8 |
| 5 | kok-kenapa | Kucing jatuh telentang, kok bisa mendarat pakai kaki? | KUCING JATUH TELENTANG | KOK MENDARAT PAKAI KAKI? | 2 | 2 | 2 | 2 | 2 | 10 |

Terpilih: #5

## Thumbnail
Subjek lengkap: kucing jatuh telentang
Gambar: props/refleks-kucing-telentang.png
Uji 1 detik: orang yang cuma lihat gambarnya (kucing oren melayang telentang, perut ke atas) tahu ini soal kucing jatuh

## Narasi
### Scene 1 (hook)
Kucing jatuh telentang, kok bisa mendarat pakai *kaki*?

### Scene 2 (stage, salah kaprah + joke 1)
Banyak yang ngira kucing punya *sembilan nyawa*. Habis jatuh, dia langsung jilat badan, pura-pura gak kenapa-napa. Persis kayak kita kepeleset di depan *gebetan*.

### Scene 3 (beat)
Oke, *sini gue jelasin* cara kucing muter di udara.

### Scene 4 (stage, mekanisme 1)
Pertama, telinga dalamnya langsung tahu mana arah *bawah*. Lalu badannya nekuk di *pinggang*, jadi badan depan dan belakang bisa muter sendiri-sendiri.

### Scene 5 (stage, mekanisme 2 + joke 2)
Kaki depannya dilipat, jadi badan depan muter *duluan*. Lalu gantian, badan belakang *nyusul*. Mirip kamu muter di kursi kantor, kaki dilipat biar makin kencang. Apalagi pas bos *gak lihat*.

### Scene 6 (stage, penutup + joke 3)
Dari tempat tinggi, kucing juga ngembangin kaki kayak *parasut*. Tapi kucing tetap bisa cedera, jadi tutup *jendela*. Apalagi kucing oren yang hobi makan, muternya suka *telat*.

Uji baca keras: kalimat <= 14 kata, satu gagasan per kalimat, tanpa "padahal", tanpa kata buku, tanpa angka.
"Telinga dalam" = vestibular (Purina, Wikipedia). "Nekuk di pinggang" = bend in the middle (Wikipedia).
"Kaki dilipat biar makin kencang" = momentum sudut (sumber 2-3). Tidak memakai klaim "lantai tinggi lebih aman"
(bias survivor). "Kucing tetap bisa cedera" dan "kegemukan susah muter" dari VCA. Tanpa klaim mutlak.

## Komedi
| # | Jenis | Kalimat joke | Punchline | Visual gag |
|---|---|---|---|---|
| 1 | sindiran | Persis kayak kita kepeleset di depan gebetan. | gebetan | kulit pisang besar jatuh di tengah di "gebetan" (ack) + teks "DEPAN GEBETAN" + kucing senyum pasrah ngintip |
| 2 | sindiran | Apalagi pas bos gak lihat. | gak lihat | kursi kantor besar muter di tengah di "gak lihat" (boing) + kucing sinis ngintip |
| 3 | hiperbola | Apalagi kucing oren yang hobi makan, muternya suka telat. | telat | kucing oren gendut besar jatuh di tengah di "telat" (fahh) + squash |

## Peta Visual
### Scene 1
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Kucing jatuh telentang, | kucing oren telentang melayang (frame 0) | props/refleks-kucing-telentang.png | wiggle@telentang |
| kok bisa mendarat pakai *kaki*? | kucing mendarat + tanya | props/refleks-kucing-mendarat.png, simbol tanya | pop tanya@kok, drop mendarat@mendarat, jump@kaki |

### Scene 2
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Banyak yang ngira kucing punya *sembilan nyawa*. | kucing mendarat + teks celetukan "9 NYAWA?" | props/refleks-kucing-mendarat.png, teks | pop teks@sembilan, wiggle@nyawa |
| Habis jatuh, | kucing mendarat goyang | props/refleks-kucing-mendarat.png | shake@jatuh |
| dia langsung jilat badan, | kucing jilat kaki | props/refleks-kucing-jilat.png | slide-left@jilat |
| pura-pura gak kenapa-napa. | teks "SANTAI..." | teks | pop teks@pura-pura, wiggle jilat@kenapa-napa |
| Persis kayak kita kepeleset di depan *gebetan*. | kulit pisang besar + kucing senyum ngintip | props/refleks-kucing-kulit-pisang.png, props/meme-kucing-senyum.png | move jilat@Persis, drop pisang@gebetan (ack), peek senyum@gebetan |

### Scene 3 (beat)
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Oke, *sini gue jelasin* cara kucing muter di udara. | kucing jelasin | props/meme-kucing-jelasin.png | wiggle@muter |

### Scene 4
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Pertama, | kepala kucing | props/refleks-kucing-kepala.png | delay 0 |
| telinga dalamnya langsung tahu mana arah *bawah*. | kepala kucing + teks "TELINGA DALAM" + panah ke bawah | props/refleks-kucing-kepala.png, teks, simbol panah | wiggle@telinga, pop teks@telinga, pop panah@bawah |
| Lalu badannya nekuk di *pinggang*, | kucing memuntir di udara | props/refleks-kucing-depan-belakang.png | slide-up@nekuk, squash@pinggang |
| jadi badan depan dan belakang bisa muter sendiri-sendiri. | teks "DEPAN ↻ BELAKANG ↺" | teks | move kucing@depan, drop teks@depan, wiggle@sendiri-sendiri |

### Scene 5
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Kaki depannya dilipat, | kucing kaki depan dilipat | props/refleks-kucing-lipat-depan.png | delay 0, pulse@dilipat |
| jadi badan depan muter *duluan*. | teks "DEPAN DULUAN" | teks | drop teks@duluan, wiggle@duluan |
| Lalu gantian, | kucing pindah | props/refleks-kucing-lipat-depan.png | move@gantian |
| badan belakang *nyusul*. | kucing mendarat | props/refleks-kucing-mendarat.png | slide-up mendarat@nyusul |
| Mirip kamu muter di kursi kantor, | kursi kantor | props/refleks-kucing-kursi-kantor.png | slide-left kursi@kursi |
| kaki dilipat biar makin kencang. | kursi muter | props/refleks-kucing-kursi-kantor.png | wiggle@kencang |
| Apalagi pas bos *gak lihat*. | kursi besar di tengah + kucing sinis ngintip | props/refleks-kucing-kursi-kantor.png, props/meme-kucing-sinis.png | move kursi@Apalagi (besar ke tengah), jump@lihat (boing), peek sinis@lihat |

### Scene 6
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Dari tempat tinggi, | kucing parasut | props/refleks-kucing-parasut.png | delay 0 |
| kucing juga ngembangin kaki kayak *parasut*. | kucing parasut membesar + teks "MODE PARASUT" | props/refleks-kucing-parasut.png, teks | grow@ngembangin, pop teks@parasut |
| Tapi kucing tetap bisa cedera, | kucing nangis | props/meme-kucing-nangis.png | pop@cedera (womp) |
| jadi tutup *jendela*. | jendela berkasa | props/refleks-kucing-jendela.png | slide-left@jendela, centang@jendela |
| Apalagi kucing oren yang hobi makan, | kucing oren gendut | props/refleks-kucing-gendut.png | drop@oren, wiggle@makan |
| muternya suka *telat*. | kucing gendut besar di tengah | props/refleks-kucing-gendut.png | move@muternya, squash@telat (fahh) |
