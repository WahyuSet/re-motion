import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';

// Impor file TypeScript dari Node (di-bundle esbuild). Hanya untuk modul tanpa React/Remotion.
export const importTs = async (file) => {
  const result = await build({
    entryPoints: [path.resolve(file)],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
};

// Baca naskah src/data/<slug>.ts atau src/explainer/data/<slug>.ts dari Node (TypeScript + import JSON).
export const loadScript = async (slug) => {
  const candidates = [path.join('src/data', `${slug}.ts`), path.join('src/explainer/data', `${slug}.ts`)];
  const file = candidates.find((c) => fs.existsSync(c)) ?? candidates[0];
  const mod = await importTs(file);
  const script = Object.values(mod).find((v) => v && Array.isArray(v.scenes));
  if (!script) throw new Error(`${file} tidak mengekspor naskah dengan "scenes"`);
  return script;
};
