# Narasi Lisan

Narasi dibacakan TTS dan didengar sekali lewat. Penonton tidak bisa membaca ulang, jadi tiap kalimat harus langsung dimengerti. Tulis seperti kamu menjelaskan ke teman, bukan seperti buku pelajaran.

**Jangan pakai skill `humanizer-indonesia`** untuk narasi ini: skill itu dikalibrasi untuk tulisan akademik dan menolak gaya santai.

## Struktur 5-7 Scene

| Scene | Isi | Komedi |
|---|---|---|
| 1 hook | 1 kalimat dari `referensi/hook-judul.md` | - |
| 2 stage | Salah kaprah yang umum ("Banyak yang ngira ..., padahal ...") | 1 joke sindiran / hiperbola |
| 3 beat | "Oke, *sini gue jelasin* ..." | meme kucing jelasin |
| 4-5 stage/diagram | Fakta inti, angka, sebab-akibat | 1 punchline saat fakta terbongkar |
| 6 stage | Solusi / kesimpulan praktis | meme jempol / centang |

Setiap scene stage/diagram: 2-3 kalimat, 20-35 kata.

## Komedi (dicek validator K1-K3)

Penonton channel ini ketawa karena **kalimat**, bukan karena ada suara "boing". Tiap video wajib 2-3 joke tertulis di narasi, idealnya 1 di scene salah kaprah, 1 saat fakta terbongkar, 1 di penutup.

| Jenis | Rumus | Contoh (topik bensin pagi) |
|---|---|---|
| `sindiran` | gambarkan kebiasaan penonton secara spesifik dan sedikit memalukan | Sampai rela antre di SPBU masih pakai *sarung*. |
| `hiperbola` | lebih-lebihkan akibat sampai absurd | Nunggu bonusnya kerasa, motormu keburu *pensiun*. |
| `perbandingan-absurd` | ubah angka jadi benda/harga sehari-hari yang kecil (rupiah wajib bersumber) | Kalau dirupiahin, bonusnya kalah sama *uang parkir*. |
| `personifikasi` | benda diberi sifat orang | Bensinnya di bawah tanah, gak tahu sekarang subuh atau siang. Hidupnya *gelap terus*. |
| `twist` | penutup membalik anggapan di hook | Yang hemat bukan bensinnya, tapi *jam tidurmu* yang boros. |
| `callback` | ulang benda/kata lucu dari scene awal di penutup | Jadi, sarungnya pakai buat tidur aja, bukan buat antre *bensin*. |

Aturan joke:
1. **Punchline di ujung kalimat** (1-3 kata terakhir), lalu titik. TTS berhenti sebentar setelah titik, itu jeda ketawanya.
2. Satu joke = satu kalimat pendek tersendiri, jangan diselipkan di tengah kalimat fakta.
3. Joke harus nyambung ke fakta, bukan lelucon acak. Angka/harga di joke wajib ada di `sumber.md`.
4. Lucu dari kebiasaan lokal ("Indonesia banget": sarung, parkir, antre, emak-emak, ojol), bukan dari merendahkan orang, agama, suku, atau fisik.
5. Visual gag di kata punchline: prop/meme **besar di tengah** (bukan pojok), masuk tepat di kata itu, SFX `womp`/`boom`/`boing`/`slap` (dan `shake`/`squash` kalau perlu).

## Dari Sumber ke Narasi

`sumber.md` berisi catatan bergaya laporan. **Jangan salin kalimatnya.** Ambil faktanya saja, lalu ceritakan ulang.

| Di `sumber.md` | Di narasi |
|---|---|
| struktur polimer plastik mengalami penuaan dan melonggarkan ikatan mikroskopisnya, sehingga partikel mikroplastik dapat luruh ke dalam air | Lewat dua tahun, plastiknya mulai rapuh. Serpihan kecilnya, *mikroplastik*, bisa lepas ke air. |
| Telur sebaiknya disimpan pada suhu stabil 4 derajat Celsius | Telur paling awet di suhu *empat derajat* yang gak naik-turun. |

## Uji Baca Keras (wajib, tiap scene)

Baca narasi keras-keras, lalu jawab:

1. **Satu kalimat, satu gagasan?** Kalau ada "sehingga", "dan", atau dua koma, biasanya itu dua gagasan. Pecah. Maksimal 18 kata per kalimat, 22 untuk scene diagram. (N1)
2. **Ada kata buku pelajaran?** Ganti sesuai tabel di bawah. (N2)
3. **Subjek dan objeknya disebut?** "bikin cepat rusak" → apa yang rusak? "di situ", "tadi", "tersebut" → sebut bendanya. (N4)
4. **Kata penghubungnya pas artinya?** Lihat tabel penghubung. "Padahal" maksimal sekali per video. (N3)
5. **Ada klaim mutlak?** "semua", "selalu", "pasti", "gak boleh", "gak pernah": cek sumber. Kalau sumber tidak bilang begitu, lunakkan. (N5)
6. **Logikanya nyambung?** Tiap kalimat harus menjawab atau melanjutkan kalimat sebelumnya. "Umur air di bumi jutaan tahun" tidak menjawab "kenapa air botol bisa kadaluwarsa".
7. **Kalimatnya selesai?** "Kebayang kan kalau telur dadar pagimu rasa ikan asin." menggantung karena "kalau" tidak punya lanjutan. Tulis "Kebayang kan, telur dadar pagimu mendadak rasa ikan asin."

## Kata Buku Pelajaran → Kata Lisan (dicek validator N2)

| Hindari | Pakai |
|---|---|
| sehingga | jadi |
| akan | (hapus), bakal |
| mengubah | bikin, ngubah |
| memiliki | punya |
| apabila | kalau |
| namun | tapi |
| idealnya | harusnya |
| luruh | lepas |
| zat kimia | sebut zatnya, "zat dari plastik" |
| merupakan, yaitu | (hapus) |
| dapat | bisa |
| (oleh) karena itu | jadi |
| sangat | banget |
| terhadap | ke, sama |
| melakukan X | langsung kata kerjanya |

## Arti Kata Penghubung

| Penghubung | Dipakai untuk | Contoh |
|---|---|---|
| padahal | kebalikan dari anggapan | Banyak yang ngira basi, **padahal** yang rusak botolnya. |
| masalahnya | sebab / sumber masalah | **Masalahnya**, cangkang telur punya ribuan pori. |
| apalagi | menambah yang lebih parah | **Apalagi** kalau botolnya sering kepanasan di mobil. |
| jadi | kesimpulan / solusi | **Jadi**, simpan telur di rak bagian dalam. |
| nah | pindah ke inti | **Nah**, di sinilah plastiknya mulai rapuh. |
| tapi | kontras biasa | Kulkasnya dingin, **tapi** rak pintunya naik-turun. |

## Larangan (antislop)

- Signposting: "Mari kita bedah...", "Tahukah kamu bahwa...", "Yuk kita cari tahu...".
- Kosakata hampa: "solusi mutakhir", "merevolusi", "game changer", "menakjubkan".
- Tigaan paksa: jangan bikin 3 butir kalau faktanya cuma 2.
- "Ini bukan sekadar X, tapi Y".
- Penutup chatbot: "Semoga bermanfaat", "tinggalkan komentar".

## Aturan Teknis

- Angka **wajib huruf**: "dua tahun", "seratus ribu", "enam puluh satu koma tiga".
- Tanpa singkatan: "dan lain-lain", bukan "dll.".
- Tandai kata kunci dengan `*bintang*` berpasangan; kata kunci ini wajib punya visual (validator V3).
- Partikel tutur secukupnya: *nih, kok, lho, tuh, kan, sih*. Satu-dua per scene, jangan tiap kalimat.
- Jangan menghapus kata yang dipakai sebagai pemicu `di`/`sampai` saat menyunting ulang. Kalau terpaksa, perbarui naskah `.ts` juga.
- Setiap benda konkret yang disebut akan butuh prop. Kalau tidak bisa digambar, pertimbangkan ganti kata.

## Contoh Sebelum / Sesudah (dari video nyata)

| Sebelum | Masalah | Sesudah |
|---|---|---|
| Apalagi kalau botolnya keseringan kena *panas matahari* di dalam mobil, zat kimia *antimoni* dari dinding plastik akan larut dan mengubah rasa air jadi *pahit seperti plastik*. | 26 kata, 3 gagasan, "zat kimia", "akan", "mengubah" | Apalagi kalau botolnya sering kepanasan di *dalam mobil*. Zat dari plastiknya bisa larut, dan airnya jadi kerasa *kayak plastik*. |
| Padahal cangkang telur punya *belasan ribu pori* yang gampang ditembus *bakteri* pas lembap. | "padahal" bukan kebalikan | *Masalahnya*, cangkang telur punya *belasan ribu pori*. Pas lembap, *bakteri* gampang masuk lewat pori itu. |
| Oke, *sini gue jelasin* kenapa rak pintu bikin cepat rusak. | objek hilang | Oke, *sini gue jelasin* kenapa telur di rak pintu cepat rusak. |
| Semua kulkas ada rak telur di pintu, kok malah *gak boleh* dipakai? | klaim mutlak, "ada" tanpa "punya" | Kulkas dikasih rak telur di pintu, kok malah bikin telur *cepat rusak*? |
