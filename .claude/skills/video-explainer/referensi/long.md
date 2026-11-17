# Video Long (16:9, 3-12 menit)

Format long dipakai kalau user minta video long, video YouTube biasa, atau landscape, atau kalau materinya tidak muat dalam 60 detik. Engine, props, latar, narasi lisan, komedi, dan validator sama dengan short. Bedanya ada di struktur, ritme, dan tata letak.

```bash
npm run baru:explainer -- <slug> --long
```

Kerangka ini memberi `format: 'landscape'`, 5 bab (Pembuka, 3 bab isi, Kesimpulan), dan bagian `## Bab` di rencana.

## Struktur

1. **Cold open (scene 1, hook, `bab: 'Pembuka'`)**: 12-45 kata, ±5-20 detik. Tembak kejanggalan utama, lalu janjikan isi video dalam 1 kalimat ("Di video ini kita bongkar tiga alasannya."). Aturan frame 0 (H6) tetap berlaku: penonton dari beranda YouTube juga memutuskan di detik pertama.
2. **Beat "Oke, sini gue jelasin."**: sekali saja, tepat setelah cold open.
3. **3-6 bab isi.** Setiap bab adalah mini-explainer, dipecah jadi 3-8 scene:
   pertanyaan bab → salah kaprah → fakta (stage/diagram) → joke → recap 1 kalimat yang menyambung ke bab berikutnya.
4. **Kesimpulan (`bab: 'Kesimpulan'`)**: jawab pertanyaan di cold open, 1 saran praktis, ajakan subscribe 1 kalimat.

Total 15-40 scene. Satu scene tetap satu gagasan (narasi 1-4 kalimat). Jangan bikin scene 1 menit.

## Bab (dicek validator: C0-C3)

- Isi `bab: '<Judul>'` **hanya di scene pertama** setiap bab. Scene berikutnya dalam bab yang sama tanpa `bab`.
- Scene 1 wajib `bab: 'Pembuka'` (C1), karena chapter YouTube harus mulai di 0:00.
- Minimal 3 bab (C2), setiap bab minimal 10 detik (C3).
- Judul bab ≤ 30 huruf, berupa pertanyaan atau klaim pendek ("Kenapa bisa kuning?", "Reaksi Maillard").
- `paket-youtube` otomatis menulis chapter ke deskripsi, dan engine menampilkan banner "BAB N · JUDUL" di kanan atas selama 3 detik (kecuali di scene 1).
- Video short **tidak boleh** memakai `bab` (C0).

## Ritme

- Durasi 180-720 detik (D3/D4). Di bawah 3 menit lebih baik dibuat short.
- Joke minimal `max(4, 1 per menit)` (K1): video 6 menit = 6 joke. Sebar ke semua bab, jangan menumpuk di awal.
- "padahal" / "banyak yang ngira" maksimal 1× **per bab** (N3).
- Ganti latar di setiap scene (latar unik per scene tetap wajib). Latar bab yang sama boleh satu tempat dari sudut berbeda.
- Setiap 20-40 detik harus ada perubahan besar di layar: latar baru, diagram, atau visual gag.

## Tata letak

Lihat `referensi/visual.md` bagian "Tata letak landscape". Ringkasnya: area aman 3-97% × 5-95%, item di hook mulai ≥ 34%, subtitle mulai 85%, dua keadaan berdampingan di `x` 25 / 75.

Untuk melihat tata letak landscape sebelum ada audio, atau mengecek video short dalam versi landscape:

```bash
node scripts/cek-frame.mjs <slug> --format landscape --rapat
```

## Narasi & TTS

- Aturan narasi lisan N1-N5 tetap sama: kalimat pendek, tanpa gaya buku pelajaran.
- `node scripts/narasi.mjs <slug>` menulis `narasi/<slug>/naskah-full.txt` (1 paragraf = 1 scene). Untuk video panjang, jeda antar-paragraf di TTS harus **jelas lebih panjang** daripada jeda antar-kalimat (±1 detik). `potong-narasi` memotong audio di jeda terpanjang dan memperingatkan kalau jeda batas scene kurang dari 1,3× jeda lainnya. Kalau potongan meleset, coba `--metode whisper`.
- Kalau audio terlalu panjang untuk sekali generate, generate per bab lalu gabungkan dengan jeda 1 detik di antaranya sebelum `potong-narasi`.

## Definisi selesai (tambahan untuk long)

- `npm run cek:explainer -- <slug>` 0 error, 0 peringatan, termasuk C1-C3, D3/D4, dan K1 dengan jumlah joke sesuai durasi.
- `cek-frame --rapat` dicek: banner bab tidak menabrak item, dua keadaan berdampingan tidak saling menutup.
- `paket-youtube` menulis chapter di `youtube.txt` (bagian deskripsi berisi "Bab:").
