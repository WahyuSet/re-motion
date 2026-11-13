import type {ExplainerScript} from '../types';

export const refleksKucing: ExplainerScript = {
  format: 'short',
  watermark: false,
  narasiAudio: 'audio/refleks-kucing',
  narasiExt: 'wav',
  youtube: {
    judul: 'Kenapa Kucing Bisa Mendarat dengan Kaki Duluan?',
    deskripsi: 'Refleks membalik tubuh kucing saat jatuh melibatkan tulang belakang lentur dan gerakan bagian depan-belakang tubuh. Ini bukan berarti setiap jatuh aman.',
    tags: ['kucing', 'fisika', 'refleks kucing', 'sains', 'edukasi', 'okesini'],
  },
  thumbnail: {
    baris1: 'KUCING JATUH',
    baris2: 'KOK BISA MUTER?',
    latar: 'latar/refleks-kucing-1.png',
    src: 'props/meme-kucing-paw.png',
  },
  scenes: [
    {
      type: 'hook', duration: 105, latar: 'latar/refleks-kucing-1.png',
      baris1: 'KUCING JATUH', baris2: 'KOK BISA MUTER?',
      narasi: 'Kucing jatuh telentang, kok bisa muter dan mendarat pakai kaki?',
      utama: {kind: 'prop', src: 'props/meme-kucing-paw.png', x: 34, y: 54, width: 320, masuk: 'none', aksi: [{type: 'wiggle', di: 'telentang', durasi: 16}, {type: 'move', di: 'muter', toX: 28, toY: 55, durasi: 16}, {type: 'jump', di: 'pakai kaki', durasi: 16}]},
      items: [
        {kind: 'simbol', simbol: 'tanya', x: 72, y: 35, width: 130, delay: 0, aksi: [{type: 'peek', di: 'kok bisa', sfx: 'boing'}]},
        {kind: 'teks', teks: 'GRAVITASI: BUKAN TOMBOL PUTAR', x: 62, y: 68, ukuran: 27, warna: '#fff', kotak: '#111a22', masuk: 'slide-left', di: 'muter'},
        {kind: 'prop', src: 'props/refleks-kucing-mendarat.png', x: 72, y: 52, width: 300, masuk: 'drop', di: 'mendarat', aksi: [{type: 'jump', di: 'kaki', sfx: 'boing'}]},
      ],
    },
    {
      type: 'stage', duration: 145, latar: 'latar/refleks-kucing-2.png',
      narasi: 'Ada refleks bawaan yang membantu kucing mengenali posisi tubuhnya. Kepala berputar dulu, lalu tulang belakangnya melentur. Badannya bisa menekuk, bukan papan triplek yang jatuh kaku.',
      items: [
        {kind: 'prop', src: 'props/meme-kucing-think.png', x: 30, y: 54, width: 300, masuk: 'slide-up', delay: 0, aksi: [{type: 'wiggle', di: 'refleks bawaan'}, {type: 'move', di: 'kepala berputar', toX: 25, toY: 52}, {type: 'jump', di: 'melentur'}]},
        {kind: 'teks', teks: 'REFLEKS POSISI TUBUH', x: 68, y: 27, ukuran: 29, warna: '#fff', kotak: '#111a22', masuk: 'drop', di: 'refleks bawaan', sampai: 'kepala berputar'},
        {kind: 'prop', src: 'props/meme-kucing-paw.png', x: 70, y: 45, width: 240, masuk: 'slide-right', di: 'kepala berputar', sampai: 'tulang belakangnya', aksi: [{type: 'wiggle', di: 'berputar'}]},
        {kind: 'simbol', simbol: 'panah', x: 52, y: 44, width: 130, di: 'kepala berputar', sampai: 'tulang belakangnya', aksi: [{type: 'pulse', di: 'kepala berputar'}]},
        {kind: 'teks', teks: 'TULANG BELAKANG LENTUR', x: 67, y: 34, ukuran: 30, warna: '#fff', kotak: '#1976d2', masuk: 'drop', sfx: 'boom', di: 'melentur'},
        {kind: 'prop', src: 'props/refleks-kucing-depan-belakang.png', x: 72, y: 50, width: 250, masuk: 'slide-right', di: 'menekuk', sampai: 'triplek', aksi: [{type: 'squash', di: 'menekuk', sfx: 'slap'}]},
        {kind: 'teks', teks: 'BUKAN PAPAN TRIPLEK', x: 70, y: 68, ukuran: 28, warna: '#fff', kotak: '#374151', rotate: -6, masuk: 'slide-right', di: 'triplek'},
      ],
    },
    {type: 'beat', duration: 55, teks: 'Oke, sini gue jelasin.', narasi: 'Oke, *sini gue jelasin* gerakannya.', items: [{kind: 'prop', src: 'props/meme-kucing-jelasin.png', x: 50, y: 58, width: 360, masuk: 'pop', sfx: 'boing', aksi: [{type: 'wiggle', di: 'jelasin'}]}]},
    {
      type: 'stage', duration: 155, latar: 'latar/refleks-kucing-3.png',
      narasi: 'Bagian depan dan belakang tubuh bergerak berlawanan arah. Kaki dirapatkan atau direntangkan untuk mengatur putaran. Momentum sudut total tetap terjaga; kucing mengubah bentuk tubuhnya untuk berputar, bukan menciptakan putaran dari nol.',
      items: [
        {kind: 'prop', src: 'props/refleks-kucing-depan-belakang.png', x: 28, y: 49, width: 300, masuk: 'slide-left', delay: 0, aksi: [{type: 'move', di: 'bagian depan', toX: 25, toY: 47}, {type: 'wiggle', di: 'berlawanan arah'}]},
        {kind: 'prop', src: 'props/kucing-tukang.png', x: 72, y: 49, width: 240, masuk: 'slide-right', di: 'kaki dirapatkan', sampai: 'direntangkan', aksi: [{type: 'pulse', di: 'dirapatkan'}, {type: 'move', di: 'dirapatkan', toX: 70, toY: 49}]},
        {kind: 'prop', src: 'props/kucing-kaget.png', x: 72, y: 49, width: 240, masuk: 'slide-up', di: 'direntangkan', aksi: [{type: 'jump', di: 'direntangkan'}]},
        {kind: 'simbol', simbol: 'panah', x: 50, y: 36, width: 130, di: 'berlawanan arah'},
        {kind: 'teks', teks: 'KAKI RAPAT ↔ RENGGANG', x: 50, y: 27, ukuran: 28, warna: '#fff', kotak: '#1976d2', masuk: 'slide-up', di: 'kaki dirapatkan', sampai: 'momentum sudut', aksi: [{type: 'pulse', di: 'direntangkan'}]},
        {kind: 'teks', teks: 'DEPAN ↻   BELAKANG ↺', x: 50, y: 69, ukuran: 34, warna: '#fff', kotak: '#111a22', masuk: 'drop', sfx: 'boom', di: 'momentum sudut'},
        {kind: 'teks', teks: 'MOMENTUM TOTAL TETAP', x: 50, y: 29, ukuran: 27, warna: '#fff', kotak: '#2e7d32', masuk: 'pop', di: 'tetap terjaga'},
        {kind: 'simbol', simbol: 'centang', x: 84, y: 28, width: 110, di: 'tetap terjaga'},
      ],
    },
    {
      type: 'stage', duration: 110, latar: 'latar/refleks-kucing-4.png',
      narasi: 'Jadi rahasianya refleks membalik tubuh dan badan yang lentur. Tapi jangan dites dari balkon, ya. Refleks bukan sabuk pengaman; jatuh tetap bisa bikin kucing cedera.',
      items: [
        {kind: 'prop', src: 'props/meme-kucing-jempol.png', x: 34, y: 50, width: 300, masuk: 'slide-up', delay: 0, aksi: [{type: 'jump', di: 'rahasianya'}, {type: 'move', di: 'jangan dites', toX: 26, toY: 53}]},
        {kind: 'teks', teks: 'REFLEKS + BADAN LENTUR', x: 68, y: 27, ukuran: 29, warna: '#fff', kotak: '#2e7d32', masuk: 'drop', di: 'lentur'},
        {kind: 'simbol', simbol: 'larang', x: 72, y: 42, width: 150, masuk: 'drop', di: 'balkon', sfx: 'slap', aksi: [{type: 'shake', di: 'cedera'}]},
        {kind: 'teks', teks: 'JANGAN DICOBA', x: 68, y: 64, ukuran: 38, warna: '#fff', kotak: '#d93829', rotate: -4, di: 'balkon'},
        {kind: 'prop', src: 'props/meme-kucing-nangis.png', x: 75, y: 53, width: 220, masuk: 'pop', di: 'cedera', sfx: 'womp'},
      ],
    },
  ],
};
