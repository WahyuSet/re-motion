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

const zonaAtas = (scene, zona) => {
  if (scene.type === 'hook') return zona.hook;
  if (scene.type === 'beat') return zona.beat;
  if (scene.type === 'stage' && scene.judul) return zona.stageBerjudul;
  return null;
};

// `profil` = ProfilFormat (src/explainer/format.ts); tanpa profil = angka short di atas.
export const cekZona = (scene, where, lapor, ukuran = new Map(), gayaTeks = 'kotak', profil = null) => {
  const aman = profil?.aman ?? BATAS_AMAN;
  const tepiSubtitle = profil?.subtitleAtas ?? TEPI_BAWAH_SUBTITLE;
  const namaAman = profil?.format === 'landscape' ? 'area aman' : 'area aman Shorts';
  const atas = zonaAtas(scene, profil?.zonaJudul ?? TEPI_ATAS_ZONA);
  const landscape = profil?.format === 'landscape';
  for (const [i, item] of semuaItem(scene).entries()) {
    const label = `${where} item ${i + 1}`;
    if (item.nempel && !landscape) {
      lapor.warn(label, 'L4 nempel hanya untuk video long.', 'Hapus nempel; di Shorts tepi bawah layar tertutup caption aplikasi.');
    }
    if (item.teks && (item.ukuran ?? 56) < (profil?.teks.min ?? 0)) {
      lapor.warn(label, `L3 teks ukuran ${item.ukuran} terlalu kecil dibaca di HP (minimal ${profil.teks.min}).`, `Naikkan ukuran ke ${profil.teks.min}-56 dan pendekkan teksnya kalau tidak muat.`);
    }
    if (typeof item.x !== 'number' || typeof item.y !== 'number') continue;
    const k = kotakItem(item, ukuran.get(item.src), gayaTeks, profil);
    if (!k) continue;
    const nempel = landscape ? item.nempel : undefined;

    // A1: keempat tepi kotak di dalam area aman (bukan titik tengahnya).
    const keluar = [
      k.kiri < aman.kiri && nempel !== 'kiri-bawah' && `kiri ${f(k.kiri)}% (min ${f(aman.kiri)})`,
      k.kanan > aman.kanan && nempel !== 'kanan-bawah' && `kanan ${f(k.kanan)}% (maks ${f(aman.kanan)})`,
      k.atas < aman.atas && `atas ${f(k.atas)}% (min ${f(aman.atas)})`,
      k.bawah > aman.bawah && !nempel && `bawah ${f(k.bawah)}% (maks ${f(aman.bawah)})`,
    ].filter(Boolean);
    if (keluar.length) {
      lapor.warn(label, `A1 tepi ${keluar.join(', ')} keluar ${namaAman}.`, 'Geser x/y ke tengah atau kecilkan width sampai keempat tepinya masuk area aman.');
    }

    // L1: tepi atas kotak di bawah judul scene.
    if (atas !== null && k.atas < atas) {
      lapor.warn(label, `L1 tepi atas ${f(k.atas)}% menabrak judul scene ${scene.type} (judul sampai ${atas}%).`, `Turunkan y atau kecilkan width sampai tepi atasnya >= ${atas}%.`);
    }
    // L2: tepi bawah kotak di atas subtitle.
    if (nempel) {
      const {kiri, kanan} = profil.kolomSubtitle;
      if (k.kiri < kanan && k.kanan > kiri) {
        lapor.warn(label, `L2 item nempel masuk kolom subtitle (${kiri}-${kanan}% lebar layar).`, 'Kecilkan width, atau pakai nempel kiri-bawah / kanan-bawah.');
      }
    } else if (k.bawah > tepiSubtitle) {
      lapor.warn(label, `L2 tepi bawah ${f(k.bawah)}% menabrak subtitle (mulai ${tepiSubtitle}%).`, `Naikkan y atau kecilkan width sampai tepi bawahnya <= ${tepiSubtitle}%.`);
    }
  }
};

const NEMPEL_UNTUK_SISI = {bawah: ['bawah', 'kiri-bawah', 'kanan-bawah'], kiri: ['kiri-bawah'], kanan: ['kanan-bawah'], atas: []};
/** Meme dengan pixel setengah tembus sebanyak ini terlihat bolong di atas foto. */
const MEME_TEMBUS_MAKS = 10;

// V7, V8 (long): di layar lebar potongan rata dan bagian tembus pada cutout jauh lebih kelihatan.
export const cekPotongan = (scene, where, lapor, alpha, profil) => {
  if (profil?.format !== 'landscape') return;
  for (const [i, item] of semuaItem(scene).entries()) {
    const info = alpha.get(item.src);
    if (!info || item.bingkai) continue;
    const label = `${where} item ${i + 1}`;
    const nama = item.src.split('/').pop();
    const lepas = Object.keys(info.potong).filter((sisi) => info.potong[sisi] && !NEMPEL_UNTUK_SISI[sisi].includes(item.nempel));
    if (lepas.length) {
      const saran = info.potong.kiri ? 'kiri-bawah' : info.potong.kanan ? 'kanan-bawah' : 'bawah';
      lapor.warn(label, `V7 ${nama} terpotong rata di sisi ${lepas.join(', ')} dan melayang di layar.`, info.potong.atas ? 'Pakai bingkai: true, atau ganti gambar yang utuh.' : `Pakai nempel: '${saran}' supaya potongannya menempel ke tepi layar.`);
    }
    if (item.src.startsWith('props/meme-') && info.tembus >= MEME_TEMBUS_MAKS) {
      lapor.warn(label, `V8 ${nama} punya bagian tembus pandang (${Math.round(info.tembus)}% pixel).`, 'Pilih meme lain di tabel referensi/visual.md bagian "Meme untuk video long".');
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
