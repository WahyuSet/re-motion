// Template file pendamping untuk video explainer baru (dipakai scripts/buat-explainer.mjs).

const RUMUS = ['kontras-angka', 'bocoran', 'salah-kaprah', 'taruhan', 'kok-kenapa'];

export const templateRencana = (title, {long = false} = {}) =>
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
    ...(long
      ? [
          '## Bab',
          'Video long dibagi 3-6 bab. Bab 1 selalu Pembuka (scene 1). Panduan: referensi/long.md',
          'Jawaban hook: scene TODO (taruh di 55-85% durasi video)',
          '',
          '| # | Judul bab | Scene | Pertanyaan yang dijawab | Kail ke bab berikutnya |',
          '|---|---|---|---|---|',
          '| 1 | Pembuka | 1-2 | TODO | TODO |',
          '| 2 | TODO | TODO | TODO | TODO |',
          '| 3 | TODO | TODO | TODO | TODO |',
          '| 4 | TODO | TODO | TODO | TODO |',
          '| 5 | Kesimpulan | TODO | TODO | |',
          '',
        ]
      : []),
    '## Narasi',
    '### Scene 1 (hook)',
    'TODO',
    '',
    '## Komedi',
    '| # | Jenis | Kalimat joke | Punchline | Visual gag |',
    '|---|---|---|---|---|',
    '| 1 | TODO sindiran/hiperbola/perbandingan-absurd/personifikasi/twist/callback | TODO kalimat persis dari narasi | TODO kata lucu di ujung kalimat | TODO prop/meme besar di tengah + sfx |',
    '| 2 | TODO | TODO | TODO | TODO |',
    ...(long ? ['| 3 | TODO | TODO | TODO | TODO |', '| 4 | TODO | TODO | TODO | TODO |'] : []),
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

/** Naskah .ts awal. Short = kerangka 9:16 yang sudah dipakai sejak awal; long = 16:9 dengan 5 bab. */
export const templateNaskah = ({slug, varName, title, long = false}) =>
  long ? templateNaskahLong({slug, varName, title}) : templateNaskahShort({slug, varName, title});

const templateNaskahShort = ({slug, varName, title}) => `import type {ExplainerScript} from '../types';

// Naskah explainer "${title}". Ikuti .claude/skills/video-explainer/SKILL.md.
// Tulis dulu ${slug}.rencana.md (hook, narasi, peta visual), lalu salin peta ke file ini.
// Cek dengan: npm run cek:explainer -- ${slug} --peta
export const ${varName}: ExplainerScript = {
  format: 'short',
  watermark: '@okesini-id',
  gayaTeks: 'stiker',
  // Isi dua baris ini SETELAH audio narasi dipotong (node scripts/potong-narasi.mjs ${slug} <file-audio>):
  // narasiAudio: 'audio/${slug}',
  // narasiExt: 'wav',
  youtube: {
    judul: 'TODO Judul ${title}',
    deskripsi: 'TODO Deskripsi singkat topik ${title}.',
    tags: ['edukasi', 'explainer', 'okesini'],
  },
  // Judul 2 baris utuh dan natural (<= 28 huruf per baris). Baris 1 = sticker putih, Baris 2 = stabilo kuning + sticker putih.
  thumbnail: {
    baris1: 'TODO SUBJEK JELAS',
    baris2: 'KENAPA BISA BEGITU?',
    latar: 'latar/${slug}-1.png',
    src: 'props/meme-kucing-paw.png',
  },
  scenes: [
    {
      type: 'hook',
      duration: 105,
      latar: 'latar/${slug}-1.png',
      baris1: 'TODO SUBJEK JELAS',
      baris2: 'KENAPA BISA BEGITU?',
      // Hook Stop-Scroll (wajib 7-14 kata, 1 kalimat ~3 detik, langsung tembak kejanggalan tanpa pengantar):
      narasi: 'TODO kebiasaan singkat sehari-hari, kok bisa muncul *kejanggalan utama* ini?',
      items: [],
    },
    {
      type: 'stage',
      duration: 120,
      latar: 'latar/${slug}-2.png',
      narasi: 'TODO penjelasan visual pertama dengan celetukan *komedi* dan kata kunci *penting* di dalam kalimat.',
      items: [
        {
          kind: 'prop',
          src: 'props/meme-kucing-paw.png',
          x: 28,
          y: 54,
          width: 300,
          masuk: 'slide-up',
          delay: 0,
          sampai: 'penting',
          aksi: [
            {type: 'wiggle', di: 'penjelasan', rotate: 14, durasi: 18},
            {type: 'move', di: 'komedi', toX: 24, toY: 56, toRotate: -5, durasi: 16},
            {type: 'jump', di: 'penting', dy: 60, durasi: 18},
          ],
        },
        {
          kind: 'simbol',
          simbol: 'tanya',
          x: 46,
          y: 38,
          width: 130,
          masuk: 'pop',
          delay: 4,
          sampai: 'penting',
          aksi: [{type: 'peek', di: 'komedi', dx: 12, dy: -8, rotate: -14, durasi: 12, tahan: 20, sfx: 'boing'}],
        },
        {
          kind: 'teks',
          teks: 'TODO POIN KUNCI',
          x: 50,
          y: 45,
          ukuran: 44,
          warna: '#ffffff',
          kotak: '#1976d2',
          masuk: 'drop',
          sfx: 'boom',
          di: 'penting',
          aksi: [{type: 'squash', di: 'kalimat', durasi: 16}],
        },
      ],
    },
    {
      type: 'beat',
      duration: 55,
      teks: 'Oke, sini gue jelasin.',
      narasi: 'Oke, *sini gue jelasin* alasannya.',
      items: [
        {
          kind: 'prop',
          src: 'props/meme-kucing-jelasin.png',
          x: 50,
          y: 58,
          width: 360,
          masuk: 'pop',
          sfx: 'boing',
          aksi: [{type: 'wiggle', di: 'jelasin', rotate: 12, durasi: 16}],
        },
      ],
    },
    {
      type: 'stage',
      duration: 120,
      latar: 'latar/${slug}-4.png',
      narasi: 'TODO kesimpulan akhir yang menjawab pertanyaan di awal dengan *jelas*.',
      items: [
        {
          kind: 'simbol',
          simbol: 'centang',
          x: 50,
          y: 45,
          width: 180,
          masuk: 'pop',
          di: 'jelas',
        },
      ],
    },
  ],
};
`;

/** Scene kerangka long: [type, bab, nomor latar]. Beat tanpa latar. */
const SCENE_LONG = [
  ['hook', 'Pembuka', 1],
  ['beat', null, null],
  ['stage', 'TODO Judul bab 1', 3],
  ['stage', 'TODO Judul bab 2', 4],
  ['stage', 'TODO Judul bab 3', 5],
  ['stage', 'Kesimpulan', 6],
];

const sceneLong = (slug, [type, bab, n]) => {
  if (type === 'hook') {
    return `    {
      type: 'hook',
      bab: '${bab}',
      duration: 300,
      latar: 'latar/${slug}-${n}.png',
      baris1: 'TODO SUBJEK JELAS',
      baris2: 'KENAPA BISA BEGITU?',
      // Cold open 12-45 kata (±5-20 detik): kejanggalan utama + janji isi video. Frame 0 wajib lengkap (H6).
      narasi: 'TODO kebiasaan sehari-hari, kok bisa muncul *kejanggalan utama* ini? Di video ini kita bongkar satu per satu.',
      items: [],
    },`;
  }
  if (type === 'beat') {
    return `    {
      type: 'beat',
      duration: 55,
      teks: 'Oke, sini gue jelasin.',
      narasi: 'Oke, *sini gue jelasin* dari awal.',
      items: [{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 56, width: 340, masuk: 'pop'}],
    },`;
  }
  return `    {
      type: 'stage',
      bab: '${bab}',
      duration: 300,
      latar: 'latar/${slug}-${n}.png',
      // Bab = mini-explainer: pertanyaan -> salah kaprah -> peragaan -> joke -> kail ke bab berikutnya. Pecah jadi beberapa scene.
      narasi: 'TODO narasi bab ini dengan kata kunci *penting*.',
      items: [],
    },`;
};

const templateNaskahLong = ({slug, varName, title}) => `import type {ExplainerScript} from '../types';

// Naskah explainer LONG "${title}" (16:9, 3-12 menit). Ikuti .claude/skills/video-explainer/SKILL.md
// dan referensi/long.md. Scene pertama tiap bab diberi field bab (jadi chapter YouTube + banner bab).
// Cek dengan: npm run cek:explainer -- ${slug} --peta
export const ${varName}: ExplainerScript = {
  format: 'landscape',
  watermark: '@okesini-id',
  gayaTeks: 'stiker',
  // Isi dua baris ini SETELAH audio narasi dipotong (node scripts/potong-narasi.mjs ${slug} <file-audio>):
  // narasiAudio: 'audio/${slug}',
  // narasiExt: 'wav',
  youtube: {
    judul: 'TODO Judul ${title}',
    deskripsi: 'TODO Deskripsi topik ${title}.',
    tags: ['edukasi', 'explainer', 'okesini'],
  },
  // Thumbnail 1280x720. Judul 2 baris utuh dan natural (<= 28 huruf per baris).
  thumbnail: {
    baris1: 'TODO SUBJEK JELAS',
    baris2: 'KENAPA BISA BEGITU?',
    latar: 'latar/${slug}-1.png',
    src: 'props/meme-kucing-paw.png',
  },
  scenes: [
${SCENE_LONG.map((s) => sceneLong(slug, s)).join('\n')}
  ],
};
`;

const PROMPT_LATAR_SHORT = [
  (title) => `wide realistic modern photography of ${title} scene 1 location, natural colors, full-bleed camera frame no border, clean composition`,
  (title) => `wide realistic modern indoor or outdoor photography of ${title} scene 2 location, natural daylight, full-bleed camera frame no border, high detail`,
  (title) => `wide realistic modern photography of ${title} conclusion scene location, soft natural lighting, full-bleed camera frame no border`,
];

/** Daftar latar awal (.latar.json): satu per scene non-beat, nama sama dengan field latar di naskah. */
export const templateLatar = (slug, title, {long = false} = {}) => {
  if (!long) {
    return [1, 2, 4].map((n, i) => ({name: `${slug}-${n}`, prompt: PROMPT_LATAR_SHORT[i](title), utuh: true}));
  }
  return SCENE_LONG.filter(([, , n]) => n).map(([, , n]) => ({
    name: `${slug}-${n}`,
    prompt: `wide realistic modern photography of ${title} scene ${n} location, natural colors, full-bleed 16:9 camera frame no border, high detail`,
    utuh: true,
  }));
};
