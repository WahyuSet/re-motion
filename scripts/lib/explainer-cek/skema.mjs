// Pagar skema naskah explainer (S1, S2): nilai enum dan field aksi harus dikenal engine.
// Daftar di sini wajib sama dengan union type di src/explainer/types.ts
// dan field yang benar-benar dibaca hitungTransformItem di src/explainer/timing.ts.

export const MASUK = ['pop', 'drop', 'slide-left', 'slide-right', 'slide-up', 'grow-up', 'fade', 'none'];
export const KELUAR = ['fade', 'pop-out', 'slide-left', 'slide-right', 'slide-down', 'none'];
export const SIMBOL = ['larang', 'centang', 'silang', 'panah', 'tanya', 'retak', 'tetes-air', 'gelombang-air'];
export const SFX = ['whoosh', 'dum', 'tik', 'pop', 'swell', 'boing', 'boom', 'womp', 'slap', 'ding', 'fahh', 'ack'];
export const TIPE_AKSI = ['move', 'peek', 'grow', 'dim', 'shake', 'pulse', 'jump', 'wiggle', 'squash'];

const FIELD_UMUM = ['type', 'di', 'delay', 'durasi', 'sfx'];

export const FIELD_AKSI = {
  move: ['toX', 'toY', 'toScale', 'toRotate'],
  peek: ['dx', 'dy', 'rotate', 'tahan'],
  grow: ['toScale', 'toScaleX', 'toScaleY'],
  dim: ['toOpacity', 'to'],
  shake: ['intensitas'],
  pulse: ['sampai', 'skala'],
  jump: ['dy'],
  wiggle: ['rotate'],
  squash: [],
};

const cekEnum = (nilai, daftar, nama, where, lapor) => {
  if (nilai === undefined) return;
  if (!daftar.includes(nilai)) {
    lapor.err(where, `S1 ${nama} "${nilai}" tidak dikenal engine.`, `Pilih salah satu: ${daftar.join(', ')}`);
  }
};

const cekSfx = (nilai, where, lapor) => {
  if (nilai === undefined || nilai === false) return;
  cekEnum(nilai, SFX, 'sfx', where, lapor);
};

export const cekSkemaItem = (item, where, lapor) => {
  cekEnum(item.masuk, MASUK, 'masuk', where, lapor);
  cekEnum(item.keluar, KELUAR, 'keluar', where, lapor);
  cekEnum(item.simbol, SIMBOL, 'simbol', where, lapor);
  cekSfx(item.sfx, where, lapor);

  for (const [ai, aksi] of (item.aksi ?? []).entries()) {
    const whereAksi = `${where} aksi[${ai + 1}]`;
    if (!TIPE_AKSI.includes(aksi.type)) {
      lapor.err(whereAksi, `S1 type "${aksi.type}" tidak dikenal engine.`, `Pilih salah satu: ${TIPE_AKSI.join(', ')}`);
      continue;
    }
    cekSfx(aksi.sfx, whereAksi, lapor);
    const boleh = [...FIELD_UMUM, ...FIELD_AKSI[aksi.type]];
    for (const field of Object.keys(aksi)) {
      if (!boleh.includes(field)) {
        lapor.warn(
          whereAksi,
          `S2 field '${field}' diabaikan engine untuk aksi type '${aksi.type}'.`,
          `Field yang dibaca untuk '${aksi.type}': ${boleh.join(', ')}`,
        );
      }
    }
  }
};
