// Tulis referensi skill video-3d dari katalog.json. Pakai: npm run 3d:katalog
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {muatKatalog} from './lib/katalog.mjs';

export const FILE_MD = '.claude/skills/video-3d/referensi/katalog.md';

const kode = (nilai) => `\`${nilai}\``;
const daftar = (nilai) => (nilai?.length ? nilai.map(kode).join(', ') : '-');
const syarat = (s) =>
  Object.keys(s ?? {}).length
    ? Object.entries(s)
        .map(([kunci, nilai]) => `${kode(kunci)}: ${[nilai].flat().map(kode).join(' / ')}`)
        .join('; ')
    : '-';

const tabel = (kepala, baris) => [
  `| ${kepala.join(' | ')} |`,
  `|${kepala.map(() => '---').join('|')}|`,
  ...baris.map((b) => `| ${b.join(' | ')} |`),
];

const bagianSet = (nama, set) => {
  const isi = Object.entries(set.isi);
  return [
    `## ${nama}`,
    '',
    `Cocok untuk: ${set.cocok_untuk}.`,
    '',
    `Syarat kalau dipakai di scene 1: ${syarat(set.syarat_hook)}`,
    '',
    '### Isi',
    '',
    ...(isi.length
      ? tabel(['Kunci', 'Pilihan', 'Bawaan'], isi.map(([k, d]) => [kode(k), daftar(d.pilihan), kode(d.bawaan)]))
      : ['Tidak ada pilihan isi. Tulis `"isi": {}`.']),
    '',
    '### Kamera',
    '',
    ...tabel(
      ['Nama', 'Boleh di scene 1', 'Area subjek (kiri, atas, kanan, bawah, persen layar)'],
      Object.entries(set.kamera).map(([k, d]) => [
        kode(k),
        d.prop ? 'tidak' : d.hook ? 'ya' : 'tidak',
        d.prop ? 'hanya untuk `gambar`' : d.zona_subjek.join(', '),
      ]),
    ),
    '',
    '### Gerak',
    '',
    ...tabel(
      ['Nama', 'Detik', 'Arti', 'Butuh', 'Syarat isi', 'Terus sampai akhir'],
      Object.entries(set.gerak).map(([k, d]) => [
        kode(k),
        String(d.detik),
        d.arti,
        daftar(d.butuh),
        syarat(d.syarat_isi),
        d.terus ? 'ya' : 'tidak',
      ]),
    ),
    '',
  ];
};

export const buatMarkdown = (katalog) =>
  [
    '<!-- DIBUAT OTOMATIS oleh npm run 3d:katalog. Jangan diedit. -->',
    '',
    '# Katalog klip 3D',
    '',
    'Pilih hanya dari daftar ini. Kalau tidak ada set yang cocok, berhenti dan laporkan "butuh set baru".',
    '',
    ...Object.entries(katalog.set).flatMap(([nama, set]) => bagianSet(nama, set)),
  ].join('\n');

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  fs.mkdirSync(path.dirname(FILE_MD), {recursive: true});
  fs.writeFileSync(FILE_MD, buatMarkdown(muatKatalog()));
  console.log(`✓ ${FILE_MD}`);
}
