// Aturan kepadatan motion dan komedi (M1-M6) untuk naskah explainer.

const SFX_KOMEDI = new Set(['boing', 'boom', 'womp', 'slap', 'ding']);
const SFX_DEFAULT_AKSI = {jump: 'boing', peek: 'boing', squash: 'slap'};
const SFX_DEFAULT_SIMBOL = {centang: 'ding', silang: 'slap'};

const semuaItem = (scene) => [...(scene.utama ? [scene.utama] : []), ...(scene.items ?? [])];
const semuaItemVideo = (script) => (script?.scenes ?? []).flatMap(semuaItem);

const sfxEfektif = (sfx, fallback) => (sfx === false ? null : (sfx ?? fallback ?? null));

export const hitungSfxKomedi = (script) => {
  let n = 0;
  for (const item of semuaItemVideo(script)) {
    if (SFX_KOMEDI.has(sfxEfektif(item.sfx, SFX_DEFAULT_SIMBOL[item.simbol]))) n++;
    for (const a of item.aksi ?? []) {
      if (SFX_KOMEDI.has(sfxEfektif(a.sfx, SFX_DEFAULT_AKSI[a.type]))) n++;
    }
  }
  return n;
};

export const cekMotionScene = (scene, where, lapor) => {
  if (scene.type !== 'hook' && scene.type !== 'stage') return;
  const items = semuaItem(scene);
  if (!items.length) return;
  const aksi = items.flatMap((it) => it.aksi ?? []);

  if (aksi.length < 3) {
    lapor.warn(where, `M1 hanya ${aksi.length} aksi di scene ini (minimal 3).`, 'Tambah aksi (jump, wiggle, move, pulse, shake) yang terikat ke kata narasi, sekitar 1 aksi tiap 1,5-2 detik.');
  }
  const jenisMasuk = new Set(items.map((it) => it.masuk ?? 'pop'));
  if (jenisMasuk.size < 2) {
    lapor.warn(where, `M2 semua item masuk dengan gaya yang sama (${[...jenisMasuk].join(', ')}).`, "Variasikan masuk: 'drop', 'slide-left', 'slide-right', 'slide-up', 'grow-up', 'pop'.");
  }
  if (scene.type === 'stage' && !aksi.some((a) => a.type === 'move')) {
    lapor.warn(where, 'M3 scene stage tanpa aksi move.', "Tambah {type: 'move', di: '<kata>', toX, toY} agar objek berpindah posisi di panggung.");
  }
};

export const cekMotionVideo = (script, lapor) => {
  const items = semuaItemVideo(script);
  const aksi = items.flatMap((it) => it.aksi ?? []);

  if (!aksi.some((a) => a.type === 'peek')) {
    lapor.warn('video', 'M4 belum ada aksi peek.', "Tambah {type: 'peek', di: '<kata celetukan>', dx: -16, rotate: -14, tahan: 22} pada karakter/meme.");
  }
  const sfx = hitungSfxKomedi(script);
  if (sfx < 3) {
    lapor.warn('video', `M5 hanya ${sfx} SFX komedi (minimal 3).`, "Pasang sfx 'boing', 'boom', 'womp', 'slap', atau 'ding' pada item/aksi di momen punchline.");
  }
  const adaCeletukan = items.some((it) => it.teks && (it.ukuran ?? 56) <= 32 && (it.rotate ?? 0) !== 0);
  if (!adaCeletukan) {
    lapor.warn('video', 'M6 belum ada teks celetukan mikro.', "Tambah item {kind: 'teks', teks: '<komentar singkat>', ukuran: 30, rotate: -6} di dekat prop.");
  }
};
