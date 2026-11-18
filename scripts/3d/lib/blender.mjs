// Cari Blender dan jalankan utama.py untuk satu rencana jadi.
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_WINDOWS = 'C:\\Program Files\\Blender Foundation';
const SKRIP = 'scripts/blender/utama.py';
const BARIS_EKOR = 20;

const whereAsli = () => {
  try {
    const perintah = process.platform === 'win32' ? 'where' : 'which';
    return execFileSync(perintah, ['blender'], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).split(/\r?\n/)[0].trim() || null;
  } catch {
    return null;
  }
};

const versiAsli = () => (fs.existsSync(ROOT_WINDOWS) ? fs.readdirSync(ROOT_WINDOWS) : []);

export const cariBlender = ({env = process.env, ada = fs.existsSync, where = whereAsli, daftarVersi = versiAsli} = {}) => {
  if (env.BLENDER && ada(env.BLENDER)) return env.BLENDER;
  const dariPath = where();
  if (dariPath) return dariPath;
  const versi = daftarVersi()
    .map((d) => path.join(ROOT_WINDOWS, d, 'blender.exe'))
    .filter((f) => ada(f))
    .sort((a, b) => b.localeCompare(a, undefined, {numeric: true}));
  return versi[0] ?? null;
};

export const jalankanBlender = ({blender, rencanaFile, folderFrame, uji = false}) => {
  // Tanpa --python-exit-code, error Python tetap membuat Blender keluar dengan kode 0.
  const args = ['-b', '--factory-startup', '--python-exit-code', '1', '-P', path.resolve(SKRIP), '--', path.resolve(rencanaFile), path.resolve(folderFrame), ...(uji ? ['uji'] : [])];
  const r = spawnSync(blender, args, {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
  const ekor = `${r.stdout ?? ''}\n${r.stderr ?? ''}`.trim().split(/\r?\n/).slice(-BARIS_EKOR).join('\n');
  return {status: r.status ?? 1, ekor: ekor || String(r.error?.message ?? '')};
};
