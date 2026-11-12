// Aturan kecocokan visual-narasi (V1-V6) untuk naskah explainer.
// Semua posisi dihitung dalam indeks kata narasi (bukan frame) agar bisa dicek sebelum audio ada.
// `kata` = modul src/lib/kata.ts ({indexOfWord, parseWords}).

const AKHIR_KLAUSA = /[.,!?;:]$/;
const MAX_KATA_KOSONG = 6;
const DEKAT_X = 18;
const DEKAT_Y = 16;

export const pecahKlausa = (words) => {
  const hasil = [];
  let mulai = 0;
  words.forEach((w, i) => {
    if (AKHIR_KLAUSA.test(w.word) || i === words.length - 1) {
      hasil.push({mulai, akhir: i});
      mulai = i + 1;
    }
  });
  return hasil;
};

const semuaItem = (scene) => [...(scene.utama ? [scene.utama] : []), ...(scene.items ?? [])];

const labelItem = (item) => {
  if (item.src) return `${item.src.split('/').pop()} (${item.masuk ?? 'pop'})`;
  if (item.simbol) return `simbol ${item.simbol}`;
  if (item.teks) return `teks "${item.teks}"`;
  return 'item';
};

/** Indeks masuk item dan kursor awal pencarian aksi/sampai, sama dengan waktuItem di engine. */
const posisiMasuk = (item, words, kata) => {
  if (item.di) {
    const idx = kata.indexOfWord(words, item.di, 0);
    return idx >= 0 ? {masuk: idx, cursor: idx + 1, ada: true} : {masuk: -1, cursor: 0, ada: false};
  }
  return {masuk: 0, cursor: 0, ada: (item.delay ?? 0) <= 15};
};

export const rentangItem = (item, words, kata) => {
  const {masuk, cursor} = posisiMasuk(item, words, kata);
  let keluar = Infinity;
  if (item.sampai) {
    const idx = kata.indexOfWord(words, item.sampai, cursor);
    if (idx >= 0) keluar = idx;
  }
  return {masuk: Math.max(0, masuk), keluar};
};

export const kejadianScene = (scene, words, kata) => {
  const hasil = [];
  const tambah = (idx, label) => {
    if (idx >= 0) hasil.push({idx, label});
  };

  for (const item of semuaItem(scene)) {
    const {masuk, cursor, ada} = posisiMasuk(item, words, kata);
    if (ada) tambah(masuk, labelItem(item));
    let actionCursor = cursor;
    for (const a of item.aksi ?? []) {
      if (!a.di) continue;
      const idx = kata.indexOfWord(words, a.di, actionCursor);
      const fallback = idx >= 0 ? idx : kata.indexOfWord(words, a.di, cursor);
      if (fallback >= 0) {
        tambah(fallback, `${a.type}@${a.di}`);
        actionCursor = fallback + 1;
      }
    }
  }

  const fieldScene = [
    ['di', scene.di],
    ['judulDi', scene.judulDi],
    ['rakitDi', scene.rakitDi],
    ['beban.di', scene.beban?.di],
    ['beban.angkaDi', scene.beban?.angkaDi],
    ['pembagi.di', scene.pembagi?.di],
    ['hasil.di', scene.hasil?.di],
  ];
  for (const [nama, target] of fieldScene) {
    if (target) tambah(kata.indexOfWord(words, target, 0), `${nama}@${target}`);
  }

  // Sama dengan resolvePotongan di src/explainer/diagram.ts: pencarian langkah dirantai.
  let searchFrom = 0;
  for (const [i, l] of (scene.langkah ?? []).entries()) {
    if (!l.di) continue;
    const idx = kata.indexOfWord(words, l.di, searchFrom);
    if (idx >= 0) {
      tambah(idx, `langkah[${i + 1}].di@${l.di}`);
      searchFrom = idx + 1;
    }
  }

  return hasil.sort((a, b) => a.idx - b.idx);
};

const potong = (words, mulai, akhir) =>
  words
    .slice(mulai, akhir + 1)
    .map((w) => w.word)
    .join(' ');

const frasaKunci = (words) => {
  const hasil = [];
  let mulai = -1;
  words.forEach((w, i) => {
    if (w.highlight && mulai < 0) mulai = i;
    if (mulai >= 0 && (!w.highlight || i === words.length - 1)) {
      const akhir = w.highlight ? i : i - 1;
      hasil.push({mulai, akhir});
      mulai = -1;
    }
  });
  return hasil;
};

const SCENE_VISUAL = new Set(['hook', 'stage', 'diagram']);

export const cekVisualScene = (scene, where, words, kata, lapor) => {
  if (!SCENE_VISUAL.has(scene.type) || !words.length) return;
  const kejadian = kejadianScene(scene, words, kata);
  const ada = (mulai, akhir) => kejadian.some((k) => k.idx >= mulai && k.idx <= akhir);

  // V1
  for (const {mulai, akhir} of pecahKlausa(words)) {
    if (!ada(mulai, akhir)) {
      lapor.err(
        where,
        `V1 klausa "${potong(words, mulai, akhir)}" belum punya visual.`,
        `Tambah item dengan di: '${words[mulai].word.replace(/[^\p{L}\p{N}]/gu, '')}' atau aksi yang di-nya jatuh di klausa ini.`,
      );
    }
  }

  // V2
  const titik = [...new Set(kejadian.map((k) => k.idx))];
  const batas = [-1, ...titik, words.length];
  for (let i = 0; i < batas.length - 1; i++) {
    const kosong = batas[i + 1] - batas[i] - 1;
    if (kosong > MAX_KATA_KOSONG) {
      lapor.warn(
        where,
        `V2 ${kosong} kata berturut-turut tanpa perubahan visual: "${potong(words, batas[i] + 1, batas[i + 1] - 1)}".`,
        'Tambah aksi (jump, wiggle, move, pulse) atau item baru di tengah rentang ini.',
      );
    }
  }

  // V3
  for (const {mulai, akhir} of frasaKunci(words)) {
    if (!ada(mulai, akhir)) {
      lapor.warn(
        where,
        `V3 kata kunci "${potong(words, mulai, akhir)}" belum punya visual.`,
        'Pasang item atau aksi dengan di pada salah satu kata di frasa ini.',
      );
    }
  }

  // V6
  const props = semuaItem(scene).filter((it) => it.src);
  for (let i = 0; i < props.length; i++) {
    for (let j = i + 1; j < props.length; j++) {
      const a = props[i];
      const b = props[j];
      const ra = rentangItem(a, words, kata);
      const rb = rentangItem(b, words, kata);
      const beririsan = ra.masuk < rb.keluar && rb.masuk < ra.keluar;
      if (beririsan && Math.abs(a.x - b.x) < DEKAT_X && Math.abs(a.y - b.y) < DEKAT_Y) {
        lapor.warn(
          where,
          `V6 prop ${a.src} dan ${b.src} tampil bersamaan dan saling tumpuk.`,
          `Jauhkan minimal ${DEKAT_X} pada x atau ${DEKAT_Y} pada y, atau samakan sampai item lama dengan di item baru.`,
        );
      }
    }
  }
};

const dipakaiDi = (scene, src) => semuaItem(scene).some((it) => it.src === src);

export const cekProps = (script, props, kata, lapor) => {
  const scenes = script?.scenes ?? [];
  const wordsPerScene = scenes.map((s) => (s.narasi ? kata.parseWords(s.narasi.trim()) : []));

  for (const entry of props) {
    const name = entry?.name ?? '(tanpa nama)';
    const src = `props/${name}.png`;
    const dipakai = scenes.some((s) => dipakaiDi(s, src)) || script?.thumbnail?.src === src;

    if (!dipakai) {
      lapor.warn('props.json', `V5 prop "${name}" tidak dipakai di naskah.`, `Pakai src: '${src}' di scene yang sesuai, atau hapus entrinya.`);
    }

    if (typeof entry?.untuk !== 'string' || !entry.untuk.trim()) {
      lapor.err('props.json', `V4 prop "${name}" belum punya field untuk.`, 'Isi untuk: "<frasa persis dari narasi yang divisualkan prop ini>".');
      continue;
    }

    const cocok = wordsPerScene
      .map((w, i) => (kata.indexOfWord(w, entry.untuk) >= 0 ? i : -1))
      .filter((i) => i >= 0);
    if (!cocok.length) {
      lapor.err('props.json', `V4 frasa untuk "${entry.untuk}" (prop ${name}) tidak ada di narasi.`, 'Salin frasa persis dari narasi scene yang memakai prop ini.');
      continue;
    }
    if (dipakai && !cocok.some((i) => dipakaiDi(scenes[i], src))) {
      const daftar = cocok.map((i) => `scene ${i + 1}`).join(' / ');
      lapor.err(
        'props.json',
        `V4 prop "${name}" untuk "${entry.untuk}" tidak dipakai di ${daftar}.`,
        `Pasang src: '${src}' di ${daftar}, atau ganti untuk dengan frasa dari scene tempat prop ini dipakai.`,
      );
    }
  }
};
