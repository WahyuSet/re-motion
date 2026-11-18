// C1-C6: semua pilihan harus ada di katalog dan bisa terlihat di klip.
import {isiLengkap} from '../katalog.mjs';

const pilihan = (obj) => Object.keys(obj).join(', ') || '(tidak ada)';

const cekSet = (ktx, entri, where, lapor) => {
  const set = ktx.katalog.set[entri.set];
  if (set) return set;
  const daftar = Object.entries(ktx.katalog.set)
    .map(([nama, s]) => `${nama} (${s.cocok_untuk})`)
    .join('; ');
  lapor.err(where, `C1 set "${entri.set}" tidak terdaftar.`, `Pilih salah satu: ${daftar}. Kalau tidak ada yang cocok, berhenti dan laporkan "butuh set baru".`);
  return null;
};

const cekIsi = (set, entri, where, lapor) => {
  let sah = true;
  for (const [kunci, nilai] of Object.entries(entri.isi ?? {})) {
    const def = set.isi[kunci];
    if (!def) {
      sah = false;
      lapor.err(where, `C3 isi "${kunci}" tidak terdaftar.`, `Kunci yang boleh: ${pilihan(set.isi)}.`);
    } else if (!def.pilihan.includes(nilai)) {
      sah = false;
      lapor.err(where, `C3 isi ${kunci} = "${nilai}" tidak terdaftar.`, `Pilih: ${def.pilihan.join(', ')}.`);
    }
  }
  return sah;
};

const cekGerak = (set, entri, where, lapor) => {
  const gerak = entri.gerak ?? [];
  const jenis = gerak.map((g) => g.jenis);
  const isi = isiLengkap(set, entri.isi);
  let sah = true;
  const err = (msg, fix) => {
    sah = false;
    lapor.err(where, msg, fix);
  };
  jenis.forEach((j, i) => {
    const def = set.gerak[j];
    if (!def) return err(`C4 gerak "${j}" tidak terdaftar.`, `Pilih: ${pilihan(set.gerak)}.`);
    if (jenis.indexOf(j) !== i) err(`C4 gerak "${j}" ditulis lebih dari sekali.`, 'Sisakan satu.');
    for (const b of def.butuh ?? []) {
      if (!jenis.includes(b)) err(`C5 gerak "${j}" butuh gerak "${b}" di klip yang sama.`, `Tambahkan {"jenis": "${b}", "di": "<kata>"} sebelum "${j}".`);
    }
    for (const [kunci, boleh] of Object.entries(def.syarat_isi ?? {})) {
      if (!boleh.includes(isi[kunci])) {
        err(`C6 gerak "${j}" tidak akan terlihat dengan ${kunci} = "${isi[kunci]}".`, `Ubah isi ${kunci} menjadi ${boleh.join(' atau ')}, atau hapus gerak ini.`);
      }
    }
  });
  return sah;
};

/** Kembalikan hanya entri yang lolos, supaya aturan waktu tidak membaca pilihan yang salah. */
export const cekKatalog = (ktx, lapor) => {
  const klip = (ktx.data.klip ?? []).filter((entri) => {
    const where = `klip scene ${entri.scene}`;
    const set = cekSet(ktx, entri, where, lapor);
    if (!set) return false;
    const kamera = set.kamera[entri.kamera];
    let sah = true;
    if (!kamera || kamera.prop) {
      sah = false;
      const boleh = Object.keys(set.kamera).filter((k) => !set.kamera[k].prop);
      lapor.err(where, `C2 kamera "${entri.kamera}" tidak bisa dipakai untuk klip.`, `Pilih: ${boleh.join(', ')}.`);
    }
    const isiSah = cekIsi(set, entri, where, lapor);
    const gerakSah = isiSah && cekGerak(set, entri, where, lapor);
    return sah && isiSah && gerakSah;
  });

  const gambar = (ktx.data.gambar ?? []).filter((entri) => {
    const where = `gambar "${entri.nama}"`;
    const set = cekSet(ktx, entri, where, lapor);
    if (!set) return false;
    let sah = true;
    if (!set.kamera[entri.kamera]?.prop) {
      sah = false;
      const boleh = Object.keys(set.kamera).filter((k) => set.kamera[k].prop);
      lapor.err(where, `C2 kamera "${entri.kamera}" tidak bisa dipakai untuk gambar.`, `Pilih: ${boleh.join(', ') || 'set lain yang punya kamera prop'}.`);
    }
    return cekIsi(set, entri, where, lapor) && sah;
  });

  return {klip, gambar};
};
