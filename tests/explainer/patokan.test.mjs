import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadScript} from '../../scripts/lib/load-script.mjs';
import {validasiExplainer} from '../../scripts/cek-explainer.mjs';

// Video patokan untuk model AI rendah (lihat bagian "Video Patokan" di .claude/skills/video-explainer/SKILL.md).
// Ketiganya wajib selalu lolos validator tanpa error dan tanpa peringatan.
const PATOKAN = ['nasi-warm', 'potongan-gaji', 'kabel-kendor'];

for (const slug of PATOKAN) {
  test(`patokan ${slug} lolos validator tanpa error dan peringatan`, async () => {
    const script = await loadScript(slug);
    const {errors, warnings} = await validasiExplainer(script, slug);
    assert.deepEqual(errors, []);
    assert.deepEqual(warnings, []);
  });
}

test('daftar patokan di SKILL.md sama dengan daftar yang diuji', () => {
  const skill = fs.readFileSync('.claude/skills/video-explainer/SKILL.md', 'utf8');
  const bagian = skill.split('## Video Patokan')[1]?.split('\n## ')[0] ?? '';
  const slugDiSkill = [...bagian.matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map((m) => m[1]);
  assert.deepEqual(slugDiSkill, PATOKAN);
});
