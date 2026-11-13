// Aturan prop bermerek (P1-P4). Produk yang di dunia nyata pasti bermerek (kemasan micin, botol air,
// bungkus mie) memakai merek fiktif channel "<PRODUK> OKE SINI", bukan merek asli. Video kita sering
// membongkar mitos keamanan produk; menampilkan merek asli di situ berisiko hukum.

const POLA_MEREK = /^[A-Z0-9]+( [A-Z0-9]+)* OKE SINI$/;
const MAX_KATA_MEREK = 4;
const MAX_PROP_MEREK = 2;

/**
 * Merek asli yang sering muncul di topik sehari-hari. Cocokkan per kata/frasa, tidak peka huruf besar.
 * Sengaja tanpa merek yang juga kata Inggris umum (apple, shell, hit, grab, sprite, vit) supaya prompt
 * seperti "red apple" atau "egg shell" tidak salah tangkap.
 */
export const MEREK_ASLI = [
  'ajinomoto', 'masako', 'royco', 'indomie', 'mie sedaap', 'sarimi', 'supermi',
  'aqua', 'le minerale', 'nestle', 'dancow', 'frisian flag', 'ultra milk', 'indomilk',
  'teh botol', 'sosro', 'coca cola', 'coca-cola', 'pepsi', 'fanta', 'kapal api', 'nescafe',
  'pertamina', 'pertalite', 'pertamax',
  'samsung', 'iphone', 'xiaomi', 'oppo', 'realme', 'infinix',
  'indomaret', 'alfamart', 'gojek', 'shopee', 'tokopedia',
  'panadol', 'bodrex', 'paramex', 'tolak angin', 'antangin', 'promag', 'mylanta',
  'rinso', 'so klin', 'pepsodent', 'lifebuoy', 'dettol', 'baygon',
];

// Tanpa '-': di mode /u, "\-" di luar kelas karakter dianggap escape tidak sah.
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cariMerekAsli = (teks) =>
  MEREK_ASLI.filter((m) => new RegExp(`(^|[^\\p{L}])${escape(m)}([^\\p{L}]|$)`, 'iu').test(teks));

export const cekMerek = (props, lapor) => {
  const bermerek = props.filter((p) => typeof p?.merek === 'string');
  if (bermerek.length > MAX_PROP_MEREK) {
    lapor.warn(
      'props.json',
      `P3 ada ${bermerek.length} prop bermerek (maks. ${MAX_PROP_MEREK}).`,
      'Merek fiktif hanya untuk subjek video (prop hook/thumbnail). Hapus field merek dari prop pendamping.',
    );
  }

  for (const p of props) {
    const where = `props.json "${p?.name ?? '(tanpa nama)'}"`;
    const prompt = String(p?.prompt ?? '');

    if (typeof p?.merek === 'string') {
      const merek = p.merek.trim();
      if (!POLA_MEREK.test(merek) || merek.split(/\s+/).length > MAX_KATA_MEREK) {
        lapor.warn(
          where,
          `P1 merek "${merek}" tidak sesuai format.`,
          `Tulis "<PRODUK> OKE SINI" huruf kapital, maks. ${MAX_KATA_MEREK} kata, contoh "MICIN OKE SINI", "AIR OKE SINI".`,
        );
      }
      if (!prompt.includes(`reads exactly "${merek}"`)) {
        lapor.warn(
          where,
          `P2 prompt belum memuat teks label persis untuk merek "${merek}".`,
          `Tambahkan ke prompt: a bright red and yellow printed front label that reads exactly "${merek}" in bold capital letters. Setelah generate, buka PNG-nya dan cek ejaannya; kalau salah 2x, pakai node scripts/label-merek.mjs.`,
        );
      }
    }

    const asli = cariMerekAsli(`${prompt} ${p?.merek ?? ''}`);
    if (asli.length) {
      lapor.warn(
        where,
        `P4 prompt menyebut merek asli: ${asli.join(', ')}.`,
        'Ganti dengan produk generik ("MSG seasoning", "mineral water bottle") atau merek fiktif lewat field merek "<PRODUK> OKE SINI".',
      );
    }
  }
};
