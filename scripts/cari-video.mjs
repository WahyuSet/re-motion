// Cari & unduh footage video sejarah berlisensi bebas (domain publik / CC0 / CC BY / CC BY-SA) dari Wikimedia Commons.
//
// Pakai:
//   node scripts/cari-video.mjs "Nieuws uit Indonesie Batavia" --slug batavia
//   node scripts/cari-video.mjs "Batavia" --slug batavia --limit 3 --pd-only
//
// Hasil: public/videos/<slug>/NN-judul.mp4 (H.264 tanpa suara, maks 1080p)
//        + NN-judul.poster.jpg + _contact-sheet.jpg + credits.json (sumber, lisensi, & durasi)
// Opsi: --limit 4  --min-width 320  --min-duration 3  --max-duration 240  --pd-only

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {parseArgs} from 'node:util';
import sharp from 'sharp';
import {ffmpeg} from './lib/ffmpeg.mjs';

const USER_AGENT = 'video-sejarah-remotion/1.0 (educational video research script)';

const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {
    slug: {type: 'string'},
    limit: {type: 'string', default: '4'},
    'min-width': {type: 'string', default: '320'},
    'min-duration': {type: 'string', default: '3'},
    'max-duration': {type: 'string', default: '240'},
    'pd-only': {type: 'boolean', default: false},
  },
});

const query = positionals.join(' ');
if (!query || !values.slug) {
  console.error('Pakai: node scripts/cari-video.mjs "<kata kunci>" --slug <nama-topik>');
  process.exit(1);
}

const limit = Number(values.limit);
const minWidth = Number(values['min-width']);
const minDuration = Number(values['min-duration']);
const maxDuration = Number(values['max-duration']);
const outDir = path.resolve('public/videos', values.slug);

const FREE_LICENSE = /^(public domain|pd\b|pd-|cc0|cc zero|no restrictions|cc by(-sa)? \d)/i;
const PD_LICENSE = /^(public domain|pd\b|pd-|cc0|cc zero|no restrictions)/i;
const isAllowed = (license) => (values['pd-only'] ? PD_LICENSE : FREE_LICENSE).test(license.trim());
const isPublicDomain = (license) => PD_LICENSE.test(license.trim());

const stripHtml = (html = '') =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/^file:/, '')
    .replace(/\.[a-z0-9]+$/, '')
    .normalize('NFKD')
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, timeout) => {
  for (let attempt = 1; ; attempt++) {
    let res;
    try {
      res = await fetch(url, {headers: {'User-Agent': USER_AGENT}, signal: AbortSignal.timeout(timeout)});
    } catch (err) {
      if (attempt === 4) throw err;
      console.log(`  (koneksi gagal: ${err.message}, coba lagi dalam ${5 * attempt} detik ...)`);
      await sleep(5000 * attempt);
      continue;
    }
    if (res.status !== 429 || attempt === 4) return res;
    const wait = Number(res.headers.get('retry-after')) || 3 * 2 ** attempt;
    console.log(`  (dibatasi server, tunggu ${wait} detik ...)`);
    await sleep(wait * 1000);
  }
};

const getJson = async (url) => {
  const res = await fetchWithRetry(url, 30_000);
  if (!res.ok) throw new Error(`HTTP ${res.status} dari ${new URL(url).host}`);
  const json = await res.json();
  if (json.error) throw new Error(`${new URL(url).host}: ${json.error.info ?? json.error.code}`);
  return json;
};

const searchCommonsVideo = async () => {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `${query} filetype:video`,
    gsrnamespace: '6',
    gsrlimit: '50',
    prop: 'imageinfo',
    iiprop: 'url|size|dimensions|mime|extmetadata',
    iiextmetadatafilter: 'LicenseShortName|Artist|Credit|AttributionRequired|ObjectName',
  });
  const json = await getJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  const pages = Object.values(json.query?.pages ?? {}).sort((a, b) => a.index - b.index);

  return pages.flatMap((page) => {
    const info = page.imageinfo?.[0];
    if (!info) return [];
    const meta = info.extmetadata ?? {};
    return [
      {
        title: page.title.replace(/^File:/, ''),
        width: info.width ?? 0,
        height: info.height ?? 0,
        duration: typeof info.duration === 'number' ? info.duration : null,
        downloadUrl: info.url,
        sourceUrl: info.descriptionurl,
        author: stripHtml(meta.Artist?.value) || 'Tidak diketahui',
        license: stripHtml(meta.LicenseShortName?.value) || '',
        site: 'Wikimedia Commons',
      },
    ];
  });
};

const makeCredit = ({author, license, site}) => {
  const shortAuthor = author.length > 60 ? `${author.slice(0, 57)}...` : author;
  return isPublicDomain(license)
    ? `Video: ${shortAuthor} (domain publik) / ${site}`
    : `Video: ${shortAuthor} / ${site}, ${license}`;
};

const parseDuration = (log) => {
  const m = log.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : 0;
};

const buildContactSheet = async (items) => {
  const cols = Math.min(4, items.length);
  const w = 480;
  const h = 320;
  const rows = Math.ceil(items.length / cols);
  const tiles = await Promise.all(
    items.map(async (item, i) => {
      const img = await sharp(path.join(outDir, item.poster)).resize(w, h, {fit: 'cover'}).toBuffer();
      const text = `${item.file.slice(0, 2)} · ${item.durasi}s · ${item.license}`.replace(/[<&>]/g, '');
      const label = Buffer.from(
        `<svg width="${w}" height="${h}"><rect width="${w}" height="44" fill="rgba(0,0,0,0.75)"/>` +
          `<text x="12" y="30" font-family="Arial" font-size="21" fill="#ffd54a">${text}</text></svg>`,
      );
      const tile = await sharp(img).composite([{input: label}]).toBuffer();
      return {input: tile, left: (i % cols) * w, top: Math.floor(i / cols) * h};
    }),
  );
  await sharp({create: {width: cols * w, height: rows * h, channels: 3, background: '#111'}})
    .composite(tiles)
    .jpeg({quality: 82})
    .toFile(path.join(outDir, '_contact-sheet.jpg'));
};

const main = async () => {
  await fs.mkdir(outDir, {recursive: true});
  const creditsPath = path.join(outDir, 'credits.json');
  const credits = JSON.parse(await fs.readFile(creditsPath, 'utf8').catch(() => '{}'));
  const knownSources = new Set(Object.values(credits).map((c) => c.sourceUrl));

  console.log(`Mencari footage video "${query}" di Wikimedia Commons ...`);
  const results = await searchCommonsVideo();

  const candidates = results
    .filter((r) => r.license && isAllowed(r.license))
    .filter((r) => r.width >= minWidth)
    .filter((r) => (r.duration ?? minDuration) >= minDuration && (r.duration ?? maxDuration) <= maxDuration)
    .filter((r) => !knownSources.has(r.sourceUrl))
    .slice(0, limit);

  const skipped = results.length - candidates.length;
  console.log(`${results.length} hasil, ${candidates.length} lolos filter lisensi, ukuran & durasi (${skipped} dilewati).`);

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'video-'));
  let n = Object.keys(credits).length + 1;
  try {
    for (const c of candidates) {
      try {
        const res = await fetchWithRetry(c.downloadUrl, 120_000);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ext = path.extname(new URL(c.downloadUrl).pathname) || '.ogv';
        const tmpFile = path.join(tmpDir, `in-${n}${ext}`);
        await fs.writeFile(tmpFile, Buffer.from(await res.arrayBuffer()));

        const base = `${String(n).padStart(2, '0')}-${slugify(c.title)}`;
        const file = `${base}.mp4`;
        const poster = `${base}.poster.jpg`;
        const outPath = path.join(outDir, file);
        const posterPath = path.join(outDir, poster);

        // Klip kecil (<720p, mis. arsip Open Beelden 352×288) dinaikkan ke 720p supaya tajam di layout print;
        // klip besar dibatasi maks 1920×1080.
        const scaleVf =
          c.height && c.height < 720
            ? 'scale=1280:720:force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos'
            : "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2";

        const log = await ffmpeg([
          '-y',
          '-i',
          tmpFile,
          '-an',
          '-vf',
          scaleVf,
          '-r',
          '30',
          '-c:v',
          'libx264',
          '-crf',
          '21',
          '-pix_fmt',
          'yuv420p',
          '-movflags',
          '+faststart',
          outPath,
        ]);
        const durasi = Math.round((c.duration ?? parseDuration(log)) * 10) / 10;
        const posterAt = Math.min(3, Math.max(0.5, durasi * 0.25)).toFixed(2);
        await ffmpeg(['-y', '-ss', posterAt, '-i', outPath, '-frames:v', '1', '-q:v', '3', posterPath]);

        credits[file] = {
          title: c.title,
          author: c.author,
          license: c.license,
          sourceUrl: c.sourceUrl,
          credit: makeCredit(c),
          durasi,
        };
        console.log(`  ${file}  (${durasi} dtk)  [${c.license}]`);
        n++;
        await sleep(1000);
      } catch (err) {
        console.log(`  gagal unduh ${c.title}: ${err.message}`);
      }
    }
  } finally {
    await fs.rm(tmpDir, {recursive: true, force: true});
  }

  await fs.writeFile(creditsPath, JSON.stringify(credits, null, 2));

  const existing = new Set(await fs.readdir(outDir));
  const items = Object.entries(credits)
    .map(([file, c]) => ({file, poster: file.replace(/\.mp4$/, '.poster.jpg'), durasi: c.durasi, license: c.license}))
    .filter((x) => existing.has(x.file) && existing.has(x.poster));
  if (items.length) await buildContactSheet(items);

  console.log(`\nFolder: public/videos/${values.slug}/  (lihat _contact-sheet.jpg untuk cek isi & watermark, credits.json berisi lisensi & durasi)`);
};

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exitCode = 1;
});
