// W1-W5: setiap gerak terikat pada kata narasi dan muat di dalam scene.
import {KANVAS, waktuGerak} from '../rencana.mjs';
import {cariKata, durasiScene, kataScene} from '../waktu.mjs';

const cekKataScene = (ktx, entri, where, lapor) => {
  const i = entri.scene - 1;
  const scene = ktx.script.scenes[i];
  if (!scene.narasi) return true;
  const audio = `public/${ktx.script.narasiAudio ?? `audio/${ktx.slug}`}/kata.json`;
  const fix = `Buat ulang ${audio} dari audio scene ini, lalu ulangi cek.`;
  if (!ktx.kataJson) {
    lapor.err(where, `W1 ${audio} belum ada.`, fix);
    return false;
  }
  const kata = ktx.kataJson[String(i)];
  if (!kata?.length) {
    lapor.err(where, `W1 ${audio} tidak punya entri "${i}" untuk scene ini.`, fix);
    return false;
  }
  const jumlah = ktx.modul.kata.parseWords(scene.narasi.trim()).length;
  if (kata.length !== jumlah) {
    lapor.err(where, `W1 narasi punya ${jumlah} kata, tetapi kata.json punya ${kata.length}.`, fix);
    return false;
  }
  return true;
};

export const cekWaktu = (ktx, klip, lapor) =>
  klip.filter((entri) => {
    const where = `klip scene ${entri.scene}`;
    if (!cekKataScene(ktx, entri, where, lapor)) return false;
    const kata = kataScene(ktx.script, ktx.kataJson, entri.scene - 1, ktx.modul, KANVAS.fps);
    const daftarKata = kata.map((w) => ktx.modul.kata.normalizeWord(w.word)).join(' ');
    let sah = true;
    const err = (msg, fix) => {
      sah = false;
      lapor.err(where, msg, fix);
    };

    const terbaca = (entri.gerak ?? []).filter((g) => {
      const hasil = cariKata(kata, String(g.di ?? ''), g.ke ?? 1, ktx.modul);
      if (!hasil.jumlah) {
        err(`W2 kata "${g.di ?? ''}" untuk gerak "${g.jenis}" tidak ada di narasi.`, `Pilih kata dari: ${daftarKata}.`);
        return false;
      }
      if (hasil.idx < 0) {
        err(`W3 kata "${g.di}" hanya muncul ${hasil.jumlah} kali, "ke" tertulis ${g.ke}.`, `Isi "ke" antara 1 dan ${hasil.jumlah}.`);
        return false;
      }
      return true;
    });

    const durasi = durasiScene(ktx.script, ktx.kataJson, entri.scene - 1, ktx.modul, KANVAS.fps);
    const waktu = new Map(terbaca.map((g) => [g.jenis, waktuGerak(ktx, entri, g)]));
    for (const [jenis, w] of waktu) {
      if (w.selesai > durasi) {
        err(`W4 gerak "${jenis}" selesai di frame ${w.selesai}, scene berakhir di frame ${durasi}.`, 'Pilih kata pemicu yang lebih awal.');
      }
      for (const b of ktx.katalog.set[entri.set].gerak[jenis].butuh ?? []) {
        const dulu = waktu.get(b);
        if (dulu && w.mulai < dulu.selesai) {
          err(`W5 gerak "${jenis}" mulai di frame ${w.mulai}, sebelum "${b}" selesai di frame ${dulu.selesai}.`, `Pilih kata pemicu yang lebih akhir untuk "${jenis}" atau lebih awal untuk "${b}".`);
        }
      }
    }
    return sah;
  });
