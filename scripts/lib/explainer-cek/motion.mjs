// Aturan kepadatan motion dan komedi (M1-M6), plus ritme video long (M7-M10).

const KATA_PER_DETIK = 2.4;
const SFX_KOMEDI = new Set(['boing', 'boom', 'womp', 'slap', 'ding', 'fahh', 'ack']);
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

/** Jarak `move` terjauh tiap item, dalam persen lebar kanvas. */
const jarakMove = (item, kanvas) => {
  let x = item.x;
  let y = item.y;
  let maks = 0;
  for (const a of item.aksi ?? []) {
    if (a.type !== 'move') continue;
    const nx = a.toX ?? x;
    const ny = a.toY ?? y;
    maks = Math.max(maks, Math.hypot(nx - x, ((ny - y) * kanvas.h) / kanvas.w));
    x = nx;
    y = ny;
  }
  return maks;
};

const berperaga = (item, ritme, kanvas) =>
  item.src &&
  (item.masuk === 'grow-up' || (item.aksi ?? []).some((a) => a.type === 'grow') || jarakMove(item, kanvas) >= ritme.moveMin);

/** Scene yang memperagakan proses: diagram, atau minimal dua prop yang benar-benar berubah posisi/ukuran. */
const adaPeragaan = (scene, ritme, kanvas) =>
  scene.type === 'diagram' || semuaItem(scene).filter((it) => berperaga(it, ritme, kanvas)).length >= 2;

const sisiUtama = (scene) => {
  const props = semuaItem(scene).filter((it) => it.src && !it.nempel);
  if (!props.length) return null;
  const utama = props.reduce((a, b) => ((b.width ?? 340) > (a.width ?? 340) ? b : a));
  return utama.x < 42 ? 'kiri' : utama.x > 58 ? 'kanan' : 'tengah';
};

export const cekMotionScene = (scene, where, lapor, profil = null) => {
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

  const ritme = profil?.ritme;
  if (!ritme) return;
  const detik = (scene.narasi ?? '').trim().split(/\s+/).filter(Boolean).length / KATA_PER_DETIK;
  const minimal = Math.ceil(detik * ritme.kejadianPerDetik);
  if (items.length + aksi.length < minimal) {
    lapor.warn(where, `M7 baru ${items.length + aksi.length} kejadian visual untuk ±${Math.round(detik)} detik narasi (minimal ${minimal}).`, 'Tambah item atau aksi di kata kunci, atau pecah scene ini jadi dua.');
  }
  if (scene.type === 'stage' && aksi.some((a) => a.type === 'move')) {
    const terjauh = Math.max(...items.map((it) => jarakMove(it, profil.kanvas)));
    if (terjauh < ritme.moveMin) {
      lapor.warn(where, `M8 move terjauh cuma ${terjauh.toFixed(1).replace('.', ',')}% lebar layar (minimal ${ritme.moveMin}%).`, 'Geser objek melintasi panggung sesuai isi narasi, jangan cuma bergeser sedikit.');
    }
  }
};

export const cekMotionVideo = (script, lapor, profil = null) => {
  const items = semuaItemVideo(script);
  const aksi = items.flatMap((it) => it.aksi ?? []);

  if (!aksi.some((a) => a.type === 'peek')) {
    lapor.warn('video', 'M4 belum ada aksi peek.', "Tambah {type: 'peek', di: '<kata celetukan>', dx: -16, rotate: -14, tahan: 22} pada karakter/meme.");
  }
  const sfx = hitungSfxKomedi(script);
  if (sfx < 3) {
    lapor.warn('video', `M5 hanya ${sfx} SFX komedi (minimal 3).`, "Pasang sfx 'fahh', 'ack', 'boing', 'boom', 'womp', 'slap', atau 'ding' pada item/aksi di momen punchline.");
  }
  const celetukanMaks = profil?.teks.celetukanMaks ?? 32;
  const adaCeletukan = items.some((it) => it.teks && (it.ukuran ?? 56) <= celetukanMaks && (it.rotate ?? 0) !== 0);
  if (!adaCeletukan) {
    lapor.warn('video', 'M6 belum ada teks celetukan mikro.', `Tambah item {kind: 'teks', teks: '<komentar singkat>', ukuran: ${Math.min(30 + (celetukanMaks - 32), celetukanMaks)}, rotate: -6} di dekat prop.`);
  }

  const ritme = profil?.ritme;
  if (!ritme) return;
  const scenes = script?.scenes ?? [];

  // M9: objek utama jangan terus di sisi yang sama.
  let sisiLalu = null;
  let beruntun = 0;
  scenes.forEach((scene, i) => {
    const sisi = scene.type === 'stage' ? sisiUtama(scene) : null;
    beruntun = sisi && sisi === sisiLalu ? beruntun + 1 : sisi ? 1 : 0;
    sisiLalu = sisi;
    if (beruntun === ritme.polaBerulangMaks + 1) {
      lapor.warn(`scene ${i + 1} (stage)`, `M9 objek utama sudah ${beruntun} scene berturut-turut di ${sisi}.`, 'Variasikan komposisi: objek besar di tengah, pindah ke sisi lain, atau dua keadaan di x 25 dan 75.');
    }
  });

  // M10: setiap bab isi memperagakan prosesnya, bukan hanya menampilkan gambar diam.
  const bab = [];
  for (const scene of scenes) {
    const judul = typeof scene.bab === 'string' ? scene.bab.trim() : '';
    if (judul || !bab.length) bab.push({judul, scenes: []});
    bab[bab.length - 1].scenes.push(scene);
  }
  for (const b of bab.slice(1, -1)) {
    if (!b.scenes.some((s) => adaPeragaan(s, ritme, profil.kanvas))) {
      lapor.warn(`bab "${b.judul}"`, 'M10 belum ada scene yang memperagakan proses.', "Pakai scene diagram, atau pecah objek jadi minimal 2 prop yang bergerak (move jauh, grow, atau masuk: 'grow-up').");
    }
  }
};
