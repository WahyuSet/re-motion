import test from 'node:test';
import assert from 'node:assert/strict';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';
import {bacaTabelKomedi} from '../../scripts/lib/explainer-cek/komedi.mjs';

const NARASI = 'Banyak yang antre bensin subuh. Sampai rela datang masih pakai *sarung*.';
const naskah = (items) => ({
  format: 'short',
  scenes: [
    {type: 'stage', duration: 150, latar: 'latar/gandum-tropis-1.png', narasi: NARASI, items},
    {type: 'beat', duration: 45, teks: 'Oke, sini gue jelasin.', narasi: 'Oke sini gue jelasin.'},
  ],
});
const rencana = (baris) =>
  ['# Rencana: Uji', '', '## Komedi', '| # | Jenis | Kalimat joke | Punchline | Visual gag |', '|---|---|---|---|---|', ...baris, '', '## Narasi', 'isi'].join('\n');
const JOKE = '| 1 | sindiran | Sampai rela datang masih pakai sarung. | sarung | orang bersarung antre |';
const JOKE2 = '| 2 | hiperbola | Banyak yang antre bensin subuh. | subuh | jam weker |';
const cek = (items, baris) => validasiExplainer(naskah(items), 'uji-komedi', {props: [], rencana: rencana(baris)});
const ada = (pesan, kode) => pesan.some((m) => m.includes(kode));
const prop = (x) => ({kind: 'prop', src: 'props/meme-kucing-sinis.png', x: 50, y: 50, width: 300, ...x});

test('bacaTabelKomedi membaca baris bernomor', () => {
  const j = bacaTabelKomedi(rencana([JOKE, JOKE2]));
  assert.equal(j.length, 2);
  assert.equal(j[0].punchline, 'sarung');
  assert.equal(j[1].jenis, 'hiperbola');
});

test('K1: kurang dari 2 joke atau jenis tidak dikenal jadi peringatan', async () => {
  const satu = await cek([prop({delay: 0})], [JOKE]);
  assert.ok(ada(satu.warnings, 'K1 bagian "## Komedi" baru berisi 1 joke'), satu.warnings.join(' | '));
  const aneh = await cek([prop({delay: 0})], [JOKE.replace('sindiran', 'receh'), JOKE2]);
  assert.ok(ada(aneh.warnings, 'K1 jenis joke "receh"'), aneh.warnings.join(' | '));
});

test('K2: kalimat tidak ada di narasi, atau punchline di tengah kalimat', async () => {
  const hilang = await cek([prop({delay: 0})], ['| 1 | sindiran | Kalimat yang tidak ada. | ada | x |', JOKE2]);
  assert.ok(ada(hilang.warnings, 'K2 kalimat joke'), hilang.warnings.join(' | '));
  const tengah = await cek([prop({delay: 0})], ['| 1 | sindiran | Sampai rela datang masih pakai sarung. | rela | x |', JOKE2]);
  assert.ok(ada(tengah.warnings, 'ada di tengah kalimat'), tengah.warnings.join(' | '));
});

test('K3: punchline wajib punya visual gag besar ber-SFX komedi', async () => {
  const kosong = await cek([prop({delay: 0})], [JOKE, JOKE2]);
  assert.ok(ada(kosong.warnings, 'K3 punchline "sarung"'), kosong.warnings.join(' | '));
  const kecil = await cek([prop({delay: 0}), prop({x: 70, width: 150, di: 'sarung', sfx: 'womp'})], [JOKE, JOKE2]);
  assert.ok(ada(kecil.warnings, 'K3 punchline "sarung"'), kecil.warnings.join(' | '));
  const pas = await cek([prop({delay: 0, aksi: [{type: 'shake', di: 'subuh', sfx: 'boom'}]}), prop({x: 70, di: 'sarung', sfx: 'womp'})], [JOKE, JOKE2]);
  assert.ok(!ada(pas.warnings, 'K3') && !ada(pas.warnings, 'K2') && !ada(pas.warnings, 'K1'), pas.warnings.join(' | '));
});

test('slug di KOMEDI_LAMA tidak dicek aturan K', async () => {
  const lama = await validasiExplainer(naskah([prop({delay: 0})]), 'bensin-pagi', {props: [], rencana: rencana([])});
  assert.ok(!ada(lama.warnings, 'K1'), lama.warnings.join(' | '));
});

test('K4: gag punchline di ujung scene harus tertahan minimal 1,2 detik', async () => {
  const items = [prop({delay: 0, aksi: [{type: 'shake', di: 'subuh', sfx: 'boom'}]}), prop({x: 70, di: 'sarung', sfx: 'womp'})];
  const mepet = await cek(items, [JOKE, JOKE2]);
  assert.ok(ada(mepet.warnings, 'K4 visual gag punchline "sarung"'), mepet.warnings.join(' | '));
  const tertahan = await validasiExplainer(
    {...naskah(items), scenes: [{...naskah(items).scenes[0], tahan: 30}, naskah(items).scenes[1]]},
    'uji-komedi',
    {props: [], rencana: rencana([JOKE, JOKE2])},
  );
  assert.ok(!ada(tertahan.warnings, 'K4'), tertahan.warnings.join(' | '));
  const keburu = await cek([items[0], prop({x: 70, di: 'pakai', sampai: 'sarung', sfx: 'womp'})], [JOKE, JOKE2]);
  assert.ok(ada(keburu.warnings, 'K3') || ada(keburu.warnings, 'K4'), keburu.warnings.join(' | '));
});
