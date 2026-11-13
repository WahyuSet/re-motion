# Desain: Skill & Engine Explainer Ramah Model AI Rendah

Tanggal: 2026-11-12
Status: menunggu review user
Pendekatan terpilih: **A** (validator diperketat + skill dirampingkan, format naskah tetap)

## 1. Latar Belakang & Tujuan

Video explainer `"nahh gini"` (`src/explainer/`) kini dikerjakan juga oleh model AI kelas rendah. Hasil evaluasi:

- **Narasi** sudah cukup mengalir (dibantu skill `humanizer-indonesia` dan `antislop:antislop-copywriting`).
- **Judul thumbnail & hook** kurang kuat: strukturnya benar tetapi isinya generik, tanpa kontras angka, taruhan, atau celah penasaran.
- **Props visual** kadang kurang lengkap atau tidak sesuai narasi. Contoh di `air-kadaluwarsa`:
  - Scene 4 dibuka "*Tanggal di kemasan*..." tetapi yang muncul botol retak, tanpa visual tanggal.
  - Scene 5 menyebut "*di dalam mobil*" tanpa visual mobil; kata "*antimoni*" divisualkan kucing bengong.

Akar masalah:

1. Urutan kerja salah: props digenerate (Langkah 2) **sebelum** naskah ditulis (Langkah 3).
2. Tidak ada tautan mesin antara prop dan kalimat narasi; validator hanya mengecek kata `di` ada di narasi.
3. `SKILL.md` 321 baris / 31 KB, penomoran ganda (`4b` dua kali), aturan + katalog + catatan sejarah bercampur, dan 4 hal bertentangan dengan kode.

**Tujuan:** model rendah yang mengikuti skill langkah demi langkah dan memperbaiki semua pesan validator akan menghasilkan naskah dengan (a) hook & judul yang lolos rubrik, (b) setiap klausa narasi punya visual yang terkait, tanpa perlu membaca dokumen panjang.

**Bukan tujuan:** mengubah format data naskah (`ExplainerScript`), mengubah tampilan render, menulis ulang 10 video lama, atau memperbaiki naskah `air-kadaluwarsa` (dikerjakan terpisah bila diminta).

## 2. Alur Kerja Baru

| # | Langkah | Hasil |
|---|---|---|
| 0 | `npm run baru:explainer -- <slug>` | `<slug>.ts`, `<slug>.sumber.md`, `<slug>.rencana.md` (baru), `<slug>.props.json`, `<slug>.latar.json`, entri `daftar.ts` |
| 1 | Riset fakta, minimal 2 URL | `<slug>.sumber.md` |
| 2 | 5 kandidat hook + judul dari 5 rumus, beri skor rubrik, pilih 1 | bagian `## Hook` di `.rencana.md` |
| 3 | Narasi per scene, saring dengan humanizer-indonesia + antislop-copywriting | bagian `## Narasi` di `.rencana.md` |
| 4 | Peta visual: 1 baris per klausa (`klausa → visual → file → aksi`) | bagian `## Peta Visual` di `.rencana.md` |
| 5 | Isi `props.json` & `latar.json` dari peta (tiap prop punya `untuk`), lalu generate via Flow Bridge | PNG di `public/props/`, `public/latar/` |
| 6 | Salin peta ke `<slug>.ts` | naskah |
| 7 | `npm run cek:explainer -- <slug>` sampai 0 error, 0 peringatan (opsional `--peta` untuk melihat celah) | - |
| 8 | TTS → `potong-narasi.mjs` → `cek-frame.mjs` / `storyboard.mjs` → `render.mjs` → `paket-youtube.mjs` | MP4 |

### Template `.rencana.md` (dibuat oleh `buat-explainer.mjs`)

```markdown
# Rencana: <Judul>

## Hook
| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | kontras-angka | TODO | TODO | TODO | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | bocoran | ... |
| 3 | salah-kaprah | ... |
| 4 | taruhan | ... |
| 5 | kok-kenapa | ... |

Terpilih: #TODO

## Narasi
### Scene 1 (hook)
TODO

## Peta Visual
### Scene 1
| Klausa | Visual | File | Aksi |
|---|---|---|---|
| TODO | TODO | TODO | TODO |
```

## 3. Struktur Skill Baru

Folder `.claude/skills/video-explainer/`:

| File | Isi | Target ukuran |
|---|---|---|
| `SKILL.md` | Aturan keras (maks. 10 butir), langkah 0-8 dengan perintah persis, definisi "selesai", tautan ke referensi | ~120 baris |
| `referensi/hook-judul.md` | 5 rumus hook, rubrik skor, aturan `baris1`/`baris2`, contoh bagus vs lemah | ~80 baris |
| `referensi/narasi.md` | Ringkasan antislop + humanizer, angka huruf, partikel tutur, contoh sebelum/sesudah | ~70 baris |
| `referensi/visual.md` | Katalog `masuk`/`keluar`/`aksi`/simbol/SFX disalin dari kode (dengan default asli), katalog meme, pola koreografi, aturan tata letak | ~150 baris |
| `referensi/contoh-scene.md` | 1 scene `stage` lengkap yang lolos semua aturan + potongan `props.json` dengan `untuk` | ~80 baris |

Dihapus dari skill: bagian "Penyempurnaan Engine sejak token-listrik" (sudah tercermin di kode), duplikasi checklist, dan penomoran ganda. Setiap aturan yang bisa dicek mesin ditandai "(dicek validator)".

## 4. Validator (`scripts/cek-explainer.mjs`)

Format pesan: `<lokasi>: <masalah> → PERBAIKI: <langkah konkret>`.

Daftar `LEGACY` = 10 slug lama (`token-listrik`, `sadap-lims`, `gandum-tropis`, `baju-kuning`, `kamar-panas`, `bata-zigzag`, `bpa-free`, `efek-rumah-kaca`, `black-box`, `cas-80`). Aturan baru 4.1-4.3 tidak berlaku untuk slug `LEGACY`; aturan 4.4 berlaku untuk semua. Menggantikan `legacyHookSlugs` yang ada.

### 4.1 Kecocokan visual-narasi

| Kode | Cek | Tingkat |
|---|---|---|
| V1 | Narasi dipecah menjadi klausa pada kata yang diakhiri `, . ? ! ; :` (regex sama dengan `potongFrasa`). Setiap klausa wajib punya >= 1 kejadian visual (item `di` atau `aksi.di`) yang indeks katanya jatuh di rentang klausa. Klausa pertama juga tertutup oleh item tanpa `di` dengan `delay <= 15`. | error |
| V2 | Ada > 6 kata berturut-turut tanpa kejadian visual (masuk item atau aksi). | peringatan |
| V3 | Setiap frasa `*kata kunci*` wajib punya item/aksi yang `di`-nya jatuh di salah satu kata frasa itu. | peringatan |
| V4 | Setiap entri `<slug>.props.json` wajib punya `untuk` (string). Frasa harus ada di narasi suatu scene, dan `props/<name>.png` harus dipakai sebagai `src` di scene tersebut. | error |
| V5 | Entri `props.json` yang tidak dipakai di naskah mana pun. | peringatan |
| V6 | Dua item `kind: 'prop'` yang tampil bersamaan (rentang indeks kata `di`..`sampai` beririsan) berjarak `< 18` pada x **dan** `< 16` pada y. | peringatan |

"Kejadian visual" dihitung pada indeks kata (bukan frame) agar bisa dicek sebelum audio ada. Pencocokan kata memakai `indexOfWord` yang sama dengan engine (pencarian `aksi` dimulai setelah indeks `di` item).

### 4.2 Kepadatan motion & komedi

| Kode | Cek | Tingkat |
|---|---|---|
| M1 | Scene `hook`/`stage`: total `aksi` >= 3. | peringatan |
| M2 | Scene `hook`/`stage`: >= 2 nilai `masuk` berbeda (default `pop`). | peringatan |
| M3 | Scene `stage`: >= 1 aksi `move`. | peringatan |
| M4 | Per video: >= 1 aksi `peek`. | peringatan |
| M5 | Per video: >= 3 SFX komedi (`boing`/`boom`/`womp`/`slap`/`ding`), termasuk default dari `jump`/`peek` (boing), `squash` (slap), `centang` (ding), `silang` (slap). | peringatan |
| M6 | Per video: >= 1 item `teks` dengan `ukuran <= 32` dan `rotate` != 0. | peringatan |

### 4.3 Hook, judul, rencana

| Kode | Cek | Tingkat |
|---|---|---|
| H1 | Narasi hook 7-14 kata. | peringatan |
| H2 | Narasi hook memuat salah satu: `kok`, `kenapa`, `padahal`, `cuma`, `ternyata`, `malah`, `bukan`. | peringatan |
| H3 | `baris1`/`baris2` (hook & thumbnail) <= 28 karakter. | peringatan |
| H4 | `baris2` diakhiri `?` atau memuat digit atau kata kontras H2. | peringatan |
| R1 | `<slug>.rencana.md` ada dan tanpa `TODO`. | peringatan |
| R2 | Tabel `## Hook` punya 5 baris kandidat dengan kolom `Total` angka; baris `Terpilih: #N` menunjuk kandidat dengan `Total` >= 7. | peringatan |

### 4.4 Pagar skema (semua slug)

| Kode | Cek | Tingkat |
|---|---|---|
| S1 | `masuk`, `keluar`, `simbol`, `sfx`, `aksi.type` di luar daftar yang dikenal engine. | error |
| S2 | Field `aksi` yang tidak dibaca engine untuk `type`-nya (mis. `durasiX`, `toScale` pada `shake`). Daftar field per type ditulis sekali di validator, bersumber dari `hitungTransformItem`. | peringatan |

### 4.5 Mode `--peta`

`npm run cek:explainer -- <slug> --peta` mencetak per scene setiap klausa beserta kejadian visualnya, menandai klausa kosong `✗`:

```
S4 │ Tanggal di kemasan itu sebenarnya batas umur *botol plastiknya*.
   │   → air-botol-retak (drop, delay 0) · shake@botol plastiknya · teks "Plastik PET"
S4 │ Lewat dari *dua tahun*,
   │   → wiggle@dua tahun
```

## 5. Perubahan Engine (`src/explainer/`)

Semua kompatibel ke belakang; render 10 video lama tidak berubah.

| File | Perubahan |
|---|---|
| `timing.ts` | `grow`: bila `toScale` diisi, dipakai untuk X dan Y (kecuali `toScaleX`/`toScaleY` diisi). |
| `timing.ts` | `dim`: `to` diterima sebagai alias `toOpacity`. |
| `types.ts` | Tambah `to?: number` pada `StageAction`. Commit bersama perubahan `silang` & `pulse.skala` yang sudah ada di working tree. |
| `Stage.tsx` | SFX masuk default simbol `silang` = `slap`. |

Default yang **tetap** (dokumentasi yang disesuaikan): `pulse` amplitudo 8% (`skala: 1.18` untuk kuat), `shake` SFX default `dum`.

## 6. Scaffold (`scripts/buat-explainer.mjs`)

- Tambah pembuatan `<slug>.rencana.md` (template bagian 2). `.latar.json` sudah dibuat oleh scaffold saat ini.
- Template `props.json` (sekarang `[]`) diganti 1 contoh entri `{name, prompt, untuk}` bertanda `TODO`.
- Komentar di template `.ts` dan pesan "langkah berikutnya" di akhir scaffold mengikuti urutan alur baru (rencana dulu, generate props setelah peta).

## 7. Pengujian

Test baru di `tests/explainer/` memakai `node:test` + `node:assert/strict` dan `importTs`, sama seperti test yang ada (jalankan `node --test tests/explainer/`):

- `validator-visual.test.mjs`: V1 (klausa kosong → error; ditutup `delay: 0` → lolos), V3, V4 (tanpa `untuk` → error; frasa tidak ada → error; prop dipakai di scene lain → error), V6.
- `validator-hook.test.mjs`: H1-H4, R2 (parse tabel, skor < 7 → peringatan).
- `validator-skema.test.mjs`: S1, S2, slug `LEGACY` melewati aturan 4.1-4.3.
- `timing.test.mjs` (tambahan): `grow.toScale`, alias `dim.to`.

Verifikasi akhir:

- `npm run cek:explainer -- <slug>` lolos (0 error) untuk ke-10 slug `LEGACY`.
- `npm run typecheck` dan seluruh test hijau.
- `air-kadaluwarsa` (bukan legacy) diharapkan gagal V1/V4 dan `--peta` menunjukkan celah scene 4 & 5. Hasilnya dilaporkan, naskah tidak diubah.

## 8. File yang Disentuh

- Ubah: `.claude/skills/video-explainer/SKILL.md`, `scripts/cek-explainer.mjs`, `scripts/buat-explainer.mjs`, `src/explainer/timing.ts`, `src/explainer/types.ts`, `src/explainer/Stage.tsx`, `tests/explainer/timing.test.mjs`
- Baru: `.claude/skills/video-explainer/referensi/{hook-judul,narasi,visual,contoh-scene}.md`, `tests/explainer/validator-{visual,hook,skema}.test.mjs`
- Tidak disentuh: engine sejarah (`src/HistoryVideo.tsx`, `src/data/*`, `src/scenes/*`, `src/components/*`), naskah video yang sudah ada.
