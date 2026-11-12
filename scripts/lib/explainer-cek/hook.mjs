// Aturan hook, judul, dan file rencana (H1-H4, R1-R2) untuk naskah explainer.

export const KATA_KONTRAS = ['kok', 'kenapa', 'padahal', 'cuma', 'ternyata', 'malah', 'bukan'];
const MAX_BARIS = 28;
const MIN_KATA_HOOK = 7;
const MAX_KATA_HOOK = 14;
const MIN_KANDIDAT = 5;
const MIN_SKOR = 7;

const bersih = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const punyaKontras = (teks) => teks.split(/\s+/).map(bersih).some((w) => KATA_KONTRAS.includes(w));

const cekBaris = (obj, where, lapor, {cekBaris2}) => {
  for (const field of ['baris1', 'baris2']) {
    const val = obj?.[field];
    if (typeof val === 'string' && val.trim().length > MAX_BARIS) {
      lapor.warn(
        where,
        `H3 ${field} "${val}" terlalu panjang (${val.trim().length} karakter, batas ${MAX_BARIS}).`,
        'Ringkas jadi 2-5 kata yang utuh secara logika agar tetap 1 baris.',
      );
    }
  }
  const b2 = obj?.baris2;
  if (cekBaris2 && typeof b2 === 'string' && b2.trim()) {
    const t = b2.trim();
    if (!t.endsWith('?') && !/\d/.test(t) && !punyaKontras(t)) {
      lapor.warn(
        where,
        `H4 baris2 "${t}" belum memancing penasaran.`,
        `Akhiri dengan "?", pakai angka, atau kata kontras (${KATA_KONTRAS.join(', ')}). Lihat referensi/hook-judul.md.`,
      );
    }
  }
};

export const cekHook = (script, kata, lapor, {legacy}) => {
  const scenes = script?.scenes ?? [];
  if (script?.thumbnail) cekBaris(script.thumbnail, 'thumbnail', lapor, {cekBaris2: !legacy});

  for (const [i, scene] of scenes.entries()) {
    if (scene.type !== 'hook') continue;
    const where = `scene ${i + 1} (hook)`;
    cekBaris(scene, where, lapor, {cekBaris2: !legacy});
    if (legacy || !scene.narasi?.trim()) continue;

    const n = kata.parseWords(scene.narasi.trim()).length;
    const rumus = 'Pakai salah satu rumus di referensi/hook-judul.md, 1 kalimat 7-14 kata.';
    if (n > MAX_KATA_HOOK) {
      lapor.warn(where, `H1 Hook narasi terlalu panjang (${n} kata, batas ${MAX_KATA_HOOK} kata / ~3-4 detik).`, rumus);
    } else if (n < MIN_KATA_HOOK) {
      lapor.warn(where, `H1 Hook narasi terlalu pendek (${n} kata, minimal ${MIN_KATA_HOOK}).`, rumus);
    }
    if (!punyaKontras(scene.narasi.replace(/\*/g, ''))) {
      lapor.warn(where, 'H2 hook belum punya kata kontras.', `Masukkan salah satu: ${KATA_KONTRAS.join(', ')}.`);
    }
  }
};

export const bacaTabelHook = (teks) => {
  const isi = teks.replace(/\r\n?/g, '\n');
  const m = isi.match(/^## Hook[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  if (!m) return [];
  const hasil = [];
  for (const line of m[1].split('\n')) {
    const l = line.trim();
    if (!l.startsWith('|') || /^\|\s*-/.test(l)) continue;
    const sel = l.split('|').slice(1, -1).map((c) => c.trim());
    const no = Number(sel[0]);
    if (!sel.length || sel[0] === '#' || !Number.isFinite(no) || sel[0] === '') continue;
    hasil.push({no, total: Number(sel[sel.length - 1])});
  }
  return hasil;
};

export const cekRencana = (teks, lapor) => {
  const where = 'rencana.md';
  if (teks === null || teks === undefined) {
    lapor.warn(where, 'R1 file rencana belum ada.', 'Buat src/explainer/data/<slug>.rencana.md (hook, narasi, peta visual) sebelum menulis naskah.');
    return;
  }
  if (/TODO/.test(teks)) {
    lapor.warn(where, 'R1 rencana masih berisi TODO.', 'Lengkapi semua bagian rencana (hook, narasi, peta visual).');
  }

  const baris = bacaTabelHook(teks).filter((b) => Number.isFinite(b.total));
  if (baris.length < MIN_KANDIDAT) {
    lapor.warn(where, `R2 tabel Hook baru berisi ${baris.length} kandidat bernilai (minimal ${MIN_KANDIDAT}).`, 'Tulis 1 kandidat dari tiap rumus dan isi kolom Total dengan angka.');
  }
  const pilih = teks.match(/Terpilih:\s*#?(\d+)/);
  if (!pilih) {
    lapor.warn(where, 'R2 baris "Terpilih: #N" belum ada.', 'Tulis nomor kandidat dengan Total tertinggi.');
    return;
  }
  const no = Number(pilih[1]);
  const kandidat = baris.find((b) => b.no === no);
  if (!kandidat) {
    lapor.warn(where, `R2 kandidat #${no} tidak ada di tabel Hook.`, 'Samakan nomor Terpilih dengan nomor di tabel.');
  } else if (kandidat.total < MIN_SKOR) {
    lapor.warn(where, `R2 kandidat terpilih #${no} skornya ${kandidat.total} (minimal ${MIN_SKOR}).`, 'Perbaiki hook sampai skor >= 7 atau pilih kandidat lain.');
  }
};
