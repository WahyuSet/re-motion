# Explainer "Kamar Panas & Pengap" Remake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merombak total (remake) video explainer `kamar-panas` (Shorts 9:16, 1080×1920) yang menjelaskan kenapa kamar tidur tetap panas dan pengap saat malam hari padahal di luar sudah adem, memenuhi standar visual Full Real 100%, naskah antislop & humanizer, Zero Overcrowding, dan safe area Shorts.

**Architecture:** Modifikasi file data `src/explainer/data/kamar-panas.ts`, file latar `kamar-panas.latar.json`, dan file props `kamar-panas.props.json`. Tidak menyentuh engine sejarah atau engine explainer. Aset baru: 5 latar full real 100% via Flow Bridge, eliminasi seluruh karakter 3D Pixar & rumah joglo, standardisasi meme kucing & prop studio nyata.

**Tech Stack:** Remotion 4, TypeScript, Flow Bridge (`scripts/generate-props.mjs`), faster-whisper (`scripts/potong-narasi.mjs`), ffmpeg.

**Spec:** Evaluasi sesi ini · [rencana/explainer-next-video.md](../../../rencana/explainer-next-video.md) · [.claude/skills/video-explainer/SKILL.md](../../../.claude/skills/video-explainer/SKILL.md) · Pelajaran revisi `cas-80` dan `black-box`.

---

## Global Constraints

- Hanya mengubah `src/explainer/data/kamar-panas.*`, aset `public/latar/kamar-panas-*.png`, `public/props/kamar-*.png`, `public/audio/kamar-panas/`. Engine inti tidak disentuh.
- Format `short`, 1080×1920, `watermark: false`.
- Wajib memiliki background lokasi real di setiap scene non-beat (Scene 1, 2, 4, 5, 6), dilarang menggunakan latar polos, `latarOpacity`, atau `latarBlur`.
- Narasi tanpa angka digit (tulis dengan huruf), tanpa singkatan, tanda `*` berpasangan.
- Hook Scene 1 dipadatkan menjadi 1 kalimat *stop-scroll* (8–14 kata) tanpa basa-basi "Pernah gak sih...".
- Seluruh karakter 3D Pixar dan miniatur rumah joglo dihapus total; digantikan oleh meme kucing khas channel dan cutout studio prop realistis.
- Zero Overcrowding: Maksimal 2–3 item non-sentral aktif di layar pada saat bersamaan. Jarak vertikal $\ge 16\%$, safe area $x: 8..92\%$, $y: 12..76\%$.
- Copywriting memenuhi `antislop-copywriting` dan `humanizer-indonesia`.

---

## Review Focus

1. **Kelulusan Validasi `cek:explainer`**: 0 error dan 0 peringatan (wajib lulus seluruh cek background real, hook length, dan safe area).
2. **Kesesuaian Visual & Konteks Sains**: Setiap prop harus connect 100% dengan kata narasi fisika bangunan (massa termal dinding bata, konveksi udara naik ke plafon, ventilasi silang).
3. **Kualitas Latar Flow Bridge**: Background Full Real 100% beresolusi tajam, pencahayaan alami tanpa orang di depan.
4. **Inspeksi Lembar Kontak**: Periksa frame 35% dan 85% di setiap scene untuk memastikan subtitle terbaca jelas dan tidak ada objek bertumpuk.

---

### Task 1: Revisi Naskah Narasi & Pembersihan Karakter Janggal

**Files:**
- Modify: `src/explainer/data/kamar-panas.ts`
- Modify: `src/explainer/data/kamar-panas.sumber.md`

- [ ] **Step 1:** Perbarui `src/explainer/data/kamar-panas.sumber.md` dengan fakta ilmiah terverifikasi (Thermal Lag massa termal bata merah, laju pendinginan malam, hukum konveksi udara panas, dan prinsip ventilasi silang / cross ventilation Bernoulli).
- [ ] **Step 2:** Perbarui naskah di `src/explainer/data/kamar-panas.ts`:
  - **Scene 1 (Hook)**: `Di luar udah adem, kenapa *kamar tidur* malah pengap kayak kukusan bolu?` (11 kata).
  - **Scene 2 (Mitos 1 Jendela)**: `Banyak yang ngira cukup buka *satu jendela* dan nyalain kipas, kamar langsung sejuk. Tanpa jalur keluar, kipas cuma *muterin udara panas* dan uap keringatmu sendiri.`
  - **Scene 3 (Beat)**: `Oke, *sini gue jelasin* dua biang kerok fisika bangunannya.`
  - **Scene 4 (Biang Kerok 1 - Massa Termal)**: `Pertama, tembok bata itu suka *nyimpen panas*. Seharian kena matahari, panasnya baru *dilepas ke kamar* pas malam hari.`
  - **Scene 5 (Biang Kerok 2 - Hawa Panas Plafon)**: `Kedua, udara panas dan uap napas itu sifatnya *naik ke plafon*. Kalau cuma ada satu bukaan tanpa *ventilasi silang*, hawanya terkunci di atas kepalamu.`
  - **Scene 6 (Solusi - Exhaust Kipas & 2 Bukaan)**: `Solusinya, buat *dua jalur udara* lewat jendela dan celah pintu. Atau hadapkan kipas *ke arah luar* jendela sebentar untuk menyedot keluar hawa panasnya.`
- [ ] **Step 3:** Hapus seluruh referensi `props/kamar-gerah.png`, `props/token-mikir.png`, dan `props/token-rumah.png` dari `src/explainer/data/kamar-panas.ts`. Ganti dengan meme kucing (`props/meme-kucing-sinis.png`, `props/meme-kucing-merenung.png`, `props/meme-kucing-jelasin.png`, `props/meme-kucing-jempol.png`).
- [ ] **Step 4:** Pasang referensi background real:
  - Scene 1: `latar: 'latar/kamar-panas-1.png'`
  - Scene 2: `latar: 'latar/kamar-panas-2.png'`
  - Scene 4: `latar: 'latar/kamar-panas-4.png'`
  - Scene 5: `latar: 'latar/kamar-panas-5.png'`
  - Scene 6: `latar: 'latar/kamar-panas-6.png'`
- [ ] **Step 5:** `git add src/explainer/data/kamar-panas.* && git commit -m "feat(kamar-panas): naskah padat dan pembersihan karakter janggal"`

---

### Task 2: Generate 5 Background Full Real 100% via Flow Bridge

**Files:**
- Create/Modify: `src/explainer/data/kamar-panas.latar.json`
- Create (generated): `public/latar/kamar-panas-{1,2,4,5,6}.png`

- [ ] **Step 1:** Tulis prompt kamar tidur realistis di `src/explainer/data/kamar-panas.latar.json`:
  - `kamar-panas-1`: *"clean realistic modern photography of an Indonesian bedroom at night, cozy mattress, pillow, warm dim nightstand lamp lighting, warm trapped ambient air, no people, full-bleed vertical 9:16 frame"*
  - `kamar-panas-2`: *"clean realistic modern photography of a bedroom during dusk evening with one small closed window and wall socket, no people, full-bleed vertical 9:16 frame"*
  - `kamar-panas-4`: *"clean realistic modern photography of an exposed red brick wall inside a bedroom at night, subtle warm radiant heat glow, interior architectural shot, no people, full-bleed vertical 9:16 frame"*
  - `kamar-panas-5`: *"clean realistic modern photography of a high ceiling angle inside a bedroom, ceiling corner where warm air collects, warm night light, no people, full-bleed vertical 9:16 frame"*
  - `kamar-panas-6`: *"clean realistic modern photography of an open bedroom window at night, white curtains gently billowing with cool fresh night breeze from outside garden, clean interior, no people, full-bleed vertical 9:16 frame"*
- [ ] **Step 2:** Jalankan Flow Bridge untuk generate 5 latar:
  ```bash
  node scripts/generate-props.mjs --file src/explainer/data/kamar-panas.latar.json --utuh --concurrency 1
  ```
- [ ] **Step 3:** Verifikasi setiap latar di `public/latar/kamar-panas-*.png` dengan `read_file` untuk memastikan gambar utuh, tajam, dan bebas distorsi.
- [ ] **Step 4:** `git add public/latar/kamar-panas-* src/explainer/data/kamar-panas.latar.json && git commit -m "feat(kamar-panas): latar real kamar tidur"`

---

### Task 3: Koreografi Panggung & Safe Area Shorts

**Files:**
- Modify: `src/explainer/data/kamar-panas.ts`

- [ ] **Step 1:** Rancang koreografi visual setiap scene di `src/explainer/data/kamar-panas.ts`:
  - **Scene 1 (Hook)**:
    - Kucing sinis kepanasan di kiri (`x: 28, y: 54`, `props/meme-kucing-sinis.png`).
    - Termometer merkuri tinggi di kanan (`x: 72, y: 46`, `props/kamar-termometer.png`).
    - Badge merah: `KUKUSAN BOLU?!` (`x: 72, y: 64`).
    - Kipas muter di kanan (`props/kamar-kipas.png`) saat narasi kipas muter.
  - **Scene 2 (Mitos 1 Jendela)**:
    - Kipas angin di kiri (`x: 30, y: 48`).
    - Jendela satu di kanan (`x: 72, y: 46`).
    - Badge merah: `ANGIN CUMA MUTER` (`x: 50, y: 22`).
    - Simbol larang saat narasi *"tanpa jalur keluar"*.
  - **Scene 3 (Beat)**:
    - Kucing jas menjelaskan di tengah (`props/meme-kucing-jelasin.png`, `x: 50, y: 56`).
    - Badge kuning: `2 BIANG KEROK FISIKA` (`x: 50, y: 34`).
  - **Scene 4 (Biang Kerok 1 - Tembok Bata)**:
    - Tembok bata di kiri (`x: 30, y: 48`, `props/kamar-tembok.png`).
    - Badge oranye: `SIANG: NYIMPEN PANAS` (`x: 30, y: 66`).
    - Termometer merkuri di kanan (`x: 72, y: 48`) saat narasi dilepas ke kamar.
    - Badge merah: `MALAM: RADIASI PANAS` (`x: 72, y: 64`).
  - **Scene 5 (Biang Kerok 2 - Plafon & Angin Buntu)**:
    - Kucing merenung di kiri bawah (`x: 30, y: 56`, `props/meme-kucing-merenung.png`).
    - Panah ke atas menuju plafon (`x: 72, y: 38`).
    - Badge merah: `HAWA PANAS NAIK` (`x: 72, y: 56`).
    - Badge hitam: `1 BUKAAN = ANGIN BUNTU` (`x: 50, y: 70`).
  - **Scene 6 (Solusi - Ventilasi Silang & Kipas Exhaust)**:
    - Jendela terbuka di kanan (`x: 74, y: 48`, `props/kamar-jendela.png`).
    - Kipas angin di kiri (`x: 28, y: 48`, `props/kamar-kipas.png`) diarahkan ke jendela dengan panah hijau keluar.
    - Badge hijau: `KIPAS HADAP LUAR = BUANG PANAS` (`x: 50, y: 66`).
    - Kucing jempol di akhir (`x: 74, y: 48`, `props/meme-kucing-jempol.png`).
- [ ] **Step 2:** Jalankan `npm run cek:explainer -- kamar-panas`. Pastikan **0 error dan 0 peringatan**.
- [ ] **Step 3:** `git add src/explainer/data/kamar-panas.ts && git commit -m "feat(kamar-panas): koreografi panggung safe area"`

---

### Task 4: Potong Narasi & Audio Alignment (Whisper)

**Files:**
- Create: `narasi/kamar-panas/naskah-full.txt`
- Modify: `public/audio/kamar-panas/{01..06}.wav`, `kata.json`

- [ ] **Step 1:** Ekspor naskah terbaru ke `narasi/kamar-panas/naskah-full.txt`.
- [ ] **Step 2:** Cek ketersediaan audio rekaman narasi di `public/audio/kamar-panas-raw.wav` atau sinkronisasi audio yang ada.
- [ ] **Step 3:** Jalankan `node scripts/potong-narasi.mjs kamar-panas "public\audio\kamar-panas-raw.wav"`.
- [ ] **Step 4:** Verifikasi alignment `npm run cek:explainer -- kamar-panas` (0 error, 0 warning).
- [ ] **Step 5:** `git add public/audio/kamar-panas/ && git commit -m "feat(kamar-panas): audio alignment"`

---

### Task 5: Inspeksi Lembar Kontak & Render Final

**Files:**
- Create: `out/cek/kamar-panas-lembar.jpg`
- Create: `out/kamar-panas.mp4`
- Create: `out/kamar-panas-720p.mp4`
- Create: `out/youtube/kamar-panas/*`

- [ ] **Step 1:** Render lembar kontak:
  ```bash
  node scripts/cek-frame.mjs kamar-panas
  ```
- [ ] **Step 2:** Buka `out/cek/kamar-panas-lembar.jpg` dengan `read_file` dan periksa tiap scene (frame 35% dan 85%) untuk memastikan layout bebas overlap dan teks terbaca jelas.
- [ ] **Step 3:** Render video final 1080p + versi 720p (-14 LUFS):
  ```bash
  node scripts/render.mjs kamar-panas --final
  ```
- [ ] **Step 4:** Generate paket YouTube:
  ```bash
  node scripts/paket-youtube.mjs kamar-panas
  ```
- [ ] **Step 5:** Periksa `out/youtube/kamar-panas/thumbnail-kecil.jpg` untuk memastikan teks thumbnail terbaca jelas di layar kecil HP.
- [ ] **Step 6:** Commit hasil akhir dan laporkan output lengkap kepada user.
