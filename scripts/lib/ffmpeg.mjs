import {execFile} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {promisify} from 'node:util';

const run = promisify(execFile);

// Pakai ffmpeg bawaan Remotion (node_modules/@remotion/compositor-<platform>), tidak perlu install terpisah.
const findFfmpeg = () => {
  const base = path.resolve('node_modules/@remotion');
  const exe = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  for (const dir of fs.readdirSync(base)) {
    if (!dir.startsWith('compositor-')) continue;
    const candidate = path.join(base, dir, exe);
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error('ffmpeg bawaan Remotion tidak ditemukan. Jalankan npm install.');
};

const FFMPEG = findFfmpeg();

/** Jalankan ffmpeg, kembalikan stderr (ffmpeg menulis log ke stderr) */
export const ffmpeg = async (args) => {
  const {stderr} = await run(FFMPEG, ['-hide_banner', ...args], {maxBuffer: 64 * 1024 * 1024});
  return stderr;
};
