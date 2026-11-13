# Contoh Scene Lengkap (lolos validator)

Contoh dari video `air-kadaluwarsa`, scene fakta. Ditiru polanya, bukan disalin isinya.

## 1. Peta visual di `.rencana.md`

```markdown
### Scene 4
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| Tanggal di kemasan itu sebenarnya batas umur *botol plastiknya*. | botol dengan label tanggal + teks celetukan | props/air-botol-expired.png, teks "Tanggal = umur botol" | wiggle@kemasan, jump@botol |
| Lewat dari *dua tahun*, | botol retak menggantikan botol baru + kucing sinis | props/air-botol-retak.png, props/meme-kucing-sinis.png | shake@dua tahun |
| plastiknya mulai rapuh dan *mikroplastik* ikut luruh ke air. | botol retak bergeser, partikel mikroplastik masuk | props/air-mikroplastik.png | move@mulai, squash@rapuh, peek@rapuh, pulse@luruh |
```

Setiap klausa punya baris. Setiap benda yang disebut (tanggal, botol, mikroplastik) punya file.

## 2. Potongan `props.json`

```json
[
  {"name": "air-botol-expired", "prompt": "clear plastic mineral water bottle with a bold red expiration date label, studio product photography cutout, isolated on clean background", "untuk": "Tanggal di kemasan"},
  {"name": "air-botol-retak", "prompt": "aged crumpled clear plastic water bottle with fine cracks, studio product photography cutout, isolated on clean background", "untuk": "plastiknya mulai rapuh"},
  {"name": "air-mikroplastik", "prompt": "magnifying glass over tiny colorful microplastic particles in a water droplet, studio product photography cutout, isolated on clean background", "untuk": "mikroplastik ikut luruh"}
]
```

`untuk` = frasa persis dari narasi scene tempat prop itu dipakai. Meme (`meme-kucing-*`) sudah ada di `public/props/`, tidak perlu masuk `props.json`.

## 3. Scene di `.ts`

```ts
{
  type: 'stage',
  duration: 140,
  latar: 'latar/air-kadaluwarsa-3.png',
  narasi:
    'Tanggal di kemasan itu sebenarnya batas umur *botol plastiknya*. Lewat dari *dua tahun*, plastiknya mulai rapuh dan *mikroplastik* ikut luruh ke air.',
  items: [
    {
      kind: 'prop',
      src: 'props/air-botol-expired.png',
      x: 30,
      y: 50,
      width: 300,
      masuk: 'drop',
      delay: 0,
      sampai: 'Lewat',
      keluar: 'slide-left',
      aksi: [
        {type: 'wiggle', di: 'kemasan', rotate: 12, durasi: 16},
        {type: 'jump', di: 'botol plastiknya', dy: 60, durasi: 18},
      ],
    },
    {
      kind: 'teks',
      teks: 'Tanggal = umur botol',
      x: 30,
      y: 24,
      ukuran: 30,
      warna: '#ffffff',
      kotak: '#e53935',
      rotate: -6,
      di: 'batas',
      sampai: 'Lewat',
    },
    {
      kind: 'prop',
      src: 'props/air-botol-retak.png',
      x: 30,
      y: 52,
      width: 290,
      masuk: 'slide-up',
      di: 'Lewat',
      aksi: [
        {type: 'shake', di: 'dua tahun', intensitas: 12, durasi: 18, sfx: 'womp'},
        {type: 'move', di: 'mulai', toX: 26, toY: 56, toRotate: -6, durasi: 16},
        {type: 'squash', di: 'rapuh', durasi: 16},
      ],
    },
    {
      kind: 'prop',
      src: 'props/meme-kucing-sinis.png',
      x: 72,
      y: 54,
      width: 240,
      masuk: 'pop',
      di: 'dua',
      sampai: 'mikroplastik',
      sfx: 'boing',
      aksi: [{type: 'peek', di: 'rapuh', dx: -16, dy: -8, rotate: -14, durasi: 12, tahan: 22}],
    },
    {
      kind: 'prop',
      src: 'props/air-mikroplastik.png',
      x: 72,
      y: 50,
      width: 260,
      masuk: 'slide-left',
      di: 'mikroplastik',
      aksi: [{type: 'pulse', di: 'luruh', skala: 1.18, durasi: 18, sfx: 'boom'}],
    },
  ],
},
```

Yang membuat scene ini lolos:
- Klausa 1 ditutup prop `delay: 0`; klausa 2 oleh `Lewat`/`dua`; klausa 3 oleh `move@mulai` dan prop `mikroplastik` (V1).
- Tiap `*kata kunci*` punya kejadian di katanya (V3).
- Ganti fase tanpa celah: `sampai: 'Lewat'` item lama = `di: 'Lewat'` item baru; meme keluar di `mikroplastik` tepat saat prop mikroplastik masuk, jadi tidak menumpuk (V6).
- 4 jenis `masuk` (drop, pop, slide-up, slide-left), 7 aksi termasuk `move` dan `peek` (M1-M4).
- SFX komedi: `womp`, `boing` (item + peek default), `slap` (squash default), `boom` (M5). Teks celetukan ukuran 30 miring (M6).
