# Rencana: Potongan Gaji

Isi berurutan: Hook -> Narasi -> Peta Visual. Panduan: .claude/skills/video-explainer/referensi/hook-judul.md
Cetakan video patokan: **hitungan potongan uang** (scene `diagram` mode `potongan`).

## Hook
| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | Gaji lima juta, kok yang masuk rekening cuma empat juta delapan ratus? | GAJI 5 JUTA | KOK CUMA 4,8 JUTA? | 2 | 2 | 2 | 2 | 1 | 9 |
| 2 | bocoran | Potongan gaji kamu itu bukan buat kantor, tapi buat kamu sendiri. | POTONGAN GAJI | BUAT SIAPA SIH? | 1 | 2 | 2 | 1 | 1 | 7 |
| 3 | salah-kaprah | Kamu kira HRD motong gaji seenaknya, padahal semuanya ada tarifnya. | GAJI DIPOTONG HRD | SEENAKNYA? | 1 | 2 | 2 | 1 | 1 | 7 |
| 4 | taruhan | Dua ratus ribu dari gaji kamu ternyata ditabung tiap bulan. | 200 RIBU DARI GAJI | KE MANA LARINYA? | 2 | 1 | 2 | 2 | 1 | 8 |
| 5 | kok-kenapa | Kerja sebulan penuh, kok gajinya gak utuh lima juta? | KERJA SEBULAN PENUH | KOK GAK UTUH? | 2 | 1 | 2 | 2 | 1 | 8 |

Terpilih: #1

## Narasi
### Scene 1 (hook)
Gaji lima juta, kok yang masuk rekening cuma *empat juta delapan ratus*?

### Scene 2 (stage, salah kaprah)
Biasanya langsung curiga HRD main potong seenaknya. Padahal tiap potongan ada *aturannya*, dan sebagian malah balik ke kamu sendiri.

### Scene 3 (beat)
Oke, *sini gue jelasin* hitungannya.

### Scene 4 (diagram potongan)
Dari lima juta, satu persen buat *BPJS Kesehatan*, dua persen buat *Jaminan Hari Tua*, dan satu persen buat *Jaminan Pensiun*. Pajaknya masih nol karena gajinya di bawah lima koma empat juta. Sisa bersihnya *empat juta delapan ratus ribu*.

### Scene 5 (stage, twist)
Yang jarang orang tahu, kantor juga ikut bayar hampir *lima ratus ribu* tiap bulan. Uang *Jaminan Hari Tua* itu juga tetap milik kamu, bisa dicairkan nanti.

### Scene 6 (stage, penutup)
Jadi jangan cuma lihat angka akhirnya, cek *slip gaji* tiap bulan dan pantau saldo JHT lewat aplikasi *JMO*.

## Peta Visual
### Scene 1
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Gaji lima juta, | slip gaji | props/potongan-gaji-slip.png | wiggle@juta |
| kok yang masuk rekening cuma *empat juta delapan ratus*? | HP notifikasi transfer + kucing nangis | props/potongan-gaji-hp-rekening.png, props/meme-kucing-nangis.png | jump@rekening, shake@empat (womp) |

### Scene 2
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Biasanya langsung curiga HRD main potong seenaknya. | kucing sinis + gunting + teks "HRD jahat?!" | props/meme-kucing-sinis.png, props/potongan-gaji-gunting.png | wiggle@curiga, shake@potong, move gunting@seenaknya |
| Padahal tiap potongan ada *aturannya*, | buku aturan + palu | props/potongan-gaji-buku-aturan.png | squash@aturannya |
| dan sebagian malah balik ke kamu sendiri. | celengan | props/potongan-gaji-celengan.png | move@balik, jump@sendiri |

### Scene 3 (beat)
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Oke, *sini gue jelasin* hitungannya. | kucing menjelaskan | props/meme-kucing-jelasin.png | wiggle@jelasin |

### Scene 4 (diagram potongan)
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Dari lima juta, | bar awal Rp5.000.000 + slip gaji | diagram, props/potongan-gaji-slip.png | - |
| satu persen buat *BPJS Kesehatan*, | langkah 1 (-Rp50.000) + kartu sehat | diagram, props/potongan-gaji-kartu-sehat.png | - |
| dua persen buat *Jaminan Hari Tua*, | langkah 2 (-Rp100.000) + celengan | diagram, props/potongan-gaji-celengan.png | - |
| dan satu persen buat *Jaminan Pensiun*. | langkah 3 (-Rp50.000) + kakek pensiun | diagram, props/potongan-gaji-kakek-pensiun.png | - |
| Pajaknya masih nol karena gajinya di bawah lima koma empat juta. | langkah 4 (Rp0) + teks "Pajak: nol!" | diagram | wiggle@bawah |
| Sisa bersihnya *empat juta delapan ratus ribu*. | hasil Rp4.800.000 + tumpukan uang | diagram, props/potongan-gaji-uang.png | jump@delapan |

### Scene 5
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Yang jarang orang tahu, | kucing senyum (trik rahasia) | props/meme-kucing-senyum.png | peek@tahu |
| kantor juga ikut bayar hampir *lima ratus ribu* tiap bulan. | gedung kantor + uang + teks "+Rp485 ribu" | props/potongan-gaji-gedung-kantor.png, props/potongan-gaji-uang.png | move uang@bayar, pulse@lima ratus ribu |
| Uang *Jaminan Hari Tua* itu juga tetap milik kamu, | celengan | props/potongan-gaji-celengan.png | jump@milik |
| bisa dicairkan nanti. | celengan bergetar | props/potongan-gaji-celengan.png | shake@dicairkan |

### Scene 6
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Jadi jangan cuma lihat angka akhirnya, | kucing mikir + teks "Rp4.800.000" | props/meme-kucing-think.png | wiggle@angka |
| cek *slip gaji* tiap bulan dan pantau saldo JHT lewat aplikasi *JMO*. | slip gaji, HP saldo, kucing jempol | props/potongan-gaji-slip.png, props/potongan-gaji-hp-rekening.png, props/meme-kucing-jempol.png | move slip@bulan, jump HP@pantau |
