# Visual: Katalog Engine, Komedi, Tata Letak

Semua nilai di sini sama dengan kode `src/explainer/` (`types.ts`, `timing.ts`, `Stage.tsx`). Nilai/field lain ditolak validator (S1) atau diabaikan engine (S2).

## StageItem

| Field | Isi |
|---|---|
| `kind` | `'prop'` (gambar), `'teks'`, `'simbol'` |
| `src` | prop: `'props/<nama>.png'` |
| `teks`, `ukuran`, `warna`, `kotak` | teks: isi, ukuran font (default 56), warna, warna kotak latar |
| `simbol` | lihat tabel simbol |
| `x`, `y` | posisi tengah dalam persen (x 8..92, y 12..76) |
| `width` | piksel (default prop 340, simbol 170) |
| `rotate`, `zIndex`, `bingkai` | rotasi awal (derajat), lapisan (default 10), bingkai hitam foto asli |
| `di` / `delay` | masuk di kata `di`, atau `delay` frame dari awal scene (tanpa `di` dan tanpa `delay` = frame 0) |
| `sampai` / `endFrame` | keluar di kata `sampai` (dicari setelah `di`) |
| `masuk`, `keluar`, `sfx`, `aksi` | lihat tabel di bawah |
| `float` | goyang halus otomatis (default `true` untuk prop/simbol, `false` untuk teks) |

## Masuk & Keluar

| `masuk` | Efek |
|---|---|
| `pop` (default) | membesar membal 12 frame |
| `drop` | jatuh dari atas + squash saat mendarat |
| `slide-left` | masuk dari kanan ke kiri |
| `slide-right` | masuk dari kiri ke kanan |
| `slide-up` | naik dari bawah |
| `grow-up` | tumbuh dari bawah (18 frame) |
| `fade` | muncul pelan |
| `none` | langsung tampil |

`keluar`: `pop-out` (default, 8 frame), `fade`, `slide-left`, `slide-right`, `slide-down`, `none`.

## Simbol

`larang`, `centang`, `silang`, `panah`, `tanya`, `retak`, `tetes-air`, `gelombang-air`.

## Aksi (`aksi: [...]`)

Field umum semua aksi: `type`, `di`, `delay`, `durasi` (default 18), `sfx`. Aksi tanpa `di` jalan 12 frame setelah item masuk. `di` aksi dicari setelah kata `di` item.

| `type` | Field khusus (default) | Efek | SFX default |
|---|---|---|---|
| `jump` | `dy` (64) | lompat + squash-stretch | `boing` |
| `wiggle` | `rotate` (14) | goyang kiri-kanan | - |
| `squash` | - | gepeng ke bawah lalu balik | `slap` |
| `peek` | `dx` (-14), `dy` (0), `rotate` (-15), `tahan` (35) | nongol miring, tahan, ngumpet | `boing` |
| `move` | `toX`, `toY`, `toScale`, `toRotate` | pindah posisi permanen | - |
| `shake` | `intensitas` (10) | getar horizontal | `dum` |
| `pulse` | `skala` (1.08), `sampai` | denyut; `skala: 1.18` untuk denyut kuat; tanpa `durasi` berdenyut sampai akhir scene | - |
| `grow` | `toScale`, atau `toScaleX`/`toScaleY` | ubah skala permanen dari bawah | - |
| `dim` | `toOpacity` atau `to` (0.25) | redupkan | - |

## SFX

Nama: `whoosh`, `dum`, `tik`, `pop`, `swell`, `boing`, `boom`, `womp`, `slap`, `ding`. `sfx: false` = bisu.

Default bunyi masuk item: `pop`; `centang` → `ding`; `silang` → `slap`; `larang`/`retak` → `dum`; item yang masuk di frame 0-2 tanpa `sfx` = bisu.

Komedi (minimal 3 per video, validator M5):
- `boing`: prop nongol nyeleneh, `peek`, `jump`.
- `womp`: salah kaprah terbongkar, uang terpotong, gagal.
- `boom`: fakta mengejutkan, beban jatuh.
- `slap`: bantahan `silang`, objek penyet.
- `ding`: jawaban benar, `centang`.

## Meme Reaksi (`public/props/`)

| File | Pakai untuk |
|---|---|
| `meme-kucing-paw.png` | mikir serius, pembuka pertanyaan |
| `meme-kucing-merenung.png` | merenung, kena realita pahit (`womp`) |
| `meme-kucing-titik.png` | speechless, gagal paham |
| `meme-kucing-think.png` | ngitung / mikir keras |
| `meme-monyet-mikir.png` | bingung kocak |
| `meme-kucing-sinis.png` | curiga, nyindir kebiasaan salah |
| `meme-kucing-senyum.png` | senyum pasrah, trik rahasia |
| `meme-kucing-nangis.png` | boncos, menyesal (`womp`) |
| `meme-kucing-jempol.png` | solusi mantap, kesimpulan (`ding`) |
| `meme-kucing-jelasin.png`, `meme-kucing-guru.png` | scene beat, penjelasan |

Meme **menemani**, bukan menggantikan. Kalau klausa menyebut benda, benda itu tetap harus tampil.

Karakter reaksi **selalu** dari tabel ini, jangan digenerate lewat Flow Bridge (ciri khas channel). Kalau ekspresi yang dibutuhkan belum ada (misalnya jijik, syok/kaget), pakai meme terdekat sementara dan **sebutkan ke user** ekspresi yang kurang supaya user yang mencarikan.

## Kepadatan Motion (validator M1-M6)

- Scene `hook`/`stage`: minimal 3 aksi, minimal 2 jenis `masuk`, scene `stage` minimal 1 `move`.
- Per video: minimal 1 `peek`, 3 SFX komedi, 1 teks celetukan (`ukuran` 28-32, `rotate: -6`).
- Prop yang tampil > 3 detik: 2-3 aksi berantai (`wiggle` → `move` → `jump`).

## Pola Koreografi

Rantai pada 1 prop:
```ts
aksi: [
  {type: 'wiggle', di: 'mengira', rotate: 14, durasi: 18},
  {type: 'move', di: 'jendela', toX: 24, toY: 56, toRotate: -5, durasi: 16},
  {type: 'jump', di: 'sejuk', dy: 55, durasi: 16},
]
```
Sebab-akibat pada kata yang sama: A `masuk: 'drop'` di `'tertimpa'` → B `{type: 'squash', di: 'tertimpa'}`.

## Tata Letak

- Detik 0 setiap scene wajib ada visual (`delay: 0` atau `di` di kata 1-2).
- Ganti fase: `sampai` item lama = `di` item baru (kata yang sama), jangan taruh item baru di posisi persis item yang sedang keluar.
- Dua prop yang tampil bersamaan: selisih minimal 18 pada `x` atau 16 pada `y` (validator V6).
- Item satu kolom: jarak vertikal 16-18%.
- Subtitle ada di bawah (`bottom` 430 px); jangan taruh item penting di `y` > 76.
