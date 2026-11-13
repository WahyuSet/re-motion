// Pilih frame cek yang rapat: tiap item masuk (+6 frame) dan mulai keluar (+4 frame, saat serah-terima),
// ditambah titik 35% dan 85% durasi scene. Dipakai `node scripts/cek-frame.mjs <slug> --rapat`.
const PERSEN = [0.35, 0.85];
const JARAK_PEMICU = 2;
const JARAK_PERSEN = 4;

export const frameRapat = (scene, words, waktuItem) => {
  const durasi = scene.duration;
  const items = [...(scene.utama ? [scene.utama] : []), ...(scene.items ?? [])];
  const pemicu = [];
  for (const item of items) {
    const {masukAt, keluarAt} = waktuItem(item, words, durasi);
    pemicu.push(masukAt + 6);
    if (Number.isFinite(keluarAt)) pemicu.push(keluarAt + 4);
  }
  const dalam = (f) => f >= 0 && f < durasi;
  const hasil = [];
  for (const f of [...new Set(pemicu.filter(dalam))].sort((a, b) => a - b)) {
    if (!hasil.length || f - hasil[hasil.length - 1] >= JARAK_PEMICU) hasil.push(f);
  }
  for (const p of PERSEN) {
    const f = Math.round(durasi * p);
    if (dalam(f) && hasil.every((x) => Math.abs(x - f) >= JARAK_PERSEN)) hasil.push(f);
  }
  return hasil.sort((a, b) => a - b);
};
