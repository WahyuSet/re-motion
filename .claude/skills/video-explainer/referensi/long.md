# Video Long (16:9, 3-12 menit)

Format long dipakai kalau user minta video long, video YouTube biasa, atau landscape, atau kalau materinya tidak muat dalam 60 detik. Engine, props, narasi lisan, komedi, dan validator sama dengan short. Bedanya ada di struktur, ritme, aset latar, dan tata letak.

```bash
npm run baru:explainer -- <slug> --long
```

Kerangka ini memberi `format: 'landscape'`, 5 bab (Pembuka, 3 bab isi, Kesimpulan), dan bagian `## Bab` di rencana.

## Struktur

1. **Cold open (scene 1, hook, `bab: 'Pembuka'`)**: 12-45 kata, ±5-20 detik. Tembak kejanggalan utama, lalu janjikan isi video dalam 1 kalimat ("Di video ini kita bongkar tiga alasannya."). Aturan frame 0 (H6) tetap berlaku: penonton dari beranda YouTube juga memutuskan di detik pertama.
2. **Beat "Oke, sini gue jelasin."**: sekali saja, tepat setelah cold open.
3. **3-6 bab isi.** Setiap bab adalah mini-explainer, dipecah jadi 3-8 scene:
   pertanyaan bab → salah kaprah → peragaan (diagram atau prop yang bergerak) → joke → kail ke bab berikutnya.
4. **Puncak**: jawaban pertanyaan hook jatuh di **55-85% durasi** (C5). Bab sebelumnya membangun konteks yang membuat jawaban itu terasa memuaskan.
5. **Kesimpulan (`bab: 'Kesimpulan'`)**: rangkum jawaban, 1 saran praktis, ajakan subscribe 1 kalimat.

Total 15-40 scene. Satu scene tetap satu gagasan (narasi 1-4 kalimat). Jangan bikin scene 1 menit.

## Bab (dicek validator: C0-C6)

- Isi `bab: '<Judul>'` **hanya di scene pertama** setiap bab. Scene berikutnya dalam bab yang sama tanpa `bab`.
- Scene 1 wajib `bab: 'Pembuka'` (C1), karena chapter YouTube harus mulai di 0:00.
- Minimal 3 bab (C2), setiap bab minimal 10 detik (C3).
- Judul bab ≤ 30 huruf, berupa pertanyaan atau klaim pendek ("Kenapa bisa kuning?", "Reaksi Maillard") (C4).
- Di bagian `## Bab` rencana tulis `Jawaban hook: scene N` (C5).
- Tabel `## Bab` punya kolom `Kail ke bab berikutnya` (C6). Isinya pertanyaan atau janji di akhir bab yang baru dijawab bab sesudahnya. Bab terakhir boleh kosong.
- `paket-youtube` otomatis menulis chapter ke deskripsi. Engine menampilkan banner "BAB N · JUDUL" selama 3 detik dan memberi transisi `whip` di awal setiap bab, kecuali scene 1. Pakai `transition: 'none'` hanya kalau memang ingin potongan langsung.
- Video short **tidak boleh** memakai `bab` (C0).

## Ritme (dicek validator: M7-M10)

- Durasi 180-720 detik (D3/D4). Di bawah 3 menit lebih baik dibuat short.
- Minimal 0,8 kejadian visual per detik narasi di tiap scene (M7). Kejadian = item + aksi. Scene yang kurang: tambah kejadian di kata kunci, atau pecah jadi dua.
- Setiap scene stage punya `move` yang jauhnya minimal 10% lebar layar (M8). Pergeseran kecil tidak terbaca di layar lebar.
- Objek utama maksimal 3 scene berturut-turut di sisi yang sama (M9). Selang-seling kiri, tengah, kanan, atau dua keadaan di `x` 25 dan 75.
- Setiap bab isi punya minimal 1 scene peragaan (M10): scene `diagram`, atau minimal 2 prop yang benar-benar bergerak.
- Joke minimal `max(4, 1 per menit)` (K1): video 6 menit = 6 joke. Sebar ke semua bab, jangan menumpuk di awal.
- "padahal" / "banyak yang ngira" maksimal 1× **per bab** (N3).
- Ganti latar di setiap scene. Latar bab yang sama boleh satu tempat dari sudut berbeda. Engine otomatis menggilir zoom-in, geser, zoom-out, geser.

## Peragaan proses

Materi yang berupa proses (lempeng bertabrakan, air menguap, uang terpotong) jangan digambar sebagai satu PNG yang digoyang. Pecah objeknya di `props.json`, lalu gerakkan dengan aksi yang sudah ada:

```ts
items: [
  {kind: 'prop', src: 'props/<slug>-lempeng-kiri.png', x: 18, y: 58, width: 420, delay: 0, masuk: 'slide-right',
    aksi: [{type: 'move', di: 'bertabrakan', toX: 38, durasi: 20}]},
  {kind: 'prop', src: 'props/<slug>-lempeng-kanan.png', x: 82, y: 58, width: 420, delay: 0, masuk: 'slide-left',
    aksi: [{type: 'move', di: 'bertabrakan', toX: 62, durasi: 20}, {type: 'shake', di: 'terlipat', intensitas: 12}]},
  {kind: 'prop', src: 'props/<slug>-gunung.png', x: 50, y: 62, width: 340, di: 'terlipat', masuk: 'grow-up', sfx: 'boom'},
]
```

Dua keadaan yang berganti di posisi sama memakai serah-terima (`sampai` lama = `di` baru, item lama `keluar: 'none'`).

## Aset latar (dicek validator: G1)

Latar long wajib 16:9. **Sebelum generate, ubah rasio di halaman Google Flow ke 16:9**, karena Flow mengikuti pengaturan di halamannya. `generate-props` membaca format dari `<slug>.ts`, meminta ukuran 16:9, dan langsung berhenti kalau hasilnya masih potret. Kembalikan Flow ke 9:16 sebelum mengerjakan video short lagi.

## Tata letak

Lihat `referensi/visual.md` bagian "Tata letak landscape". Ringkasnya: area aman 3-97% × 5-95%, item di hook mulai ≥ 36%, stage berjudul ≥ 20%, subtitle mulai 85%, teks minimal 44 px, dua keadaan berdampingan di `x` 25 / 75.

Untuk melihat tata letak landscape sebelum ada audio:

```bash
node scripts/cek-frame.mjs <slug> --format landscape --rapat
```

## Narasi & TTS

- Aturan narasi lisan N1-N5 tetap sama: kalimat pendek, tanpa gaya buku pelajaran.
- `node scripts/narasi.mjs <slug>` menulis `narasi/<slug>/naskah-full.txt` (1 paragraf = 1 scene). Untuk video panjang, jeda antar-paragraf di TTS harus **jelas lebih panjang** daripada jeda antar-kalimat (±1 detik). `potong-narasi` memotong audio di jeda terpanjang dan memperingatkan kalau jeda batas scene kurang dari 1,3× jeda lainnya. Kalau potongan meleset, coba `--metode whisper`.
- Kalau audio terlalu panjang untuk sekali generate, generate per bab lalu gabungkan dengan jeda 1 detik di antaranya sebelum `potong-narasi`.

## Definisi selesai (tambahan untuk long)

- `npm run cek:explainer -- <slug>` 0 error, 0 peringatan, termasuk C1-C6, D3/D4, G1, L3, M7-M10, V7-V8, dan K1 dengan jumlah joke sesuai durasi.
- `cek-frame --rapat` dicek: banner bab tidak menabrak item, dua keadaan berdampingan tidak saling menutup, meme `nempel` tidak menutupi subtitle.
- `paket-youtube` menulis chapter di `youtube.txt` (bagian deskripsi berisi "Bab:").
