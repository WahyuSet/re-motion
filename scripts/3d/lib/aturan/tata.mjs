// Z1, S1, S2: overlay tidak menutupi aksi 3D dan tetap terbaca di atas klip.
import {kotakItem, porsiTumpuk} from '../../../lib/explainer-cek/kotak.mjs';
import {rentangItem} from '../../../lib/explainer-cek/visual.mjs';
import {KANVAS, rencanaKlip} from '../rencana.mjs';
import {durasiScene, kataScene} from '../waktu.mjs';

const BATAS_TUTUP = 0.3;
const TEKS_MIN = 36;
const CELETUKAN = 32;
const SIMBOL_MIN = 120;
const SIMBOL_BAWAAN = 170;

const semuaItem = (scene) => [...(scene.utama ? [scene.utama] : []), ...(scene.items ?? [])];
const labelItem = (item) => item.teks ?? item.simbol ?? item.src ?? 'item';
const adalahTeks = (item) => item.kind === 'teks' || (!item.kind && item.teks);
const adalahSimbol = (item) => item.kind === 'simbol' || (!item.kind && item.simbol);

/** Item pada posisi awal dan pada setiap tujuan aksi move. */
const posisiItem = (item) => {
  const hasil = [item];
  let {x, y} = item;
  for (const a of item.aksi ?? []) {
    if (a.type !== 'move') continue;
    x = a.toX ?? x;
    y = a.toY ?? y;
    hasil.push({...item, x, y});
  }
  return hasil;
};

const cekZona = (ktx, entri, scene, where, lapor) => {
  const rencana = rencanaKlip(ktx, entri);
  if (!rencana.gerak.length) return;
  const durasi = durasiScene(ktx.script, ktx.kataJson, entri.scene - 1, ktx.modul, KANVAS.fps);
  const kata = kataScene(ktx.script, ktx.kataJson, entri.scene - 1, ktx.modul, KANVAS.fps);
  const [kiri, atas, kanan, bawah] = ktx.katalog.set[entri.set].kamera[entri.kamera].zona_subjek;
  const zona = {kiri, atas, kanan, bawah};
  const rentangGerak = rencana.gerak.map((g) => [g.mulai, g.terus ? durasi : g.selesai]);

  for (const item of semuaItem(scene)) {
    const {masuk, keluar} = rentangItem(item, kata, ktx.modul.kata);
    const awal = item.di ? (kata[masuk]?.start ?? 0) : (item.delay ?? 0);
    const akhir = Number.isFinite(keluar) ? kata[keluar].start : durasi;
    if (!rentangGerak.some(([m, s]) => awal < s && akhir > m)) continue;
    const menutupi = posisiItem(item).some((pos) => {
      const kotak = kotakItem(pos, ktx.ukuran.get(item.src), ktx.script.gayaTeks ?? 'kotak');
      return kotak && porsiTumpuk(kotak, zona) > BATAS_TUTUP;
    });
    if (menutupi) {
      lapor.warn(
        where,
        `Z1 item "${labelItem(item)}" menutupi area subjek saat gerak 3D berjalan.`,
        `Pindahkan ke y di bawah ${atas}, y di atas ${bawah}, x di bawah ${kiri}, atau x di atas ${kanan}; atau atur di/sampai agar tampil saat tidak ada gerak.`,
      );
    }
  }
};

export const cekTata = (ktx, klip, lapor) => {
  let celetukanTerpakai = false;
  for (const entri of [...klip].sort((a, b) => a.scene - b.scene)) {
    const where = `klip scene ${entri.scene}`;
    const scene = ktx.script.scenes[entri.scene - 1];
    cekZona(ktx, entri, scene, where, lapor);
    for (const item of semuaItem(scene)) {
      if (adalahTeks(item)) {
        const ukuran = item.ukuran ?? 56;
        if (ukuran >= TEKS_MIN) continue;
        if (ukuran === CELETUKAN && (item.rotate ?? 0) !== 0 && !celetukanTerpakai) {
          celetukanTerpakai = true;
          continue;
        }
        lapor.warn(where, `S1 teks "${item.teks}" berukuran ${ukuran}, terlalu kecil di atas klip.`, `Naikkan ukuran ke minimal ${TEKS_MIN}. Hanya satu celetukan per video yang boleh ukuran ${CELETUKAN} dengan rotate bukan 0.`);
      } else if (adalahSimbol(item) && (item.width ?? SIMBOL_BAWAAN) < SIMBOL_MIN) {
        lapor.warn(where, `S2 simbol "${item.simbol}" selebar ${item.width}, terlalu kecil di atas klip.`, `Naikkan width ke minimal ${SIMBOL_MIN}.`);
      }
    }
  }
};
