# Desain Engine Explainer (`@NahhJadi` Style) di `src/explainer/`

## 1. Tujuan & Latar Belakang (Intent & Why)

Channel ingin membuat video pendek vertikal (9:16, YouTube Shorts / TikTok / Reels) bergaya **Cutout Motion Explainer** seperti referensi `@NahhJadi` (*"Sawit Bukan Pohon Hutan"* dan *"Kenapa Bata Harus Zig Zag"*), dimulai dengan topik pertama **"Token Listrik"**.

Prinsip utama yang diminta user:
1. **Satu repo / satu dapur (`d:\Learning\remotion`)**, memanfaatkan pipeline audio TTS + faster-whisper (`kata.json`), generator cutout PNG (`generate-props.mjs`), dan script render yang sudah ada.
2. **100% tidak menyentuh atau merusak engine sejarah**: semua komponen, scene, tipe data, dan tampilan video sejarah yang sudah ada tidak boleh berubah (`npm run uji` wajib tetap 0 pixel beda).
3. **Pembuatan video baru tanpa ubah kode engine**: setelah engine `src/explainer/` selesai dibangun, membuat video baru (seperti *Token Listrik*) cukup dengan mengedit file data naskah `src/explainer/data/<slug>.ts` dan `.props.json`.

---

## 2. Goals, Non-Goals, dan Anti-Goals

### Goals
- Menyediakan engine mandiri di `src/explainer/` untuk video pendek vertikal 9:16 (default `1080×1920`, 30 fps) dengan estetika kanvas krem polos (`#ddd5b8`), watermark tengah tipis, dan subtitle gelap 1 baris per frasa di bawah.
- Menyediakan **4 jenis scene deklaratif** (`hook`, `beat`, `stage`, `diagram`) yang mampu mereproduksi seluruh pola visual video referensi `@NahhJadi` hanya dari konfigurasi data `.ts`.
- Mendukung siklus hidup objek (`StageItem`) yang terikat ke kata narasi (`di` untuk masuk, `sampai` untuk keluar, dan `aksi` berantai untuk pindah, tumbuh, ngintip, getar, redup, atau berkedip) serta tumpukan layer (`zIndex`).
- Menyediakan simulasi visual deklaratif (`DiagramScene`) untuk dua pola penjelasan teknis:
  1. `potongan` (rincian pemotongan/konversi nilai bertahap, seperti Rp100.000 token listrik dipotong admin & PPJ lalu dibagi tarif per kWh).
  2. `grid-bata` (susunan bata zig-zag vs sejajar dengan simulasi distribusi beban segitiga otomatis seperti video referensi kedua).
- Menyediakan CLI pembantu (`buat-explainer.mjs`, `cek-explainer.mjs`) dan mengintegrasikan pembaca naskah (`scripts/lib/load-script.mjs`) agar pipeline `narasi`, `potong-narasi`, `generate-props`, `cek-frame`, `storyboard`, `render`, dan `paket-youtube` langsung bisa dipakai untuk slug explainer.
- Menyertakan naskah awal siap pakai `src/explainer/data/token-listrik.ts` (+ `.props.json` & `.sumber.md`) yang lulus validasi dan typecheck.

### Non-Goals
- Tidak mengubah atau memigrasikan video sejarah (`src/data/*`) ke engine explainer.
- Tidak membangun editor GUI drag-and-drop; semua naskah tetap ditulis sebagai file TypeScript deklaratif.
- Tidak membutuhkan engine fisika 2D eksternal (seperti Matter.js); semua gerakan (jatuh, membal, getar, aliran air, pembagian beban) dihitung secara deterministik berdasarkan `useCurrentFrame()` Remotion.

### Anti-Goals (Hal yang membuat proyek ini dianggap gagal walau jalan)
- Mengubah tampilan atau durasi video sejarah yang sudah ada walau hanya 1 pixel (`npm run uji` gagal).
- Mengharuskan user membuat komponen `.tsx` baru setiap kali ingin membuat video topik baru.
- Animasi yang bergerak sendiri tanpa terikat ke kata yang sedang diucapkan narator (`kata.json`).

---

## 3. Batasan Teknis (Constraints)

1. **Isolasi File Engine Sejarah**:
   - File berikut **dilarang diubah**: `src/HistoryVideo.tsx`, `src/Thumbnail.tsx`, `src/theme.ts`, `src/types.ts`, `src/scenes/*`, `src/components/*`, `src/data/daftar.ts`.
   - File eksisting yang boleh disentuh hanya:
     - `src/Root.tsx` (menambahkan render `<Composition>` & `<Still>` untuk `daftarExplainer` dari `src/explainer/daftar.ts`).
     - `scripts/lib/load-script.mjs` (mencari naskah di `src/data/<slug>.ts`, lalu fallback ke `src/explainer/data/<slug>.ts`).
     - `scripts/lib/komposisi.mjs` & `scripts/storyboard.mjs` (agar scene explainer tanpa `shots` tetap menghasilkan titik cuplikan storyboard berdasarkan item/aksi di dalam scene).
     - `package.json` (menambahkan script npm `baru:explainer` dan `cek:explainer`).
2. **Tanpa Dependency Baru**:
   - Hanya memakai paket yang sudah terpasang di `package.json` (`remotion`, `@remotion/transitions`, `@remotion/google-fonts`, `react`, `sharp`, `esbuild`, `mediabunny`).
3. **Deterministik di Remotion**:
   - Semua animasi di `src/explainer/` wajib murni fungsi dari `useCurrentFrame()` dan `useVideoConfig()` (tanpa `Math.random()` atau `setTimeout`).

---

## 4. Arsitektur & Spesifikasi Komponen `src/explainer/`

### 4.1 Struktur Folder Baru
```text
src/explainer/
  theme.ts              # Palet warna krem (#ddd5b8), tinta (#1d1812), aksen, & font Inter
  types.ts              # Definisi tipe ExplainerScript, Scene (hook, beat, stage, diagram), StageItem, StageAction
  ExplainerVideo.tsx    # Komponen utama komposisi Remotion (kanvas, transisi, audio narasi, ducking musik, SFX, watermark, subtitle)
  ExplainerThumb.tsx    # Komponen Still cover 1080×1920 (kotak hitam 2 baris + prop utama di atas kanvas krem)
  Subtitle.tsx          # Subtitle bawah 1 baris per frasa (4–6 kata), teks gelap, kata *bintang* berwarna aksen
  Stage.tsx             # Renderer StageItem (prop PNG, teks inline, simbol SVG) dengan lifecycle di/sampai, zIndex, & aksi berantai
  scenes/
    HookScene.tsx       # Banner 2 baris kotak hitam tebal di atas + prop utama di tengah
    BeatScene.tsx       # Layar bersih + 1 kata punchline besar di tengah
    StageScene.tsx      # Panggung kolase cutout + judul/label opsional
    DiagramScene.tsx    # Simulasi deklaratif: mode 'potongan' (Token Listrik) & mode 'grid-bata' (Batu Bata Zig-Zag)
  daftar.ts             # Daftar komposisi video explainer
  data/
    token-listrik.ts          # Naskah topik pertama: Token Listrik
    token-listrik.props.json  # Daftar prompt props untuk generate-props.mjs
    token-listrik.sumber.md   # Catatan sumber fakta tarif/PPJ/biaya admin token listrik
scripts/
  buat-explainer.mjs    # Generator template video explainer baru + registrasi ke src/explainer/daftar.ts
  cek-explainer.mjs     # Validator naskah explainer (kata di/sampai, file prop, area aman, TODO, kata.json)
```

### 4.2 Kanvas, Tema, Watermark, dan Subtitle (`theme.ts`, `ExplainerVideo.tsx`, `Subtitle.tsx`)
- **Ukuran**: Default `format: 'short'` (`1080×1920`, 30 fps). Mendukung `format: 'landscape'` (`1920×1080`).
- **Warna (`explainerTheme`)**:
  - `bg`: `'#ddd5b8'` (krem hangat seperti `@NahhJadi`; bisa di-override per naskah lewat `bg?: string`)
  - `ink`: `'#1d1812'` (hitam kecokelatan untuk teks dan subtitle)
  - `bannerBg`: `'#0d0d0d'`, `bannerText`: `'#ffffff'`
  - `accent`: `'#1976d2'` (biru untuk highlight kata `*bintang*` di subtitle)
  - `red`: `'#d93829'` (untuk simbol larangan `🚫`, silang, panah, dan potongan pengurang)
  - `green`: `'#2e7d32'` (untuk simbol centang dan hasil akhir positif)
- **Watermark Tengah**:
  - Teks `@jejakala` (atau `script.watermark` / `CHANNEL.nama`) dirender tepat di tengah kanvas (`left: 50%, top: 50%`) dengan `opacity: 0.09`, `fontSize: 34`, `fontWeight: 700`, `pointerEvents: 'none'`, di bawah layer objek (`zIndex: 1`).
- **Subtitle Frasa (`Subtitle.tsx`)**:
  - Mengambil `TimedWord[]` dari `sceneWords(scene, fps)`.
  - Mengelompokkan kata menjadi potongan frasa pendek (maksimal 5 kata atau 34 karakter per potongan, otomatis putus di tanda baca `,.;:!?`).
  - Hanya potongan frasa yang sedang aktif pada `frame` saat ini yang ditampilkan di bagian bawah (`bottom: 430px` pada mode short agar aman dari UI Shorts/TikTok; `bottom: 90px` pada landscape).
  - Tampilan: `fontSize: 40` (short) / `36` (landscape), `fontWeight: 700`, warna `ink` (`#1d1812`), rata tengah. Kata yang ditandai `*bintang*` di `narasi` ditampilkan dengan warna `accent` (atau `scene.accentColor`).

### 4.3 Sistem Panggung & Objek (`Stage.tsx` & `types.ts`)
Setiap `StageItem` merepresentasikan satu elemen visual di panggung:
- **Jenis (`kind`)**:
  1. `'prop'` (default bila ada `src`): gambar PNG transparan (`public/props/...`) atau foto (`public/photos/...`). Opsional `bingkai?: boolean` (memberi border tipis apabila menampilkan foto kotak seperti foto bangunan di referensi kedua).
  2. `'teks'`: teks/angka/rumus yang menempel di panggung (contoh: `"x 19.000.000"`, `"≠ pohon"`, `"*100kg"`, `"Rp100.000"`). Properti: `teks: string`, `ukuran?: number` (default `56`), `warna?: string`, `kotak?: string` (warna latar kotak jika ingin tampil seperti blok label).
  3. `'simbol'`: grafis vektor bawaan (`simbol: 'larang' | 'centang' | 'panah' | 'retak' | 'tetes-air' | 'gelombang-air'`).
     - `'larang'`: lingkaran merah dengan garis miring (`🚫`).
     - `'centang'`: tanda centang hijau tebal.
     - `'panah'`: panah tebal menunjuk ke sudut `rotate` derajat.
     - `'retak'`: garis-garis retakan bercabang hitam yang tergambar (`strokeDashoffset`) di atas objek.
     - `'tetes-air'`: 1 atau 3 tetesan air biru (`💧`) siap digerakkan turun dengan aksi `'move'`.
     - `'gelombang-air'`: gelombang air biru bergoyang di permukaan tanah.
- **Koordinat & Tumpukan**:
  - `x: number`, `y: number` dalam persen kanvas (`0..100`). Area panggung aman untuk short adalah `x: 10..90`, `y: 16..72` (tengah panggung = `x: 50, y: 45`).
  - `width?: number` (lebar dalam px, default `360` untuk prop, `180` untuk simbol).
  - `rotate?: number` (derajat, default `0`).
  - `zIndex?: number` (default `10`). Memungkinkan karakter mengintip dari *belakang* batang pohon (`zIndex: 5` di belakang `zIndex: 10`) dan simbol `🚫` berada di *depan* objek (`zIndex: 20`).
  - `float?: boolean` (default `false` di explainer agar objek seperti tembok/pohon tegak diam kecuali diberi aksi).
- **Waktu Muncul & Hilang (Sinkron Kata)**:
  - `di?: string` / `delay?: number`: frame mulai muncul (`frameOfWord(words, di)`).
  - `sampai?: string` / `endFrame?: number`: frame mulai keluar (`frameOfWord(words, sampai)`).
  - `masuk?: 'pop' | 'drop' | 'slide-left' | 'slide-right' | 'slide-up' | 'grow-up' | 'fade' | 'none'` (default `'pop'`).
    - `'grow-up'`: tumbuh dari bawah ke atas (`scaleY(0 -> 1)` dengan `transformOrigin: '50% 100%'`), cocok untuk batang pohon yang tumbuh tinggi atau tumpukan yang naik.
  - `keluar?: 'fade' | 'pop-out' | 'slide-left' | 'slide-right' | 'slide-down' | 'none'` (default `'fade'`, durasi 10 frame).
- **Aksi Berantai (`aksi?: StageAction[]`)**:
  Daftar perubahan yang terjadi pada objek setelah objek tampil di panggung, masing-masing dipicu oleh `di?: string` (atau `delay?: number` sejak awal scene) dengan `durasi?: number` (default `18` frame):
  - `{type: 'move', di?: string, toX?: number, toY?: number, toScale?: number, toRotate?: number, durasi?: number}`: menggeser posisi/ukuran/rotasi secara mulus (`Easing.inOut(Easing.quad)`). Beberapa `'move'` berurutan bekerja kumulatif.
  - `{type: 'peek', di?: string, dx?: number, dy?: number, rotate?: number, tahan?: number, durasi?: number}`: bergeser keluar sejauh `(dx, dy)` persen + miring `rotate` derajat, bertahan selama `tahan` frame (default `35`), lalu masuk kembali ke posisi asal (cocok untuk meme orang ngintip dari balik objek).
  - `{type: 'grow', di?: string, toScaleX?: number, toScaleY?: number, durasi?: number}`: memanjangkan/membesarkan objek dari titik tumpu bawah.
  - `{type: 'dim', di?: string, toOpacity?: number, durasi?: number}`: meredupkan objek ke `toOpacity` (default `0.25`).
  - `{type: 'shake', di?: string, intensitas?: number, durasi?: number}`: menggetarkan objek selama `durasi` frame (default `20` frame) + memicu SFX `'dum'`.
  - `{type: 'pulse', di?: string, sampai?: string}`: berdenyut membesar-mengecil halus berulang (cocok untuk lampu indikator meteran listrik berkedip / alarm).

### 4.4 Keempat Jenis Scene (`scenes/`)

1. **`HookScene` (`type: 'hook'`)**:
   - Menampilkan 1 atau 2 baris kotak hitam tebal di bagian atas (`y: 22%`), teks putih kapital (`baris1`, `baris2`).
   - Menampilkan `items: StageItem[]` di panggung tengah (prop utama muncul di frame 0 atau sesuai `di`).
2. **`BeatScene` (`type: 'beat'`)**:
   - Mengosongkan panggung dan menampilkan `teks: string` (maksimal 3 kata, contoh `"nah"`, `"jadi"`, `"he..."`) tepat di tengah kanvas (`50%, 46%`) dengan animasi `pop` + SFX `'pop'`.
3. **`StageScene` (`type: 'stage'`)**:
   - Menampilkan `judul?: string` opsional di bagian atas (`y: 18%`, teks gelap tebal atau kotak hitam) dan seluruh `items: StageItem[]` di panggung, lengkap dengan SFX `'pop'` saat tiap item masuk dan `'dum'` saat simbol `'larang'` atau aksi `'shake'` aktif.
4. **`DiagramScene` (`type: 'diagram'`)**:
   Mendukung 2 mode deklaratif ditambah `items?: StageItem[]` pendamping:
   - **Mode `'potongan'` (Rincian Potongan & Konversi Nilai — untuk Token Listrik)**:
     - Properti:
       - `awal: {label: string; nilai: string}` (contoh: `{label: 'Isi Token', nilai: 'Rp100.000'}`)
       - `langkah: {label: string; potong: string; sisa: string; di?: string; warna?: string}[]` (contoh: potongan Biaya Admin Bank & PPJ Daerah, muncul berurutan saat kata `di` diucapkan, mengiris/mengurangi bar visual dan menampilkan sisa rupiah)
       - `pembagi?: {label: string; nilai: string; di?: string}` (contoh: `{label: 'Tarif Listrik', nilai: '÷ Rp1.444,70 / kWh', di: 'tarif'}`)
       - `hasil: {label: string; nilai: string; di?: string}` (contoh: `{label: 'Dapat Listrik', nilai: '61,3 kWh', di: 'enam'}`)
   - **Mode `'grid-bata'` (Simulasi Tembok Bata Zig-Zag vs Sejajar — seperti referensi kedua)**:
     - Properti:
       - `pola: 'zigzag' | 'sejajar'`, `baris?: number` (default `6`), `kolom?: number` (default `5`), `x?: number` (default `50`), `y?: number` (default `48`), `width?: number` (default `680`).
       - `rakitDi?: string`: jika diisi, bata jatuh tersusun satu per satu mulai dari baris bawah.
       - `beban?: {nilai: number; satuan?: string; di?: string; angkaDi?: string}`:
         - Saat `di` diucapkan, bata yang tidak menerima distribusi beban meredup (`opacity: 0.25`).
         - Pada `pola: 'zigzag'`, beban `nilai` (misal `100`) di puncak tengah terbagi 50%/50% ke dua bata di bawahnya membentuk piramida segitiga Pascal (`100` -> `50 | 50` -> `25 | 50 | 25` -> `12.5 | 37.5 | 37.5 | 12.5`).
         - Pada `pola: 'sejajar'`, beban hanya turun lurus di 2 kolom tengah (`50 | 50` dari atas sampai bawah).
         - Saat `angkaDi` diucapkan, angka beban di setiap bata aktif muncul baris demi baris dari atas ke bawah.

---

## 5. Keputusan yang Diserahkan ke Builder (Left to the Builder)

- Detail kurva spring (`damping`, `mass`, `stiffness`) pada tiap jenis animasi `StageItem` selama konsisten dan responsif (6–14 frame).
- Tata letak internal SVG pada `DiagramScene` (`mode: 'potongan'` dan `mode: 'grid-bata'`) selama berada di dalam safe area vertikal `x: 10..90%, y: 18..72%`.
- Format laporan teks pada `scripts/cek-explainer.mjs` selama mengikuti konvensi `✓ LULUS` / `✗ ERROR` + `Perbaiki:` seperti `scripts/cek-naskah.mjs`.
