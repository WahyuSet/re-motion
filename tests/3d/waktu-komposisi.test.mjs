import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import {bukaKomposisi, tutup} from '../../scripts/lib/komposisi.mjs';
import {loadScript} from '../../scripts/lib/load-script.mjs';
import {durasiScene, muatKataJson, muatModulWaktu} from '../../scripts/3d/lib/waktu.mjs';

after(tutup);

for (const [id, slug] of [['AirEs', 'air-es'], ['JendelaKebalik', 'jendela-kebalik'], ['PlafonTinggi', 'plafon-tinggi']]) {
  test(`durasi ${slug} sama dengan komposisi Remotion`, async () => {
    const modul = await muatModulWaktu();
    const script = await loadScript(slug);
    const kataJson = muatKataJson(script);
    const {composition} = await bukaKomposisi(id);
    assert.deepEqual([composition.fps, composition.width, composition.height], [30, 1080, 1920]);
    const total = script.scenes.reduce(
      (jumlah, scene, i) =>
        jumlah + durasiScene(script, kataJson, i, modul) - (i ? modul.kata.transitionFrames(scene.transition ?? 'none') : 0),
      0,
    );
    assert.equal(total, composition.durationInFrames);
  });
}
