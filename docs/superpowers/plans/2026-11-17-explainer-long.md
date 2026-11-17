# Explainer Long (16:9) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Video Cutout Motion Explainer bisa dibuat versi long, yaitu 16:9 1920×1080 berdurasi 3-12 menit dengan chapter YouTube. Format short 9:16 tetap jalan persis seperti sekarang.

**Architecture:** Semua angka tata letak dan aturan yang bergantung pada format dipindah ke satu modul data murni, `src/explainer/format.ts` (`PROFIL.short` / `PROFIL.landscape`). Engine (scene React) membacanya lewat `useProfil()`, validator membacanya lewat `importTs`. Jadi angka engine dan angka validator selalu sama. Nilai `PROFIL.short` = angka yang sekarang di-hardcode, jadi hasil render video short tidak berubah satu pixel pun (dibuktikan dengan `npm run uji`). Chapter memakai field `bab` yang sudah ada di `BaseExplainerScene`; `paket-youtube.mjs` sudah bisa menulis chapter dari field itu.

**Tech Stack:** Remotion 4.0.539, React 19, TypeScript, Node `node:test`, esbuild (`importTs`), sharp.

**Spec:** Tidak ada dokumen spec terpisah. Keputusan desainnya ada di bagian "Keputusan Desain" di bawah, hasil diskusi di sesi 2026-11-17.

## Keputusan Desain

- "Long" = `format: 'landscape'` (1920×1080), sama seperti engine sejarah. Short 9:16 yang durasinya lebih dari 60 detik **di luar cakupan**.
- Ukuran item (`width`, `ukuran`) tetap dalam pixel dan **tidak diskalakan** per format. Di landscape tinggi kanvas 1080 px, jadi prop yang sama terlihat lebih tinggi relatif ke layar. Validator menghitung kotak dengan kanvas sesuai format, dan skill memberi rentang `width` khusus landscape.
- Banner bab: kartu kecil kanan atas "BAB N · JUDUL", tampil 3 detik di awal setiap scene yang punya `bab`, **kecuali scene 1** (hook tetap bersih di frame 0). Nomornya dihitung dari scene 1.
- Durasi landscape 180-720 detik. Joke minimal `max(4, ceil(detik/60))`. "padahal"/"banyak yang ngira" maksimal 1× **per bab** (short: per video).
- Video long pertama (butuh audio TTS dari user dan props dari Flow) **di luar plan ini**. Plan berhenti di engine, validator, template, skill, dan pratinjau landscape dari video short yang sudah ada.

## Global Constraints

- Jangan ubah engine sejarah: `src/HistoryVideo.tsx`, `src/Thumbnail.tsx`, `src/theme.ts`, `src/types.ts`, `src/scenes/*`, `src/components/*`, `src/data/*`, `src/lib/safe.ts`, `src/lib/layout.ts`.
- Video explainer short yang sudah ada harus menghasilkan frame yang identik pixel per pixel (`npm run uji` 0 beda) dan durasi yang sama.
- Naskah tanpa field `format` = short (engine dan validator).
- Pesan validator baru memakai bentuk yang sudah ada: `lokasi: KODE pesan → PERBAIKI: langkah`, dalam bahasa Indonesia.
- Test: `node --test tests/explainer/`. Typecheck: `npm run typecheck`.
- `tests/explainer/patokan.test.mjs` harus tetap lulus (patokan nasi-warm, potongan-gaji, kabel-kendor 0 error, 0 peringatan).

## Review Focus

1. **Video short lama berubah tampilan** karena refactor angka → harus identik pixel. Dikunci oleh baseline `npm run uji` di Task 1 dan pengecekan ulang di Task 2 dan Task 7.
2. **Naskah tanpa `format`** → harus diperlakukan sebagai short oleh `profilNaskah` dan `profilDari`. Test di Task 1.
3. **Judul hook 28 huruf di landscape** → harus muat dalam satu baris selebar 1600 px tanpa terpotong. Dicek lewat pratinjau `cek-frame --format landscape` di Task 2.
4. **Durasi bab memakai `kata.json` kalau ada** (bukan perkiraan) → C3 harus pakai waktu nyata setelah audio dipotong. Test di Task 4.
5. **Penomoran bab saat scene 1 tanpa `bab`** → nomor tetap urut dari bab pertama, tidak loncat. Test `nomorBab` di Task 3.

---

### Task 1: Profil format + baseline regresi

**Files:**
- Create: `src/explainer/format.ts`
- Test: `tests/explainer/format.test.mjs`

**Interfaces:**
- Produces:
  ```ts
  export type FormatExplainer = 'short' | 'landscape';
  export type ProfilFormat = {
    format: FormatExplainer;
    kanvas: {w: number; h: number};
    /** Area aman, persen layar */
    aman: {kiri: number; kanan: number; atas: number; bawah: number};
    /** Tepi bawah judul tiap jenis scene, persen (aturan L1) */
    zonaJudul: {hook: number; stageBerjudul: number; beat: number};
    /** Tepi atas kotak subtitle, persen (aturan L2) */
    subtitleAtas: number;
    hook: {top: string; side: number; font1: number; font2: number; lebar1: number; lebar2: number};
    bannerStage: {top: string; side: number};
    beat: {topBerItem: string; topKosong: string; side: number};
    diagram: {top: string; side: number; skala: number};
    watermark: {left: string; top: string};
    thumb: {top: string; side: number; font1: number; font2: number; lebar1: number; lebar2: number};
    bab: {right: string; top: string; fontSize: number};
    durasi: {min: number; max: number};
    hookKata: {min: number; max: number};
    minJoke: number;
    jokePerMenit: number;
  };
  export const PROFIL: Record<FormatExplainer, ProfilFormat>;
  export const profilNaskah: (script: {format?: FormatExplainer} | undefined) => ProfilFormat; // default short
  export const profilDari: (width: number, height: number) => ProfilFormat; // width > height → landscape
  export const jokeMinimal: (profil: ProfilFormat, detik: number) => number; // max(minJoke, ceil(detik/60 * jokePerMenit))
  ```

Nilai yang dikunci:

| Field | short (= angka engine sekarang) | landscape |
|---|---|---|
| kanvas | 1080×1920 (`FORMAT_SIZE.short`) | 1920×1080 |
| aman | dari `SAFE_SHORT`: kiri 70/1080, kanan 100−150/1080, atas 240/1920, bawah 100−420/1920 (persen) | kiri 3, kanan 97, atas 5, bawah 95 |
| zonaJudul | hook 28, stageBerjudul 22, beat 24 | hook 34, stageBerjudul 16, beat 18 |
| subtitleAtas | 73.5 | 85 |
| hook | top '15%', side 56, font 92/84, lebar 960/936 | top '7%', side 120, font 104/92, lebar 1600/1560 |
| bannerStage | top '16%', side 72 | top '7%', side 200 |
| beat | '18%' / '38%', side 60 | '8%' / '38%', side 200 |
| diagram | top '16%', side 80, skala 1 | top '7%', side 200, skala 0.8 |
| watermark | left '7%', top '8.5%' | left '3%', top '4%' |
| thumb | top '15%', side 56, font 112/100, lebar 980/956 | top '9%', side 60, font 100/88, lebar 1160/1120 |
| bab | right '3%', top '4%', fontSize 30 (tidak dipakai di short) | right '3%', top '4%', fontSize 30 |
| durasi | min 0, max 60 | min 180, max 720 |
| hookKata | 7..14 | 12..45 |
| minJoke / jokePerMenit | 2 / 0 | 4 / 1 |

- [ ] **Step 1: Simpan baseline regresi short (SEBELUM menyentuh engine)**

Run: `npm run uji -- --simpan NasiWarm PotonganGaji KabelKendor AirKadaluwarsa BataZigzag KlipRoti`
Expected: frame acuan tersimpan di `out/baseline/` (enam id, lima frame masing-masing). Set ini mencakup hook, stage, beat, diagram potongan, diagram bata, dan gaya stiker. Catatan: `--simpan` menghapus seluruh `out/baseline/` (termasuk acuan video sejarah). Isinya cuma file hasil generate, tapi beri tahu user kalau acuan sejarah sedang dipakai.

- [ ] **Step 2: Tulis test yang gagal** di `tests/explainer/format.test.mjs` (muat lewat `importTs('src/explainer/format.ts')`):
  - `profilNaskah({})` dan `profilNaskah(undefined)` → `.format === 'short'`; `profilNaskah({format: 'landscape'}).format === 'landscape'`.
  - `profilDari(1080, 1920).format === 'short'`; `profilDari(1920, 1080).format === 'landscape'`.
  - `PROFIL.short.aman` sama dengan `SAFE_SHORT`/`FORMAT_SIZE.short` dari `src/lib/safe.ts` (selisih < 1e-9, rumus seperti `validator-kotak.test.mjs`).
  - `PROFIL.short.hook` deepEqual `{top: '15%', side: 56, font1: 92, font2: 84, lebar1: 960, lebar2: 936}`; `PROFIL.short.durasi.max === 60`.
  - `jokeMinimal(PROFIL.short, 55) === 2`; `jokeMinimal(PROFIL.landscape, 200) === 4`; `jokeMinimal(PROFIL.landscape, 400) === 7`.

- [ ] **Step 3: Jalankan, pastikan gagal**
Run: `node --test tests/explainer/format.test.mjs` → Expected: FAIL (file `format.ts` belum ada).

- [ ] **Step 4: Implementasi `src/explainer/format.ts`** dengan nilai dari tabel. Tanpa import React/Remotion; boleh import `../lib/safe`.

- [ ] **Step 5: Jalankan test** → Expected: PASS.

- [ ] **Step 6: Commit**
```bash
git add src/explainer/format.ts tests/explainer/format.test.mjs
git commit -m "feat(explainer): profil format short/landscape"
```

### Task 2: Engine membaca profil + pratinjau landscape

**Files:**
- Create: `src/explainer/useProfil.ts`
- Modify: `src/explainer/scenes/HookScene.tsx`, `src/explainer/scenes/StageScene.tsx`, `src/explainer/scenes/BeatScene.tsx`, `src/explainer/scenes/DiagramScene.tsx`, `src/explainer/ExplainerVideo.tsx` (watermark), `src/explainer/ExplainerThumb.tsx`
- Modify: `scripts/cek-frame.mjs` (flag `--format`)

**Interfaces:**
- Consumes: `profilDari(width, height)` dari Task 1.
- Produces: `useProfil(): ProfilFormat` (`useVideoConfig()` → `profilDari(width, height)`); CLI `node scripts/cek-frame.mjs <slug> --format landscape [--rapat]`.

- [ ] **Step 1: Ganti angka hardcode dengan profil.** HookScene: `top`, `left/right` = `side`, `fitThumbFontSize(baris1, font1, lebar1)` / `(baris2, font2, lebar2)`. StageScene: banner `top`, `left/right`. BeatScene: `top` (berItem/kosong), `left/right`. DiagramScene: setiap `top: '16%'`, `left: 80`, `right: 80` → `profil.diagram`, dan kolom diagram dibungkus `transform: scale(skala)` dengan `transformOrigin: 'top center'` (skala 1 = tidak berubah). Watermark di ExplainerVideo: `left/top` dari `profil.watermark`. ExplainerThumb: `top`, `side`, dan font/lebar dari `profil.thumb`. Subtitle tidak diubah (sudah punya cabang landscape).

- [ ] **Step 2: Typecheck**
Run: `npm run typecheck` → Expected: 0 error.

- [ ] **Step 3: Regresi short identik**
Run: `npm run uji -- NasiWarm PotonganGaji KabelKendor AirKadaluwarsa BataZigzag KlipRoti`
Expected: exit 0, 0 pixel beda, durasi sama. Kalau ada beda, berarti ada nilai `PROFIL.short` yang tidak sama dengan angka lama. Perbaiki profilnya, bukan baseline-nya.

- [ ] **Step 4: Tambah flag `--format <short|landscape>` di `cek-frame.mjs`.** Muat naskah dengan `loadScript(slug)`, timpa `format`, lalu buka lewat `bukaKomposisi(slug, {script: {...script, format}})`. Nama file keluaran diberi akhiran `-landscape` supaya tidak menimpa hasil short.

- [ ] **Step 5: Pratinjau landscape dari tiga patokan + diagram bata**
Run: `node scripts/cek-frame.mjs nasi-warm --format landscape --rapat` (ulangi untuk `potongan-gaji`, `kabel-kendor`, `bata-zigzag`)
Expected: buka `out/cek/<slug>-landscape-lembar.jpg`: judul hook satu baris dan tidak terpotong, banner stage/beat tidak menabrak watermark, diagram masuk layar di atas subtitle, subtitle tidak menutupi judul. Kalau diagram masih keluar layar, turunkan `PROFIL.landscape.diagram.skala` (0.7) dan ulangi. Angka akhir dicatat di commit.

- [ ] **Step 6: Thumbnail landscape**
Run: `npx remotion still NasiWarmThumb out/cek/nasi-warm-thumb-landscape.png --props='<script nasi-warm dengan format landscape>'`, atau dengan script node kecil memakai `bukaKomposisi('NasiWarmThumb', {script})` + `renderFrame(0, ...)`.
Expected: 1280×720, kedua baris judul terbaca dan tidak terpotong.

- [ ] **Step 7: Commit**
```bash
git add src/explainer scripts/cek-frame.mjs
git commit -m "feat(explainer): tata letak engine mengikuti profil format, pratinjau landscape"
```

### Task 3: Banner bab

**Files:**
- Create: `src/explainer/bab.ts` (logika murni), `src/explainer/BabBanner.tsx`
- Modify: `src/explainer/ExplainerVideo.tsx`
- Test: `tests/explainer/bab.test.mjs`

**Interfaces:**
- Consumes: `useProfil()` (Task 2), `explainerTheme.bannerBg/bannerText`.
- Produces: `nomorBab(scenes: {bab?: string}[], index: number): number | null` → nomor bab scene `index` (1-based, dihitung dari jumlah scene ber-`bab` sampai index itu), `null` kalau scene itu tidak punya `bab`. `tampilBanner(index: number, scene: {bab?: string}): boolean` → `index > 0 && Boolean(scene.bab)`.

- [ ] **Step 1: Test yang gagal:**
  - `nomorBab([{bab: 'A'}, {}, {bab: 'B'}, {bab: 'C'}], 2) === 2`, `(..., 3) === 3`, `(..., 1) === null`.
  - Scene 1 tanpa bab: `nomorBab([{}, {bab: 'A'}, {bab: 'B'}], 2) === 2`.
  - `tampilBanner(0, {bab: 'Pembuka'}) === false`; `tampilBanner(3, {bab: 'X'}) === true`; `tampilBanner(3, {}) === false`.
- [ ] **Step 2:** `node --test tests/explainer/bab.test.mjs` → FAIL.
- [ ] **Step 3: Implementasi `bab.ts`**, lalu `BabBanner` ({nomor, judul}): teks `BAB {nomor} · {JUDUL}` uppercase, posisi `profil.bab`, `zIndex: 45`, masuk spring dari kanan di frame 0-12, tampil sampai frame 90, fade out di frame 78-90. Pasang di `renderExplainerScene` saat `tampilBanner(i, scene)`.
- [ ] **Step 4:** test PASS, `npm run typecheck` 0 error, dan `npm run uji -- NasiWarm AirKadaluwarsa` 0 beda (video short tidak punya `bab`).
- [ ] **Step 5: Commit** `feat(explainer): banner bab untuk video long`.

### Task 4: Validator, geometri dan aturan per format

**Files:**
- Modify: `scripts/lib/explainer-cek/kotak.mjs`, `scripts/lib/explainer-cek/layout.mjs`, `scripts/lib/explainer-cek/visual.mjs` (V6), `scripts/lib/explainer-cek/narasi.mjs` (D3, N3), `scripts/lib/explainer-cek/hook.mjs` (H1), `scripts/lib/explainer-cek/komedi.mjs` (jumlah joke), `scripts/cek-explainer.mjs`
- Create: `scripts/lib/explainer-cek/bab.mjs`
- Test: `tests/explainer/validator-format.test.mjs`; test yang sudah ada tetap lulus tanpa diubah

**Interfaces:**
- Consumes: `profilNaskah`, `jokeMinimal` (Task 1), lewat `importTs('src/explainer/format.ts')` sekali di `validasiExplainer`.
- Produces:
  - `kotakItem(item, ukuran, gayaTeks = 'kotak', profil = PROFIL_SHORT)`: W/H dari `profil.kanvas`. `BATAS_AMAN` tetap diekspor (= area aman short) supaya test lama tetap lulus.
  - `cekZona(scene, where, lapor, ukuran, gayaTeks, profil)`: A1 memakai `profil.aman` (pesan "keluar area aman" tanpa kata "Shorts" untuk landscape), L1 memakai `profil.zonaJudul`, L2 memakai `profil.subtitleAtas`.
  - `detikScene(script, kataJson): number[]`: perkiraan per scene (logika `perkiraanDurasi` yang sekarang, per scene). `perkiraanDurasi` = jumlahnya.
  - `cekDurasi(script, kataJson, lapor, profil)`: D3 `> profil.durasi.max`; **D4** `< profil.durasi.min` → warn `D4 durasi N detik terlalu pendek untuk video long (minimal 180).` → PERBAIKI: `Tambah bab, atau pakai format short.`
  - `cekHook(script, kata, lapor, {legacy, profil})`: H1 memakai `profil.hookKata`.
  - `cekKomedi(..., profil)`: batas jumlah joke = `jokeMinimal(profil, perkiraanDurasi(script, kataJson))`.
  - N3 (`padahal`, `banyak yang ngira`): short per video; landscape dihitung per segmen bab (segmen baru mulai di scene yang punya `bab`), lokasi pesan `bab "<judul>"`.
  - `cekBab(script, kataJson, lapor, profil)`:
    - **C0** (short, ada scene ber-`bab`) → warn, PERBAIKI: `Hapus field bab; chapter hanya untuk format landscape.`
    - **C1** (landscape, scene 1 tanpa `bab`) → warn, PERBAIKI: `Isi bab di scene 1, contoh bab: 'Pembuka'.`
    - **C2** (landscape, kurang dari 3 bab) → warn.
    - **C3** (landscape, ada bab < 10 detik, dihitung dengan `detikScene`) → warn dengan nama babnya.
  - Cek koordinat lama `x 8..92, y 12..76` tetap khusus short (tidak diubah).

- [ ] **Step 1: Test yang gagal** di `validator-format.test.mjs` (pakai pola `naskah()`/`OPTS` dari `validator-kotak.test.mjs`, `legacy` mati):
  - Landscape: prop `x: 50, y: 50, width: 300`, gambar persegi → tidak ada A1/L1/L2. Prop yang sama di `y: 92` → ada `L2`.
  - Short naskah yang sama di `y: 50` → hasil A1/L2 sama dengan sebelum perubahan (bandingkan dengan `kotakItem` tanpa profil).
  - Narasi landscape ±100 kata (perkiraan < 180 detik) → ada `D4`; short dengan narasi yang sama → tidak ada `D4`.
  - Narasi short ±200 kata → ada `D3`; landscape ±500 kata → tidak ada `D3`.
  - Landscape dengan 2 bab → `C2`; scene 1 tanpa bab → `C1`; short dengan `bab` → `C0`.
  - C3 memakai kataJson: bab yang perkiraannya 4 detik, tetapi `kataJson` scene-nya berakhir di 12 detik → tidak ada `C3`.
  - Hook landscape 30 kata → tidak ada `H1`; hook short 30 kata → ada `H1`.
  - Landscape dengan "padahal" sekali di bab 1 dan sekali di bab 2 → tidak ada `N3`; dua kali dalam bab yang sama → ada `N3`.
- [ ] **Step 2:** `node --test tests/explainer/validator-format.test.mjs` → FAIL.
- [ ] **Step 3: Implementasi** sesuai Interfaces. `validasiExplainer` memuat profil sekali, lalu meneruskannya ke `cekZona`, V6 (`kotakItem` di `visual.mjs:183-184`), `cekDurasi`, `cekHook`, `cekKomedi`, dan `cekBab`.
- [ ] **Step 4: Seluruh suite**
Run: `node --test tests/explainer/` → Expected: semua PASS, termasuk `patokan.test.mjs`, `validator-kotak.test.mjs`, dan `stiker.test.mjs` tanpa perubahan.
- [ ] **Step 5: Commit** `feat(explainer): validator mengikuti format, aturan durasi dan bab untuk long`.

### Task 5: Kerangka `baru:explainer --long`

**Files:**
- Modify: `scripts/buat-explainer.mjs`, `scripts/lib/explainer-template.mjs`
- Test: `tests/explainer/template.test.mjs`

**Interfaces:**
- Produces: `npm run baru:explainer -- <slug> --long`; `templateRencana(title, {long = false} = {})`; `templateNaskah({slug, varName, title, long = false}): string`. Isinya template `.ts` yang sekarang ada inline di `buat-explainer.mjs` (baris ±44 dst.), dipindah ke `explainer-template.mjs` supaya bisa dites tanpa menulis file.

Kerangka long: `format: 'landscape'`; scenes = hook (`bab: 'Pembuka'`) → beat → 3 stage `bab: 'TODO Judul bab N'` → stage `bab: 'Kesimpulan'`, masing-masing dengan `latar` unik. Rencana long menambah bagian `## Bab` (`| # | Judul bab | Scene | Pertanyaan yang dijawab |`, 4 baris TODO) sebelum `## Narasi`, dan tabel Komedi berisi 4 baris TODO. Tanpa `--long`, keluarannya sama persis dengan sekarang.

- [ ] **Step 1: Test yang gagal** di `template.test.mjs`:
  - `templateRencana('X', {long: true})` memuat `## Bab`, dan `bacaTabelHook` tetap menemukan 5 kandidat; `templateRencana('X')` tidak memuat `## Bab`.
  - `templateNaskah({slug: 'uji', varName: 'uji', title: 'Uji', long: true})` memuat `format: 'landscape'` dan tepat 5 kemunculan `bab: '`.
  - `templateNaskah({slug: 'uji', varName: 'uji', title: 'Uji'})` sama persis dengan template inline yang lama (salin string lama ke test sebagai acuan sebelum dipindah), memuat `format: 'short'`, dan tidak memuat `bab:`.
- [ ] **Step 2:** FAIL → **Step 3:** implementasi (pindahkan template, `buat-explainer.mjs` membaca flag `--long` lalu memanggil `templateNaskah` dan `templateRencana`) → **Step 4:** `node --test tests/explainer/template.test.mjs` PASS.
- [ ] **Step 5: Commit** `feat(explainer): kerangka baru:explainer --long`.

### Task 6: Skill video-explainer untuk long

**Files:**
- Modify: `.claude/skills/video-explainer/SKILL.md`, `.claude/skills/video-explainer/referensi/visual.md`
- Create: `.claude/skills/video-explainer/referensi/long.md`

Isi yang dikunci:
- **SKILL.md**
  - `description`: "9:16" → "9:16 (short) atau 16:9 long (3-12 menit, chapter)".
  - Bagian baru `## Pilih Format` sebelum Aturan Keras: default short. Long dipilih kalau user minta long/YouTube biasa/landscape, atau materinya butuh lebih dari 60 detik. Long → baca `referensi/long.md` dan pakai `npm run baru:explainer -- <slug> --long`.
  - Aturan Keras 6 dipecah per format. Short: angka yang ada sekarang. Landscape: kiri ≥ 3%, kanan ≤ 97%, atas ≥ 5%, bawah ≤ 95%; tepi atas hook ≥ 34%, stage berjudul ≥ 16%, beat ≥ 18%; tepi bawah ≤ 85%; `width` prop utama 320-480, pendamping 220-320, simbol 100-180.
  - Langkah 3: jumlah scene short 5-7, long 15-40 dibagi 3-6 bab.
  - Langkah 7: tambahkan `node scripts/cek-frame.mjs <slug> --format landscape` hanya untuk pratinjau.
  - Definisi Selesai: durasi short ≤ 60 detik (D3), long 180-720 detik (D3/D4), long tanpa peringatan C1-C3.
  - Bagian "Video Patokan" **tidak diubah**: tabelnya dijaga `patokan.test.mjs`. Cukup tambah satu kalimat di bawahnya: belum ada patokan long, jadi ikuti `referensi/long.md`.
- **referensi/long.md** (baru): struktur (cold open hook 15-20 detik dengan aturan H6 → janji isi video → beat "Oke, sini gue jelasin." sekali → 3-6 bab, setiap bab mini-explainer: pertanyaan → salah kaprah → fakta → joke → recap 1 kalimat → kesimpulan + CTA). Aturan bab (`bab` di scene pertama tiap bab, scene 1 = `'Pembuka'`, minimal 3 bab, tiap bab ≥ 10 detik, judul bab ≤ 30 huruf, tampil sebagai chapter YouTube lewat `paket-youtube`). Ritme (joke ±1 per menit, maks 1 "padahal" per bab, ganti latar tiap scene). Tata letak 16:9 (dua keadaan kiri-kanan di x 25/75, ruang tengah 17-85%, subtitle di bawah). TTS (narasi panjang dipotong per scene oleh `potong-narasi`, jeda antar-scene di TTS harus jelas lebih panjang daripada jeda antar-kalimat, minimal 1,3× sesuai cek di script itu).
- **referensi/visual.md**: subbagian "Tata letak landscape" berisi angka yang sama dengan Aturan Keras 6 landscape, plus posisi banner bab dan watermark.

- [ ] **Step 1: Tulis ketiga file.**
- [ ] **Step 2:** `node --test tests/explainer/patokan.test.mjs` → PASS (tabel patokan tetap 3 slug).
- [ ] **Step 3: Cocokkan angka.** Setiap angka landscape di SKILL.md dan visual.md harus sama dengan `PROFIL.landscape` (zonaJudul, subtitleAtas, aman, durasi).
- [ ] **Step 4: Commit** `docs(skill): video-explainer mendukung format long 16:9`.

### Task 7: Verifikasi akhir

- [ ] **Step 1:** `node --test tests/explainer/` → semua PASS.
- [ ] **Step 2:** `npm run typecheck` → 0 error.
- [ ] **Step 3:** `npm run uji -- NasiWarm PotonganGaji KabelKendor AirKadaluwarsa BataZigzag KlipRoti` → 0 beda, durasi sama.
- [ ] **Step 4: Uji asap kerangka long.** `npm run baru:explainer -- uji-long --long`, lalu `npm run cek:explainer -- uji-long`. Expected: hanya muncul error/peringatan TODO, rencana, file latar/prop yang belum ada, dan D4. **Tidak ada C0-C3**, karena kerangka sudah benar strukturnya. Setelah itu hapus file `uji-long` dan entrinya di `daftar.ts` (`git checkout -- src/explainer/daftar.ts` dan hapus `src/explainer/data/uji-long.*`).
- [ ] **Step 5:** Pratinjau landscape `kabel-kendor` dengan `--rapat` sekali lagi, lalu lampirkan lembarnya ke laporan.

---

## Di Luar Plan Ini

- Video long pertama (riset, narasi 3-12 menit, props Flow, audio TTS dari user, render). Mulai setelah plan ini selesai, lewat skill `video-explainer` dengan `--long`, lalu jadikan patokan long.
- Short 9:16 yang lebih dari 60 detik.
