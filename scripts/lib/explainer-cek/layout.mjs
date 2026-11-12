// Aturan tata letak (A1, L1, L2) dihitung dari kotak sebenarnya tiap item (lihat kotak.mjs).
// Batas diambil dari posisi elemen tetap di engine (kanvas 1080x1920):
// - Area aman SAFE_SHORT: kiri 6,5%, kanan 86,1%, atas 12,5%, bawah 78,1%.
// - HookScene: judul 2 baris mulai top 15%, bawahnya sekitar 27%.
// - StageScene: banner judul di top 16%, bawahnya sekitar 21%.
// - BeatScene: banner teks di top 18%, bawahnya sekitar 23%.
// - Subtitle: kotaknya mulai sekitar y 74% (bottom 430 px).
import {BATAS_AMAN, kotakItem} from './kotak.mjs';

const TEPI_ATAS_ZONA = {hook: 28, stageBerjudul: 22, beat: 24};
const TEPI_BAWAH_SUBTITLE = 73.5;

const semuaItem = (scene) => [...(scene.utama ? [scene.utama] : []), ...(scene.items ?? [])];
const f = (n) => n.toFixed(1).replace('.', ',');

const zonaAtas = (scene) => {
  if (scene.type === 'hook') return TEPI_ATAS_ZONA.hook;
  if (scene.type === 'beat') return TEPI_ATAS_ZONA.beat;
  if (scene.type === 'stage' && scene.judul) return TEPI_ATAS_ZONA.stageBerjudul;
  return null;
};

export const cekZona = (scene, where, lapor, ukuran = new Map()) => {
  const atas = zonaAtas(scene);
  for (const [i, item] of semuaItem(scene).entries()) {
    if (typeof item.x !== 'number' || typeof item.y !== 'number') continue;
    const k = kotakItem(item, ukuran.get(item.src));
    if (!k) continue;
    const label = `${where} item ${i + 1}`;

    // A1: keempat tepi kotak di dalam area aman (bukan titik tengahnya).
    const keluar = [
      k.kiri < BATAS_AMAN.kiri && `kiri ${f(k.kiri)}% (min ${f(BATAS_AMAN.kiri)})`,
      k.kanan > BATAS_AMAN.kanan && `kanan ${f(k.kanan)}% (maks ${f(BATAS_AMAN.kanan)})`,
      k.atas < BATAS_AMAN.atas && `atas ${f(k.atas)}% (min ${f(BATAS_AMAN.atas)})`,
      k.bawah > BATAS_AMAN.bawah && `bawah ${f(k.bawah)}% (maks ${f(BATAS_AMAN.bawah)})`,
    ].filter(Boolean);
    if (keluar.length) {
      lapor.warn(label, `A1 tepi ${keluar.join(', ')} keluar area aman Shorts.`, 'Geser x/y ke tengah atau kecilkan width sampai keempat tepinya masuk area aman.');
    }

    // L1: tepi atas kotak di bawah judul scene.
    if (atas !== null && k.atas < atas) {
      lapor.warn(label, `L1 tepi atas ${f(k.atas)}% menabrak judul scene ${scene.type} (judul sampai ${atas}%).`, `Turunkan y atau kecilkan width sampai tepi atasnya >= ${atas}%.`);
    }
    // L2: tepi bawah kotak di atas subtitle.
    if (k.bawah > TEPI_BAWAH_SUBTITLE) {
      lapor.warn(label, `L2 tepi bawah ${f(k.bawah)}% menabrak subtitle (mulai ${TEPI_BAWAH_SUBTITLE}%).`, `Naikkan y atau kecilkan width sampai tepi bawahnya <= ${TEPI_BAWAH_SUBTITLE}%.`);
    }
  }
};

// Aturan scene beat (B1-B4): jeda "Oke, sini gue jelasin." yang seragam di semua video.
export const TEKS_BEAT = 'Oke, sini gue jelasin.';
export const MEME_BEAT = 'props/meme-kucing-jelasin.png';

export const cekBeat = (scene, where, lapor) => {
  if (scene.type !== 'beat') return;
  if (scene.latar) {
    lapor.err(where, 'B1 scene beat tidak boleh punya latar.', 'Hapus field latar; beat selalu memakai kanvas krem.');
  }
  if (scene.teks !== TEKS_BEAT) {
    lapor.warn(where, `B2 teks beat "${scene.teks}" bukan teks standar.`, `Pakai teks: '${TEKS_BEAT}'. Narasinya boleh dilanjutkan, contoh "Oke, *sini gue jelasin* penyebabnya."`);
  }
  const items = scene.items ?? [];
  if (!items.some((it) => it.src === MEME_BEAT)) {
    lapor.warn(where, 'B3 scene beat belum memakai meme kucing jelasin.', `Tambah item {kind: 'prop', src: '${MEME_BEAT}', x: 50, y: 54, width: 340, masuk: 'pop'}.`);
  }
  for (const [i, item] of items.entries()) {
    if (item.sfx !== undefined && item.sfx !== false) {
      lapor.warn(`${where} item ${i + 1}`, `B4 sfx '${item.sfx}' bertabrakan dengan bunyi pop banner beat.`, 'Hapus field sfx pada item di scene beat.');
    }
  }
};
