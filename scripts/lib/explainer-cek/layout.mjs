// Aturan tata letak (L1, L2): item tidak boleh menabrak judul scene atau subtitle.
// Batas diambil dari posisi elemen tetap di engine:
// - HookScene: judul 2 baris mulai top 15%, selesai sekitar 32%.
// - StageScene: banner judul di top 16%, satu baris sampai sekitar 21%.
// - BeatScene: banner teks di top 18% saat ada item.
// - Subtitle: bottom 430 px dari 1920 px (kotaknya mulai sekitar y 74%).

const BATAS_ATAS = {hook: 36, stageBerjudul: 26, beat: 28};
const BATAS_BAWAH = 70;

const semuaItem = (scene) => [...(scene.utama ? [scene.utama] : []), ...(scene.items ?? [])];

const batasAtas = (scene) => {
  if (scene.type === 'hook') return BATAS_ATAS.hook;
  if (scene.type === 'beat') return BATAS_ATAS.beat;
  if (scene.type === 'stage' && scene.judul) return BATAS_ATAS.stageBerjudul;
  return null;
};

export const cekZona = (scene, where, lapor) => {
  const atas = batasAtas(scene);
  for (const [i, item] of semuaItem(scene).entries()) {
    if (typeof item.y !== 'number') continue;
    const label = `${where} item ${i + 1}`;
    if (atas !== null && item.y < atas) {
      lapor.warn(
        label,
        `L1 y=${item.y} menabrak judul scene ${scene.type} (zona judul sampai y ${atas}).`,
        `Turunkan item ke y >= ${atas}, atau taruh di sisi kiri/kanan judul dengan width kecil.`,
      );
    }
    if (item.y > BATAS_BAWAH) {
      lapor.warn(
        label,
        `L2 y=${item.y} terlalu dekat subtitle (subtitle mulai sekitar y 74).`,
        `Naikkan item ke y <= ${BATAS_BAWAH}; prop besar sebaiknya y <= 64.`,
      );
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
