# Hook & Judul Thumbnail

Penonton Shorts memutuskan scroll dalam 1,5-3 detik. Hook = **1 kalimat, 7-14 kata, ~3-4 detik** (`duration` 95-120 frame).

## 5 Rumus (tulis 1 kandidat dari tiap rumus)

| Rumus | Pola | Contoh (air-kadaluwarsa) |
|---|---|---|
| `kontras-angka` | [X] angka besar, kok [Y] angka kecil? | Air di bumi umurnya jutaan tahun, kok di botol cuma dua tahun? |
| `bocoran` | Yang [kena] itu bukan [dugaan], tapi [jawaban]. | Yang kadaluwarsa itu bukan airnya, tapi botolnya. |
| `salah-kaprah` | Kamu kira [kebiasaan/anggapan], padahal [kebalikan]. | Kamu kira air botol bisa basi, padahal yang rusak plastiknya. |
| `taruhan` | [Benda sehari-hari] yang kamu [pakai] ternyata [risiko]. | Botol air yang kamu tinggal di mobil ternyata bikin airnya pahit. |
| `kok-kenapa` | [Fakta 4 kata], kok/kenapa [kejanggalan]? | Air putih gak pernah basi, kok botolnya ada kadaluwarsa? |

Contoh lama yang kuat:
- "Beli token seratus ribu, kok masuknya cuma enam puluh satu?" (kontras-angka)
- "Tanpa klik link aneh, kok HP tetap bisa disadap?" (kok-kenapa)
- "Kita juara makan mie instan, kok gak punya sawah gandum?" (kok-kenapa)

## Larangan

- Kalimat pemanasan: "Isu X lagi ramai...", "Pernah gak sih...", "Tahukah kamu...".
- Lebih dari 1 kalimat.
- Membuka jawaban penuh (jawaban hanya boleh dibocorkan setengah, seperti rumus `bocoran`).

## Rubrik Skor (0-2 per kriteria, total maks. 10)

| Kriteria | 0 | 1 | 2 |
|---|---|---|---|
| Konkret | abstrak | ada benda | ada angka atau benda yang bisa difoto |
| Kontras | tidak ada | tersirat | dua hal bertentangan jelas (pakai kok/padahal/cuma/ternyata/bukan/malah/kenapa) |
| Dekat | jarang dialami | pernah dengar | penonton pernah mengalaminya sendiri |
| Penasaran | jawaban sudah lengkap | sebagian | jawaban belum diberikan |
| Visual0 | tidak bisa digambar | butuh 2+ detik | ada prop yang langsung mewakili di detik 0 |

Pilih Total tertinggi (seri: pilih yang lebih pendek). **Minimal 7.** Di bawah 7: tulis ulang, jangan dipaksa.

## Judul (`baris1`, `baris2`)

Ukuran huruf judul otomatis menyesuaikan lebar: makin pendek baris, makin besar hurufnya (hook maks. 92 px, thumbnail maks. 112 px). Usahakan `baris1` <= 18 karakter supaya judul tetap terbaca di grid channel dan feed.

Diturunkan dari hook terpilih; dipakai di `thumbnail` dan scene `hook`.
- `baris1` = subjek atau angka besar. `baris2` = kejanggalannya (tampil di stabilo kuning).
- Maks. **28 karakter** per baris, 2-5 kata, utuh secara logika (bukan potongan telegram).
- `baris2` diakhiri `?`, atau memuat angka, atau kata kontras.
- Digit **boleh** di judul (tidak dibaca TTS).

### Judul harus berdiri sendiri (dicek validator: H5)

**Uji orang asing:** kalau cuma membaca judulnya, tanpa gambar dan tanpa video, orang tahu ini soal **benda apa, di mana**? Kalau jawabannya "pintu apa?", "air yang mana?", judulnya belum lengkap.

1. Tulis dulu **Subjek lengkap** di bagian `## Thumbnail` rencana: benda + tempat/konteksnya ("rak telur di pintu kulkas", "kabel listrik depan rumah", "gaji 5 juta").
2. Semua kata penting subjek itu wajib ada di `baris1`/`baris2`.
3. Kalau kepanjangan, buang **kata pengisi** dulu (ADA, YANG, ITU, INI, SEMUA), jangan buang kata konteks.

| Lemah | Kenapa | Lengkap |
|---|---|---|
| `ADA RAK TELUR DI PINTU` | pintu apa? "ADA" cuma pengisi | `RAK TELUR DI PINTU KULKAS` |
| `TELUR CEPAT BUSUK` | di mana? kenapa? | `TELUR DI PINTU KULKAS` / `KOK CEPAT BUSUK?` |

### Gambar thumbnail (dicek validator: T1)

- Gambar (`thumbnail.src`) menampilkan **subjek lengkap dengan tempatnya**: kulkas terbuka dengan rak pintu berisi telur, **bukan** telur saja.
- **Uji 1 detik:** orang yang cuma melihat gambarnya (judulnya ditutup) tahu ini soal apa.
- Harus prop dari `props.json` video ini, bukan meme. Kalau belum ada prop yang menampilkan subjek lengkap, generate prop khusus thumbnail.
- Tulis file-nya di `Gambar:` pada bagian `## Thumbnail` rencana, lalu samakan dengan `thumbnail.src`.

| Bagus | Lemah | Kenapa |
|---|---|---|
| `AIR JUTAAN TAHUN` / `DI BOTOL CUMA 2 TAHUN?` | `AIR PUTIH GAK BASI` / `KOK ADA KADALUWARSA?` | yang bagus punya kontras angka |
| `TOKEN 100 RIBU` / `ISINYA CUMA 61 kWh?` | `TOKEN LISTRIK` / `KENAPA BEGITU?` | yang lemah tidak konkret |
| `HP DISADAP` / `TANPA KITA SADARI?` | `HP` / `DISADAP TANPA KLIK LINK APA PUN?` | baris2 terlalu panjang |

## Format di `.rencana.md`

```markdown
## Hook
| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | Air di bumi umurnya jutaan tahun, kok di botol cuma dua tahun? | AIR JUTAAN TAHUN | DI BOTOL CUMA 2 TAHUN? | 2 | 2 | 2 | 2 | 1 | 9 |
| 2 | bocoran | ... | ... | ... | 1 | 2 | 2 | 1 | 1 | 7 |
| 3 | salah-kaprah | ... |
| 4 | taruhan | ... |
| 5 | kok-kenapa | ... |

Terpilih: #1

## Thumbnail
Subjek lengkap: air botol kemasan
Gambar: props/air-botol-expired.png
Uji 1 detik: orang yang cuma lihat gambarnya tahu ini soal tanggal kadaluwarsa di botol air
```
Kolom pertama harus angka, kolom terakhir harus angka (validator membacanya). Bagian `## Thumbnail` wajib ada (validator R3).
