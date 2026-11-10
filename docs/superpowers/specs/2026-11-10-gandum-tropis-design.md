# Design Doc: Video Explainer "Kenapa Gandum Tidak Tumbuh di Indonesia?"

Dokumen spesifikasi desain pembuatan video motion explainer 9:16 ("nahh gini") baru di `src/explainer/` berdasarkan riset biologi dan iklim tropis.

---

## 1. Intent & Why
- **Latar Belakang:** Indonesia adalah salah satu importir gandum terbesar di dunia (mencapai lebih dari sepuluh juta ton per tahun) akibat tingginya konsumsi mie instan, roti, dan gorengan tepung terigu. Meskipun tanah Indonesia terkenal subur, hampir tidak ada perkebunan gandum komersial di Indonesia.
- **Tujuan (Why):** Menjelaskan alasan ilmiah biologis dan iklim secara populer mengapa tanaman gandum tidak cocok dibudidayakan secara massal di Indonesia, dibawakan dengan gaya khas *"nahh gini"* (bahasa santai, analogi komedi sehari-hari, SFX terpadu, dan cutout motion yang hidup).

---

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- Video vertikal 9:16 (YouTube Shorts / TikTok / Reels) berdurasi aman **50 sampai 55 detik (~115-120 kata narasi)** pada tempo bicara natural.
- Menerapkan pendekatan **Semi-Formal Populer**: mengenalkan istilah biologi resmi (*vernalisasi* diucapkan di narasi dan *fotoperiodisme* ditampilkan sebagai badge visual) yang langsung dibumikan dengan analogi receh.
- Memenuhi 100% checklist [rencana/explainer-next-video.md](../../../rencana/explainer-next-video.md) dan [.claude/skills/video-explainer/SKILL.md](../../../.claude/skills/video-explainer/SKILL.md):
  - Latar belakang foto modern nyata unik per scene (100% opasitas, tanpa blur/krem polos kecuali beat scene).
  - Tiga pilar komedi aktif: celetukan narasi relatable, 5 SFX komedi (`boing`, `boom`, `womp`, `slap`, `ding`), dan cutout meme reaksi hewan (`meme-kucing-paw`, `meme-kucing-merenung`, `meme-kucing-jelasin`).
  - High-density motion: minimal 3-5 `aksi` per scene terikat ke kata narasi (`di: '<kata>'`).
  - Pergantian fase tanpa celah & anti-ghosting (`keluar: 'pop-out'`).
  - Nol layar kosong di detik pertama (detik 0.0s langsung ada visual pembuka).
  - Seluruh angka di narasi ditulis sebagai kata huruf (`sepuluh juta`, `lima belas derajat`, `enam belas jam`, `dua belas jam`).

### Non-Goals
- Tidak membahas sejarah kolonialisme perdagangan gandum atau mafia impor pangan secara mendalam.
- Tidak membuat visual 3D kompleks (fokus pada cutout PNG 2D realistis + living motion + foto Wikimedia berbingkai).
- Tidak menyentuh kode engine video sejarah (`src/HistoryVideo.tsx`, `src/data/`, dsb.).

### Anti-Goals
- Dilarang membuat narasi kaku seperti membaca ensiklopedia atau buku diktat kampus.
- Dilarang membiarkan ada jeda visual lebih dari 2 detik tanpa gerakan di layar.
- Dilarang menduplikasi gambar latar belakang yang sama di beberapa scene berbeda.

---

## 3. Constraints
- Resolusi video 1080x1920 (9:16 Shorts).
- Area aman elemen interaktif/prop: horizontal `x: 8..92%`, vertikal `y: 12..76%`.
- Jarak vertikal aman antar-elemen bertumpuk minimal 16-18% tinggi layar.
- Lolos validasi `npm run cek:explainer -- gandum-tropis` dengan 0 error dan 0 warning.

---

## 4. Approaches & Selected Direction

Tiga pendekatan struktur yang telah dipertimbangkan:

1. **Pendekatan 1: Enam Scene Tematik Terpisah (DIPILIH)**
   - Scene 1: Hook (Mie instan vs ladang gandum)
   - Scene 2: Salah Kaprah (Mitos tanah subur tongkat jadi tanaman)
   - Scene 3: Beat Transisi (*"Oke, sini gue jelasin."* + meme kucing kacamata)
   - Scene 4: Sains 1 (Vernalisasi & alarm suhu dingin)
   - Scene 5: Sains 2 (Fotoperiodisme panjang hari & kelembapan jamur tropis)
   - Scene 6: Penutup (Padi juara tropis vs kesimpulan gandum si turis subtropis)
   - *Alasan dipilih:* Memberikan panggung visual yang leluasa untuk masing-masing konsep sains tanpa tumpang tindih elemen, menjaga ritme video tetap dinamis, serta durasi pas di angka 50-55 detik.

2. **Pendekatan 2: Lima Scene Ringkas Kombo**
   - Menggabungkan Vernalisasi dan Fotoperiodisme ke dalam satu scene panjang.
   - *Alasan tidak dipilih:* Scene sains menjadi terlalu padat dan sesak, membatasi ruang gerak komedi visual.

3. **Pendekatan 3: Format Head-to-Head (Padi vs Gandum)**
   - Format split screen terus-menerus membandingkan nasib padi dan gandum.
   - *Alasan tidak dipilih:* Layar vertikal 9:16 menjadi sangat sempit jika dua kubu harus selalu hadir berdampingan.

---

## 5. Rincian Naskah Final & Storyboard 6 Scene (Total: 119 Kata)

### Scene 1: Hook (`type: 'hook'`) - 20 Kata
- **Latar:** `latar/gandum-tropis-1.png` (Meja makan / dapur modern dengan mangkok mie instan dan roti).
- **Teks Hook:** Baris 1: `KONSUMSI MIE JUARA`, Baris 2: `KOK GAK TANAM SENDIRI?`.
- **Narasi:** *"Indonesia juara makan mie instan dan gorengan tepung. Tapi pernah gak mikir, kenapa gak ada sawah gandum di kampung kita?"*
- **Visual & SFX:**
  - `0.0s`: Prop mangkok mie instan mengepul (`props/gandum-mie.png`, `x: 32, y: 52`).
  - Di kata *makan mie*: Karung tepung terigu jatuh dari atas (`props/gandum-karung-terigu.png`, `x: 70, y: 38`, `masuk: 'drop'`, `sfx: 'boom'`).
  - Di kata *pernah gak*: Simbol `tanya` (`simbol: 'tanya'`, `x: 82, y: 46`, `masuk: 'pop'`, `sfx: 'boing'`).
  - Di kata *sawah gandum*: Meme kucing garuk dagu heran (`props/meme-monyet-mikir.png` atau `props/meme-kucing-paw.png`, `x: 28, y: 56`, `masuk: 'slide-up'`).

### Scene 2: Stage Salah Kaprah (`type: 'stage'`) - 23 Kata
- **Latar:** `latar/gandum-tropis-2.png` (Lahan tanah subur pedesaan tropis hijau).
- **Narasi:** *"Banyak yang ngira, tanah kita subur banget, lempar tongkat aja tumbuh. Giliran gandum ditanam, daunnya sih lebat, tapi bulirnya menolak keluar!"*
- **Visual & SFX:**
  - `0.0s`: Meme kucing merenung santai (`props/meme-kucing-merenung.png`, `x: 28, y: 56`, `delay: 0`).
  - Di kata *lempar tongkat*: Batang tanaman subur nongol (`masuk: 'grow-up'`).
  - Di kata *daunnya sih*: Tanaman gandum daun lebat tanpa bulir muncul (`props/gandum-tanaman-daun.png`, `x: 68, y: 48`).
  - Di kata *menolak keluar*: Simbol `larang` merah menempel di tanaman (`simbol: 'larang'`, `x: 68, y: 48`, `masuk: 'pop'`, `sfx: 'slap'`) + teks mikro *"Zonk!"* (`ukuran: 30`, `rotate: -8`).

### Scene 3: Beat Transisi (`type: 'beat'`) - 6 Kata
- **Latar:** Kanvas polos standar beat scene.
- **Durasi Target:** 55 frame (sekitar 1,8 detik).
- **Teks Tampilan:** `'Oke, sini gue jelasin.'`
- **Narasi:** *"Oke, sini gue jelasin rahasia biologinya."*
- **Visual & SFX:**
  - Kucing profesor/berkacamata menunjuk papan (`props/meme-kucing-jelasin.png`, `x: 50, y: 52`, `masuk: 'pop'`, `sfx: 'boing'`), aksi wiggle saat kata *jelasin*.

### Scene 4: Stage Sains 1 - Vernalisasi (`type: 'stage'`) - 25 Kata
- **Latar:** `latar/gandum-tropis-4.png` (Laboratorium botani / perbukitan sejuk subtropis).
- **Narasi:** *"Gandum punya alarm biologis bernama vernalisasi. Tanaman ini wajib ngerasain hawa dingin di bawah lima belas derajat berminggu-minggu, baru selnya mau memproduksi biji."*
- **Visual & SFX:**
  - `0.0s`: Teks badge penegas `'VERNALISASI'` (`x: 50, y: 22`, warna krem, kotak navy).
  - Di kata *alarm biologis*: Jam alarm beku bersalju (`props/gandum-alarm-beku.png`, `x: 32, y: 52`, `masuk: 'pop'`, `aksi: [{type: 'shake', di: 'alarm biologis', sfx: 'ding'}]`).
  - Di kata *hawa dingin*: Termometer merkuri turun ke bawah nol (`props/gandum-termometer-dingin.png`, `x: 70, y: 46`, `masuk: 'slide-right'`).
  - Di kata *memproduksi biji*: Bulir gandum emas berkilau membal keluar (`props/gandum-bulir-emas.png`, `x: 50, y: 56`, `masuk: 'pop'`, `sfx: 'ding'`).

### Scene 5: Stage Sains 2 - Fotoperiodisme & Jamur (`type: 'stage'`) - 23 Kata
- **Latar:** `latar/gandum-tropis-5.png` (Pematang sawah terik tropis lembap berkabut).
- **Narasi:** *"Kedua, gandum butuh siang enam belas jam. Di khatulistiwa, matahari cuma dua belas jam, ditambah udara lembap yang bikin gampang busuk jamuran!"*
- **Visual & SFX:**
  - `0.0s`: Teks badge penegas `'FOTOPERIODISME'` (`x: 50, y: 22`, warna krem, kotak navy).
  - Di kata *siang enam belas*: Ikon jam matahari dengan silang merah (`simbol: 'larang'`, `x: 34, y: 44`, `masuk: 'pop'`, `sfx: 'slap'`).
  - Di kata *udara lembap*: Simbol tetes air uap lembap (`simbol: 'tetes-air'`, `x: 72, y: 38`, `masuk: 'drop'`).
  - Di kata *busuk jamuran*: Jamur pembusuk bulir nemplok ke tanaman gandum (`props/gandum-jamur.png`, `x: 65, y: 55`, `masuk: 'pop'`, `sfx: 'womp'`, aksi squash).

### Scene 6: Stage Penutup (`type: 'stage'`) - 22 Kata
- **Latar:** `latar/gandum-tropis-6.png` (Lumbung padi / sawah terasering Indonesia yang indah cerah).
- **Narasi:** *"Makanya, daripada maksa gandum yang gampang masuk angin, petani kita jelas milih padi sang raja tropis. Kamu tim mie atau tim nasi?"*
- **Visual & SFX:**
  - `0.0s`: Gandum lemas kedinginan pakai syal dan koyo (`props/gandum-kedinginan.png`, `x: 28, y: 54`, `delay: 0`, aksi wiggle).
  - Di kata *raja tropis*: Karakter padi pakai mahkota emas gagah (`props/padi-mahkota.png`, `x: 72, y: 50`, `masuk: 'slide-left'`, `sfx: 'ding'`).
  - Di kata *tim mie*: Badge pilihan interaktif `MIE vs NASI` (`x: 50, y: 32`, `masuk: 'pop'`, `sfx: 'boing'`).

---

## 6. Daftar Aset yang Dibutuhkan

### A. Latar Belakang Foto Modern Real 100% (`src/explainer/data/gandum-tropis.latar.json`):
1. `gandum-tropis-1.png`: Dapur / meja makan modern terang dengan mangkok mie instan dan roti di atas meja kayu.
2. `gandum-tropis-2.png`: Lahan pertanian desa Indonesia yang sangat subur, tanah gembur hitam dan tanaman hijau.
3. `gandum-tropis-4.png`: Rumah kaca pertanian modern di pegunungan sejuk atau laboratorium botani modern.
4. `gandum-tropis-5.png`: Hamparan sawah dataran rendah tropis terik dengan awan lembap di langit.
5. `gandum-tropis-6.png`: Pemandangan sawah terasering bertingkat khas Indonesia yang asri bermandikan cahaya matahari pagi.

### B. Props Cutout PNG Transparan (`src/explainer/data/gandum-tropis.props.json`):
- `props/gandum-mie.png`: Semangkuk mie instan lezat mengepul.
- `props/gandum-karung-terigu.png`: Karung tepung terigu putih bertuliskan tepung gandum.
- `props/gandum-tanaman-daun.png`: Tanaman gandum hijau rimbun tapi gundul tanpa bulir.
- `props/gandum-alarm-beku.png`: Jam alarm dengan lapisan es beku.
- `props/gandum-termometer-dingin.png`: Termometer kaca suhu dingin di bawah 15 derajat.
- `props/gandum-bulir-emas.png`: Batang bulir gandum matang berwarna kuning keemasan tebal.
- `props/gandum-jamur.png`: Jamur tanaman pembusuk bulir (fusarium/jamur karat).
- `props/gandum-kedinginan.png`: Batang gandum kartun lucu memakai syal dan koyo tampak lemas.
- `props/padi-mahkota.png`: Seikat padi kuning gagah memakai mahkota emas raja.
- Meme yang sudah tersedia: `props/meme-kucing-jelasin.png`, `props/meme-kucing-merenung.png`, `props/meme-kucing-paw.png`.

---

## 7. Keputusan Desain yang Ditetapkan (Calls Made)
1. **Durasi & Kata:** Naskah dirampingkan menjadi tepat 119 kata (durasi ~50-55 detik, aman batas Shorts < 60 detik).
2. **Penyebutan Istilah:** *Vernalisasi* diucapkan narator dan ditampilkan badge visual di Scene 4; *Fotoperiodisme* ditampilkan sebagai badge teks visual penegas di Scene 5 agar narasi suara tetap luwes.
3. **Standar Komedi:** 5 SFX komedi (`boom`, `boing`, `slap`, `ding`, `womp`) terpasang selaras dengan kata punchline narasi.

---

## 8. Apa yang Diserahkan ke Builder
- Pembuatan file kerangka via `npm run baru:explainer -- gandum-tropis`.
- Pengisian `src/explainer/data/gandum-tropis.sumber.md` dengan fakta terverifikasi (FAO, Balitsereal Kementan, riset vernalisasi).
- Pengisian `gandum-tropis.latar.json` dan `gandum-tropis.props.json`.
- Peracikan koordinat, durasi, kata pemicu `di`, dan aksi gerak di `src/explainer/data/gandum-tropis.ts`.
- Validasi bebas error lewat `npm run cek:explainer -- gandum-tropis`.
