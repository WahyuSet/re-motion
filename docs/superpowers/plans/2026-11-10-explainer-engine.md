# Explainer Engine (`@NahhJadi` Style) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated, declarative Cutout Motion Explainer video engine in `src/explainer/` (with a starter `token-listrik` script and CLI tools) that shares the repo's audio/Whisper/render pipeline without modifying or breaking any existing history video components.

**Architecture:** A standalone `src/explainer/` module provides `ExplainerVideo`, `ExplainerThumb`, a word-synced `Stage` renderer (supporting `di`/`sampai` lifecycles, `zIndex` layering, and chained `aksi` animations), and four declarative scene types (`hook`, `beat`, `stage`, `diagram`). `src/Root.tsx` registers compositions from `src/explainer/daftar.ts` alongside `daftarVideo`, and `scripts/lib/load-script.mjs` resolves scripts from either `src/data/` or `src/explainer/data/` so all existing CLI tools work seamlessly while `npm run uji` remains 100% pixel-identical.

**Tech Stack:** Remotion 4.0, React 18, TypeScript 5, Node.js (`node:test`, `node:assert/strict`), `esbuild`, `sharp`.

**Spec:** [docs/superpowers/specs/2026-11-10-explainer-engine-design.md](file:///d:/Learning/remotion/docs/superpowers/specs/2026-11-10-explainer-engine-design.md)

## Global Constraints

- Do NOT modify any history engine files: `src/HistoryVideo.tsx`, `src/Thumbnail.tsx`, `src/theme.ts`, `src/types.ts`, `src/scenes/*`, `src/components/*`, `src/data/daftar.ts`.
- Only touch existing files listed in the spec: `src/Root.tsx`, `scripts/lib/load-script.mjs`, `scripts/lib/komposisi.mjs`, `scripts/storyboard.mjs`, `package.json`.
- Do NOT add any new npm dependencies to `package.json`.
- All animations must be pure deterministic functions of `useCurrentFrame()` and `useVideoConfig()` (no `Math.random()` or timers).
- Existing history videos must pass `npm run uji` with `0 pixel beda`.

## Review Focus

- **Repeated trigger words in `narasi` (`di` / `sampai` / `aksi.di`):** When the same word appears multiple times in `narasi`, `sampai` must search forward from the matched `di` word index (not from index 0), and chained `aksi` items must search forward sequentially so an item never exits or triggers before it enters. (Tested in Task 1)
- **Previewing a script before `kata.json` exists:** When `narasiAudio` is unset on a newly created script, `prepareExplainerScript` must still populate `scene.kata` via `spreadWords(scene.narasi, estimateSeconds(scene.narasi))` so word-synced `di`/`sampai` triggers and phrase subtitles work during `cek-frame` and Studio preview. (Tested in Task 2)
- **Single-row / empty-step edge cases in `DiagramScene`:** `hitungBebanBata` with `baris: 1` or `kolom: 1` and `hitungPotongan` with `langkah: []` must return valid finite numbers without `NaN` or division by zero. (Tested in Task 3)
- **Running `storyboard.mjs` and `cek-frame.mjs` on Explainer scenes without `shots`:** `waktuScene` in `scripts/lib/komposisi.mjs` and `scripts/storyboard.mjs` must synthesize virtual preview shots for scenes that lack `shots` (using the scene's `di` triggers or mid-scene frame) so `storyboard.mjs` renders snapshots instead of crashing or producing 0 frames. (Tested in Task 4)
- **Validator catching inverted `sampai < di` timing and unsafe mobile coordinates:** `scripts/cek-explainer.mjs` must reject scripts where `sampai` resolves to an earlier word than `di`, or where `StageItem` coordinates fall outside the vertical safe zone (`x: 8..92`, `y: 12..76`). (Tested in Task 5)

---

### Task 1: Explainer Types, Theme, & Word-Synced Stage Timing

**Files:**
- Create: `src/explainer/theme.ts`
- Create: `src/explainer/types.ts`
- Create: `src/explainer/timing.ts`
- Test: `tests/explainer/timing.test.mjs`

**Interfaces:**
- Consumes: `parseWords`, `sceneWords`, `indexOfWord`, `TimedWord`, `TRANSITION_FRAMES`, `transitionFrames` from `src/lib/kata.ts`; `WordTiming`, `YoutubeMeta` from `src/types.ts`
- Produces:
  - `src/explainer/theme.ts`: `explainerTheme` (`bg: '#ddd5b8'`, `ink: '#1d1812'`, `bannerBg: '#0d0d0d'`, `bannerText: '#ffffff'`, `accent: '#1976d2'`, `red: '#d93829'`, `green: '#2e7d32'`, `fontBody`, `fontMono`)
  - `src/explainer/types.ts`: `StageSymbolType`, `StageEnterType`, `StageExitType`, `StageAction`, `StageItem`, `HookScene`, `BeatScene`, `StageScene`, `DiagramPotonganStep`, `DiagramPotonganScene`, `DiagramBataScene`, `DiagramScene`, `ExplainerScene`, `ExplainerThumbData`, `ExplainerScript`
  - `src/explainer/timing.ts`:
    - `potongFrasa(words: TimedWord[], maxKata?: number, maxHuruf?: number): {mulai: number; selesai: number; kata: TimedWord[]}[]`
    - `waktuItem(item: StageItem, words: TimedWord[], duration: number): {masukAt: number; keluarAt: number; aksi: (StageAction & {at: number; endAt: number})[]}`
    - `hitungTransformItem(item: StageItem, frame: number, fps: number, words: TimedWord[], duration: number): {visible: boolean; x: number; y: number; scaleX: number; scaleY: number; rotate: number; opacity: number; shakeX: number}`

- [ ] **Step 1: Write the failing test in `tests/explainer/timing.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';

test('potongFrasa splits TimedWord[] by max words, max chars, and punctuation', async () => {
  const {potongFrasa} = await importTs('src/explainer/timing.ts');
  const words = [
    {word: 'Nah,', highlight: false, start: 8, end: 16},
    {word: 'kenapa', highlight: false, start: 18, end: 26},
    {word: 'isi', highlight: false, start: 27, end: 33},
    {word: 'token', highlight: true, start: 34, end: 42},
    {word: 'seratus', highlight: false, start: 43, end: 52},
    {word: 'ribu', highlight: false, start: 53, end: 60},
    {word: 'beda?', highlight: false, start: 61, end: 72},
  ];
  const frasa = potongFrasa(words, 5, 34);
  assert.equal(frasa.length, 2);
  assert.equal(frasa[0].kata.map((w) => w.word).join(' '), 'Nah,');
  assert.equal(frasa[1].kata.map((w) => w.word).join(' '), 'kenapa isi token seratus ribu');
});

test('waktuItem resolves repeated trigger words sequentially (sampai after di, aksi in order)', async () => {
  const {waktuItem} = await importTs('src/explainer/timing.ts');
  const words = [
    {word: 'token', highlight: false, start: 10, end: 20},
    {word: 'pertama', highlight: false, start: 22, end: 32},
    {word: 'lalu', highlight: false, start: 35, end: 45},
    {word: 'token', highlight: false, start: 50, end: 60},
    {word: 'kedua', highlight: false, start: 65, end: 75},
  ];
  const resolved = waktuItem(
    {
      kind: 'prop',
      src: 'props/meteran.png',
      x: 50,
      y: 45,
      di: 'token',
      sampai: 'token',
      aksi: [{type: 'move', di: 'lalu', toX: 30, toY: 45}],
    },
    words,
    120,
  );
  assert.equal(resolved.masukAt, 10);
  assert.equal(resolved.aksi[0].at, 35);
  assert.equal(resolved.keluarAt, 50);
});

test('hitungTransformItem applies grow-up, move, peek, and dim deterministically', async () => {
  const {hitungTransformItem} = await importTs('src/explainer/timing.ts');
  const words = [
    {word: 'mulai', highlight: false, start: 10, end: 18},
    {word: 'geser', highlight: false, start: 30, end: 38},
    {word: 'redup', highlight: false, start: 60, end: 68},
  ];
  const item = {
    kind: 'prop',
    src: 'props/batang.png',
    x: 50,
    y: 50,
    di: 'mulai',
    masuk: 'grow-up',
    aksi: [
      {type: 'move', di: 'geser', toX: 70, toY: 40, durasi: 10},
      {type: 'dim', di: 'redup', toOpacity: 0.25, durasi: 10},
    ],
  };
  const before = hitungTransformItem(item, 5, 30, words, 100);
  assert.equal(before.visible, false);

  const afterMove = hitungTransformItem(item, 45, 30, words, 100);
  assert.equal(afterMove.visible, true);
  assert.equal(afterMove.x, 70);
  assert.equal(afterMove.y, 40);
  assert.equal(afterMove.opacity, 1);

  const afterDim = hitungTransformItem(item, 75, 30, words, 100);
  assert.ok(Math.abs(afterDim.opacity - 0.25) < 0.01);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/explainer/timing.test.mjs`
Expected: FAIL with error resolving `src/explainer/timing.ts`

- [ ] **Step 3: Implement `src/explainer/theme.ts`, `src/explainer/types.ts`, and `src/explainer/timing.ts`**

Create `src/explainer/theme.ts` using `@remotion/google-fonts/Inter` and `@remotion/google-fonts/IBMPlexMono` with the palette values in the spec (`bg: '#ddd5b8'`, `ink: '#1d1812'`, `bannerBg: '#0d0d0d'`, `bannerText: '#ffffff'`, `accent: '#1976d2'`, `red: '#d93829'`, `green: '#2e7d32'`).
Create `src/explainer/types.ts` with all exported types from the spec.
Create `src/explainer/timing.ts` (pure TypeScript + `interpolate` / `spring` / `Easing` from `'remotion'`, or pure math so it runs cleanly under `importTs` in Node) implementing `potongFrasa`, `waktuItem` (searching `sampai` starting at `diIndex + 1`, and searching `aksi[k].di` sequentially from `diIndex`), and `hitungTransformItem`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/explainer/timing.test.mjs`
Expected: PASS (3 tests passing)

- [ ] **Step 5: Commit**

```bash
git add src/explainer/theme.ts src/explainer/types.ts src/explainer/timing.ts tests/explainer/timing.test.mjs
git commit -m "feat(explainer): add types, theme, and word-synced stage timing"
```

---

### Task 2: Core Explainer Components (`Subtitle`, `Stage`, `HookScene`, `BeatScene`, `StageScene`, `ExplainerThumb`, `ExplainerVideo`)

**Files:**
- Create: `src/explainer/Subtitle.tsx`
- Create: `src/explainer/Stage.tsx`
- Create: `src/explainer/scenes/HookScene.tsx`
- Create: `src/explainer/scenes/BeatScene.tsx`
- Create: `src/explainer/scenes/StageScene.tsx`
- Create: `src/explainer/ExplainerThumb.tsx`
- Create: `src/explainer/ExplainerVideo.tsx`
- Test: `tests/explainer/video-prep.test.mjs`

**Interfaces:**
- Consumes: `explainerTheme` from `src/explainer/theme.ts`; types from `src/explainer/types.ts`; `potongFrasa`, `waktuItem`, `hitungTransformItem` from `src/explainer/timing.ts`; `sceneWords`, `TRANSITION_FRAMES`, `transitionFrames`, `rentangSuara`, `volumeMusik`, `estimateSeconds`, `spreadWords`, `narasiDuration`, `NARASI_DELAY` from `src/lib/kata.ts`; `Sfx`, `SfxContext` from `src/components/Sfx.tsx`
- Produces:
  - `src/explainer/Subtitle.tsx`: `ExplainerSubtitle: React.FC<{words: TimedWord[]; accentColor?: string}>`
  - `src/explainer/Stage.tsx`: `Stage: React.FC<{items?: StageItem[]; words: TimedWord[]; duration: number}>`
  - `src/explainer/scenes/HookScene.tsx`: `HookSceneView: React.FC<{scene: HookScene; words: TimedWord[]}>`
  - `src/explainer/scenes/BeatScene.tsx`: `BeatSceneView: React.FC<{scene: BeatScene; words: TimedWord[]}>`
  - `src/explainer/scenes/StageScene.tsx`: `StageSceneView: React.FC<{scene: StageScene; words: TimedWord[]}>`
  - `src/explainer/ExplainerThumb.tsx`: `ExplainerThumb: React.FC<{script: ExplainerScript}>`
  - `src/explainer/ExplainerVideo.tsx`:
    - `getExplainerDuration(script: ExplainerScript): number`
    - `prepareExplainerScript(script: ExplainerScript, fps: number): Promise<ExplainerScript>`
    - `ExplainerVideo: React.FC<{script: ExplainerScript}>`

- [ ] **Step 1: Write the failing test in `tests/explainer/video-prep.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';

test('prepareExplainerScript populates estimated word timings and duration when narasiAudio is unset', async () => {
  const {prepareExplainerScript, getExplainerDuration} = await importTs('src/explainer/prep.ts');
  const raw = {
    format: 'short',
    scenes: [
      {
        type: 'hook',
        duration: 60,
        baris1: 'ISI TOKEN 100 RIBU',
        baris2: 'KOK KWH BEDA?',
        narasi: 'Pernah bingung nggak kenapa isi *token listrik* seratus ribu dapatnya beda?',
        items: [],
      },
      {
        type: 'beat',
        duration: 30,
        teks: 'nah',
        narasi: 'Nah gini alasannya.',
      },
    ],
  };
  const prepared = await prepareExplainerScript(raw, 30);
  assert.ok(Array.isArray(prepared.scenes[0].kata));
  assert.equal(prepared.scenes[0].kata.length, 11);
  assert.ok(prepared.scenes[0].duration >= 60);
  assert.equal(
    getExplainerDuration(prepared),
    prepared.scenes[0].duration + prepared.scenes[1].duration,
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/explainer/video-prep.test.mjs`
Expected: FAIL with cannot resolve `src/explainer/prep.ts`

- [ ] **Step 3: Implement `src/explainer/prep.ts`, `Subtitle.tsx`, `Stage.tsx`, scenes (`HookScene.tsx`, `BeatScene.tsx`, `StageScene.tsx`), `ExplainerThumb.tsx`, and `ExplainerVideo.tsx`**

Put `getExplainerDuration` and `prepareExplainerScript` in `src/explainer/prep.ts` (re-exported by `ExplainerVideo.tsx`), defaulting `scene.transition` in explainer scripts to `'none'` unless specified.
In `Stage.tsx`, render `kind: 'prop'` (`<Img src={staticFile(item.src!)} />`), `kind: 'teks'`, and `kind: 'simbol'` (`'larang' | 'centang' | 'panah' | 'retak' | 'tetes-air' | 'gelombang-air'` as inline SVG), ordered by `zIndex ?? 10`, triggering `<Sfx name="pop" at={masukAt} />` on item entry and `<Sfx name="dum" at={...} />` on `'larang'` symbol or `'shake'` action.
In `ExplainerVideo.tsx`, temporarily render a placeholder for `case 'diagram':` until Task 3 is wired.

- [ ] **Step 4: Run test and typecheck to verify they pass**

Run: `node --test tests/explainer/video-prep.test.mjs && npx tsc --noEmit`
Expected: PASS and 0 TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add src/explainer/prep.ts src/explainer/Subtitle.tsx src/explainer/Stage.tsx src/explainer/scenes/HookScene.tsx src/explainer/scenes/BeatScene.tsx src/explainer/scenes/StageScene.tsx src/explainer/ExplainerThumb.tsx src/explainer/ExplainerVideo.tsx tests/explainer/video-prep.test.mjs
git commit -m "feat(explainer): add core stage, subtitle, hook, beat, and video components"
```

---

### Task 3: Declarative `DiagramScene` (`mode: 'potongan'` & `mode: 'grid-bata'`)

**Files:**
- Create: `src/explainer/scenes/DiagramScene.tsx`
- Modify: `src/explainer/ExplainerVideo.tsx`
- Test: `tests/explainer/diagram.test.mjs`

**Interfaces:**
- Consumes: `DiagramScene`, `DiagramPotonganScene`, `DiagramBataScene` from `src/explainer/types.ts`; `TimedWord`, `frameOfWord` from `src/lib/kata.ts`; `Stage` from `src/explainer/Stage.tsx`
- Produces:
  - `src/explainer/scenes/DiagramScene.tsx`:
    - `hitungBebanBata(pola: 'zigzag' | 'sejajar', baris: number, kolom: number, nilaiBeban: number): {row: number; col: number; xOffset: number; beban: number; aktif: boolean}[][]`
    - `hitungPotongan(awalNilai: string, langkah: {label: string; potong: string; sisa: string; di?: string}[], words: TimedWord[]): {label: string; potong: string; sisa: string; at: number; porsi: number}[]`
    - `DiagramSceneView: React.FC<{scene: DiagramScene; words: TimedWord[]}>`

- [ ] **Step 1: Write the failing test in `tests/explainer/diagram.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import {importTs} from '../../scripts/lib/load-script.mjs';

test('hitungBebanBata splits 100kg into Pascal triangle on zigzag vs straight columns on sejajar, and handles 1x1 edge case', async () => {
  const {hitungBebanBata} = await importTs('src/explainer/scenes/DiagramScene.tsx');

  const zigzag = hitungBebanBata('zigzag', 4, 5, 100);
  assert.equal(zigzag.length, 4);
  const r0 = zigzag[0].filter((b) => b.aktif).map((b) => b.beban);
  const r1 = zigzag[1].filter((b) => b.aktif).map((b) => b.beban);
  const r2 = zigzag[2].filter((b) => b.aktif).map((b) => b.beban);
  const r3 = zigzag[3].filter((b) => b.aktif).map((b) => b.beban);
  assert.deepEqual(r0, [100]);
  assert.deepEqual(r1, [50, 50]);
  assert.deepEqual(r2, [25, 50, 25]);
  assert.deepEqual(r3, [12.5, 37.5, 37.5, 12.5]);

  const sejajar = hitungBebanBata('sejajar', 4, 5, 100);
  for (const row of sejajar) {
    const aktif = row.filter((b) => b.aktif).map((b) => b.beban);
    assert.deepEqual(aktif, [50, 50]);
  }

  const single = hitungBebanBata('zigzag', 1, 1, 100);
  assert.equal(single[0][0].beban, 100);
  assert.ok(Number.isFinite(single[0][0].xOffset));
});

test('hitungPotongan resolves step trigger frames and handles empty langkah array without NaN', async () => {
  const {hitungPotongan} = await importTs('src/explainer/scenes/DiagramScene.tsx');
  const words = [
    {word: 'admin', highlight: false, start: 15, end: 22},
    {word: 'pajak', highlight: false, start: 40, end: 48},
  ];
  const steps = hitungPotongan(
    'Rp100.000',
    [
      {label: 'Biaya Admin', potong: '-Rp2.500', sisa: 'Rp97.500', di: 'admin'},
      {label: 'PPJ Daerah 10%', potong: '-Rp8.863', sisa: 'Rp88.637', di: 'pajak'},
    ],
    words,
  );
  assert.equal(steps.length, 2);
  assert.equal(steps[0].at, 15);
  assert.equal(steps[1].at, 40);
  assert.ok(steps[1].porsi < steps[0].porsi && steps[1].porsi > 0);

  const empty = hitungPotongan('Rp100.000', [], words);
  assert.deepEqual(empty, []);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/explainer/diagram.test.mjs`
Expected: FAIL with cannot resolve `src/explainer/scenes/DiagramScene.tsx`

- [ ] **Step 3: Implement `src/explainer/scenes/DiagramScene.tsx` and wire it in `src/explainer/ExplainerVideo.tsx`**

Implement `hitungBebanBata` and `hitungPotongan` as pure exported helpers in `src/explainer/scenes/DiagramScene.tsx`, and render both `'potongan'` (stacked visual bar + deduction cards + divider badge + final kWh highlight box + SFX `'tik'`/`'pop'`) and `'grid-bata'` (brick wall SVG/div grid with staggered or aligned rows, assembly drop animation, dimmed inactive bricks, and load weight labels per brick), plus `<Stage items={scene.items} ... />` overlay. Wire `case 'diagram':` in `src/explainer/ExplainerVideo.tsx`.

- [ ] **Step 4: Run test and typecheck to verify they pass**

Run: `node --test tests/explainer/diagram.test.mjs && npx tsc --noEmit`
Expected: PASS and 0 TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add src/explainer/scenes/DiagramScene.tsx src/explainer/ExplainerVideo.tsx tests/explainer/diagram.test.mjs
git commit -m "feat(explainer): add declarative DiagramScene for potongan and grid-bata"
```

---

### Task 4: Registry, `Root.tsx` Wiring, Starter Script `token-listrik`, & Shared CLI Compatibility

**Files:**
- Create: `public/props/token-meteran.svg`
- Create: `public/props/token-struk.svg`
- Create: `public/props/token-lampu.svg`
- Create: `src/explainer/data/token-listrik.ts`
- Create: `src/explainer/data/token-listrik.props.json`
- Create: `src/explainer/data/token-listrik.sumber.md`
- Create: `src/explainer/daftar.ts`
- Modify: `src/Root.tsx`
- Modify: `scripts/lib/load-script.mjs`
- Modify: `scripts/lib/komposisi.mjs`
- Modify: `scripts/storyboard.mjs`
- Test: `tests/explainer/integration.test.mjs`

**Interfaces:**
- Consumes: `ExplainerVideo`, `getExplainerDuration`, `prepareExplainerScript` from `src/explainer/ExplainerVideo.tsx`; `ExplainerThumb` from `src/explainer/ExplainerThumb.tsx`
- Produces:
  - `src/explainer/daftar.ts`: `export const daftarExplainer: {id: string; script: ExplainerScript}[] = [{id: 'TokenListrik', script: tokenListrik}]`
  - `scripts/lib/load-script.mjs`: `loadScript(slug)` resolves `src/data/<slug>.ts` first, falling back to `src/explainer/data/<slug>.ts`
  - `scripts/lib/komposisi.mjs`: `waktuScene(composition)` returns virtual `shots` / `shotStarts` for explainer scenes that have no `scene.shots` (derived from `scene.items` / `scene.langkah` `di` triggers, or 1 mid-scene snapshot) so `cek-frame.mjs` and `storyboard.mjs` work out of the box

- [ ] **Step 1: Write the failing test in `tests/explainer/integration.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import {loadScript} from '../../scripts/lib/load-script.mjs';

test('loadScript loads both history slugs (borobudur) and explainer slugs (token-listrik)', async () => {
  const sejarah = await loadScript('borobudur');
  assert.ok(Array.isArray(sejarah.scenes) && sejarah.scenes.length > 0);

  const explainer = await loadScript('token-listrik');
  assert.equal(explainer.format, 'short');
  assert.ok(Array.isArray(explainer.scenes) && explainer.scenes.length >= 5);
  assert.equal(explainer.scenes[0].type, 'hook');
  assert.ok(explainer.scenes.some((s) => s.type === 'beat'));
  assert.ok(explainer.scenes.some((s) => s.type === 'stage'));
  assert.ok(explainer.scenes.some((s) => s.type === 'diagram' && s.mode === 'potongan'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/explainer/integration.test.mjs`
Expected: FAIL with cannot find `token-listrik.ts`

- [ ] **Step 3: Create `token-listrik` starter assets & script, `src/explainer/daftar.ts`, and update `src/Root.tsx`, `scripts/lib/load-script.mjs`, `scripts/lib/komposisi.mjs`, and `scripts/storyboard.mjs`**

1. Create clean SVG cutout props in `public/props/token-meteran.svg`, `public/props/token-struk.svg`, and `public/props/token-lampu.svg` so `token-listrik` renders immediately before AI props are generated, plus `src/explainer/data/token-listrik.props.json` and `src/explainer/data/token-listrik.sumber.md`.
2. Create `src/explainer/data/token-listrik.ts` covering:
   - Scene 1 (`hook`): `"ISI TOKEN 100 RIBU"` / `"KOK DAPETNYA BEDA?"` + meteran prop.
   - Scene 2 (`stage`): Struk Rp100.000 vs angka kWh di meteran + simbol `'larang'` (`≠ 100 kWh`).
   - Scene 3 (`beat`): `"nah"`.
   - Scene 4 (`diagram`, `mode: 'potongan'`): `Rp100.000` -> potongan Biaya Admin (`-Rp2.500`) -> potongan PPJ Daerah (`-Rp8.863`) -> dibagi Tarif Golongan R1 (`÷ Rp1.444,70/kWh`) -> hasil `61,3 kWh`.
   - Scene 5 (`stage`): kenapa tiap daerah bisa beda (PPJ tiap pemda 3% sampai 10% beda-beda) + meteran bunyi `pulse`/`shake`.
3. Register `TokenListrik` in `src/explainer/daftar.ts` and render `daftarExplainer` in `src/Root.tsx` using `ExplainerVideo` and `ExplainerThumb`.
4. Update `scripts/lib/load-script.mjs` to check `src/data/${slug}.ts` then `src/explainer/data/${slug}.ts`.
5. Update `scripts/lib/komposisi.mjs` and `scripts/storyboard.mjs` so when a scene has no `shots`/`photo` (explainer scene), `waktuScene` synthesizes 1–3 virtual shots from the scene's `items`/`langkah` triggers (`di`) so `storyboard.mjs` and `cek-frame.mjs` render snapshots cleanly.

- [ ] **Step 4: Run integration test, `cek-frame`, and `npm run uji` regression check**

Run: `node --test tests/explainer/integration.test.mjs && npx tsc --noEmit && node scripts/narasi.mjs token-listrik && npm run uji`
Expected: All tests PASS, `narasi/token-listrik/naskah-full.txt` created, and `npm run uji` reports `✓ LULUS` (`0 pixel beda` on all history compositions)

- [ ] **Step 5: Commit**

```bash
git add public/props/token-meteran.svg public/props/token-struk.svg public/props/token-lampu.svg src/explainer/data/token-listrik.ts src/explainer/data/token-listrik.props.json src/explainer/data/token-listrik.sumber.md src/explainer/daftar.ts src/Root.tsx scripts/lib/load-script.mjs scripts/lib/komposisi.mjs scripts/storyboard.mjs tests/explainer/integration.test.mjs
git commit -m "feat(explainer): wire Root, shared CLI scripts, and token-listrik starter script"
```

---

### Task 5: Explainer CLI Scaffolder & Validator (`buat-explainer.mjs`, `cek-explainer.mjs`)

**Files:**
- Create: `scripts/buat-explainer.mjs`
- Create: `scripts/cek-explainer.mjs`
- Modify: `package.json`
- Test: `tests/explainer/cli.test.mjs`

**Interfaces:**
- Consumes: `loadScript`, `importTs` from `scripts/lib/load-script.mjs`; `indexOfWord`, `parseWords` from `src/lib/kata.ts`
- Produces:
  - `scripts/buat-explainer.mjs <slug>`: creates `src/explainer/data/<slug>.ts`, `.props.json`, `.sumber.md`, and registers `<Id>` in `src/explainer/daftar.ts`
  - `scripts/cek-explainer.mjs <slug>` (exporting `validasiExplainer(script, slug)` for unit testing): validates scene count, `narasi` presence and numeric-digits lint, `di` and `sampai` word existence and ordering (`sampai` index > `di` index), `aksi.di` word existence, prop file existence in `public/`, safe area bounds (`x: 8..92, y: 12..76`), and `kata.json` word count match when `narasiAudio` is set
  - `package.json`: `"baru:explainer": "node scripts/buat-explainer.mjs"`, `"cek:explainer": "node scripts/cek-explainer.mjs"`

- [ ] **Step 1: Write the failing test in `tests/explainer/cli.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import {loadScript} from '../../scripts/lib/load-script.mjs';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

test('validasiExplainer passes on token-listrik starter script', async () => {
  const script = await loadScript('token-listrik');
  const {errors} = await validasiExplainer(script, 'token-listrik');
  assert.deepEqual(errors, []);
});

test('validasiExplainer catches inverted sampai < di, missing trigger word, and unsafe y coordinate', async () => {
  const badScript = {
    format: 'short',
    scenes: [
      {
        type: 'stage',
        duration: 60,
        narasi: 'Kata awal muncul lalu kata akhir menutup kalimat ini dengan jelas.',
        items: [
          {
            kind: 'prop',
            src: 'props/token-meteran.svg',
            x: 50,
            y: 88,
            di: 'akhir',
            sampai: 'awal',
            aksi: [{type: 'shake', di: 'tidakada'}],
          },
        ],
      },
    ],
  };
  const {errors} = await validasiExplainer(badScript, 'uji-gagal');
  assert.ok(errors.some((e) => e.includes('sampai')));
  assert.ok(errors.some((e) => e.includes('tidakada')));
  assert.ok(errors.some((e) => e.includes('area aman') || e.includes('y=')));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/explainer/cli.test.mjs`
Expected: FAIL with cannot find module `scripts/cek-explainer.mjs`

- [ ] **Step 3: Implement `scripts/cek-explainer.mjs`, `scripts/buat-explainer.mjs`, and add npm scripts in `package.json`**

Implement `validasiExplainer(script, slug)` in `scripts/cek-explainer.mjs` (and run CLI main when invoked directly via `process.argv[1]`). Implement `scripts/buat-explainer.mjs` to scaffold new explainer scripts in `src/explainer/data/<slug>.ts` and register them in `src/explainer/daftar.ts`. Add `"baru:explainer"` and `"cek:explainer"` to `package.json`.

- [ ] **Step 4: Run all tests, validator, frame check, storyboard, and regression suite**

Run: `node --test tests/explainer/*.test.mjs && npm run cek:explainer -- token-listrik && node scripts/cek-frame.mjs token-listrik && node scripts/storyboard.mjs token-listrik && npm run uji`
Expected:
- All unit tests PASS
- `npm run cek:explainer -- token-listrik` outputs `✓ LULUS`
- `out/cek/token-listrik-lembar.jpg` and `out/storyboard/token-listrik-1.jpg` generated cleanly
- `npm run uji` outputs `✓ LULUS` (`0 pixel beda` on all history videos)

- [ ] **Step 5: Commit**

```bash
git add scripts/buat-explainer.mjs scripts/cek-explainer.mjs package.json tests/explainer/cli.test.mjs
git commit -m "feat(explainer): add buat-explainer and cek-explainer CLI tools"
```
