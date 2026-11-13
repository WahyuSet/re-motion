// Aturan komedi tertulis (K1-K3). Meme, SFX, dan teks celetukan (M4-M6) cuma dekorasi;
// yang bikin penonton ketawa adalah kalimat joke di narasi + visual gag tepat di kata punchline.
// Joke direncanakan di bagian "## Komedi" rencana.md, lalu dicek ke naskah.

/** Video yang dibuat sebelum aturan K. Video baru tidak boleh masuk daftar ini. */
export const KOMEDI_LAMA = new Set([
  'air-kadaluwarsa',
  'bensin-pagi',
  'cara-kerja-gps',
  'kabel-kendor',
  'kamar-panas',
  'mundur-makzul',
  'nasi-warm',
  'penggunaan-pajak',
  'potongan-gaji',
  'refleks-kucing',
  'telur-kulkas',
]);

export const JENIS_JOKE = ['sindiran', 'hiperbola', 'perbandingan-absurd', 'personifikasi', 'twist', 'callback'];
const MIN_JOKE = 2;
/** Punchline harus di ujung kalimat: salah satu dari 3 kata terakhir. */
const EKOR_KALIMAT = 3;
/** Prop yang lebih kecil dari ini dianggap tempelan pojok, bukan visual gag. */
const MIN_WIDTH_GAG = 240;
const SFX_KOMEDI = new Set(['boing', 'boom', 'womp', 'slap', 'ding', 'fahh', 'ack']);
const SFX_DEFAULT_AKSI = {jump: 'boing', peek: 'boing', squash: 'slap', shake: 'dum'};
const SFX_DEFAULT_SIMBOL = {centang: 'ding', silang: 'slap', larang: 'dum', retak: 'dum'};

const PANDUAN = 'Lihat referensi/narasi.md bagian "Komedi".';

export const bacaTabelKomedi = (teks) => {
  const isi = (teks ?? '').replace(/\r\n?/g, '\n');
  const m = isi.match(/^## Komedi[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  if (!m) return null;
  const hasil = [];
  for (const line of m[1].split('\n')) {
    const l = line.trim();
    if (!l.startsWith('|') || /^\|\s*-/.test(l)) continue;
    const sel = l.split('|').slice(1, -1).map((c) => c.trim());
    const no = Number(sel[0]);
    if (!Number.isFinite(no) || sel[0] === '') continue;
    hasil.push({no, jenis: (sel[1] ?? '').toLowerCase(), kalimat: sel[2] ?? '', punchline: sel[3] ?? '', gag: sel[4] ?? ''});
  }
  return hasil;
};

const polos = (s) => s.replace(/\*/g, '').trim();

/** Kejadian per kata: item masuk dan aksi, lengkap dengan SFX efektif dan ukuran. */
const kejadianKomedi = (scene, words, kata) => {
  const hasil = [];
  for (const item of [...(scene.utama ? [scene.utama] : []), ...(scene.items ?? [])]) {
    let masuk = -1;
    let cursor = 0;
    if (item.di) {
      masuk = kata.indexOfWord(words, item.di, 0);
      cursor = masuk + 1;
    } else if ((item.delay ?? 0) <= 15) {
      masuk = 0;
    }
    const kind = item.kind ?? (item.simbol ? 'simbol' : item.teks ? 'teks' : 'prop');
    const besar = kind !== 'prop' || (item.width ?? 340) >= MIN_WIDTH_GAG;
    if (masuk >= 0) {
      const sfx = item.sfx === false ? null : (item.sfx ?? SFX_DEFAULT_SIMBOL[item.simbol] ?? null);
      hasil.push({idx: masuk, sfx, besar, label: item.src ?? item.teks ?? item.simbol});
    }
    let ac = cursor;
    for (const a of item.aksi ?? []) {
      if (!a.di) continue;
      const i = kata.indexOfWord(words, a.di, ac);
      const idx = i >= 0 ? i : kata.indexOfWord(words, a.di, cursor);
      if (idx < 0) continue;
      ac = idx + 1;
      const sfx = a.sfx === false ? null : (a.sfx ?? SFX_DEFAULT_AKSI[a.type] ?? null);
      hasil.push({idx, sfx, besar, label: `${a.type}@${a.di}`});
    }
  }
  return hasil;
};

export const cekKomedi = (script, rencana, kata, lapor) => {
  if (rencana === null || rencana === undefined) return; // sudah dilaporkan R1
  const jokes = bacaTabelKomedi(rencana);
  if (!jokes || jokes.length < MIN_JOKE) {
    lapor.warn(
      'rencana.md',
      `K1 bagian "## Komedi" baru berisi ${jokes?.length ?? 0} joke (minimal ${MIN_JOKE}).`,
      `Tulis tabel | # | Jenis | Kalimat joke | Punchline | Visual gag | dengan ${MIN_JOKE}-3 joke dari narasi. Jenis: ${JENIS_JOKE.join(', ')}. ${PANDUAN}`,
    );
    if (!jokes?.length) return;
  }

  const scenes = script?.scenes ?? [];
  const wordsPerScene = scenes.map((s) => (s.narasi ? kata.parseWords(s.narasi.trim()) : []));

  for (const j of jokes) {
    const where = `komedi #${j.no}`;
    if (!JENIS_JOKE.includes(j.jenis)) {
      lapor.warn(where, `K1 jenis joke "${j.jenis}" tidak dikenal.`, `Pilih: ${JENIS_JOKE.join(', ')}.`);
    }
    const kalimat = polos(j.kalimat).replace(/[.?!]+$/, '');
    let si = -1;
    let mulai = -1;
    for (const [i, words] of wordsPerScene.entries()) {
      const idx = kalimat ? kata.indexOfWord(words, kalimat) : -1;
      if (idx >= 0) {
        si = i;
        mulai = idx;
        break;
      }
    }
    if (si < 0) {
      lapor.warn(where, `K2 kalimat joke "${j.kalimat}" tidak ada di narasi.`, 'Salin kalimat joke persis dari narasi (tanpa tanda *), atau tulis jokenya ke narasi.');
      continue;
    }
    const words = wordsPerScene[si];
    const panjang = kalimat.split(/\s+/).length;
    const akhir = mulai + panjang - 1;
    const p = j.punchline ? kata.indexOfWord(words, polos(j.punchline), mulai) : -1;
    if (p < 0 || p > akhir) {
      lapor.warn(where, `K2 punchline "${j.punchline}" tidak ada di kalimat joke.`, 'Isi Punchline dengan kata lucu di kalimat itu.');
      continue;
    }
    if (p < akhir - (EKOR_KALIMAT - 1)) {
      lapor.warn(
        where,
        `K2 punchline "${j.punchline}" ada di tengah kalimat, bukan di ujung.`,
        'Susun ulang kalimat supaya kata lucunya jadi 1-3 kata terakhir; jeda TTS setelah titik memberi waktu penonton ketawa.',
      );
    }
    const gag = kejadianKomedi(scenes[si], words, kata).filter((k) => k.idx === p);
    const kena = gag.some((k) => k.besar && SFX_KOMEDI.has(k.sfx));
    if (!kena) {
      lapor.warn(
        `scene ${si + 1} (${scenes[si].type})`,
        `K3 punchline "${j.punchline}" (komedi #${j.no}) belum punya visual gag ber-SFX komedi di kata itu${gag.length ? ` (ada: ${gag.map((k) => k.label).join(', ')})` : ''}.`,
        `Masukkan prop/meme besar (width >= ${MIN_WIDTH_GAG}) atau teks dengan di: '${j.punchline}' dan sfx fahh/ack/womp/boom/boing/slap, atau aksi shake/jump/squash dengan sfx komedi di kata itu.`,
      );
    }
  }
};
