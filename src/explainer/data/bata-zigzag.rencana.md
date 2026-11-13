# Rencana: Bata Tembok Kok Dipasang Zigzag? (remake)

Isi berurutan: Hook -> Narasi -> Komedi -> Peta Visual. Panduan: .claude/skills/video-explainer/referensi/hook-judul.md dan narasi.md

Patokan terdekat: `kabel-kendor` (fisika/teknik sehari-hari, dua keadaan: lurus vs zigzag). Bedanya: inti
penjelasannya dua scene `diagram` mode `grid-bata` (pola `sejajar` lalu `zigzag`) supaya penonton melihat beban
yang turun lurus vs beban yang menyebar. Remake dari versi legacy (watermark lama, tanpa rencana); klaim lama
"tembok lurus retak kalau ditekan dari atas" dibuang karena keliru (kuat tekannya sama, lihat sumber.md).

## Hook
| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | Batanya sama persis, kok tembok bata lurus cuma sepertiga kuatnya? | TEMBOK BATA LURUS | CUMA 1/3 KUATNYA? | 2 | 2 | 1 | 2 | 1 | 8 |
| 2 | bocoran | Yang bikin tembok bata kuat bukan semennya, tapi susunan zigzagnya. | TEMBOK BATA KUAT | BUKAN DARI SEMENNYA? | 1 | 2 | 2 | 1 | 2 | 8 |
| 3 | salah-kaprah | Kamu kira bata zigzag cuma biar rapi, padahal itu yang bikin tembok gak jebol. | BATA TEMBOK ZIGZAG | CUMA BIAR RAPI? | 2 | 2 | 2 | 1 | 2 | 9 |
| 4 | taruhan | Tembok rumah yang batanya disusun lurus ternyata gampang retak kena dorongan samping. | BATA DISUSUN LURUS | GAMPANG RETAK? | 2 | 1 | 1 | 1 | 1 | 6 |
| 5 | kok-kenapa | Masang bata lurus lebih gampang, kok tukang malah pasang zigzag? | BATA TEMBOK RUMAH | KOK DIPASANG ZIGZAG? | 2 | 2 | 2 | 2 | 2 | 10 |

Terpilih: #5

## Thumbnail
Subjek lengkap: bata tembok rumah yang dipasang zigzag
Gambar: props/bata-zigzag-tembok-zigzag.png
Uji 1 detik: orang yang cuma lihat gambarnya (tembok bata merah setengah jadi, susunan selang-seling, cetok di atasnya) tahu ini soal cara tukang masang bata

## Narasi
### Scene 1 (hook)
Masang bata lurus lebih gampang, kok tukang malah pasang *zigzag*?

### Scene 2 (stage, salah kaprah + joke 1)
Banyak yang ngira zigzag itu cuma biar tembok kelihatan *rapi*. Ada yang nyuruh tukang pasang lurus aja, biar *cepat*. Maklum, tukangnya dibayar *harian*.

### Scene 3 (beat)
Oke, *sini gue jelasin* kenapa bata lurus gampang retak.

### Scene 4 (diagram sejajar)
Kalau dipasang lurus, sambungan semennya jadi *satu garis* panjang. Beban dari atas turun lurus, gak *nyebar* ke samping.

### Scene 5 (stage, fakta + joke 2)
Masalahnya, sambungan semen itu bagian paling *lemah* di tembok. Kena dorongan dari samping, tembok lurus cuma kuat *sepertiganya*. Retaknya tinggal ikut garis sambungan, kayak nyobek *kecap sachet*.

### Scene 6 (diagram zigzag)
Nah, kalau zigzag, satu bata duduk di atas *dua bata*. Bebannya dibagi dua, lalu dibagi lagi, kayak *patungan*. Retak juga susah merambat, karena garis sambungannya *putus-putus*.

### Scene 7 (stage, penutup + joke 3 callback)
Jadi biarin tukangmu pasang zigzag. Kalau dipasang lurus biar cepat, yang cepat juga *retaknya*.

Uji baca keras: kalimat <= 12 kata, satu gagasan per kalimat, tanpa "padahal", tanpa kata buku, angka huruf
("sepertiganya"). "Sepertiga" = 30% kuat lentur arah horizontal (TEK 14-06), dibingkai "kena dorongan dari samping",
bukan ditekan dari atas. "Satu bata duduk di atas dua bata" = running bond (overlap). Tidak ada klaim mutlak.

## Komedi
| # | Jenis | Kalimat joke | Punchline | Visual gag |
|---|---|---|---|---|
| 1 | sindiran | Maklum, tukangnya dibayar harian. | harian | tumpukan uang rupiah besar jatuh di tengah di "harian" (womp) + kucing sinis ngintip |
| 2 | perbandingan-absurd | Retaknya tinggal ikut garis sambungan, kayak nyobek kecap sachet. | kecap sachet | sachet "KECAP OKE SINI" yang sobek jatuh besar di tengah di "kecap" (ack) |
| 3 | callback | Kalau dipasang lurus biar cepat, yang cepat juga retaknya. | retaknya | tembok retak raksasa pop di tengah di "retaknya" (fahh) + shake |

## Peta Visual
### Scene 1
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Masang bata lurus lebih gampang, | tembok zigzag (frame 0) + tembok lurus | props/bata-zigzag-tembok-zigzag.png, props/bata-zigzag-tembok-lurus.png | wiggle utama@Masang, pop lurus@lurus, pulse lurus@gampang |
| kok tukang malah pasang *zigzag*? | kucing tukang + tanya, tembok zigzag lompat | props/kucing-tukang.png, simbol tanya | slide-left tukang@tukang, wiggle tukang@malah, jump utama@zigzag, pop tanya@zigzag |

### Scene 2
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Banyak yang ngira zigzag itu cuma biar tembok kelihatan *rapi*. | tembok zigzag + teks celetukan "Biar rapi doang?" | props/bata-zigzag-tembok-zigzag.png, teks | wiggle@ngira, pop teks@ngira, pulse@rapi |
| Ada yang nyuruh tukang pasang lurus aja, | kucing tukang + tembok lurus | props/kucing-tukang.png, props/bata-zigzag-tembok-lurus.png | slide-left tukang@tukang, slide-up lurus@lurus |
| biar *cepat*. | kucing tukang lompat + teks "BIAR CEPAT" | props/kucing-tukang.png, teks | jump tukang@cepat, drop teks@cepat |
| Maklum, tukangnya dibayar *harian*. | uang rupiah besar + kucing sinis ngintip | props/bata-zigzag-uang-harian.png, props/meme-kucing-sinis.png | move tukang@Maklum, drop uang@harian (womp), peek sinis@harian |

### Scene 3 (beat)
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Oke, *sini gue jelasin* kenapa bata lurus gampang retak. | kucing jelasin | props/meme-kucing-jelasin.png | wiggle@retak |

### Scene 4 (diagram sejajar)
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Kalau dipasang lurus, | grid bata sejajar dirakit | diagram grid-bata pola sejajar | rakit@dipasang |
| sambungan semennya jadi *satu garis* panjang. | teks "1 GARIS LURUS" | teks | drop@satu |
| Beban dari atas turun lurus, | beban 80 kg turun di dua tumpukan tengah | diagram beban | beban@Beban, angka@turun |
| gak *nyebar* ke samping. | silang + kucing think | simbol silang, props/meme-kucing-think.png | pop silang@nyebar, slide-left kucing@nyebar |

### Scene 5
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Masalahnya, | cetok dengan adukan semen | props/bata-zigzag-cetok-semen.png | delay 0 |
| sambungan semen itu bagian paling *lemah* di tembok. | cetok + teks "TITIK LEMAH" | props/bata-zigzag-cetok-semen.png, teks | wiggle@sambungan, drop teks@lemah |
| Kena dorongan dari samping, | tembok lurus + panah dorongan | props/bata-zigzag-tembok-lurus.png, simbol panah | slide-up tembok@Kena, slide-left panah@dorongan, shake tembok@samping |
| tembok lurus cuma kuat *sepertiganya*. | teks "CUMA 1/3 KUATNYA" | teks | drop teks@sepertiganya (boom) |
| Retaknya tinggal ikut garis sambungan, | tembok retak menggantikan tembok lurus | props/bata-zigzag-tembok-retak.png | none@Retaknya, squash@garis |
| kayak nyobek *kecap sachet*. | sachet kecap sobek besar | props/bata-zigzag-kecap-sachet.png | move retak@kayak, drop kecap@kecap (ack) |

### Scene 6 (diagram zigzag)
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Nah, | grid bata zigzag dirakit | diagram grid-bata pola zigzag | delay 0 |
| kalau zigzag, | (sama) | diagram | rakit@zigzag |
| satu bata duduk di atas *dua bata*. | kucing guru menunjuk | props/meme-kucing-guru.png | slide-left@satu, jump@dua |
| Bebannya dibagi dua, | beban 80 kg terbagi 40 + 40 | diagram beban | beban@Bebannya, angka@dibagi |
| lalu dibagi lagi, | angka 20/40/20 muncul per baris | diagram | (angka per baris) |
| kayak *patungan*. | uang rupiah kecil (callback "harian") | props/bata-zigzag-uang-harian.png | pop@patungan |
| Retak juga susah merambat, | tembok zigzag mini | props/bata-zigzag-tembok-zigzag.png | slide-up@Retak |
| karena garis sambungannya *putus-putus*. | centang | simbol centang | pop centang@putus-putus |

### Scene 7
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Jadi biarin tukangmu pasang zigzag. | tembok zigzag + kucing tukang + centang | props/bata-zigzag-tembok-zigzag.png, props/kucing-tukang.png, simbol centang | slide-left tukang@tukangmu, jump tembok@zigzag, pop centang@zigzag |
| Kalau dipasang lurus biar cepat, | tembok lurus menggantikan zigzag | props/bata-zigzag-tembok-lurus.png | none@Kalau, wiggle@cepat |
| yang cepat juga *retaknya*. | tembok retak raksasa di tengah | props/bata-zigzag-tembok-retak.png | move tukang@yang, pop retak@retaknya (fahh), shake@retaknya |
