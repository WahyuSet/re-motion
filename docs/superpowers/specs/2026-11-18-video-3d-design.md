# Desain: Jalur Klip 3D Blender untuk Model Rendah (`video-3d`)

Tanggal: 2026-11-18
Status: menunggu review user

## 1. Tujuan

Model rendah (patokan: Claude Haiku) bisa menambahkan klip 3D Blender ke video explainer short tanpa membaca atau menulis Python, dengan alur lurus dan kesalahan yang ditangkap validator.

### Keputusan user

- Fokus hanya jalur Blender. Skill `video-explainer` dan alur explainer yang sekarang sudah oke dan tidak diubah.
- Blender tetap opsional: hanya dijalankan kalau user memintanya.
- Tanpa maskot atau karakter.
- Model rendah hanya memilih dari katalog. Kalau topik tidak cocok, model berhenti dan melapor.
- Instruksi berada di skill terpisah `video-3d`, tanpa baris penunjuk di `video-explainer`.
- Struktur memakai satu file per set, ditambah `katalog.json` yang dicek otomatis.

### Kriteria berhasil

1. Subagent Haiku yang hanya diberi skill `video-3d` bisa membuat `<slug>.3d.json` yang lolos `cek:3d`, tanpa membuka file `.py`.
2. Saat diminta adegan di luar katalog, subagent yang sama berhenti dan melapor "butuh set baru".
3. Video `jendela-kebalik` versi baru lolos `cek:3d` dan `cek:explainer` dengan 0 error dan 0 peringatan, dan keenam masalah hasil analisa sudah hilang (bagian 9).
4. Semua video explainer lama identik pixel dengan acuan, dan test suite tetap lulus.

## 2. Di luar lingkup

- Format long 16:9. `cek:3d` menolak naskah `format: 'landscape'`.
- Karakter, rig, Mixamo, Blender MCP.
- Model rendah menulis atau mengubah Python.
- Perubahan skill `video-explainer`, aturan `cek:explainer` yang lama, dan engine sejarah.

## 3. Alur skill `video-3d`

Skill terpicu hanya kalau user meminta klip 3D atau Blender. Syarat mulai: naskah lolos `npm run cek:explainer -- <slug>` dan `public/audio/<slug>/kata.json` ada.

| Langkah | Yang dikerjakan model | Perintah |
|---|---|---|
| 1. Kerangka | Membuat `<slug>.3d.json`, satu entri per scene non-beat | `npm run 3d:baru -- <slug>` |
| 2. Pilih | Membaca `katalog.md`, mengisi set, kamera, isi, gerak; menghapus entri scene yang tidak diminta | edit `<slug>.3d.json` |
| 3. Cek | Memperbaiki sesuai `→ PERBAIKI:` sampai bersih | `npm run cek:3d -- <slug>` |
| 4. Uji | Melihat lembar kontak resolusi kecil | `npm run 3d:uji -- <slug>` |
| 5. Render | Merender klip penuh | `npm run 3d:render -- <slug>` |
| 6. Pasang | Menambahkan `latarVideo` yang dicetak perintah render, lalu cek ulang | `cek:3d`, lalu `cek:explainer` |

Aturan berhenti di `SKILL.md`:

- Tidak ada set yang cocok: berhenti, laporkan "butuh set baru: <deskripsi adegan>". Dilarang menulis Python.
- Pesan error yang sama muncul 3 kali: berhenti dan laporkan pesan itu beserta isi entri JSON-nya.

`SKILL.md` maksimal 60 baris. Tabel set, kamera, isi, dan gerak ada di `referensi/katalog.md`.

## 4. Komponen dan file

```text
.claude/skills/video-3d/
  SKILL.md                     alur dan aturan berhenti
  referensi/katalog.md         DIBUAT OTOMATIS dari katalog.json
scripts/3d/
  baru.mjs                     perintah 3d:baru
  cek.mjs                      perintah cek:3d
  render.mjs                   perintah 3d:render dan 3d:uji (--uji)
  katalog-md.mjs               perintah 3d:katalog
  lib/katalog.mjs              muat katalog.json
  lib/waktu.mjs                kata -> frame, durasi scene
  lib/rencana.mjs              gabungkan .3d.json + katalog + waktu, hitung hash
  lib/blender.mjs              cari dan jalankan Blender
  lib/aturan/*.mjs             satu file per kelompok aturan (bagian 7)
scripts/blender/
  katalog.json                 menu resmi
  utama.py                     titik masuk: baca rencana jadi, panggil set, render
  inti.py                      bahan, bentuk, lampu, kamera, dekorator @gerak, pengaturan render
  set/rumah_luar.py
  set/potongan_udara.py
  set/potongan_keramik.py
  set/ruang_primitif.py
src/explainer/data/
  <slug>.3d.json               ditulis model
  <slug>.3d.lock.json          hash rencana klip yang sudah dirender, ditulis 3d:render
public/klip/<slug>/scene-NN.mp4
out/3d/<slug>/                 rencana jadi, frame, lembar uji (tidak di-commit)
tests/3d/*.test.mjs
```

File lama yang digantikan dan tidak dibawa ke branch (belum pernah di-commit): `scripts/blender.mjs`, `scripts/blender/bangun-adegan.py`, `scripts/blender/contoh.blender.json`, `scripts/blender/contoh-keramik.blender.json`, `src/explainer/data/jendela-kebalik.blender.json`, `public/klip/jendela-kebalik/0N.mp4`, serta perintah npm `blender`.

Perintah npm baru: `3d:baru`, `cek:3d`, `3d:uji`, `3d:render`, `3d:katalog`.

## 5. Format data

### 5.1 `<slug>.3d.json` (ditulis model)

```json
{
  "slug": "jendela-kebalik",
  "klip": [
    {
      "scene": 4,
      "set": "rumah-luar",
      "kamera": "dekat-jendela",
      "isi": {"jendela": "kebalik", "awal": "terbuka"},
      "gerak": [
        {"jenis": "karung-datang", "di": "Maling", "ke": 2},
        {"jenis": "karung-nyangkut", "di": "nyangkut"}
      ]
    }
  ],
  "gambar": [
    {"nama": "jendela-kebalik-jendela", "set": "rumah-luar", "kamera": "prop-jendela", "isi": {"jendela": "kebalik", "awal": "terbuka"}}
  ]
}
```

- `scene` memakai nomor 1-based seperti pesan `cek:explainer`.
- `di` adalah kata di narasi scene itu, dicocokkan dengan `indexOfWord` dari `src/lib/kata.ts`.
- `ke` opsional, menunjuk kemunculan ke-N dari kata itu. Bawaannya 1.
- `isi` yang tidak ditulis memakai `bawaan` dari katalog.
- `gambar` opsional, menghasilkan `public/props/<nama>.png` berlatar transparan.
- File ini tidak memuat durasi, posisi, atau koordinat.

### 5.2 `katalog.json`

```json
{
  "versi": 1,
  "set": {
    "rumah-luar": {
      "file": "rumah_luar.py",
      "cocok_untuk": "benda di dinding luar rumah: jendela, pintu, ventilasi",
      "langit": "#CFE3EE",
      "isi": {
        "jendela": {"pilihan": ["kebalik", "biasa", "dua"], "bawaan": "kebalik"},
        "awal": {"pilihan": ["tertutup", "terbuka"], "bawaan": "tertutup"}
      },
      "syarat_hook": {"awal": "terbuka"},
      "kamera": {
        "dekat-jendela": {
          "dari": [1.2, -3.4, 1.5],
          "ke": [0.9, -3.0, 1.55],
          "lihat": [0, 0, 1.6],
          "lensa": 30,
          "zona_subjek": [20, 30, 80, 68],
          "hook": false
        }
      },
      "gerak": {
        "buka-jendela": {"detik": 1.2, "arti": "daun jendela membuka"},
        "karung-datang": {"detik": 1.0, "arti": "karung melayang menuju celah"},
        "karung-nyangkut": {"detik": 0.8, "arti": "karung masuk celah lalu goyang", "butuh": ["karung-datang"], "terus": true}
      }
    }
  }
}
```

- `zona_subjek` = `[kiri, atas, kanan, bawah]` dalam persen layar, dan harus memuat subjek sepanjang gerak kamera.
- `hook: true` berarti kamera boleh dipakai di scene 1.
- `prop: true` pada kamera berarti hanya untuk `gambar`: latar transparan dan tanpa lingkungan.
- `syarat_hook` berisi nilai `isi` yang wajib untuk scene 1. Objek kosong berarti tidak ada syarat.
- `terus: true` berarti efek gerak berlanjut sampai akhir klip. `detik` tetap menyatakan lama bagian utamanya.
- `syarat_isi` opsional pada gerak, berisi nilai `isi` yang membuat gerak itu terlihat, misalnya `{"awal": ["tertutup"]}` untuk `buka-jendela`.

### 5.3 Rencana jadi: `out/3d/<slug>/scene-NN.json`

Dibuat Node dan hanya ini yang dibaca Python.

```json
{
  "set": "rumah-luar",
  "file": "rumah_luar.py",
  "fps": 30,
  "lebar": 1080,
  "tinggi": 1920,
  "frame_akhir": 372,
  "transparan": false,
  "langit": "#CFE3EE",
  "kamera": {"dari": [1.2, -3.4, 1.5], "ke": [0.9, -3.0, 1.55], "lihat": [0, 0, 1.6], "lensa": 30},
  "isi": {"jendela": "kebalik", "awal": "terbuka"},
  "gerak": [{"jenis": "karung-nyangkut", "mulai": 243, "selesai": 267, "terus": true}]
}
```

Semua frame di rencana berbasis 0 dan sama dengan frame lokal scene di Remotion. Blender merender frame `0` sampai `frame_akhir - 1`, jadi frame ke-N di MP4 tepat berada di frame ke-N scene. `gerak` diurutkan menurut `mulai`.

### 5.4 Pola file set

```python
from inti import gerak, kotak

def bangun(isi):
    """Susun objek diam. Kembalikan objek yang digerakkan, dengan nama tetap."""
    return {"daun": daun, "karung": karung}

@gerak("buka-jendela")
def buka_jendela(obj, mulai, selesai, frame_akhir):
    ...
```

Satu file berisi satu `bangun()` dan satu fungsi per gerak. File set tidak mengatur render, kamera, atau membaca JSON.

## 6. Waktu dan sinkronisasi

Sumber kebenaran tetap engine explainer, jadi rumus tidak ditulis ulang dengan nilai sendiri. `lib/waktu.mjs` memuat lewat `importTs`:

- `sceneWords` dari `src/lib/kata.ts`. Frame mulai kata = nilai `start` yang dipakai subtitle.
- `NARASI_DELAY` dari `src/lib/kata.ts`, serta `EKOR_EXPLAINER` dan `TAHAN_AKHIR` dari `src/explainer/prep.ts`.

Waktu kata scene diambil dari `public/audio/<slug>/kata.json`. Durasi scene:

```text
NARASI_DELAY + ceil(akhir_kata_terakhir * fps) + EKOR_EXPLAINER + tahan + transisi_berikutnya
ditambah TAHAN_AKHIR untuk scene terakhir
```

`frame_akhir` klip = durasi scene + 15 frame cadangan. Sebuah test membandingkan jumlah durasi `jendela-kebalik` dengan `durationInFrames` komposisi Remotion, supaya perbedaan dengan engine langsung ketahuan.

`mulai` gerak = frame kata pemicu. `selesai` = `mulai + round(detik * fps)`.

## 7. Aturan `cek:3d`

Format pesan sama dengan `cek:explainer`: `lokasi: masalah → PERBAIKI: langkah`. Kerja dianggap selesai hanya dengan 0 error dan 0 peringatan. Aturan berlaku untuk scene yang punya entri di `.3d.json`.

| Kode | Tingkat | Aturan |
|---|---|---|
| J1 | error | JSON valid; pesan menyebut baris dan kolom |
| J2 | error | `slug` sama dengan argumen, naskah bukan `landscape` |
| J3 | error | scene ada, bukan `beat`, dan tidak dobel |
| C1 | error | `set` terdaftar; pesan menampilkan pilihan dan `cocok_untuk` |
| C2 | error | `kamera` terdaftar di set itu; kamera `prop` hanya untuk `gambar` |
| C3 | error | kunci dan nilai `isi` terdaftar |
| C4 | error | `jenis` gerak terdaftar, tidak dobel dalam satu klip |
| C5 | error | setiap `butuh` ada di klip yang sama |
| C6 | error | `isi` klip memenuhi `syarat_isi` setiap gerak |
| W1 | error | `kata.json` ada, punya entri untuk scene itu, dan jumlah katanya sama dengan narasi |
| W2 | error | kata `di` ada di narasi scene; pesan menampilkan daftar katanya |
| W3 | error | `ke` tidak melebihi jumlah kemunculan |
| W4 | error | gerak selesai sebelum scene berakhir |
| W5 | error | gerak mulai setelah semua `butuh`-nya selesai |
| H1 | error | klip scene 1 memenuhi `syarat_hook` |
| H2 | error | kamera klip scene 1 punya `hook: true` |
| Z1 | peringatan | item overlay tidak menutupi lebih dari 30% kotaknya dengan `zona_subjek` selama ada gerak berjalan |
| S1 | peringatan | item teks minimal `ukuran` 36, kecuali satu teks celetukan per video dengan `ukuran` 32 dan `rotate` bukan 0 |
| S2 | peringatan | item simbol minimal `width` 120 |
| P1 | error | setelah render, naskah memakai `latarVideo: 'klip/<slug>/scene-NN.mp4'` untuk scene itu |
| P2 | error | file klip ada dan durasinya tidak lebih pendek dari scene |
| P3 | error | hash rencana sama dengan `.3d.lock.json`; kalau berbeda, klip basi dan harus dirender ulang |
| P4 | error | file `public/props/<nama>.png` untuk setiap `gambar` ada |

Catatan:

- Aturan P hanya dijalankan kalau `.3d.lock.json` sudah ada, supaya langkah 3 tidak gagal sebelum render pertama. Kalau lock sudah ada tapi entri scene belum tercatat, P3 gagal.
- Z1 memakai `kotakItem` dan `porsiTumpuk` dari `scripts/lib/explainer-cek/kotak.mjs`, serta posisi kata dari `rentangItem` di `visual.mjs`. Kotak dihitung di posisi awal dan di setiap tujuan aksi `move`. Gerak `terus` dihitung berjalan sampai akhir scene.
- Hash P3 mencakup rencana jadi serta isi `utama.py`, `inti.py`, dan file set-nya (akhir baris dinormalkan), jadi klip juga basi kalau audio atau Python berubah.
- Pengecualian S1 ada karena aturan M6 di `cek:explainer` mewajibkan satu teks celetukan per video dengan `ukuran` maksimal 32 dan `rotate` bukan 0.

### Test katalog

Test berikut menjaga katalog, jadi model tidak perlu menilai komposisi kamera:

- Nama `@gerak` di setiap file set sama persis dengan `gerak` di katalog.
- `zona_subjek` kamera non-prop: lebar minimal 50, kiri minimal 7, kanan maksimal 86, atas minimal 13, bawah maksimal 73,5.
- Kamera `hook: true`: atas minimal 28.
- `bawaan` ada di `pilihan`, `butuh` menunjuk gerak yang ada.
- `referensi/katalog.md` sama dengan hasil `3d:katalog`.

## 8. Penanganan gagal

- `3d:render` merender ke `out/3d/<slug>/` dan baru mengganti MP4 di `public/klip/` setelah render dan encode sukses.
- Kalau gagal, perintah berhenti dengan kode 1 dan mencetak klip, 20 baris terakhir keluaran Blender, serta perintah ulang.
- Klip dengan hash yang sama dengan lock dilewati, kecuali memakai `--paksa`.
- `3d:render` menolak jalan kalau `cek:3d` masih punya error J, C, W, atau H.
- Blender dicari lewat env `BLENDER`, `PATH`, lalu `C:\Program Files\Blender Foundation\`. Kalau tidak ada, pesan menyebut cara memasangnya.
- `3d:baru` tidak menimpa `.3d.json` yang sudah ada.

## 9. Isi katalog versi pertama dan migrasi `jendela-kebalik`

| Set | Asal | Gerak awal |
|---|---|---|
| `rumah-luar` | `jendela-kebalik` | `buka-jendela`, `kayang`, `engsel-nyala`, `karung-datang`, `karung-nyangkut`, `debu-masuk` |
| `potongan-udara` | `jendela-kebalik` | `panas-naik`, `panas-keluar`, `sejuk-masuk` |
| `potongan-keramik` | prototipe | `dorong-samping`, `keramik-naik` |
| `ruang-primitif` | prototipe | `bola-gelinding`, `kardus-jatuh` |

`jendela-kebalik` dimigrasi menjadi video patokan, dengan perbaikan berikut:

| Masalah hasil analisa | Perbaikan |
|---|---|
| Aksi 3D tidak sinkron | gerak memakai kata pemicu, termasuk karung di "Maling" dan "nyangkut", serta `kayang` di "kayang" |
| Frame 0 hook belum "kebalik" | `awal: terbuka` pada scene 1 |
| Aksi udara di area tombol | kamera baru `potongan-udara` dengan zona lolos test |
| Subjek terlalu kecil | kamera baru dengan zona minimal 50% lebar layar |
| Stiker kecil, panah 2D bertabrakan | item naskah disesuaikan sampai S1 dan S2 lolos; panah 2D dihapus di scene yang punya panah 3D |
| Gag menutupi aksi 3D | item naskah digeser sampai Z1 lolos |
| Prop jendela kecil membingungkan di scene 6 | prop hanya tampil pada klausa pertama lalu keluar di kata "Sejak"; tidak bisa dihapus karena aturan V4 mewajibkan prop thumbnail dipakai di scene yang memuat frasa `untuk` |

Setelah itu klip, preview, video final, dan paket YouTube dirender ulang. Audio TTS tetap memakai potongan yang ada. Dua bagian yang perlu didengar user tetap dicatat di laporan akhir: awal scene 2 dan kata "engsel" di awal scene 6.

## 10. Pengujian

1. **Test unit tanpa Blender** di `tests/3d/`, memakai `node:test`: tiap kelompok aturan punya kasus lolos dan gagal, waktu kata ke frame, durasi, hash, `3d:baru`, dan test katalog.
2. **Uji asap dengan Blender:** semua kamera non-prop di tiap set dirender dengan `--uji`, dan satu `gambar` transparan. Test ini dilewati dengan pesan jelas kalau Blender tidak ada.
3. **Regresi:** seluruh test `tests/explainer` dan `tests/lib`, typecheck, lalu `npm run uji` dengan semua ID di `daftarExplainer` kecuali `JendelaKebalik`. Acuan pixel dibuat dari commit `062115e` di worktree implementasi sebelum ada perubahan apa pun, karena acuan lama berasal dari sebelum fitur long.
4. **Uji model rendah**, dijalankan di worktree terpisah dengan `jendela-kebalik.3d.json` dihapus:
   - Skenario A: subagent Haiku membuat ulang rencana 3D `jendela-kebalik` dari skill. Lulus kalau `cek:3d` bersih dan log alatnya tidak menunjukkan pembacaan file `.py`.
   - Skenario B: subagent Haiku diminta klip mesin motor. Lulus kalau tidak ada Python yang ditulis dan laporannya berisi "butuh set baru".

## 11. Git

Pekerjaan Blender saat ini belum di-commit dan berada di folder utama, yang juga sedang dipakai sesi lain untuk video `jakarta-tenggelam`. Implementasi dikerjakan di worktree `G:\Project\remotion-3d` pada branch baru `feat/video-3d` dari `062115e`, dan hanya file milik pekerjaan ini yang disalin ke sana. Folder utama tidak diubah. File lama di folder utama dibersihkan saat merge, dengan persetujuan user. Branch lama `feat/explainer-latar-video` tertinggal dari `main` dan tidak dipakai.
