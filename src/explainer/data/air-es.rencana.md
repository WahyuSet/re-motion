# Rencana: Air Es

Topik: Air Es Bikin Sakit? Ini Faktanya!
Sudut pandang: Indonesia banget (mitos minum es bikin radang/sakit, fakta >200 virus penyebab pilek, dan fakta medis soal es dari air mentah di suhu 0 derajat).
Target durasi: 38-45 detik (93 kata narasi + jeda komedi `tahan`).

## Hook

| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | Lebih dari dua ratus jenis virus bisa bikin pilek, kok yang disalahin air dinginnya? | BUKAN SALAH AIR DINGIN? | INI BIANG PILEK ASLI | 2 | 2 | 2 | 1 | 1 | 8 |
| 2 | bocoran | Ini alasan medis kenapa habis minum es kamu kadang ngerasa tenggorokan gak enak. | MINUM ES BIKIN SAKIT? | INI ALASAN MEDISNYA? | 1 | 1 | 2 | 2 | 2 | 8 |
| 3 | salah-kaprah | Banyak yang nuduh suhu es bawa penyakit, padahal biangnya sering ngumpet di luar. | AIR ES BIKIN SAKIT? | BIANGNYA BUKAN SUHU? | 1 | 2 | 2 | 2 | 1 | 8 |
| 4 | taruhan | Coba cek gelas es kamu, dinginnya yang bahaya atau air yang kepakai? | CEK AIR ES KAMU | BAHAYA ATAU AMAN? | 1 | 1 | 2 | 2 | 2 | 8 |
| 5 | kok-kenapa | Air es gak bawa *virus*, kok habis jajan es malah *sakit*? | AIR ES BIKIN SAKIT? | BUKAN KARENA DINGINNYA? | 2 | 2 | 2 | 2 | 2 | 10 |

Terpilih: #5
Alasan: Memecahkan rasa penasaran langsung pada kontras antara air es yang secara alami tidak membawa virus dengan pengalaman dekat penonton Indonesia yang merasa sakit setelah jajan es, sambil langsung menampilkan gelas air es bening di detik 0.

## Thumbnail

Subjek lengkap: air es bikin sakit
Gambar: props/air-es-gelas-es.png
baris1: AIR ES BIKIN SAKIT?
baris2: BUKAN KARENA DINGINNYA?
Uji 1 detik: Gelas bening berisi air putih dan es batu berembun di tengah layar dengan judul "AIR ES BIKIN SAKIT? BUKAN KARENA DINGINNYA?" terbaca utuh dalam satu detik.

## Narasi

### Scene 1 (hook)
Air es gak bawa *virus*, kok habis jajan es malah *sakit*?

### Scene 2 (stage)
Banyak yang ngira *air es* bikin tenggorokan *radang*. Baru pegang gelasnya, udah diceramahin kayak minum *racun*.

### Scene 3 (beat)
Oke, *sini gue jelasin*.

### Scene 4 (stage)
Pilek itu ulah lebih dari *dua ratus* virus. Gejalanya muncul *satu sampai tiga hari* setelah tertular. Suhu es cuma bikin *tenggorokan* kaget sebentar.

### Scene 5 (stage)
Yang bahaya justru es batu dari *air mentah* yang tercemar *bakteri*. Suhu *nol derajat* gak bunuh kuman, mereka cuma *numpang ngadem*.

### Scene 6 (stage)
Lagi *batuk*, tahan dulu esnya. Pas sehat, pakai es *air matang*. Biar yang *ngadem* cuma kamu, bukan *kumannya*.

## Komedi

| # | Jenis | Kalimat joke | Punchline | Visual gag |
|---|---|---|---|---|
| 1 | sindiran | Baru pegang gelasnya, udah diceramahin kayak minum racun. | racun | Botol racun tengkorak (245px) jatuh tepat di kata "racun" di sebelah gelas es + SFX `ack`, scene tahan 32 frame (`>= 1.2s`). |
| 2 | personifikasi | Suhu nol derajat gak bunuh kuman, mereka cuma numpang ngadem. | ngadem | Kartun kuman berkacamata hitam santai di dalam es batu (330px) muncul tepat di kata "ngadem" + SFX `fahh`, scene tahan 32 frame (`>= 1.2s`). |
| 3 | callback | Biar yang ngadem cuma kamu, bukan kumannya. | kumannya | Kuman berkacamata hitam balik lagi di sebelah kanan (280px) + silang merah besar tepat di kata "kumannya" + SFX `womp`, scene tahan akhir (`>= 1.2s`). |

## Peta Visual

### Scene 1 (`hook`) - Latar: `latar/air-es-1.png`
- Klausa 1 (`Air es gak bawa *virus*`):
  - Frame 0 (`delay: 0`, `masuk: 'none'`): `props/air-es-gelas-es.png` (`utama`, tengah kiri `x: 35, y: 51, width: 245`).
  - `bawa`: `pulse` pada gelas es.
  - `*virus*`: `props/air-es-virus.png` masuk `pop` di kanan atas (`x: 70, y: 43, width: 190`, SFX `pop`, hingga `sakit`, `keluar: 'none'`) + `simbol silang` di atas virus (`x: 70, y: 43, width: 120`, tanpa SFX, hingga `sakit`).
- Klausa 2 (`kok habis jajan es malah *sakit*?`):
  - `kok`: `teks` mikro miring `"KOK BISA?"` (`x: 70, y: 31, ukuran: 30, rotate: -6`, warna `#FFE066`, `masuk: 'fade'`, hingga `sakit`).
  - `jajan`: `wiggle` pada gelas es.
  - `*sakit*`: `props/meme-kucing-kaget.png` masuk `slide-right` di kanan (`x: 71, y: 51, width: 245`, SFX `boing`) + `simbol tanya` di kiri atas (`x: 20, y: 35, width: 100`) + `shake` pada gelas es.

### Scene 2 (`stage`) - Latar: `latar/air-es-2.png` - Judul: `MITOS WARGA`
- Klausa 1 (`Banyak yang ngira *air es* bikin tenggorokan *radang*`):
  - `Banyak`: `props/air-es-gelas-es.png` (`x: 35, y: 49, width: 250`, `masuk: 'slide-up'`).
  - `*air es*`: `pulse` pada gelas es + SFX `pop`.
  - `*radang*`: `props/air-es-tenggorokan.png` masuk `pop` di kanan (`x: 71, y: 48, width: 240`, SFX `dum`, hingga `pegang`, `keluar: 'none'`) + `wiggle` pada gelas es.
- Klausa 2 (`Baru pegang gelasnya`):
  - `pegang`: `move` pada gelas es ke kiri (`toX: 28, toY: 50`, SFX `whoosh`).
- Klausa 3 (`udah diceramahin kayak minum *racun*`):
  - `diceramahin`: `teks` mikro miring `"AUTO CERAMAH!"` (`x: 68, y: 29, ukuran: 28, rotate: 6`, warna `#FFE066`, `masuk: 'fade'`).
  - `*racun*` (Joke #1): `props/air-es-botol-racun.png` jatuh `drop` di kanan (`x: 68, y: 51, width: 245`, SFX `ack`). Scene ditahan `tahan: 32`.

### Scene 3 (`beat`) - Tanpa latar
- `teks`: `"Oke, sini gue jelasin."` (property scene `beat`).
- Klausa 1 (`Oke`): `props/meme-kucing-jelasin.png` masuk `pop` di tengah (`x: 50, y: 41, width: 240`, tanpa SFX).

### Scene 4 (`stage`) - Latar: `latar/air-es-4.png` - Judul: `FAKTA MEDIS`
- Klausa 1 (`Pilek itu ulah lebih dari *dua ratus* virus`):
  - `Pilek`: `props/air-es-virus.png` (`x: 33, y: 49, width: 270`, `masuk: 'pop'`, SFX `pop`, hingga `Suhu`, `keluar: 'none'`).
  - `*dua*`: `teks` `"200+ VIRUS"` di kanan (`x: 69, y: 42, ukuran: 48`, warna `#ffffff`, kotak `#d32f2f`, `masuk: 'grow-up'`, SFX `ding`, hingga `Gejalanya`).
  - `virus`: `pulse` pada virus.
- Klausa 2 (`Gejalanya muncul *satu sampai tiga hari* setelah tertular`):
  - `Gejalanya`: `move` virus ke kiri (`toX: 27, toY: 50`, SFX `whoosh`).
  - `*satu*`: `props/air-es-kalender.png` jatuh `drop` di kanan (`x: 69, y: 45, width: 250`, SFX `tik`, hingga `Suhu`, `keluar: 'none'`).
  - `hari`: `teks` `"1-3 HARI"` di bawah kalender (`x: 69, y: 61, ukuran: 38`, warna `#111111`, kotak `#ffe066`, `masuk: 'fade'`, hingga `Suhu`).
  - `tertular`: `wiggle` pada virus.
- Klausa 3 (`Suhu es cuma bikin *tenggorokan* kaget sebentar`):
  - `Suhu`: `props/air-es-tenggorokan.png` masuk `slide-up` di tengah kiri (`x: 34, y: 49, width: 265`, SFX `whoosh`) + `props/meme-kucing-think.png` masuk `slide-right` di kanan (`x: 73, y: 50, width: 210`).
  - `*tenggorokan*`: `shake` pada tenggorokan (SFX `dum`).
  - `sebentar`: `peek` pada `meme-kucing-think` (`dx: -8, rotate: -10, tahan: 20`, SFX `boing`).

### Scene 5 (`stage`) - Latar: `latar/telur-kulkas-5.png` - Judul: `AIR MENTAH & ES`
- Klausa 1 (`Yang bahaya justru es batu dari *air mentah* yang tercemar *bakteri*`):
  - `Yang`: `props/air-es-gelas-es.png` (`x: 33, y: 50, width: 240`, `masuk: 'drop'`, SFX `dum`, hingga `ngadem`, `keluar: 'none'`).
  - `batu`: `pulse` pada gelas es.
  - `*air*`: `teks` `"AIR MENTAH"` di kanan atas (`x: 69, y: 34, ukuran: 40`, warna `#ffffff`, kotak `#d32f2f`, `masuk: 'grow-up'`, SFX `ding`, hingga `Suhu`, `keluar: 'none'`).
  - `*bakteri*`: `props/air-es-bakteri.png` masuk `pop` di kanan bawah (`x: 70, y: 56, width: 195`, SFX `ack`, hingga `ngadem`, `keluar: 'none'`).
- Klausa 2 (`Suhu *nol derajat* gak bunuh kuman`):
  - `Suhu`: `move` gelas es sedikit ke kanan (`toX: 35, toY: 50`, SFX `whoosh`) + `props/gandum-termometer-dingin.png` masuk `slide-up` di kiri (`x: 16, y: 50, width: 68`, hingga `ngadem`, `keluar: 'none'`).
  - `*nol*`: `teks` `"0°C BEKU"` di kanan atas (`x: 69, y: 35, ukuran: 42`, warna `#ffffff`, kotak `#1565c0`, `masuk: 'pop'`, tanpa SFX, hingga `mereka`, `keluar: 'none'`).
  - `bunuh`: `wiggle` pada gelas es.
  - `kuman`: `shake` pada bakteri.
- Klausa 3 (`mereka cuma *numpang ngadem*`):
  - `mereka`: `teks` mikro miring `"CUMA TIDUR!"` (`x: 70, y: 29, ukuran: 28, rotate: -6`, warna `#111111`, kotak `#ffe066`, `masuk: 'fade'`, hingga `ngadem`).
  - `*ngadem*` (Joke #2): `props/air-es-kuman-ngadem.png` masuk `pop` di tengah panggung (`x: 50, y: 50, width: 330`, SFX `fahh`). Scene ditahan `tahan: 32`.

### Scene 6 (`stage`) - Latar: `latar/air-es-6.png` - Judul: `TIPS AMAN`
- Klausa 1 (`Lagi *batuk*`):
  - `Lagi`: `props/air-es-tenggorokan.png` (`x: 30, y: 49, width: 245`, `masuk: 'pop'`, SFX `dum`, hingga `Pas`, `keluar: 'none'`).
  - `*batuk*`: `shake` pada tenggorokan.
- Klausa 2 (`tahan dulu esnya`):
  - `tahan`: `props/air-es-gelas-es.png` masuk `slide-right` di kanan (`x: 68, y: 49, width: 230`, hingga `Pas`, `keluar: 'none'`).
  - `esnya`: `simbol silang` di atas gelas es (`x: 68, y: 49, width: 140`, SFX `slap`, hingga `Pas`).
- Klausa 3 (`Pas sehat`):
  - `Pas`: `props/air-es-air-matang.png` masuk `grow-up` di tengah kiri (`x: 34, y: 51, width: 270`, SFX `ding`).
- Klausa 4 (`pakai es *air matang*`):
  - `pakai`: `simbol centang` di kiri atas air matang (`x: 28, y: 34, width: 100`, tanpa SFX).
  - `*matang*`: `move` pada `air-es-air-matang` ke kiri (`toX: 28, toY: 51`, SFX `whoosh`).
- Klausa 5 (`Biar yang *ngadem* cuma kamu`):
  - `Biar`: `pulse` pada `air-es-air-matang`.
  - `*ngadem*`: `props/meme-kucing-jempol.png` masuk `pop` di kanan (`x: 70, y: 49, width: 230`, SFX `boing`, hingga `kumannya`, `keluar: 'none'`).
- Klausa 6 (`bukan *kumannya*`):
  - `*kumannya*` (Joke #3): `props/air-es-kuman-ngadem.png` masuk `drop` di kanan (`x: 70, y: 50, width: 280`, SFX `womp`) + `simbol silang` di atasnya (`x: 70, y: 50, width: 165`, tanpa SFX). Scene akhir `tahan: 6`.
