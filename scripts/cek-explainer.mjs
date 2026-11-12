// Periksa naskah explainer src/explainer/data/<slug>.ts:
// - keberadaan narasi, angka dalam huruf, tanda * berpasangan
// - kecocokan kata pemicu (`di`, `sampai`, `aksi[].di`, `langkah[].di`, dsb.) terhadap narasi
// - urutan `sampai` harus sesudah `di`
// - koordinat x/y objek di dalam area aman YouTube Shorts (x: 8..92%, y: 12..76%)
// - keberadaan file prop di public/
//
// Pakai: node scripts/cek-explainer.mjs token-listrik

import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {importTs, loadScript} from './lib/load-script.mjs';
import {cekSkemaItem} from './lib/explainer-cek/skema.mjs';

// Video lama yang dibuat sebelum aturan V/M/H/R. Aturan skema (S) tetap berlaku.
export const LEGACY = new Set([
  'token-listrik',
  'sadap-lims',
  'gandum-tropis',
  'baju-kuning',
  'kamar-panas',
  'bata-zigzag',
  'bpa-free',
  'efek-rumah-kaca',
  'black-box',
  'cas-80',
]);

const existsPublic = (rel) =>
  fs.access(path.resolve('public', rel)).then(
    () => true,
    () => false,
  );

const plain = (text) => text.replace(/\*/g, '');

export const validasiExplainer = async (script, slug = 'explainer', opts = {}) => {
  const {indexOfWord, parseWords} = await importTs('src/lib/kata.ts');
  const errors = [];
  const warnings = [];
  const format = (where, msg, fix) => `${where}: ${msg}${fix ? ` → PERBAIKI: ${fix}` : ''}`;
  const err = (where, msg, fix) => errors.push(format(where, msg, fix));
  const warn = (where, msg, fix) => warnings.push(format(where, msg, fix));
  const lapor = {err, warn};

  const scenes = script?.scenes ?? [];
  const short = (script?.format ?? 'short') === 'short';

  if (scenes.length < 3) {
    err('naskah', `Hanya ${scenes.length} scene.`, 'Buat minimal 4–6 scene untuk explainer.');
  }

  let kataJson = null;
  if (script?.narasiAudio) {
    try {
      kataJson = JSON.parse(
        await fs.readFile(path.resolve('public', script.narasiAudio, 'kata.json'), 'utf8'),
      );
    } catch {
      warn(
        'audio',
        'kata.json tidak ditemukan, memakai perkiraan waktu.',
        `Jalankan: node scripts/potong-narasi.mjs ${slug} "<file-audio>"`,
      );
    }
  }

  if (script?.thumbnail?.src && !(await existsPublic(script.thumbnail.src))) {
    err('thumbnail', `File public/${script.thumbnail.src} tidak ditemukan.`);
  }
  if (script?.thumbnail?.latar && !(await existsPublic(script.thumbnail.latar))) {
    err('thumbnail', `File latar public/${script.thumbnail.latar} tidak ditemukan.`);
  }
  for (const field of ['baris1', 'baris2']) {
    const val = script?.thumbnail?.[field];
    if (typeof val === 'string' && val.trim().length > 28) {
      warn(
        'thumbnail',
        `${field} "${val}" terlalu panjang (${val.trim().length} karakter, batas 28).`,
        'Ringkas menjadi 2–5 kata yang utuh secara logika agar teks thumbnail tetap besar dalam 1 baris.',
      );
    }
  }

  const seenLatar = new Map();

  for (const [i, scene] of scenes.entries()) {
    const where = `scene ${i + 1} (${scene.type})`;
    const narasi = scene.narasi ?? '';
    const json = JSON.stringify(scene);

    if (/TODO/.test(json)) {
      err(where, 'Masih ada teks TODO.', 'Lengkapi semua TODO sebelum render.');
    }

    if (!narasi.trim()) {
      err(where, 'Tidak punya narasi.', 'Setiap scene explainer wajib memiliki narasi.');
      continue;
    }

    const words = parseWords(narasi.trim());
    if (/\d/.test(plain(narasi))) {
      err(
        where,
        'Narasi berisi angka digit.',
        'Tulis angka dengan huruf agar TTS membacanya benar, contoh "seratus ribu".',
      );
    }
    if (/\b(dll|dsb|yg|thn|abd|M)\./.test(narasi)) {
      err(where, 'Narasi berisi singkatan.', 'Tulis lengkap tanpa singkatan.');
    }
    if ((narasi.match(/\*/g) ?? []).length % 2 !== 0) {
      err(where, 'Jumlah tanda * ganjil.', 'Pastikan setiap *kata kunci* ditutup tanda bintang.');
    }

    if (kataJson && Array.isArray(kataJson[i]) && kataJson[i].length !== words.length) {
      warn(
        where,
        `Jumlah kata di kata.json (${kataJson[i].length}) berbeda dengan narasi (${words.length}).`,
        `Jalankan ulang potong-narasi.mjs ${slug}`,
      );
    }

    const cekKata = (label, target) => {
      if (!target) return -1;
      const idx = indexOfWord(words, target);
      if (idx < 0) {
        err(where, `${label} "${target}" tidak ditemukan di narasi.`);
      }
      return idx;
    };

    if (scene.latarOpacity !== undefined || scene.latarBlur !== undefined) {
      err(
        where,
        'Dilarang memakai latarOpacity atau latarBlur.',
        'Background explainer wajib Full Real 100% tanpa transparan. Hapus properti latarOpacity dan latarBlur.',
      );
    }

    if (scene.latar) {
      if (!(await existsPublic(scene.latar))) {
        err(where, `File latar public/${scene.latar} tidak ditemukan.`);
      } else if (seenLatar.has(scene.latar)) {
        warn(
          where,
          `Latar "${scene.latar}" sudah dipakai di scene ${seenLatar.get(scene.latar)}.`,
          'Gunakan background lokasi unik per scene sesuai narasi.',
        );
      } else {
        seenLatar.set(scene.latar, i + 1);
      }
    } else if (scene.type !== 'beat') {
      err(
        where,
        'Wajib memiliki background lokasi real.',
        `Isi latar: 'latar/${slug}-${i + 1}.png' dan generate: node scripts/generate-props.mjs --utuh --name ${slug}-${i + 1} --prompt "<suasana-lokasi>"`,
      );
    }

    if (scene.judulDi) cekKata('judulDi', scene.judulDi);
    if (scene.type === 'hook') {
      const legacyHookSlugs = new Set(['token-listrik', 'sadap-lims', 'gandum-tropis']);
      if (!legacyHookSlugs.has(slug) && words.length > 15) {
        warn(
          where,
          `Hook narasi terlalu panjang (${words.length} kata, batas 14 kata / ~3-4 detik).`,
          'Ringkas jadi 1 kalimat stop-scroll (8-14 kata): "[Fakta/aksi 4 kata], kok/kenapa [kejanggalan 5 kata]?" tanpa kalimat pengantar.',
        );
      }
      for (const field of ['baris1', 'baris2']) {
        const val = scene[field];
        if (typeof val === 'string' && val.trim().length > 28) {
          warn(
            where,
            `${field} "${val}" terlalu panjang (${val.trim().length} karakter, batas 28).`,
            'Ringkas menjadi 2-5 kata yang utuh secara logika agar banner hook tetap 1 baris.',
          );
        }
      }
    }
    if (scene.di) cekKata('di', scene.di);
    if (scene.rakitDi) cekKata('rakitDi', scene.rakitDi);
    if (scene.beban?.di) cekKata('beban.di', scene.beban.di);
    if (scene.beban?.angkaDi) cekKata('beban.angkaDi', scene.beban.angkaDi);
    if (scene.pembagi?.di) cekKata('pembagi.di', scene.pembagi.di);
    if (scene.hasil?.di) cekKata('hasil.di', scene.hasil.di);

    for (const [li, langkah] of (scene.langkah ?? []).entries()) {
      if (langkah.di) cekKata(`langkah[${li + 1}].di`, langkah.di);
    }

    const allItems = [
      ...(scene.utama ? [scene.utama] : []),
      ...(scene.items ?? []),
    ];

    if (scene.type === 'stage' && allItems.length > 0) {
      const hasOpeningItem = allItems.some((it) => {
        if (!it.di) return (it.delay ?? 0) <= 15;
        const idx = indexOfWord(words, it.di);
        return idx >= 0 && idx <= 2;
      });
      if (!hasOpeningItem) {
        warn(
          where,
          'Awal scene kosong di detik pertama.',
          'Beri minimal 1 item tanpa `di` (delay: 0) atau `di` pada 1–2 kata pertama agar panggung tidak kosong saat scene mulai.',
        );
      }
    }

    if ((scene.type === 'hook' || scene.type === 'stage') && allItems.length > 0) {
      const totalAksi = allItems.reduce((sum, it) => sum + (it.aksi?.length ?? 0), 0);
      if (totalAksi === 0) {
        warn(
          where,
          'Tidak ada `aksi` motion aktif pada item di scene ini.',
          'Tambahkan minimal 3–5 `aksi` (jump, wiggle, squash, peek, move, shake, pulse) yang terikat ke kata narasi agar visual tidak statis.',
        );
      }
    }

    for (const [ii, item] of allItems.entries()) {
      const itemLabel = `${where} item ${ii + 1}`;
      cekSkemaItem(item, itemLabel, lapor);
      if (item.src && !(await existsPublic(item.src))) {
        err(itemLabel, `File prop public/${item.src} tidak ditemukan.`);
      }

      if (short && typeof item.x === 'number' && typeof item.y === 'number') {
        if (item.x < 8 || item.x > 92 || item.y < 12 || item.y > 76) {
          err(
            itemLabel,
            `Koordinat x=${item.x}, y=${item.y} keluar dari area aman short (x: 8..92, y: 12..76).`,
          );
        }
      }

      const idxDi = item.di ? cekKata(`${itemLabel} di`, item.di) : -1;
      if (item.sampai) {
        const idxAny = indexOfWord(words, item.sampai);
        if (idxAny < 0) {
          err(where, `${itemLabel} sampai "${item.sampai}" tidak ditemukan di narasi.`);
        } else if (idxDi >= 0 && indexOfWord(words, item.sampai, idxDi + 1) < 0) {
          err(
            itemLabel,
            `Urutan waktu terbalik: sampai "${item.sampai}" muncul sebelum atau bersamaan dengan di "${item.di}".`,
          );
        }
      }

      for (const [ai, aksi] of (item.aksi ?? []).entries()) {
        if (aksi.di) cekKata(`${itemLabel} aksi[${ai + 1}].di`, aksi.di);
        if (aksi.sampai) cekKata(`${itemLabel} aksi[${ai + 1}].sampai`, aksi.sampai);
        if (aksi.sfx && !(await existsPublic(`sfx/${aksi.sfx}.wav`))) {
          err(
            `${itemLabel} aksi[${ai + 1}]`,
            `File SFX public/sfx/${aksi.sfx}.wav tidak ditemukan.`,
            'Jalankan: node scripts/buat-sfx-explainer.mjs',
          );
        }
      }

      if (item.sfx && !(await existsPublic(`sfx/${item.sfx}.wav`))) {
        err(
          itemLabel,
          `File SFX public/sfx/${item.sfx}.wav tidak ditemukan.`,
          'Jalankan: node scripts/buat-sfx-explainer.mjs',
        );
      }
    }
  }

  return {errors, warnings};
};

const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Pakai: node scripts/cek-explainer.mjs <slug>');
    process.exit(1);
  }

  try {
    const script = await loadScript(slug);
    const {errors, warnings} = await validasiExplainer(script, slug);

    try {
      const daftar = await fs.readFile('src/explainer/daftar.ts', 'utf8');
      if (!daftar.includes(`./data/${slug}`)) {
        errors.push(
          `daftar.ts: Naskah "${slug}" belum terdaftar di src/explainer/daftar.ts.`,
        );
      }
    } catch {
      // Abaikan jika daftar.ts belum ada
    }

    for (const w of warnings) console.log(`  ⚠ ${w}`);
    for (const e of errors) console.error(`  ✗ ${e}`);

    if (errors.length > 0) {
      console.error(`\n✗ GAGAL: ${errors.length} error, ${warnings.length} peringatan.`);
      process.exitCode = 1;
    } else {
      console.log(
        `\n✓ LULUS: ${slug} (${script.scenes.length} scene, ${warnings.length} peringatan).`,
      );
    }
  } catch (e) {
    console.error(`✗ Gagal membaca naskah "${slug}": ${e.message}`);
    process.exitCode = 1;
  }
}
