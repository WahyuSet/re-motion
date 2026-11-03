// Ekspor naskah narasi dari src/data/<slug>.ts untuk di-generate di aplikasi TTS luar.
//
// Pakai: node scripts/narasi.mjs borobudur
// Hasil: narasi/<slug>/naskah-full.txt  (teks bersih untuk di-paste ke TTS, 1 paragraf = 1 scene)
//        narasi/<slug>/naskah-tts.txt   (panduan: nomor scene, perkiraan durasi, cara pakai)

import fs from 'node:fs/promises';
import path from 'node:path';
import {loadScript} from './lib/load-script.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('Pakai: node scripts/narasi.mjs <slug>');
  process.exit(1);
}

// Kecepatan bicara TTS bahasa Indonesia rata-rata ±2,4 kata per detik.
const WORDS_PER_SECOND = 2.4;

// Hal yang sering dibaca salah oleh TTS.
const lint = (text) => {
  const warnings = [];
  if (/\d/.test(text)) warnings.push('ada angka, tulis sebagai kata (1814 -> seribu delapan ratus empat belas)');
  if (/\b(dll|dsb|yg|thn|abd|M)\./.test(text)) warnings.push('ada singkatan, tulis lengkap');
  return warnings;
};

const main = async () => {
  const script = await loadScript(slug);
  const outDir = path.resolve('narasi', slug);
  await fs.mkdir(outDir, {recursive: true});

  const lines = [
    `PANDUAN TTS: ${slug}`,
    '',
    'Cara pakai:',
    `- Paste isi naskah-full.txt ke aplikasi TTS dan generate SATU file audio utuh.`,
    '- Setiap paragraf = satu scene bernarasi. Beri JEDA PANJANG (±1,5 detik) di antara paragraf:',
    '  pakai fitur pause/break di aplikasi TTS, atau baris kosong kalau aplikasinya otomatis memberi jeda.',
    '  Jeda antar paragraf harus lebih panjang dari jeda antar kalimat, karena di situ audio dipotong per scene.',
    '- Jangan tambahkan intro/outro atau kalimat lain di luar naskah.',
    `- Hasilnya kirim ke Claude, atau jalankan: node scripts/potong-narasi.mjs ${slug} <file-audio>`,
    '',
    'Daftar scene (untuk referensi, JANGAN ikut dibacakan):',
    '',
  ];

  const paragraphs = [];
  let totalSeconds = 0;
  let problems = 0;
  for (const [i, scene] of script.scenes.entries()) {
    const no = String(i + 1).padStart(2, '0');
    if (!scene.narasi) {
      if (scene.type === 'chapter') {
        lines.push(`[${no}] (chapter — tanpa narasi, dilewati TTS)`, '');
      } else {
        console.log(`  ⚠ scene ${no} (${scene.type}) tidak punya narasi. Mode audio utuh butuh narasi di SETIAP scene.`);
        problems++;
      }
      continue;
    }
    // Tanda *bintang* hanya untuk penanda visual di video, tidak ikut dibacakan.
    const text = scene.narasi.replace(/\*/g, '').trim();
    const seconds = text.split(/\s+/).length / WORDS_PER_SECOND;
    totalSeconds += seconds;
    paragraphs.push(text);
    lines.push(`[${no}] (${scene.type}) ±${seconds.toFixed(1)} detik`, text, '');

    for (const w of lint(text)) {
      console.log(`  ⚠ scene ${no}: ${w}`);
      problems++;
    }
  }

  lines.push(`Perkiraan total narasi: ±${Math.round(totalSeconds)} detik (belum termasuk jeda)`);
  await fs.writeFile(path.join(outDir, 'naskah-full.txt'), paragraphs.join('\n\n') + '\n');
  await fs.writeFile(path.join(outDir, 'naskah-tts.txt'), lines.join('\n'));

  console.log(paragraphs.join('\n\n'));
  console.log(`\n${paragraphs.length} paragraf, ±${Math.round(totalSeconds)} detik.`);
  console.log(`Tersimpan di narasi/${slug}/naskah-full.txt (untuk TTS) dan naskah-tts.txt (panduan)`);
  if (problems) console.log(`${problems} peringatan di atas.`);
};

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  // exitCode (bukan process.exit) supaya koneksi jaringan sempat ditutup; process.exit bisa crash di Node Windows
  process.exitCode = 1;
});
