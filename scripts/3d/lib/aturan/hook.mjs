// H1-H2: klip scene 1 harus langsung memperlihatkan isi hook dan aman dari judul.
import {isiLengkap} from '../katalog.mjs';

export const cekHook = (ktx, klip, lapor) => {
  const entri = klip.find((k) => k.scene === 1);
  if (!entri) return;
  const where = 'klip scene 1';
  const set = ktx.katalog.set[entri.set];
  const isi = isiLengkap(set, entri.isi);
  for (const [kunci, nilai] of Object.entries(set.syarat_hook)) {
    if (isi[kunci] !== nilai) lapor.err(where, `H1 hook harus memakai ${kunci} = "${nilai}", sekarang "${isi[kunci]}".`, `Isi "${kunci}": "${nilai}".`);
  }
  if (!set.kamera[entri.kamera].hook) {
    const boleh = Object.keys(set.kamera).filter((k) => set.kamera[k].hook);
    lapor.err(where, `H2 kamera "${entri.kamera}" tidak boleh dipakai di scene 1.`, `Pilih: ${boleh.join(', ') || 'set lain, set ini tidak punya kamera hook'}.`);
  }
};
