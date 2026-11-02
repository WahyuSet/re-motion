// Generate props visual lewat Google Flow Bridge, lalu hapus background-nya jadi PNG transparan.
//
// Pakai:
//   node scripts/generate-props.mjs --name kompas --prompt "ancient bronze compass"
//   node scripts/generate-props.mjs --file props/majapahit.json
//   node scripts/generate-props.mjs --remove-bg-only            (proses ulang semua file di public/props/_raw)
//
// File JSON: [{"name": "kompas", "prompt": "ancient bronze compass"}, ...]
// Opsi: --style "<gaya>"  --bg green|magenta  --concurrency 4

import fs from 'node:fs/promises';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {removeBackground} from './lib/remove-bg.mjs';

const BRIDGE_URL = process.env.FLOW_BRIDGE_URL ?? 'http://127.0.0.1:8001';
const TOKEN = process.env.FLOW_BRIDGE_TOKEN ?? '';
const PROPS_DIR = path.resolve('public/props');
const RAW_DIR = path.join(PROPS_DIR, '_raw');

const DEFAULT_STYLE =
  'vintage hand-painted illustration, museum artifact style, warm sepia and gold tones, soft studio lighting, highly detailed';

const BACKGROUNDS = {
  green: 'perfectly flat solid pure chroma green (#00FF00) background',
  magenta: 'perfectly flat solid pure magenta (#FF00FF) background',
};

const {values} = parseArgs({
  options: {
    name: {type: 'string'},
    prompt: {type: 'string'},
    file: {type: 'string'},
    style: {type: 'string', default: DEFAULT_STYLE},
    bg: {type: 'string', default: 'green'},
    concurrency: {type: 'string', default: '4'},
    'remove-bg-only': {type: 'boolean', default: false},
  },
});

const buildPrompt = (subject, style, bg) =>
  [
    subject,
    'single isolated object, centered, the whole object fully visible with generous empty margin around it',
    style,
    'no text, no watermark, no frame, no cast shadow, no floor, no other objects',
    BACKGROUNDS[bg] ?? BACKGROUNDS.green,
  ].join(', ');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(TOKEN ? {Authorization: `Bearer ${TOKEN}`} : {}),
});

const checkBridge = async () => {
  let health;
  try {
    health = await (await fetch(`${BRIDGE_URL}/health`, {signal: AbortSignal.timeout(5000)})).json();
  } catch {
    throw new Error(
      `Flow Bridge tidak bisa dihubungi di ${BRIDGE_URL}. Jalankan dulu: D:\\Learning\\ai-content\\tools\\flow_bridge\\run_bridge.ps1`,
    );
  }
  if (!health.extension_connected) {
    throw new Error('Flow Bridge jalan, tapi Chrome Extension belum terhubung. Buka tab Google Flow di Chrome.');
  }
};

const generateOne = async ({name, prompt}, style, bg) => {
  const fullPrompt = buildPrompt(prompt, style, bg);
  const res = await fetch(`${BRIDGE_URL}/v1/images/generations`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({prompt: fullPrompt, model: 'nano-banana-2', size: '1024x1024', response_format: 'b64_json'}),
    signal: AbortSignal.timeout(200_000),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error('Response tidak berisi b64_json');

  const rawPath = path.join(RAW_DIR, `${name}.png`);
  await fs.writeFile(rawPath, Buffer.from(b64, 'base64'));
  const outPath = path.join(PROPS_DIR, `${name}.png`);
  await removeBackground(rawPath, outPath);
  return outPath;
};

// Jalankan beberapa request sekaligus (bridge mendukung request paralel).
const runPool = async (items, limit, worker) => {
  const results = [];
  let next = 0;
  const lanes = Array.from({length: Math.min(limit, items.length)}, async () => {
    while (next < items.length) {
      const item = items[next++];
      try {
        results.push({item, ok: true, out: await worker(item)});
        console.log(`  ✓ ${item.name}`);
      } catch (err) {
        results.push({item, ok: false, error: err.message});
        console.log(`  ✗ ${item.name}: ${err.message}`);
      }
    }
  });
  await Promise.all(lanes);
  return results;
};

const main = async () => {
  await fs.mkdir(RAW_DIR, {recursive: true});

  if (values['remove-bg-only']) {
    const files = (await fs.readdir(RAW_DIR)).filter((f) => f.endsWith('.png'));
    for (const f of files) {
      await removeBackground(path.join(RAW_DIR, f), path.join(PROPS_DIR, f));
      console.log(`  ✓ ${f}`);
    }
    return;
  }

  let items;
  if (values.file) {
    items = JSON.parse(await fs.readFile(values.file, 'utf8'));
  } else if (values.name && values.prompt) {
    items = [{name: values.name, prompt: values.prompt}];
  } else {
    throw new Error('Isi --name dan --prompt, atau --file <props.json>');
  }

  await checkBridge();
  console.log(`Generate ${items.length} props lewat ${BRIDGE_URL} ...`);
  const results = await runPool(items, Number(values.concurrency), (item) => generateOne(item, values.style, values.bg));

  const failed = results.filter((r) => !r.ok);
  console.log(`\nSelesai: ${results.length - failed.length} berhasil, ${failed.length} gagal.`);
  console.log(`PNG transparan: public/props/<name>.png   |   gambar asli: public/props/_raw/`);
  if (failed.length) process.exitCode = 1;
};

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
