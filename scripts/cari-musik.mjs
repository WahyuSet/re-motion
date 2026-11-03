// Cari & unduh musik instrumental bebas lisensi (domain publik / CC0 / CC BY / CC BY-SA) dari Wikimedia Commons.
//
// Pakai:
//   node scripts/cari-musik.mjs "javanese gamelan" --slug borobudur
//   node scripts/cari-musik.mjs "classical strings" --slug majapahit --limit 3 --pd-only
//
// Hasil: public/music/<slug>/NN-judul.mp3 + credits.json (sumber, lisensi, & durasi tiap musik)
// Opsi: --limit 5  --min-duration 15  --pd-only

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {ffmpeg} from './lib/ffmpeg.mjs';

const USER_AGENT = 'video-sejarah-remotion/1.0 (educational video research script)';

const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {
    slug: {type: 'string'},
    limit: {type: 'string', default: '5'},
    'min-duration': {type: 'string', default: '15'},
    'pd-only': {type: 'boolean', default: false},
  },
});

const query = positionals.join(' ');
if (!query || !values.slug) {
  console.error('Pakai: node scripts/cari-musik.mjs "<kata kunci>" --slug <nama-topik>');
  process.exit(1);
}

const limit = Number(values.limit);
const minDuration = Number(values['min-duration']);
const outDir = path.resolve('public/music', values.slug);

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

const searchCommonsAudio = async () => {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `${query} -filemime:midi -intitle:LL-Q filetype:audio`,
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
    const title = page.title.replace(/^File:/, '');
    return [
      {
        title,
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
    ? `Musik: ${shortAuthor} (domain publik) / ${site}`
    : `Musik: ${shortAuthor} / ${site}, ${license}`;
};

const parseDuration = (log) => {
  const m = log.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : 0;
};

const main = async () => {
  await fs.mkdir(outDir, {recursive: true});
  const creditsPath = path.join(outDir, 'credits.json');
  const credits = JSON.parse(await fs.readFile(creditsPath, 'utf8').catch(() => '{}'));
  const knownSources = new Set(Object.values(credits).map((c) => c.sourceUrl));

  console.log(`Mencari musik "${query}" di Wikimedia Commons ...`);
  const results = await searchCommonsAudio();

  const candidates = results
    .filter((r) => r.license && isAllowed(r.license))
    .filter((r) => !/^(ll-q\d+|[a-z]{2,3}-[a-z])/i.test(r.title) && !/\.(mid|midi)$/i.test(r.title))
    .filter((r) => (r.duration ?? Infinity) >= minDuration)
    .filter((r) => !knownSources.has(r.sourceUrl))
    .slice(0, limit);

  const skipped = results.length - candidates.length;
  console.log(`${results.length} hasil, ${candidates.length} lolos filter lisensi & durasi (${skipped} dilewati).`);

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'musik-'));
  let n = Object.keys(credits).length + 1;
  try {
    for (const c of candidates) {
      try {
        const res = await fetchWithRetry(c.downloadUrl, 90_000);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ext = path.extname(new URL(c.downloadUrl).pathname) || '.ogg';
        const tmpFile = path.join(tmpDir, `in-${n}${ext}`);
        await fs.writeFile(tmpFile, Buffer.from(await res.arrayBuffer()));

        const file = `${String(n).padStart(2, '0')}-${slugify(c.title)}.mp3`;
        const outPath = path.join(outDir, file);
        const log = await ffmpeg([
          '-y',
          '-i',
          tmpFile,
          '-vn',
          '-ac',
          '2',
          '-ar',
          '44100',
          '-c:a',
          'libmp3lame',
          '-b:a',
          '192k',
          outPath,
        ]);
        const durasi = Math.round((c.duration ?? parseDuration(log)) * 10) / 10;
        if (durasi > 0 && durasi < minDuration) {
          await fs.rm(outPath, {force: true});
          console.log(`  dilewati ${c.title}: durasi ${durasi} dtk (< ${minDuration} dtk)`);
          continue;
        }
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
  console.log(`\nFolder: public/music/${values.slug}/  (credits.json berisi sumber & lisensi)`);
  console.log(`Pasang di src/data/${values.slug}.ts (di atas scenes): music: 'music/${values.slug}/NN-nama.mp3',`);
};

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exitCode = 1;
});
