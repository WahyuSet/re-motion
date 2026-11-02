// Generate props visual lewat Google Flow Bridge, lalu hapus background-nya jadi PNG transparan.
//
// Pakai:
//   node scripts/generate-props.mjs --name kompas --prompt "ancient bronze compass"
//   node scripts/generate-props.mjs --file props/majapahit.json
//   node scripts/generate-props.mjs --remove-bg-only            (proses ulang semua file di public/props/_raw)
//
//   node scripts/generate-props.mjs --cek                       (cek Flow Bridge saja, tanpa generate)
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
    cek: {type: 'boolean', default: false},
  },
});

class FatalBridgeError extends Error {}

// Terjemahkan error relay jadi penjelasan + langkah perbaikan. HTTP 502 dari relay bisa berarti
// tab Google Flow belum dibuka ATAU prompt ditolak Flow, jadi baca isi pesannya.
const explainError = (status, body) => {
  if (/No Google Flow tab/i.test(body)) {
    return new FatalBridgeError('Tab Google Flow belum terbuka di Chrome. Buka Google Flow di Chrome (tab yang terhubung ke extension), lalu ulangi.');
  }
  if (status === 401) return new FatalBridgeError('Token Flow Bridge salah/kosong. Set env FLOW_BRIDGE_TOKEN sesuai relay.');
  if (status === 503) return new FatalBridgeError('Chrome Extension Flow Bridge belum terhubung. Buka Chrome dengan extension aktif.');
  if (status === 504) return new Error('Render di Google Flow terlalu lama (timeout). Ulangi, atau kurangi --concurrency.');
  if (status === 502) return new Error(`Google Flow menolak/error (sering karena prompt kena filter konten; ubah kata-katanya). Pesan relay: ${body.slice(0, 200)}`);
  return new Error(`HTTP ${status}: ${body.slice(0, 300)}`);
};

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
  return health;
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
    throw explainError(res.status, await res.text());
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
  let fatal = null;
  const lanes = Array.from({length: Math.min(limit, items.length)}, async () => {
    while (next < items.length && !fatal) {
      const item = items[next++];
      try {
        results.push({item, ok: true, out: await worker(item)});
        console.log(`  ✓ ${item.name}`);
      } catch (err) {
        results.push({item, ok: false, error: err.message});
        console.log(`  ✗ ${item.name}: ${err.message}`);
        // Masalah koneksi/tab berlaku untuk semua props: hentikan sisanya, jangan ulangi kegagalan yang sama
        if (err instanceof FatalBridgeError) fatal = err;
      }
    }
  });
  await Promise.all(lanes);
  return results;
};

const main = async () => {
  if (values.cek) {
    try {
      await checkBridge();
      console.log(`SIAP: Flow Bridge jalan di ${BRIDGE_URL} dan extension terhubung.`);
      console.log('Catatan: tab Google Flow di Chrome juga harus terbuka; kalau belum, generate akan gagal dengan pesan "Tab Google Flow belum terbuka".');
    } catch (err) {
      console.log(`TIDAK SIAP: ${err.message}`);
      process.exitCode = 1;
    }
    return;
  }

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
  const skipped = items.length - results.length;
  console.log(`\nSelesai: ${results.length - failed.length} berhasil, ${failed.length} gagal${skipped ? `, ${skipped} dilewati` : ''}.`);
  console.log(`PNG transparan: public/props/<name>.png   |   gambar asli: public/props/_raw/`);
  if (failed.length) process.exitCode = 1;
};

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  // exitCode (bukan process.exit) supaya koneksi jaringan sempat ditutup; process.exit bisa crash di Node Windows
  process.exitCode = 1;
});
