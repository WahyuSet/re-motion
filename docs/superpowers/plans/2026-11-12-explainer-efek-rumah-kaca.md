# Explainer "Efek Rumah Kaca" Remake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merombak (remake) video explainer Shorts `efek-rumah-kaca` (1080×1920) agar mencapai standar visual sempurna (grade A+): hook stop-scroll 10 kata (0 warning), eliminasi foto kotak berbingkai polaroid menjadi cutout studio Flow Bridge, pembersihan meme watermark, dan penataan timing anti-overcrowding.

**Architecture:** Modifikasi file data `src/explainer/data/efek-rumah-kaca.ts` dan `efek-rumah-kaca.props.json`. Generate 2 cutout studio baru via Flow Bridge (`erk-greenhouse`, `erk-pabrik`). Engine inti tidak disentuh.

**Tech Stack:** Remotion 4, TypeScript, Flow Bridge (`scripts/generate-props.mjs`), faster-whisper, ffmpeg.

---

## Global Constraints

- Hanya mengubah `src/explainer/data/efek-rumah-kaca.*`, `public/props/erk-*.png`.
- Format `short`, 1080×1920, `watermark: false`.
- Hook Scene 1 wajib 1 kalimat padat (8–14 kata) bebas warning.
- Zero Foto Kotak Berbingkai: Seluruh foto polaroid digantikan studio cutout transparan.
- Zero Watermark: Ganti `meme-kucing-think.png` dengan meme kucing bersih (`meme-kucing-sinis` atau `meme-kucing-merenung`).
- Zero Overcrowding: Maksimal 2–3 item non-sentral aktif di layar. Transisi sekuensial memakai `sampai: X` / `di: X`.
- Safe area Shorts $x: 8..92\%$, $y: 12..76\%$.

---

### Task 1: Generate Prop Cutout Baru via Flow Bridge

**Files:**
- Modify: `src/explainer/data/efek-rumah-kaca.props.json`
- Create (generated): `public/props/erk-greenhouse.png`, `public/props/erk-pabrik.png`

- [ ] **Step 1:** Tambahkan definisi prompt studio cutout di `src/explainer/data/efek-rumah-kaca.props.json`:
  - `erk-greenhouse`: *"clean realistic studio product photography cutout of a small traditional glass greenhouse building with green lush plants and vegetables inside, glass panes, crisp edges, natural colors, soft studio lighting, high detail"*
  - `erk-pabrik`: *"clean realistic studio product photography cutout of a modern industrial chemical plant complex with tall smokestacks emitting dark smoke, crisp edges, natural colors, soft studio lighting, high detail"*
- [ ] **Step 2:** Generate via Flow Bridge:
  ```bash
  node scripts/generate-props.mjs --name erk-greenhouse --prompt "clean realistic studio product photography cutout of a small traditional glass greenhouse building with green lush plants inside, glass panes, crisp edges, natural colors, soft studio lighting, high detail"
  node scripts/generate-props.mjs --name erk-pabrik --prompt "clean realistic studio product photography cutout of an industrial chemical plant factory with smokestacks emitting smoke, crisp edges, natural colors, soft studio lighting, high detail"
  ```
- [ ] **Step 3:** Verifikasi kedua PNG cutout bersih dengan `read_file`.

---

### Task 2: Koreografi Panggung, Naskah Padat, & Anti-Overcrowding

**Files:**
- Modify: `src/explainer/data/efek-rumah-kaca.ts`
- Modify: `narasi/efek-rumah-kaca/naskah-full.txt`

- [ ] **Step 1:** Ringkas Hook Scene 1:
  `Dengar istilah efek rumah kaca, kok *gedung kaca* perkotaan yang dituduh?` (10 kata).
  Items: Gedung kaca di kiri (`erk-gedung-kaca.png`), kucing paw di kanan (`meme-kucing-paw.png`), simbol larang + badge merah `SALAH TUDUH!`.
- [ ] **Step 2:** Scene 2 (Greenhouse Pertanian):
  Ganti foto polaroid kotak dengan cutout `props/erk-greenhouse.png` berdampingan dengan badge hijau `GREENHOUSE TANAMAN 🌱`.
- [ ] **Step 3:** Scene 5 (Penataan 3 Fase Bersih):
  - Fase 1: Pabrik `props/erk-pabrik.png` di kiri + cerobong asap di kanan + badge `EMISI CO₂ NUMPUK!` (`sampai: 'Ibarat'`).
  - Fase 2: Kucing merenung/sinis (tanpa watermark) di kanan + badge `5 LAPIS BEDCOVER SIANG BOLONG 🥵` (`sampai: 'jelas'`).
  - Fase 3: Bumi kepanasan (`props/erk-bumi-kepanasan.png`) di kiri + termometer di kanan + badge `BUMI KEPANASAN!`.
- [ ] **Step 4:** Uji validasi:
  ```bash
  npm run cek:explainer -- efek-rumah-kaca
  ```
  Pastikan **0 error dan 0 peringatan**.
- [ ] **Step 5:** Git commit pembaruan skrip dan aset.

---

### Task 3: Inspeksi Lembar Kontak & Render Final

**Files:**
- Create: `out/cek/efek-rumah-kaca-lembar.jpg`
- Create: `out/efek-rumah-kaca.mp4`
- Create: `out/efek-rumah-kaca-720p.mp4`
- Create: `out/youtube/efek-rumah-kaca/*`

- [ ] **Step 1:** Render lembar kontak:
  ```bash
  node scripts/cek-frame.mjs efek-rumah-kaca
  ```
- [ ] **Step 2:** Inspeksi `out/cek/efek-rumah-kaca-lembar.jpg` dengan `read_file` untuk memverifikasi kebersihan frame 35% dan 85%.
- [ ] **Step 3:** Render video final 1080p + versi kirim 720p (-14 LUFS):
  ```bash
  node scripts/render.mjs efek-rumah-kaca --final
  ```
- [ ] **Step 4:** Generate paket YouTube terbaru:
  ```bash
  node scripts/paket-youtube.mjs efek-rumah-kaca
  ```
- [ ] **Step 5:** Laporkan hasil output lengkap dan sajikan lembar kontak kepada user.
