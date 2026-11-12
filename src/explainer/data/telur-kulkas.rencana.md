# Rencana: Telur Kulkas

Isi berurutan: Hook -> Narasi -> Peta Visual. Panduan: .claude/skills/video-explainer/referensi/hook-judul.md
Patokan terdekat: `nasi-warm` (sains dapur / salah kaprah sehari-hari, memakai scene `stage` saja + sebab-akibat).

## Hook
| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | Kulkas udah disetel empat derajat, kok telur di pintu malah *lebih cepat busuk*? | KULKAS SUDAH 4 DERAJAT | TELUR DI PINTU CEPAT BUSUK? | 2 | 2 | 2 | 1 | 2 | 9 |
| 2 | bocoran | Tempat paling aman buat nyimpan *telur* di kulkas bukan di rak pintunya. | RAK TELUR DI PINTU KULKAS | BUKAN TEMPAT TERBAIK? | 2 | 2 | 2 | 1 | 2 | 9 |
| 3 | salah-kaprah | Kamu kira rak di pintu kulkas paling aman, padahal justru *paling sering hangat*. | RAK TELUR DI PINTU KULKAS | JUSTRU PALING HANGAT? | 2 | 2 | 2 | 1 | 2 | 9 |
| 4 | taruhan | Kebiasaan naruh *telur* di pintu kulkas ternyata diam-diam bikin bakteri gampang masuk. | NARUH TELUR DI PINTU | KOK MALAH CEPAT RUSAK? | 2 | 2 | 2 | 1 | 2 | 9 |
| 5 | kok-kenapa | Semua kulkas punya rak telur di pintu, kok raknya *gak boleh* dipakai? | RAK TELUR DI PINTU KULKAS | KOK GAK BOLEH DIPAKAI? | 2 | 2 | 2 | 2 | 2 | 10 |

Terpilih: #5

## Narasi
### Scene 1 (hook)
Semua kulkas punya rak telur di pintu, kok raknya *gak boleh* dipakai?

### Scene 2 (stage, salah kaprah)
Banyak yang ngira rak pintu paling aman buat telur. Padahal tiap pintu kulkas dibuka, *angin hangat* dari luar langsung nabrak telur duluan. Belum lagi telurnya ikut *keguncang* tiap pintu dibanting.

### Scene 3 (beat)
Oke, *sini gue jelasin* kenapa rak pintu bikin telur cepat rusak.

### Scene 4 (stage, fakta 1)
Bagian dalam kulkas idealnya dingin stabil di *empat derajat*. Tapi suhu rak pintu terus naik-turun, bikin *cangkang telur* berembun. Saat cangkangnya lembap, *belasan ribu pori* gampang ditembus *bakteri*.

### Scene 5 (stage, fakta 2 + punchline)
Selain bikin telur kemasukan bakteri, pori-porinya juga nyedot *bau tajam* makanan lain, kayak *ikan asin*. Kebayang gak kalau *telur dadar* pagimu mendadak rasa ikan asin.

### Scene 6 (stage, solusi)
Jadi taruh telur di *rak bagian dalam* kulkas yang paling dingin dan stabil. Simpan di *wadah tertutup* atau karton telur, supaya telurnya awet sampai *tiga minggu* lebih.

## Peta Visual
### Scene 1
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Semua kulkas punya rak telur di pintu, | rak telur pintu kulkas | props/telur-kulkas-rak-pintu.png | wiggle@telur |
| kok raknya *gak boleh* dipakai? | kucing mikir + simbol larang | props/meme-kucing-paw.png, simbol:larang | shake rak@gak boleh, wiggle@dipakai |

### Scene 2
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Banyak yang ngira rak pintu paling aman buat telur. | rak telur pintu, kucing judes, teks "Bukan tempat aman!" | props/telur-kulkas-rak-pintu.png, props/meme-kucing-judes.png, teks | wiggle@pintu, move@telur, wiggle@paling |
| Padahal tiap pintu kulkas dibuka, | angin hangat masuk | props/telur-kulkas-angin-hangat.png | - |
| *angin hangat* dari luar langsung nabrak telur duluan. | angin mengarah ke telur retak goyang | props/telur-kulkas-telur-retak.png | move angin@angin hangat, shake@nabrak |
| Belum lagi telurnya ikut *keguncang* tiap pintu dibanting. | kucing kaget + telur retak membal | props/meme-kucing-kaget.png | jump@keguncang, squash@dibanting, wiggle kucing@dibanting |

### Scene 3 (beat)
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Oke, *sini gue jelasin* kenapa rak pintu bikin telur cepat rusak. | kucing berkacamata menjelaskan | props/meme-kucing-jelasin.png | wiggle@jelasin |

### Scene 4
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Bagian dalam kulkas idealnya dingin stabil di *empat derajat*. | termometer 4°C + simbol centang | props/telur-kulkas-termometer.png, simbol:centang | pulse@empat derajat |
| Tapi suhu rak pintu terus naik-turun, | rak pintu menggoyang + termometer bergetar | props/telur-kulkas-rak-pintu.png | shake termometer@naik-turun, wiggle@naik-turun |
| bikin *cangkang telur* berembun. | telur berembun | props/telur-kulkas-telur-embun.png | pulse@berembun |
| Saat cangkangnya lembap, | kaca pembesar pori telur | props/telur-kulkas-pori-mikro.png | - |
| *belasan ribu pori* gampang ditembus *bakteri*. | kucing kaget, bakteri mendekat | props/meme-kucing-kaget.png, props/telur-kulkas-bakteri.png | move pori@belasan ribu pori, shake pori@ditembus, jump bakteri@bakteri, wiggle kucing@bakteri |

### Scene 5
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Selain bikin telur kemasukan bakteri, | bakteri | props/telur-kulkas-bakteri.png | wiggle@bakteri |
| pori-porinya juga nyedot *bau tajam* makanan lain, | pori telur | props/telur-kulkas-pori-mikro.png | move pori@nyedot, pulse pori@bau tajam |
| kayak *ikan asin*. | piring ikan asin | props/telur-kulkas-ikan-asin.png | - |
| Kebayang gak kalau *telur dadar* pagimu mendadak rasa ikan asin. | telur dadar, kucing tutup hidung ngintip, teks "Telur rasa ikan?!" | props/telur-kulkas-dadar.png, props/meme-kucing-tutuphidung.png, teks | wiggle dadar@telur dadar, squash dadar@mendadak, peek kucing@ikan asin |

### Scene 6
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Jadi taruh telur di *rak bagian dalam* kulkas yang paling dingin dan stabil. | rak dalam kulkas + simbol centang | props/telur-kulkas-rak-dalam.png, simbol:centang | move@rak bagian dalam, pulse@dingin |
| Simpan di *wadah tertutup* atau karton telur, | karton/wadah telur | props/telur-kulkas-karton.png | wiggle@wadah tertutup |
| supaya telurnya awet sampai *tiga minggu* lebih. | badge "Awet 3-5 minggu", kucing jempol | teks, props/meme-kucing-jempol.png | jump kucing@lebih |
