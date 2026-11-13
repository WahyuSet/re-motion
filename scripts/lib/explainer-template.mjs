// Template file pendamping untuk video explainer baru (dipakai scripts/buat-explainer.mjs).

const RUMUS = ['kontras-angka', 'bocoran', 'salah-kaprah', 'taruhan', 'kok-kenapa'];

export const templateRencana = (title) =>
  [
    `# Rencana: ${title}`,
    '',
    'Isi berurutan: Hook -> Narasi -> Komedi -> Peta Visual. Panduan: .claude/skills/video-explainer/referensi/hook-judul.md dan narasi.md',
    '',
    '## Hook',
    '| # | Rumus | Narasi hook | baris1 | baris2 | Konkret | Kontras | Dekat | Penasaran | Visual0 | Total |',
    '|---|---|---|---|---|---|---|---|---|---|---|',
    ...RUMUS.map((r, i) => `| ${i + 1} | ${r} | TODO | TODO | TODO | 0 | 0 | 0 | 0 | 0 | 0 |`),
    '',
    'Terpilih: #TODO',
    '',
    '## Thumbnail',
    'Subjek lengkap: TODO benda + tempatnya, contoh "rak telur di pintu kulkas"',
    'Gambar: props/TODO-nama-prop.png',
    'Uji 1 detik: TODO orang yang cuma lihat gambarnya tahu ini soal apa',
    '',
    '## Narasi',
    '### Scene 1 (hook)',
    'TODO',
    '',
    '## Komedi',
    '| # | Jenis | Kalimat joke | Punchline | Visual gag |',
    '|---|---|---|---|---|',
    '| 1 | TODO sindiran/hiperbola/perbandingan-absurd/personifikasi/twist/callback | TODO kalimat persis dari narasi | TODO kata lucu di ujung kalimat | TODO prop/meme besar di tengah + sfx |',
    '| 2 | TODO | TODO | TODO | TODO |',
    '',
    '## Peta Visual',
    '### Scene 1',
    '| Klausa | Visual | File | Aksi |',
    '|---|---|---|---|',
    '| TODO | TODO | TODO | TODO |',
    '',
  ].join('\n');

export const templateProps = () => [
  {
    name: 'TODO-nama-prop',
    prompt: 'TODO deskripsi objek, studio product photography cutout, isolated on clean background',
    untuk: 'TODO frasa persis dari narasi',
  },
];
