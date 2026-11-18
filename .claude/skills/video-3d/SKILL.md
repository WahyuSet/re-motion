---
name: video-3d
description: Menambahkan klip 3D Blender sebagai latar scene video explainer short, hanya dengan memilih set, kamera, dan gerak dari katalog. Pakai skill ini hanya kalau user meminta klip 3D atau Blender. Tanpa permintaan itu, video explainer tetap memakai alur biasa.
---

# Klip 3D Blender

Kerjakan langkah berurutan. Kamu hanya mengedit `<slug>.3d.json` dan baris `latarVideo` di naskah.
Selesai berarti `cek:3d` dan `cek:explainer` sama-sama 0 error dan 0 peringatan.

## Syarat mulai

- `npm run cek:explainer -- <slug>` sudah lolos.
- `public/audio/<slug>/kata.json` sudah ada.

## Langkah

1. Buat kerangka: `npm run 3d:baru -- <slug>`
2. Baca `referensi/katalog.md`, lalu isi `src/explainer/data/<slug>.3d.json`. Hapus entri scene yang tidak diminta.
3. Cek: `npm run cek:3d -- <slug>`. Kerjakan setiap `→ PERBAIKI:` sampai bersih.
4. Uji: `npm run 3d:uji -- <slug>`. Buka `out/3d/<slug>/scene-NN-uji.jpg`. Subjek harus di dalam persegi.
5. Render: `npm run 3d:render -- <slug>`
6. Pasang: di naskah, ganti baris `latar:` scene itu dengan `latarVideo` yang dicetak langkah 5.
   Lalu jalankan `npm run cek:3d -- <slug>` dan `npm run cek:explainer -- <slug>`.

## Contoh entri

```json
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
```

- `scene`: nomor scene mulai dari 1.
- `di`: kata di narasi scene itu, saat gerak dimulai.
- `ke`: kemunculan ke berapa dari kata itu. Tulis hanya kalau bukan yang pertama.
- `gambar` (opsional): `{"nama": "<slug>-benda", "set": "...", "kamera": "<kamera prop>", "isi": {}}`.

## Aturan berhenti

- Tidak ada set yang cocok: berhenti dan laporkan `butuh set baru: <deskripsi adegan>`.
- Dilarang menulis, mengubah, atau membuka file Python.
- Pesan error yang sama muncul 3 kali: berhenti, laporkan pesan itu beserta isi entri JSON-nya.
- Blender gagal atau tidak ditemukan: berhenti dan laporkan pesan dari perintahnya.
