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

// Baca naskah src/data/<slug>.ts dari Node (TypeScript + import JSON).
export const loadScript = async (slug) => {
  const mod = await importTs(path.join('src/data', `${slug}.ts`));
  const script = Object.values(mod).find((v) => v && Array.isArray(v.scenes));
  if (!script) throw new Error(`src/data/${slug}.ts tidak mengekspor naskah dengan "scenes"`);
  return script;
};
