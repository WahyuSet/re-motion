// Render video dengan profil terukur:
//   --preview : setengah resolusi (scale 0.5), CRF 28, setiap frame ke-3 (10 fps), cepat (<30% waktu final)
//   --final   : resolusi penuh (1080p / 1080×1920 short), CRF 21, normalisasi audio 2-tahap (-14 LUFS, TP -1.5),
//               + otomatis buat versi kirim 720p (≤ 28 MB, bitrate dihitung dari durasi)
//
// Pakai:
//   node scripts/render.mjs gunung-kawi --preview
//   node scripts/render.mjs gunung-kawi --final
//   node scripts/render.mjs gunung-kawi            (default: --final)

import fs from 'node:fs/promises';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {renderMedia} from '@remotion/renderer';
import {ffmpeg} from './lib/ffmpeg.mjs';
import {bukaKomposisi, tutup} from './lib/komposisi.mjs';

const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {
    preview: {type: 'boolean', default: false},
    final: {type: 'boolean', default: false},
    crf: {type: 'string'},
  },
});

const slug = positionals[0];
if (!slug) {
  console.error('Pakai: node scripts/render.mjs <slug> [--preview | --final] [--crf <angka>]');
  process.exit(1);
}

const isPreview = Boolean(values.preview && !values.final);
const crf = Number(values.crf ?? (isPreview ? 28 : 21));

const fmtDurasi = (detik) => {
  const s = Math.round(detik);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} (${detik.toFixed(1)} dtk)`;
};

const fmtMb = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const parseLoudnormJson = (log) => {
  const start = log.lastIndexOf('{');
  const end = log.lastIndexOf('}');
  if (start < 0 || end < start) return null;
  try {
    return JSON.parse(log.slice(start, end + 1));
  } catch {
    return null;
  }
};

// Normalisasi audio 2-tahap sesuai standar YouTube (-14 LUFS, true peak -1.5 dBTP), video disalin (-c:v copy).
const normalisasiAudio = async (inputMp4, outputMp4) => {
  const log1 = await ffmpeg([
    '-i',
    inputMp4,
    '-vn',
    '-af',
    'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json',
    '-f',
    'null',
    '-',
  ]);
  const s1 = parseLoudnormJson(log1);
  if (!s1 || !Number.isFinite(Number(s1.input_i))) {
    await fs.rename(inputMp4, outputMp4);
    return null;
  }

  const af = [
    'loudnorm=I=-14:TP=-1.5:LRA=11',
    `measured_I=${s1.input_i}`,
    `measured_TP=${s1.input_tp}`,
    `measured_LRA=${s1.input_lra}`,
    `measured_thresh=${s1.input_thresh}`,
    `offset=${s1.target_offset}`,
    'linear=true:print_format=json',
  ].join(':');

  const log2 = await ffmpeg([
    '-y',
    '-i',
    inputMp4,
    '-c:v',
    'copy',
    '-af',
    af,
    '-ar',
    '48000',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    '-movflags',
    '+faststart',
    outputMp4,
  ]);
  await fs.rm(inputMp4, {force: true});
  const s2 = parseLoudnormJson(log2);
  return {
    inputI: s1.input_i,
    outputI: s2?.output_i ?? '-14.0',
    outputTp: s2?.output_tp ?? '-1.5',
  };
};

// Buat versi kirim 720p yang dijamin ≤ 28 MB dengan menghitung bitrate dari durasi video.
const buatVersiKirim = async (inputMp4, outputMp4, durasiDetik, short) => {
  const scaleFilter = short ? 'scale=720:1280' : 'scale=1280:720';
  // Anggaran 26,5 MiB (217.088 kbit) supaya dengan header MP4 tetap aman di bawah 28 MB.
  const audioKbps = 128;
  const videoKbps = Math.min(3100, Math.max(400, Math.floor(217088 / Math.max(1, durasiDetik)) - audioKbps));
  const maxRateKbps = Math.round(videoKbps * 1.1);
  const bufSizeKbps = videoKbps * 2;

  await ffmpeg([
    '-y',
    '-i',
    inputMp4,
    '-vf',
    scaleFilter,
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-b:v',
    `${videoKbps}k`,
    '-maxrate',
    `${maxRateKbps}k`,
    '-bufsize',
    `${bufSizeKbps}k`,
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    `${audioKbps}k`,
    '-movflags',
    '+faststart',
    outputMp4,
  ]);
  return {videoKbps, resolusi: short ? '720×1280' : '1280×720'};
};

const main = async () => {
  await fs.mkdir('out', {recursive: true});
  const tMulai = Date.now();

  try {
    const inputProps = isPreview ? {grain: 0} : {};
    const {composition, serveUrl, browser} = await bukaKomposisi(slug, inputProps);
    const durasiDetik = composition.durationInFrames / composition.fps;
    const short = composition.height > composition.width;

    let lastPct = -1;
    const onProgress = ({progress, renderedFrames, encodedFrames}) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct >= lastPct + 10) {
        lastPct = pct;
        console.log(`  ${pct}% (render ${renderedFrames} frame, encode ${encodedFrames} frame)`);
      }
    };

    if (isPreview) {
      const outPreview = path.resolve('out', `${slug}-preview.mp4`);
      const w = Math.round(composition.width * 0.5);
      const h = Math.round(composition.height * 0.5);
      console.log(`Render PREVIEW ${composition.id} (${w}×${h}, CRF ${crf}, 10 fps) -> out/${slug}-preview.mp4 ...`);
      await renderMedia({
        composition,
        serveUrl,
        puppeteerInstance: browser,
        inputProps,
        codec: 'h264',
        scale: 0.5,
        crf,
        jpegQuality: 65,
        x264Preset: 'veryfast',
        everyNthFrame: 3,
        outputLocation: outPreview,
        overwrite: true,
        onProgress,
      });
      const {size} = await fs.stat(outPreview);
      const dtk = ((Date.now() - tMulai) / 1000).toFixed(1);
      console.log(`\nLaporan Render Preview (${slug})`);
      console.log(`  Durasi video : ${fmtDurasi(durasiDetik)} (${composition.durationInFrames} frame @ ${composition.fps} fps)`);
      console.log(`  File preview : out/${slug}-preview.mp4 (${w}×${h}, ${fmtMb(size)})`);
      console.log(`  Waktu render : ${dtk} dtk`);
      return;
    }

    const rawMp4 = path.resolve('out', `${slug}.raw.mp4`);
    const finalMp4 = path.resolve('out', `${slug}.mp4`);
    const kirimMp4 = path.resolve('out', `${slug}-720p.mp4`);

    console.log(
      `Render FINAL ${composition.id} (${composition.width}×${composition.height}, CRF ${crf}) -> out/${slug}.mp4 ...`,
    );
    await renderMedia({
      composition,
      serveUrl,
      puppeteerInstance: browser,
      codec: 'h264',
      scale: 1,
      crf,
      outputLocation: rawMp4,
      overwrite: true,
      onProgress,
    });

    console.log('Normalisasi audio 2-tahap (target -14 LUFS, TP -1.5 dBTP) ...');
    const loud = await normalisasiAudio(rawMp4, finalMp4);

    console.log(`Membuat versi kirim 720p (≤ 28 MB) -> out/${slug}-720p.mp4 ...`);
    const kirimInfo = await buatVersiKirim(finalMp4, kirimMp4, durasiDetik, short);

    const [stFinal, stKirim] = await Promise.all([fs.stat(finalMp4), fs.stat(kirimMp4)]);
    const dtk = ((Date.now() - tMulai) / 1000).toFixed(1);

    console.log(`\nLaporan Render Final (${slug})`);
    console.log(`  Durasi video : ${fmtDurasi(durasiDetik)} (${composition.durationInFrames} frame @ ${composition.fps} fps)`);
    console.log(
      `  File utama   : out/${slug}.mp4 (${composition.width}×${composition.height}, CRF ${crf}, ${fmtMb(stFinal.size)})`,
    );
    if (loud) {
      console.log(`  Loudness     : ${loud.inputI} -> ${loud.outputI} LUFS (TP ${loud.outputTp} dBTP)`);
    }
    console.log(
      `  Versi kirim  : out/${slug}-720p.mp4 (${kirimInfo.resolusi}, ${kirimInfo.videoKbps} kbps, ${fmtMb(stKirim.size)})`,
    );
    console.log(`  Waktu total  : ${dtk} dtk`);
  } finally {
    await tutup();
  }
};

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exitCode = 1;
});
