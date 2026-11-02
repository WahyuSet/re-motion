// Cari & unduh foto sejarah berlisensi bebas (domain publik / CC0 / CC BY / CC BY-SA).
//
// Pakai:
//   node scripts/cari-foto.mjs "borobudur 1900" --slug borobudur
//   node scripts/cari-foto.mjs "Raffles portrait" --slug borobudur --limit 4 --pd-only
//   node scripts/cari-foto.mjs "majapahit temple" --slug majapahit --source openverse
//
// Hasil: public/photos/<slug>/NN-judul.jpg + credits.json (sumber & lisensi tiap foto)
//        + _contact-sheet.jpg (semua kandidat bernomor, buat dipilih cepat).
// Opsi: --limit 8  --min-width 1200  --pd-only  --source commons|openverse

import fs from 'node:fs/promises';
import path from 'node:path';
import {parseArgs} from 'node:util';
import sharp from 'sharp';

const USER_AGENT = 'video-sejarah-remotion/1.0 (educational video research script)';

const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {
    slug: {type: 'string'},
    limit: {type: 'string', default: '8'},
    'min-width': {type: 'string', default: '1200'},
    'pd-only': {type: 'boolean', default: false},
    source: {type: 'string', default: 'commons'},
  },
});

const query = positionals.join(' ');
if (!query || !values.slug) {
  console.error('Pakai: node scripts/cari-foto.mjs "<kata kunci>" --slug <nama-topik>');
  process.exit(1);
}

const limit = Number(values.limit);
const minWidth = Number(values['min-width']);
const outDir = path.resolve('public/photos', values.slug);

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
    .replace(/\.[a-z]+$/, '')
    .normalize('NFKD')
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Wikimedia membatasi kecepatan (HTTP 429) dan koneksi kadang putus ("fetch failed").
// Tunggu lalu coba lagi, maksimal 4 kali.
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

// Wikimedia Commons: koleksi terbesar foto sejarah bebas lisensi (termasuk arsip KITLV, Tropenmuseum, Nationaal Archief).
const searchCommons = async () => {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '50',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '2400',
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
        width: info.width,
        downloadUrl: info.thumburl ?? info.url,
        sourceUrl: info.descriptionurl,
        author: stripHtml(meta.Artist?.value) || 'Tidak diketahui',
        license: stripHtml(meta.LicenseShortName?.value) || '',
        site: 'Wikimedia Commons',
      },
    ];
  });
};

// Openverse: agregator Flickr Commons, museum, dll. Kadang lambat/timeout.
const searchOpenverse = async () => {
  const params = new URLSearchParams({
    q: query,
    license: values['pd-only'] ? 'pdm,cc0' : 'pdm,cc0,by,by-sa',
    page_size: '40',
  });
  const json = await getJson(`https://api.openverse.org/v1/images/?${params}`);
  const licenseName = (r) =>
    r.license === 'pdm' ? 'Public domain' : r.license === 'cc0' ? 'CC0' : `CC ${r.license.toUpperCase()} ${r.license_version ?? ''}`.trim();

  return (json.results ?? []).map((r) => ({
    title: r.title || r.id,
    width: r.width ?? 0,
    downloadUrl: r.url,
    sourceUrl: r.foreign_landing_url,
    author: r.creator || 'Tidak diketahui',
    license: licenseName(r),
    site: r.source ?? 'Openverse',
  }));
};

const makeCredit = ({author, license, site}) => {
  const shortAuthor = author.length > 60 ? `${author.slice(0, 57)}...` : author;
  return isPublicDomain(license)
    ? `Foto: ${shortAuthor} (domain publik) / ${site}`
    : `Foto: ${shortAuthor} / ${site}, ${license}`;
};

const buildContactSheet = async (files) => {
  const cols = 4;
  const w = 480;
  const h = 320;
  const rows = Math.ceil(files.length / cols);
  const tiles = await Promise.all(
    files.map(async (f, i) => {
      const img = await sharp(path.join(outDir, f.file)).resize(w, h, {fit: 'cover'}).toBuffer();
      const label = Buffer.from(
        `<svg width="${w}" height="${h}"><rect width="${w}" height="44" fill="rgba(0,0,0,0.7)"/>` +
          `<text x="12" y="30" font-family="Arial" font-size="22" fill="#fff">${f.file.slice(0, 2)} · ${f.license.replace(/[<&>]/g, '')}</text></svg>`,
      );
      const tile = await sharp(img).composite([{input: label}]).toBuffer();
      return {input: tile, left: (i % cols) * w, top: Math.floor(i / cols) * h};
    }),
  );
  await sharp({create: {width: cols * w, height: rows * h, channels: 3, background: '#111'}})
    .composite(tiles)
    .jpeg({quality: 80})
    .toFile(path.join(outDir, '_contact-sheet.jpg'));
};

const main = async () => {
  await fs.mkdir(outDir, {recursive: true});
  const creditsPath = path.join(outDir, 'credits.json');
  const credits = JSON.parse(await fs.readFile(creditsPath, 'utf8').catch(() => '{}'));
  const knownSources = new Set(Object.values(credits).map((c) => c.sourceUrl));

  console.log(`Mencari "${query}" di ${values.source} ...`);
  const results = values.source === 'openverse' ? await searchOpenverse() : await searchCommons();

  const candidates = results
    .filter((r) => r.license && isAllowed(r.license))
    .filter((r) => r.width >= minWidth)
    .filter((r) => !knownSources.has(r.sourceUrl))
    .slice(0, limit);

  const skipped = results.length - candidates.length;
  console.log(`${results.length} hasil, ${candidates.length} lolos filter lisensi & ukuran (${skipped} dilewati).`);

  let n = Object.keys(credits).length + 1;
  for (const c of candidates) {
    try {
      const res = await fetchWithRetry(c.downloadUrl, 60_000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      const file = `${String(n).padStart(2, '0')}-${slugify(c.title)}.jpg`;
      // Konversi ke JPEG maks 2400px supaya ringan untuk render.
      await sharp(buffer).rotate().resize({width: 2400, withoutEnlargement: true}).jpeg({quality: 90}).toFile(path.join(outDir, file));
      credits[file] = {
        title: c.title,
        author: c.author,
        license: c.license,
        sourceUrl: c.sourceUrl,
        credit: makeCredit(c),
      };
      console.log(`  ${file}  [${c.license}]`);
      n++;
      await sleep(1000);
    } catch (err) {
      console.log(`  gagal unduh ${c.title}: ${err.message}`);
    }
  }

  await fs.writeFile(creditsPath, JSON.stringify(credits, null, 2));

  const existing = new Set(await fs.readdir(outDir));
  const files = Object.entries(credits)
    .filter(([file]) => existing.has(file))
    .map(([file, c]) => ({file, license: c.license}));
  if (files.length) await buildContactSheet(files);

  console.log(`\nFolder: public/photos/${values.slug}/  (lihat _contact-sheet.jpg, credits.json berisi teks kredit)`);
};

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
