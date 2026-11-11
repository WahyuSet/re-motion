# Rencana implementasi: "Warren Buffett: Prinsip Keuangan & Sang Peramal dari Omaha" (4–5 menit)

Untuk dikerjakan AI agent di project ini. Riset, sumber, naskah narasi final, dan kata kunci foto **sudah disiapkan** di dokumen ini. Tugas agent: merakit mengikuti skill, memilih foto, mengecek, lalu berhenti di titik 🛑.

## Prompt untuk agent (tempel ini)

```text
Kamu bekerja di project Remotion di D:\Learning\remotion.
Baca dulu `.claude/skills/video-sejarah/SKILL.md` sampai habis, lalu baca `rencana/warren-buffett.md`.
Kerjakan rencana itu bagian demi bagian (Tahap 1 sampai Tahap 7), BERURUTAN, memakai perintah persis yang tertulis.
Narasi dan fakta sudah final: salin apa adanya, jangan menambah fakta baru dan jangan mengubah kata-kata narasi.
Video ini berisi 26 scene dalam 6 bab: kerjakan scene per bab, jalankan cek-naskah setiap selesai satu bab.
Berhenti dan lapor ke saya di setiap titik 🛑. Jangan render MP4 sebelum storyboard disetujui. Jangan git commit/push.
Setiap kali berhenti, laporkan: tahap yang selesai, hasil terakhir `node scripts/cek-naskah.mjs warren-buffett`, file yang diubah, hal yang ragu.
```

## Ringkasan keputusan (sudah disetujui user)

| | |
|---|---|
| Topik | Perjalanan finansial dan prinsip pengelolaan keuangan **Warren Buffett** |
| Format | Video panjang 16:9 (`format` tidak diisi = landscape) |
| Durasi | **±4–4,5 menit**, **26 scene** dalam 6 bab (±565 kata narasi) |
| Slug / Id | `warren-buffett` / `WarrenBuffett` |
| Alur | Rumah Omaha 1958 & masa kecil 1930 → saham pertama Cities Service usia 11 tahun (1942) → kuliah di Columbia bersama Benjamin Graham (1950) & pelajaran GEICO (1951) → mengambil alih Berkshire Hathaway (1965) & kemitraan Charlie Munger → prinsip keuangan (aturan nomor 1, efek bola salju, usia 50 tahun, lingkaran kompetensi) → filantropi 99% kekayaan & The Giving Pledge |
| Watermark | Otomatis "jejakala" (jangan diubah) |
| Props AI | Opsional (Tahap 4). Video tetap lengkap tanpa props |

## Aturan khusus topik ini

1. **Angka kekayaan bersih berubah setiap hari mengikuti harga saham.** Jangan menyebut angka dolar kekayaan bersih saat ini sebagai angka pasti tanpa konteks waktu; gunakan fakta historis yang tetap (tahun lahir 1930, saham pertama usia 11 tahun pada 1942, rumah dibeli 1958, akuisisi Berkshire Hathaway 1965, mayoritas kekayaan setelah usia 50 tahun, dan janji donasi 99%).
2. **Jangan membuat gambar wajah tokoh nyata dengan AI (Aturan Langkah 5 SKILL.md).** Foto Warren Buffett, Charlie Munger, Benjamin Graham (atau gedung Columbia), dan Bill Gates wajib dari foto bebas lisensi Wikimedia Commons lewat `cari-foto.mjs`.
3. **Semua angka di `narasi` ditulis dengan huruf** tanpa digit, tanpa tanda kurung, dan tanpa singkatan agar lolos `cek-naskah.mjs` dan dibaca mulus oleh TTS.
4. **Variasi jenis scene & ritme:** Naskah memakai kombinasi `title`, `photo`, `fact`, `kutipan`, `timeline`, dan `outro` sehingga tidak pernah ada lebih dari 3 scene `photo` berturut-turut, serta membatasi maksimal 3 shot `layout: 'print'` beruntun.

---

## Tahap 1. Siapkan video (Langkah 0 skill)

```bash
node scripts/buat-video.mjs warren-buffett
```
Topik, format, dan durasi sudah ditentukan → tidak perlu bertanya lagi.

**Selesai jika:** muncul "Terdaftar sebagai Composition \"WarrenBuffett\"".

## Tahap 2. Isi sumber fakta (Langkah 1 skill)

Ganti seluruh isi `src/data/warren-buffett.sumber.md` dengan teks ini (salin persis):

```markdown
# Sumber fakta: Warren Buffett — Perjalanan Finansial & Prinsip Keuangan

## Masa kecil, rumah Omaha, dan saham pertama
- Warren Edward Buffett lahir pada 30 Agustus 1930 di Omaha, Nebraska, Amerika Serikat, saat masa Depresi Besar (Great Depression)
  - https://en.wikipedia.org/wiki/Warren_Buffett
  - https://www.britannica.com/money/Warren_Buffett
- Sejak kecil (usia 6 tahun) sudah berdagang permen karet, botol Coca-Cola, dan mengantar koran (Washington Post) saat remaja serta memasang mesin pinball di pangkas rambut lalu membeli lahan pertanian di Nebraska
  - https://en.wikipedia.org/wiki/Warren_Buffett
  - https://www.britannica.com/money/Warren_Buffett
- Membeli saham pertama di usia 11 tahun pada 1942: 3 lembar saham preferen Cities Service (~$38 per lembar), sempat turun lalu dijual saat naik tipis ke $40, sebelum harganya melesat hampir $200 per lembar
  - https://en.wikipedia.org/wiki/Warren_Buffett
  - https://www.cnbc.com/2018/10/16/warren-buffett-bought-his-first-stock-at-age-11-heres-what-he-learned.html
- Tinggal di rumah yang sama di Omaha, Nebraska, yang dibeli pada tahun 1958 seharga $31.500
  - https://en.wikipedia.org/wiki/Warren_Buffett
  - https://www.cnbc.com/2018/08/16/warren-buffett-lives-in-a-modest-house-thats-worth-point-001-percent-of-his-total-wealth.html

## Pendidikan, Benjamin Graham, dan GEICO
- Ditolak Harvard Business School, lalu masuk Columbia Business School pada 1950 dan lulus M.S. bidang Ekonomi tahun 1951, belajar langsung di bawah Benjamin Graham (penulis *The Intelligent Investor*, 1949)
  - https://en.wikipedia.org/wiki/Warren_Buffett
  - https://www.britannica.com/money/Warren_Buffett
- Kutipan dan prinsip "Price is what you pay; value is what you get" (Harga adalah apa yang Anda bayar; nilai adalah apa yang Anda dapatkan) dari Benjamin Graham yang dikutip dalam Surat Pemegang Saham Berkshire Hathaway 2008
  - https://www.berkshirehathaway.com/letters/2008ltr.pdf
  - https://en.wikipedia.org/wiki/Value_investing
- Mengunjungi kantor pusat GEICO di Washington, D.C. pada hari Sabtu tahun 1951, bertemu Lorimer Davidson, dan mempelajari konsep *insurance float* (uang premi yang diterima sebelum klaim dibayar)
  - https://en.wikipedia.org/wiki/Warren_Buffett
  - https://www.berkshirehathaway.com/letters/1995.html

## Berkshire Hathaway, Charlie Munger, dan jejak akuisisi
- Mendirikan Buffett Partnership Ltd. di Omaha pada tahun 1956, lalu mengambil alih kendali perusahaan tekstil Berkshire Hathaway pada tahun 1965 sebelum mengubahnya menjadi perusahaan induk (holding company)
  - https://en.wikipedia.org/wiki/Berkshire_Hathaway
  - https://www.britannica.com/topic/Berkshire-Hathaway
- Bermitra dengan Charlie Munger yang mendorong filosofi membeli perusahaan hebat dengan harga wajar ketimbang perusahaan biasa dengan harga murah
  - https://en.wikipedia.org/wiki/Charlie_Munger
  - https://www.berkshirehathaway.com/letters/2023ltr.pdf
- Tonggak akuisisi dan investasi utama Berkshire Hathaway: National Indemnity (1967), See's Candies (1972), saham The Coca-Cola Company (1988), dan saham Apple Inc. (2016)
  - https://en.wikipedia.org/wiki/Berkshire_Hathaway
  - https://www.berkshirehathaway.com/letters/2022ltr.pdf

## Prinsip keuangan, efek bola salju, dan filantropi
- Aturan Nomor 1: "Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1." serta konsep lingkaran kompetensi (*circle of competence*) dan bunga majemuk (*snowball effect* / *The Snowball*)
  - https://en.wikipedia.org/wiki/Warren_Buffett
  - https://www.berkshirehathaway.com/letters/1996.html
- Lebih dari 99% kekayaan bersih Warren Buffett terakumulasi setelah ulang tahunnya yang ke-50 berkat efek bunga majemuk jangka panjang
  - https://www.cnbc.com/2020/09/08/billionaire-warren-buffett-most-overlooked-fact-about-how-he-got-so-rich.html
  - https://en.wikipedia.org/wiki/Warren_Buffett
- Pada tahun 2006 berkomitmen menyumbangkan lebih dari 99% kekayaannya, dan pada tahun 2010 mendirikan *The Giving Pledge* bersama Bill dan Melinda Gates
  - https://givingpledge.org/pledger?pledgerId=177
  - https://en.wikipedia.org/wiki/The_Giving_Pledge
```

**Selesai jika:** file `src/data/warren-buffett.sumber.md` tersimpan.

## Tahap 3. Cari foto (Langkah 3 skill)

Jalankan satu per satu, tunggu selesai:

```bash
node scripts/cari-foto.mjs "Warren Buffett" --slug warren-buffett --limit 10 --min-width 800
node scripts/cari-foto.mjs "Warren Buffett house Omaha" --slug warren-buffett --limit 4 --min-width 800
node scripts/cari-foto.mjs "Omaha Nebraska street" --slug warren-buffett --limit 4 --min-width 1000
node scripts/cari-foto.mjs "Great Depression 1930" --slug warren-buffett --limit 4 --pd-only --min-width 800
node scripts/cari-foto.mjs "newspaper boy 1940s" --slug warren-buffett --limit 3 --pd-only --min-width 600
node scripts/cari-foto.mjs "New York Stock Exchange trading floor" --slug warren-buffett --limit 5 --min-width 800
node scripts/cari-foto.mjs "Cities Service stock certificate" --slug warren-buffett --limit 3 --min-width 600
node scripts/cari-foto.mjs "Columbia University Low Library" --slug warren-buffett --limit 4 --min-width 1000
node scripts/cari-foto.mjs "Charlie Munger" --slug warren-buffett --limit 4 --min-width 600
node scripts/cari-foto.mjs "Hathaway Mills New Bedford" --slug warren-buffett --limit 4 --min-width 800
node scripts/cari-foto.mjs "textile mill looms historic" --slug warren-buffett --limit 3 --min-width 800
node scripts/cari-foto.mjs "See's Candies" --slug warren-buffett --limit 3 --min-width 800
node scripts/cari-foto.mjs "Coca-Cola glass bottle" --slug warren-buffett --limit 4 --min-width 800
node scripts/cari-foto.mjs "snowball snow hill" --slug warren-buffett --limit 3 --min-width 800
node scripts/cari-foto.mjs "Warren Buffett Bill Gates" --slug warren-buffett --limit 4 --min-width 800
node scripts/cari-foto.mjs "Berkshire Hathaway annual meeting" --slug warren-buffett --limit 4 --min-width 800
```

Lalu **lihat `public/photos/warren-buffett/_contact-sheet.jpg` dengan Read.** Hapus file JPG yang tidak relevan, berwatermark, atau buram.

**Selesai jika** tersedia cukup foto untuk 26 scene (potret Warren Buffett di berbagai acara, rumah/kota Omaha, suasana Depresi Besar 1930-an, lantai bursa saham/sertifikat saham, kampus Universitas Columbia, pabrik tekstil/mesin tenun tua, Charlie Munger, produk investasi seperti Coca-Cola/See's Candies, dan foto bersama Bill Gates). Jika ada kata kunci yang menghasilkan 0 foto, coba kata kunci bahasa Inggris sejenis maksimal 3 kali lalu gunakan foto proksi dengan `tag` yang jujur.

## Tahap 4. Props (opsional, Langkah 5 skill)

```bash
node scripts/generate-props.mjs --cek
```
- `TIDAK SIAP` → catat untuk laporan, lewati Tahap 4.
- `SIAP` → isi `src/data/warren-buffett.props.json`:
  ```json
  [
    {"name": "sertifikat-saham", "prompt": "a vintage 1940s ornate paper stock certificate, blank without readable text"},
    {"name": "buku-investasi", "prompt": "a classic vintage hardcover finance book with gold leaf edges"},
    {"name": "bola-salju", "prompt": "a clean round white snowball rolling with snow particles"}
  ]
  ```
  Jalankan `node scripts/generate-props.mjs --file src/data/warren-buffett.props.json`, periksa hasilnya dengan Read, lalu pasang (`x: 80, y: 62, width: 300, animation: 'pop'`):
  - `sertifikat-saham` di scene 5 `di: 'saham'`
  - `buku-investasi` di scene 10 `di: 'perusahaan'`
  - `bola-salju` di scene 20 `di: 'bola'`

## Tahap 5. Tulis naskah (Langkah 2 + 4 skill)

Isi `src/data/warren-buffett.ts` dengan blok `youtube`, `thumbnail`, dan 26 `scenes` di bawah. **Narasi, bab, tag, judul, judulDi, value, label, titik, teks, sumber, stempel, transisi: salin persis.** Yang kamu isi sendiri adalah nama file di `shots` (dan `thumbnail`) sesuai isi `public/photos/warren-buffett/`, dengan shot ke-1 tanpa `di` dan shot ke-2 dst. memakai `di` yang tertulis.

Blok metadata di atas `scenes`:
```ts
  youtube: {
    judul: 'Warren Buffett: Prinsip Keuangan Sang Miliarder Omaha',
    deskripsi:
      'Bagaimana Warren Buffett membangun kekayaan dari mengantar koran dan membeli saham di usia sebelas tahun hingga memimpin Berkshire Hathaway, sembari tetap tinggal di rumah tahun 1958 dan menyumbangkan 99 persen hartanya.',
    tags: [
      'warren buffett',
      'keuangan warren buffett',
      'berkshire hathaway',
      'sejarah investasi',
      'value investing',
      'benjamin graham',
      'charlie munger',
    ],
  },
  thumbnail: {
    judul: 'Kaya dari *kesabaran & waktu*',
    sub: 'Kisah & Prinsip Warren Buffett',
    ...foto('NN-potret-warren-buffett.jpg'),
  },
```

### Bab 1. Sang Peramal dari Omaha (scene 1–4)

**1 · title** · `bab: 'Sang Peramal dari Omaha'`
- kicker `Tokoh & Keuangan` · title `Warren Buffett` · subtitle `Prinsip keuangan sang peramal dari Omaha`
- narasi: `Bagaimana seseorang bisa menjadi salah satu manusia terkaya di dunia, namun tetap tinggal di rumah yang sama selama puluhan tahun? Inilah kisah *Warren Buffett*.`
- Foto: potret Warren Buffett (`move: 'push-in'`); rumah Buffett di Omaha `di: 'rumah'`; suasana kota Omaha `di: 'Inilah'`

**2 · photo** · transisi `dorong`
- tag `Omaha · Nebraska` · judul `Rumah sejak *lima puluh delapan*` · judulDi `delapan`
- narasi: `Di kota Omaha, Nebraska, Warren Buffett masih menempati rumah sederhana yang ia beli pada tahun seribu sembilan ratus lima puluh delapan.`
- Foto: kota Omaha (`move: 'pan-right'`); rumah Warren Buffett di Omaha `layout: 'print'`, tag `Rumah Omaha · dibeli 1958`, `di: 'rumah'`

**3 · fact** · transisi `kartu`
- value `1930` · format `year` · label `Lahir saat Depresi Besar`
- narasi: `Ia lahir pada tiga puluh Agustus *seribu sembilan ratus tiga puluh*, tepat ketika Amerika Serikat sedang dihantam krisis ekonomi Depresi Besar.`
- Foto: arsip suasana Depresi Besar 1930 `layout: 'print'`, tag `Era Depresi Besar · 1930-an`; foto antrean/kota Amerika 1930-an `layout: 'print'`, `di: 'krisis'`

**4 · photo** · transisi `dorong`
- tag `Omaha · masa kecil` · judul `Berdagang sejak *usia enam tahun*` · judulDi `enam`
- narasi: `Sejak usia enam tahun, ia sudah mencari uang sendiri dengan menjual permen karet, botol minuman, hingga mengantar koran keliling kota.`
- Foto: botol Coca-Cola klasik (`move: 'push-in'`); foto arsip pengantar koran 1940-an `layout: 'print'`, tag `Pengantar koran · era 1940-an`, `di: 'koran'`

### Bab 2. Saham pertama dan kesabaran (scene 5–8)

**5 · fact** · transisi `kartu` · `bab: 'Saham pertama dan kesabaran'`
- value `11` · label `Usia beli saham pertama`
- narasi: `Pada tahun seribu sembilan ratus empat puluh dua, di usia *sebelas* tahun, Buffett membeli tiga lembar saham pertamanya di perusahaan Cities Service.`
- Foto: lantai bursa New York Stock Exchange (`move: 'pan-left'`, tag `Bursa Saham New York`); sertifikat saham lama / Cities Service `layout: 'print'`, tag `Sertifikat saham · era 1940-an`, `di: 'saham'`

**6 · photo** · transisi `dorong`
- tag `Cities Service · 1942` · judul `Menjual *terlalu cepat*` · judulDi `menjualnya`
- narasi: `Harga saham itu sempat anjlok sebelum naik tipis. Ia buru-buru menjualnya demi untung kecil, padahal setelah itu harganya melesat berkali-kali lipat.`
- Foto: papan harga / lantai bursa saham (`move: 'push-in'`); sertifikat atau aktivitas pialang saham `layout: 'print'`, `di: 'menjualnya'`

**7 · photo** · transisi `kartu`
- tag `Pelajaran pertama` · judul `Kunci utamanya *kesabaran*` · judulDi `kesabaran`
- narasi: `Pengalaman masa kecil itu mengajarkan prinsip penting bahwa pasar modal memindahkan uang dari orang yang tidak sabar kepada orang yang memiliki *kesabaran*.`
- Foto: gedung bursa Wall Street (`move: 'pan-right'`); potret Warren Buffett `di: 'memindahkan'`

**8 · photo** · transisi `dorong`
- tag `Washington D.C. · 1945` · judul `Bisnis koran dan *pinball*` · judulDi `koran`
- narasi: `Saat remaja, ia mengumpulkan tabungan dari hasil mengantar koran dan menaruh mesin permainan di pangkas rambut, lalu membeli lahan pertanian di Nebraska.`
- Foto: pengantar koran / remaja era 1940-an `layout: 'print'`; lanskap pertanian/kota di Nebraska (`move: 'pull-out'`), `di: 'lahan'`

### Bab 3. Guru besar investasi nilai (scene 9–13)

**9 · fact** · transisi `zoom` · `bab: 'Guru besar investasi nilai'`
- value `1950` · format `year` · label `Kuliah di Universitas Columbia`
- narasi: `Setelah ditolak Universitas Harvard, Buffett mendaftar ke Universitas Columbia pada tahun *seribu sembilan ratus lima puluh* untuk belajar langsung dari Benjamin Graham.`
- Foto: kampus Columbia University Low Library (`move: 'push-in'`, tag `Columbia University · New York`); gedung kampus / potret arsip `layout: 'print'`, `di: 'belajar'`

**10 · photo** · transisi `dorong`
- tag `The Intelligent Investor · 1949` · judul `Membeli di bawah *nilai asli*` · judulDi `nilai`
- narasi: `Graham adalah bapak investasi nilai. Ia mengajarkan cara mencari perusahaan bagus yang harga sahamnya sedang dijual jauh di bawah nilai aslinya.`
- Foto: kampus Columbia University (`move: 'pan-left'`); lantai perdagangan bursa saham `layout: 'print'`, tag `Analisis nilai intrinsik`, `di: 'perusahaan'`

**11 · kutipan** · transisi `kartu`
- teks: `Harga adalah apa yang Anda bayar, sedangkan *nilai* adalah apa yang Anda dapatkan.`
- sumber: `Surat Pemegang Saham Berkshire Hathaway, 2008`
- narasi: `Dalam surat tahunannya pada dua ribu delapan, Buffett merangkum pelajaran gurunya: harga adalah apa yang Anda bayar, sedangkan nilai adalah apa yang Anda dapatkan.`
- Foto: potret Warren Buffett berbicara (`move: 'push-in'`); potret Warren Buffett lain `di: 'harga'`

**12 · photo** · transisi `dorong`
- tag `Washington D.C. · 1951` · judul `Mengetuk pintu *kantor asuransi*` · judulDi `asuransi`
- narasi: `Tahun seribu sembilan ratus lima puluh satu, ia naik kereta di akhir pekan demi mengetuk pintu kantor asuransi GEICO dan mempelajari cara kerjanya.`
- Foto: suasana Washington D.C. / stasiun kereta (`move: 'pan-right'`); gedung perkantoran keuangan `layout: 'print'`, tag `Studi langsung bisnis asuransi · 1951`, `di: 'kantor'`

**13 · photo** · transisi `kartu`
- tag `Model bisnis asuransi` · judul `Modal dari *premi asuransi*` · judulDi `premi`
- narasi: `Dari sana ia memahami bahwa perusahaan asuransi menerima uang premi di muka sebelum klaim dibayar, sehingga dana itu bisa diputarkan untuk berinvestasi.`
- Foto: lantai bursa / gedung finansial (`move: 'push-in'`); potret Warren Buffett `di: 'dana'`

### Bab 4. Lahirnya kerajaan Berkshire Hathaway (scene 14–18)

**14 · fact** · transisi `dorong` · `bab: 'Lahirnya kerajaan Berkshire Hathaway'`
- value `1956` · format `year` · label `Kemitraan investasi di Omaha`
- narasi: `Pada tahun *seribu sembilan ratus lima puluh enam*, Buffett kembali ke Omaha dan mendirikan kemitraan investasi dari kamar tidur rumahnya.`
- Foto: suasana jalanan Omaha (`move: 'pan-left'`, tag `Omaha · Nebraska`); rumah Warren Buffett `layout: 'print'`, `di: 'kemitraan'`

**15 · fact** · transisi `none`
- value `1965` · format `year` · label `Mengambil alih Berkshire Hathaway`
- stempel: `{teks: 'Titik Balik', di: 'mengambil'}`
- narasi: `Lalu pada tahun *seribu sembilan ratus enam puluh lima*, ia mengambil alih kendali perusahaan tekstil tua yang sedang merugi bernama Berkshire Hathaway.`
- Foto: gedung pabrik Hathaway Mills di New Bedford `layout: 'print'`, tag `Hathaway Mills · New Bedford`; mesin tenun tekstil tua `layout: 'print'`, tag `Pabrik tekstil abad ke-20`, `di: 'perusahaan'`

**16 · photo** · transisi `kartu`
- tag `New Bedford · Massachusetts` · judul `Dari tekstil ke *perusahaan induk*` · judulDi `induk`
- narasi: `Bisnis tekstilnya terus tertekan impor murah. Buffett pun mengalihkan arus kasnya untuk membeli perusahaan asuransi, perbankan, dan ritel di bawah satu perusahaan induk.`
- Foto: kompleks pabrik tekstil tua (`move: 'pull-out'`); gedung pusat bisnis Omaha `di: 'membeli'`

**17 · photo** · transisi `dorong`
- tag `Charlie Munger · mitra bisnis` · judul `Bisnis hebat, *harga wajar*` · judulDi `hebat`
- narasi: `Bersama sahabat dan mitra bisnisnya, Charlie Munger, ia mengubah strategi menjadi membeli perusahaan hebat dengan harga wajar dan memegangnya dalam jangka panjang.`
- Foto: potret Charlie Munger `layout: 'print'`, tag `Charlie Munger · Wakil Ketua Berkshire`; Warren Buffett dan Charlie Munger `di: 'mengubah'`

**18 · timeline** · transisi `kartu`
- tag `Jejak akuisisi utama`
- narasi: `Berkshire membeli asuransi National Indemnity tahun seribu sembilan ratus enam puluh tujuh, toko cokelat tahun tujuh puluh dua, saham minuman bersoda tahun delapan puluh delapan, hingga raksasa teknologi tahun dua ribu enam belas.`
- titik:
  - `{tahun: 1967, label: 'National Indemnity', di: 'asuransi'}`
  - `{tahun: 1972, label: "See's Candies", di: 'cokelat'}`
  - `{tahun: 1988, label: 'Saham Coca-Cola', di: 'minuman'}`
  - `{tahun: 2016, label: 'Saham Apple', di: 'teknologi'}`
- Foto: toko See's Candies (`move: 'push-in'`); botol Coca-Cola `di: 'minuman'`

### Bab 5. Prinsip keuangan dan efek bola salju (scene 19–22)

**19 · photo** · transisi `dorong` · `bab: 'Prinsip keuangan dan efek bola salju'`
- tag `Aturan nomor satu` · judul `Jangan pernah *kehilangan uang*` · judulDi `kehilangan`
- narasi: `Prinsip pertamanya terkenal tegas: aturan nomor satu adalah jangan pernah kehilangan uang, dan aturan nomor dua adalah jangan lupakan aturan nomor satu.`
- Foto: potret Warren Buffett (`move: 'push-in'`); dokumen sertifikat saham `layout: 'print'`, `di: 'aturan nomor dua'`

**20 · photo** · transisi `kartu`
- tag `Bunga majemuk · efek bola salju` · judul `Gulungan *bola salju* waktu` · judulDi `salju`
- narasi: `Kekayaannya tumbuh berkat efek bunga berbunga. Ia mengibaratkannya seperti menggelindingkan bola salju kecil dari puncak bukit panjang yang basah dan bersalju.`
- Foto: bola salju / bukit bersalju (`move: 'push-in'`); tumpukan bola salju (`move: 'pan-right'`), `di: 'bola'`

**21 · fact** · transisi `dorong`
- value `50` · label `Usia saat kekayaan melesat`
- narasi: `Buktinya, sebagian besar kekayaan bersih Warren Buffett baru terbentuk setelah ia melewati usia *lima puluh* tahun, hasil dari investasi yang tidak terputus.`
- Foto: potret Warren Buffett (`move: 'push-in'`, tag `Hasil investasi puluhan tahun`); rapat tahunan Berkshire Hathaway `di: 'melewati'`

**22 · photo** · transisi `kartu`
- tag `Lingkaran kompetensi` · judul `Pahami apa yang *Anda beli*` · judulDi `pahami`
- narasi: `Ia juga menolak membeli bisnis yang tidak ia pahami. Dalam keseharian, ia menghindari utang konsumtif dan tetap sarapan sederhana setiap pagi.`
- Foto: toko See's Candies / ritel nyata (`move: 'pan-left'`); rumah sederhana Buffett di Omaha `layout: 'print'`, `di: 'menghindari'`

### Bab 6. Janji filantropi dan warisan (scene 23–26)

**23 · fact** · transisi `dorong` · `bab: 'Janji filantropi dan warisan'`
- value `99` · suffix `%` · label `Kekayaan yang disumbangkan`
- stempel: `{teks: 'Disumbangkan', di: 'menyumbangkan'}`
- narasi: `Sejak tahun dua ribu enam, Buffett berjanji menyumbangkan lebih dari *sembilan puluh sembilan* persen kekayaannya untuk kegiatan amal dan kesehatan dunia.`
- Foto: potret Warren Buffett (`move: 'push-in'`, tag `Komitmen filantropi · 2006`); Warren Buffett bersama Bill Gates `di: 'kegiatan'`

**24 · photo** · transisi `kartu`
- tag `The Giving Pledge · 2010` · judul `Gerakan *berbagi kekayaan*` · judulDi `mengajak`
- narasi: `Bersama Bill dan Melinda Gates pada tahun dua ribu sepuluh, ia menggagas gerakan untuk mengajak para miliarder dunia menyumbangkan mayoritas harta mereka.`
- Foto: Warren Buffett dan Bill Gates `layout: 'print'`, tag `Pendiri The Giving Pledge · 2010`; potret Warren Buffett berbicara `di: 'mengajak'`

**25 · photo** · transisi `dorong`
- tag `Omaha · rapat tahunan` · judul `Puluhan ribu *investor datang*` · judulDi `ribu`
- narasi: `Setiap tahun, puluhan ribu orang datang ke Omaha untuk mendengarkan wejangan keuangannya tentang kesabaran, disiplin, dan ketenangan menghadapi gejolak pasar.`
- Foto: suasana rapat tahunan Berkshire Hathaway di Omaha (`move: 'pan-right'`); Warren Buffett di hadapan investor `di: 'mendengarkan'`

**26 · outro** · transisi `kartu`
- tag `Warren Buffett · Keuangan` · title `Kaya karena *waktu dan disiplin*` · cta `Follow untuk sejarah lainnya`
- narasi: `Kisah Warren Buffett membuktikan bahwa kekayaan sejati dibangun dari disiplin, kesabaran, dan waktu. Ikuti channel ini untuk kisah tokoh dan sejarah lainnya.`
- Foto: potret Warren Buffett (`move: 'push-in'`); lanskap kota Omaha (`move: 'pull-out'`), `di: 'Ikuti'`

Setelah selesai tiap bab, dan sekali lagi di akhir:
```bash
npx tsc
node scripts/cek-naskah.mjs warren-buffett
```
Perbaiki semua `✗ ERROR` dan peringatan `⚠` sesuai petunjuk "Perbaiki:".

**Selesai jika:** `✓ LULUS`, 26 scene, 0 error, perkiraan durasi ±230–260 detik.

## Tahap 6. Naskah TTS (Langkah 6 skill)

```bash
node scripts/narasi.mjs warren-buffett
```

🛑 **Berhenti & lapor ke user**: kirim path `narasi/warren-buffett/naskah-full.txt`, minta TTS satu file audio utuh. Sertakan: hasil `cek-naskah`, status props (dibuat/dilewati), dan catatan foto proksi jika ada.

## Tahap 7. Setelah user mengirim audio (Langkah 7–9 skill)

```bash
node scripts/potong-narasi.mjs warren-buffett "<path audio dari user>"
```
- Semua baris `ok` dan kecocokan ≥70% → aktifkan `narasiAudio: 'audio/warren-buffett', narasiExt: 'wav',` di atas `scenes`.
- Ada `⚠` → 🛑 lapor ke user.

```bash
node scripts/cek-naskah.mjs warren-buffett
npx tsc
node scripts/cek-frame.mjs warren-buffett
node scripts/storyboard.mjs warren-buffett
```
Lihat semua halaman storyboard (`out/storyboard/warren-buffett-N.jpg`) dengan Read. Pastikan setiap shot cocok dengan kata yang sedang diucapkan.

🛑 **Berhenti & kirim semua halaman `out/storyboard/warren-buffett-N.jpg` ke user**. Render & buat paket YouTube hanya setelah user setuju:
```bash
node scripts/render.mjs warren-buffett
node scripts/paket-youtube.mjs warren-buffett
```

---

## Checklist akhir (untuk dilaporkan agent)

- [ ] `cek-naskah`: ✓ LULUS, 26 scene, ±4–4,5 menit, 0 error
- [ ] Narasi 26 scene sama persis dengan rencana (semua angka ditulis huruf)
- [ ] Setiap shot ke-2 dst. punya `di` yang berurutan sesuai narasi
- [ ] Transisi `zoom` hanya di scene 9; stempel hanya di scene 15 dan 23
- [ ] Tidak ada wajah tokoh yang digenerate AI (semua foto tokoh dari Wikimedia Commons)
- [ ] 6 bab YouTube (`bab`) mulai dari scene 1, masing-masing ≥10 detik
- [ ] Storyboard dikirim & disetujui sebelum render
