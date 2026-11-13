# Contoh Scene Lengkap (lolos validator)

Contoh dari video `air-kadaluwarsa` (remake), scene fakta dengan punchline. Ditiru polanya, bukan disalin isinya.
Naskahnya memakai `gayaTeks: 'stiker'`, jadi semua item teks di bawah tampil sebagai stiker die-cut.

## 1. Peta visual di `.rencana.md`

```markdown
### Scene 4
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Tanggal itu wajib dari *aturan label BPOM*. | buku aturan berstempel + stiker "ATURAN LABEL BPOM" | props/air-kadaluwarsa-buku-aturan.png, teks "ATURAN LABEL BPOM" | drop buku delay 0, wiggle@wajib, pop teks@aturan, jump buku@BPOM |
| Cuka aja bebas tanggal, | botol cuka + centang | props/air-kadaluwarsa-cuka.png, teks "CUKA", simbol centang | slide-right cuka@Cuka, centang@bebas, move buku@Cuka |
| air putih malah *kena tilang*. | botol air ditempeli surat tilang (gag) + stiker "DITILANG!" | props/air-kadaluwarsa-botol-tilang.png, teks "DITILANG!" | drop botol-tilang@kena (slap), teks@tilang, wiggle@tilang |
```

Setiap klausa punya baris. Setiap benda yang disebut (aturan, cuka, air) punya file. Klausa punchline memakai visual gag
dari tabel `## Komedi`:

```markdown
| # | Jenis | Kalimat joke | Punchline | Visual gag |
|---|---|---|---|---|
| 2 | personifikasi | Cuka aja bebas tanggal, air putih malah kena tilang. | kena tilang | Botol air dengan surat tilang (props/air-kadaluwarsa-botol-tilang.png, 280px) drop di kata "kena" + SFX `slap` + teks "DITILANG!"; scene tahan 30 frame. |
```

## 2. Potongan `props.json`

```json
[
  {"name": "air-kadaluwarsa-buku-aturan", "untuk": "aturan label BPOM", "prompt": "a thick official government regulation document booklet with a plain dark green cover and a round red rubber stamp mark on the cover, lying slightly open with a few bookmark tabs, no readable words, no logos"},
  {"name": "air-kadaluwarsa-cuka", "untuk": "Cuka aja bebas tanggal", "prompt": "a single tall clear glass bottle of white vinegar with a plain red screw cap and a plain white label with no text, whole bottle in view, upright, front view"},
  {"name": "air-kadaluwarsa-botol-tilang", "untuk": "air putih malah kena tilang", "prompt": "a single clear plastic water bottle full of water with a pink paper traffic violation ticket slip tied to its neck with a string, a silver police whistle hanging next to the ticket, whole bottle in view, upright, no logos, no readable text"}
]
```

`untuk` = frasa persis dari narasi scene tempat prop itu dipakai. Meme (`meme-kucing-*`) sudah ada di `public/props/`, tidak perlu masuk `props.json`.
Label kosong di botol cuka diberi teks panggung "CUKA" (Flow tidak andal menulis teks di prop).

## 3. Scene di `.ts`

```ts
{
  type: 'stage',
  duration: 180,
  tahan: 30,
  latar: 'latar/air-kadaluwarsa-4.png',
  narasi: 'Tanggal itu wajib dari *aturan label BPOM*. Cuka aja bebas tanggal, air putih malah *kena tilang*.',
  items: [
    {
      kind: 'prop',
      src: P('buku-aturan'),
      x: 40,
      y: 40,
      width: 340,
      masuk: 'drop',
      delay: 0,
      aksi: [
        {type: 'wiggle', di: 'wajib', rotate: 8, durasi: 16},
        {type: 'jump', di: 'BPOM', dy: 50, durasi: 16},
        {type: 'move', di: 'Cuka', toX: 28, toY: 28, toScale: 0.65, durasi: 16},
      ],
    },
    {
      kind: 'teks',
      teks: 'ATURAN LABEL BPOM',
      x: 50,
      y: 60,
      ukuran: 44,
      warna: '#ffffff',
      kotak: '#1e88e5',
      masuk: 'pop',
      di: 'aturan',
      sampai: 'Cuka',
    },
    {
      kind: 'prop',
      src: P('cuka'),
      x: 24,
      y: 56,
      width: 150,
      masuk: 'slide-right',
      di: 'Cuka',
      aksi: [{type: 'wiggle', di: 'bebas', rotate: 8, durasi: 16}],
    },
    {kind: 'teks', teks: 'CUKA', x: 24, y: 58, ukuran: 28, warna: '#ffffff', kotak: '#37474f', masuk: 'pop', di: 'aja', zIndex: 12},
    {kind: 'simbol', simbol: 'centang', x: 40, y: 46, width: 110, masuk: 'pop', di: 'bebas'},
    {
      kind: 'prop',
      src: P('botol-tilang'),
      x: 66,
      y: 52,
      width: 280,
      masuk: 'drop',
      di: 'kena',
      sfx: 'slap',
      aksi: [{type: 'wiggle', di: 'tilang', rotate: 10, durasi: 16}],
    },
    {
      kind: 'teks',
      teks: 'DITILANG!',
      x: 66,
      y: 26,
      ukuran: 40,
      warna: '#ffffff',
      kotak: '#e53935',
      rotate: -6,
      masuk: 'pop',
      di: 'tilang',
    },
  ],
},
```

`P` = `(nama) => \`props/air-kadaluwarsa-${nama}.png\`` di atas file naskah.

Yang membuat scene ini lolos:
- Klausa 1 ditutup prop `delay: 0`; klausa 2 oleh `Cuka`/`bebas`; klausa 3 oleh prop gag di `kena` (V1).
- Tiap `*kata kunci*` punya kejadian di katanya: teks di `aturan`, jump di `BPOM`, gag di `kena` (V3).
- Punchline "kena tilang" di ujung kalimat, gag besar (280 px) masuk tepat di kata `kena` dengan SFX `slap`, dan `tahan: 30` memberi jeda ketawa (K2-K4).
- Buku aturan tidak keluar, tapi `move` mengecilkannya ke pojok supaya cuka dan botol punya ruang; kotak awal buku dan botol tilang tidak bertumpuk (V6).
- Stiker lebih lebar dari kotak datar: validator A1 sudah menghitungnya, jadi teks lebar jangan ditaruh terlalu ke kanan (`x` ≤ 64 untuk teks ±20 huruf ukuran 30).
- 4 jenis `masuk` (drop, pop, slide-right, drop), 6 aksi termasuk `move` (M1-M3).
