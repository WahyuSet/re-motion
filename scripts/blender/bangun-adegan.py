# Bangun adegan 3D low-poly dari rencana JSON lalu render jadi PNG sequence (Eevee).
# Dipanggil oleh scripts/blender.mjs, bukan langsung:
#   blender -b --factory-startup -P scripts/blender/bangun-adegan.py -- <rencana.json> <folder-frame> <nama-klip>
#
# Modul opsional: hanya dipakai kalau user meminta klip 3D. Tidak menyentuh engine Remotion.

import json
import math
import os
import sys

import bpy

argv = sys.argv[sys.argv.index('--') + 1 :]
RENCANA, FOLDER_FRAME, NAMA_KLIP = argv[0], argv[1], argv[2]
UJI = len(argv) > 3 and argv[3] == 'uji'  # pratinjau cepat: tiap frame ke-15, resolusi kecil

with open(RENCANA, encoding='utf-8') as f:
    rencana = json.load(f)

FPS = rencana.get('fps', 30)
LEBAR = rencana.get('lebar', 1080)
TINGGI = rencana.get('tinggi', 1920)
klip = next(k for k in rencana['klip'] if k['nama'] == NAMA_KLIP)
FRAME_AKHIR = max(1, round(klip['durasi'] * FPS))


# ---------- warna & bahan ----------

def _linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def warna(hexs):
    h = hexs.lstrip('#')
    r, g, b = (int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))
    return (_linear(r), _linear(g), _linear(b), 1.0)


_bahan = {}


def bahan(hexs, emisi=0.0):
    key = (hexs, emisi)
    if key in _bahan:
        return _bahan[key]
    m = bpy.data.materials.new(f'w{hexs}{emisi}')
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = warna(hexs)
    bsdf.inputs['Roughness'].default_value = 0.85
    if emisi:
        nama_emisi = 'Emission Color' if 'Emission Color' in bsdf.inputs else 'Emission'
        bsdf.inputs[nama_emisi].default_value = warna(hexs)
        bsdf.inputs['Emission Strength'].default_value = emisi
    _bahan[key] = m
    return m


# ---------- bentuk dasar ----------

def _halus(o, lebar=0.02):
    # Sudut sedikit membulat: ciri low-poly "halus"
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = o.modifiers.new('bevel', 'BEVEL')
    mod.width = lebar
    mod.segments = 2


def kotak(nama, posisi, ukuran, hexs, emisi=0.0, bevel=True):
    bpy.ops.mesh.primitive_cube_add(size=1, location=posisi)
    o = bpy.context.active_object
    o.name = nama
    o.scale = ukuran
    if bevel:
        _halus(o, min(0.03, min(ukuran) * 0.3))
    o.data.materials.append(bahan(hexs, emisi))
    return o


def bentuk(spec):
    jenis = spec.get('bentuk', 'kubus')
    pos = spec.get('posisi', [0, 0, 0])
    ukuran = spec.get('ukuran', [1, 1, 1])
    hexs = spec.get('warna', '#CCCCCC')
    if jenis == 'kubus':
        return kotak(spec.get('nama', 'kubus'), pos, ukuran, hexs, spec.get('emisi', 0.0))
    if jenis == 'bola':
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.5, location=pos)
    elif jenis == 'silinder':
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.5, depth=1, location=pos)
    elif jenis == 'kerucut':
        bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.5, depth=1, location=pos)
    else:
        raise ValueError(f'bentuk tidak dikenal: {jenis} (pakai kubus, bola, silinder, kerucut)')
    o = bpy.context.active_object
    o.name = spec.get('nama', jenis)
    o.scale = ukuran
    o.data.materials.append(bahan(hexs, spec.get('emisi', 0.0)))
    return o


def gerakkan(o, spec):
    g = spec.get('gerak')
    if not g:
        return
    o.keyframe_insert('location', frame=1)
    o.keyframe_insert('rotation_euler', frame=1)
    if 'posisi_akhir' in g:
        o.location = g['posisi_akhir']
    if 'putar' in g:
        o.rotation_euler = [math.radians(d) for d in g['putar']]
    o.keyframe_insert('location', frame=FRAME_AKHIR)
    o.keyframe_insert('rotation_euler', frame=FRAME_AKHIR)


# ---------- set ----------

def set_ruang_primitif(w):
    kotak('lantai', (0, 0, -0.05), (8, 8, 0.1), w.get('lantai', '#C9A27E'), bevel=False)
    kotak('dinding-belakang', (0, 4, 1.5), (8, 0.1, 3), w.get('dinding', '#E8DCC8'), bevel=False)
    kotak('dinding-kiri', (-4, 0, 1.5), (0.1, 8, 3), w.get('dinding-samping', '#D9CBB4'), bevel=False)
    plafon = kotak('plafon', (0, 0, 3.05), (8, 8, 0.1), w.get('plafon', '#F4EEE4'), bevel=False)
    plafon.visible_shadow = False  # cahaya matahari tetap masuk dan membentuk bayangan
    kotak('jendela', (1.5, 3.94, 1.7), (1.4, 0.02, 1.2), '#BFE3F5', emisi=1.0, bevel=False)
    kotak('kusen', (1.5, 3.96, 1.7), (1.56, 0.03, 1.36), '#FFFFFF', bevel=False)
    kotak('karpet', (0.8, 0.2, 0.005), (2.4, 1.6, 0.01), w.get('karpet', '#6E8B74'), bevel=False)
    # meja
    mx, my = -1.2, 1.5
    kotak('meja', (mx, my, 0.75), (1.6, 0.9, 0.08), w.get('kayu', '#8B5A3C'))
    for dx in (-0.72, 0.72):
        for dy in (-0.37, 0.37):
            kotak('kaki-meja', (mx + dx, my + dy, 0.375), (0.08, 0.08, 0.75), w.get('kayu', '#8B5A3C'))
    # kursi
    kotak('dudukan-kursi', (-1.2, 0.6, 0.45), (0.5, 0.5, 0.06), w.get('kursi', '#B33A3A'))
    kotak('sandaran-kursi', (-1.2, 0.37, 0.78), (0.5, 0.06, 0.6), w.get('kursi', '#B33A3A'))
    for dx in (-0.21, 0.21):
        for dy in (0.39, 0.81):
            kotak('kaki-kursi', (-1.2 + dx, dy, 0.21), (0.05, 0.05, 0.42), w.get('kayu', '#8B5A3C'))


def _engsel(o, pivot):
    # Putar objek terhadap satu tepi: parent ke empty di titik engsel, lalu putar empty-nya
    bpy.ops.object.empty_add(location=pivot)
    e = bpy.context.active_object
    o.parent = e
    o.matrix_parent_inverse = e.matrix_world.inverted()
    return e


def _key_putar_y(e, derajat, mulai, puncak):
    e.rotation_euler = (0, 0, 0)
    e.keyframe_insert('rotation_euler', frame=1)
    e.keyframe_insert('rotation_euler', frame=mulai)
    e.rotation_euler = (0, math.radians(derajat), 0)
    e.keyframe_insert('rotation_euler', frame=puncak)
    e.keyframe_insert('rotation_euler', frame=FRAME_AKHIR)


def _panah(nama, x, z, arah, hexs):
    # Panah 3D sejajar sumbu X; arah +1 menunjuk ke kanan, -1 ke kiri
    bpy.ops.object.empty_add(location=(x, -0.7, z))
    induk = bpy.context.active_object
    induk.name = nama
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.05, depth=0.5, location=(x - arah * 0.12, -0.7, z), rotation=(0, math.radians(90), 0))
    batang = bpy.context.active_object
    bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.12, depth=0.24, location=(x + arah * 0.25, -0.7, z), rotation=(0, math.radians(90 * arah), 0))
    ujung = bpy.context.active_object
    for o in (batang, ujung):
        o.data.materials.append(bahan(hexs))
        o.parent = induk
        o.matrix_parent_inverse = induk.matrix_world.inverted()
    return induk


def set_potongan_keramik(w):
    # Potongan melintang lantai: tanah, pasir, adukan semen, deretan keramik.
    # Dua keramik tengah terangkat membentuk tenda (keramik "naik sendiri") karena pemuaian dari samping.
    # Lapisan dibuat tebal supaya potongannya jelas di layar tegak 9:16
    kotak('tanah', (0, 0, -0.95), (3, 1.2, 1.3), w.get('tanah', '#7A5236'), bevel=False)
    kotak('pasir', (0, 0, -0.18), (3, 1.2, 0.24), w.get('pasir', '#D8B98A'), bevel=False)
    kotak('adukan', (0, 0, 0.0), (3, 1.2, 0.12), w.get('adukan', '#9A9A96'), bevel=False)
    mulai, puncak = round(FRAME_AKHIR * 0.3), round(FRAME_AKHIR * 0.8)
    for i in range(6):
        x = -1.25 + i * 0.5
        tegel = kotak(f'keramik-{i}', (x, 0, 0.08), (0.48, 1.18, 0.04), w.get('keramik', '#EDE6DA') if i % 2 else w.get('keramik-2', '#E1D7C6'), bevel=True)
        if i == 2:  # engsel di tepi kiri, ujung kanan naik
            _key_putar_y(_engsel(tegel, (x - 0.25, 0, 0.1)), -22, mulai, puncak)
        elif i == 3:  # engsel di tepi kanan, ujung kiri naik
            _key_putar_y(_engsel(tegel, (x + 0.25, 0, 0.1)), 22, mulai, puncak)
    if w.get('panah', True):
        for sisi in (-1, 1):
            p = _panah(f'panah-{sisi}', sisi * 1.15, 0.4, -sisi, w.get('warna-panah', '#E53935'))
            p.keyframe_insert('location', frame=1)
            p.keyframe_insert('location', frame=mulai)
            p.location.x -= sisi * 0.35
            p.keyframe_insert('location', frame=puncak)
            p.keyframe_insert('location', frame=FRAME_AKHIR)


# ---------- jendela (biasa = engsel atas, kebalik = engsel bawah) ----------

def _ke_induk(o, induk):
    o.parent = induk
    o.matrix_parent_inverse = induk.matrix_world.inverted()


def _key_rot(e, sumbu, derajat, mulai, puncak, terbuka_awal=False):
    nol = [0, 0, 0]
    buka = [0, 0, 0]
    buka['xyz'.index(sumbu)] = math.radians(derajat)
    if terbuka_awal:
        e.rotation_euler = buka
        e.keyframe_insert('rotation_euler', frame=1)
        return
    e.rotation_euler = nol
    e.keyframe_insert('rotation_euler', frame=1)
    e.keyframe_insert('rotation_euler', frame=mulai)
    e.rotation_euler = buka
    e.keyframe_insert('rotation_euler', frame=puncak)
    e.keyframe_insert('rotation_euler', frame=FRAME_AKHIR)


def jendela(spec, w):
    """Jendela di dinding yang permukaan depannya di y=-0.1. Daun miring ke luar (-Y)."""
    kebalik = spec.get('jenis', 'kebalik') == 'kebalik'
    x, zc = spec.get('x', 0.0), spec.get('z', 1.6)
    lb, tg = spec.get('lebar', 1.0), spec.get('tinggi', 1.3)
    kayu, kaca = w.get('kusen', '#6B4226'), w.get('kaca', '#9CC7D9')
    yf, t = -0.1, 0.1
    kotak('ruang-dalam', (x, yf - 0.005, zc), (lb, 0.02, tg), w.get('dalam', '#2E2620'), bevel=False)
    kotak('kusen-atas', (x, yf - 0.06, zc + tg / 2 + t / 2), (lb + 2 * t, 0.12, t), kayu)
    kotak('kusen-bawah', (x, yf - 0.08, zc - tg / 2 - t / 2), (lb + 2 * t + 0.08, 0.16, t), kayu)
    kotak('kusen-kiri', (x - lb / 2 - t / 2, yf - 0.06, zc), (t, 0.12, tg), kayu)
    kotak('kusen-kanan', (x + lb / 2 + t / 2, yf - 0.06, zc), (t, 0.12, tg), kayu)
    z_engsel = zc - tg / 2 if kebalik else zc + tg / 2
    bpy.ops.object.empty_add(location=(x, yf - 0.05, z_engsel))
    induk = bpy.context.active_object
    b = 0.07  # lebar bilah daun
    bagian = [
        kotak('daun-atas', (x, yf - 0.05, zc + tg / 2 - b / 2), (lb, 0.05, b), kayu),
        kotak('daun-bawah', (x, yf - 0.05, zc - tg / 2 + b / 2), (lb, 0.05, b), kayu),
        kotak('daun-kiri', (x - lb / 2 + b / 2, yf - 0.05, zc), (b, 0.05, tg), kayu),
        kotak('daun-kanan', (x + lb / 2 - b / 2, yf - 0.05, zc), (b, 0.05, tg), kayu),
        kotak('daun-tengah', (x, yf - 0.05, zc), (lb, 0.04, 0.05), kayu),
        kotak('kaca', (x, yf - 0.05, zc), (lb - 2 * b, 0.02, tg - 2 * b), kaca, bevel=False),
    ]
    for o in bagian:
        _ke_induk(o, induk)
    for dx in (-lb * 0.3, lb * 0.3):  # engsel kuningan; engsel_menyala = disorot untuk scene penjelasan
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.035, depth=0.14, location=(x + dx, yf - 0.08, z_engsel), rotation=(0, math.radians(90), 0))
        e = bpy.context.active_object
        e.data.materials.append(bahan(w.get('engsel', '#E0B43A'), 0.6 if spec.get('engsel_menyala') else 0.0))
    # kebalik: rotasi +X membuat tepi atas maju ke -Y; biasa (engsel atas): rotasi -X membuat tepi bawah maju.
    sudut = spec.get('sudut', 30) * (1 if kebalik else -1)
    mulai = round(FRAME_AKHIR * spec.get('buka_mulai', 0.15))
    puncak = round(FRAME_AKHIR * spec.get('buka_puncak', 0.45))
    _key_rot(induk, 'x', sudut, mulai, puncak, spec.get('terbuka_awal', False))
    return induk


def _jalur_benda(o, titik, mulai, sampai):
    # Pindah lewat beberapa titik, jarak waktu dibagi rata
    for i, p in enumerate(titik):
        f = round(mulai + (sampai - mulai) * i / max(1, len(titik) - 1))
        o.location = p
        o.keyframe_insert('location', frame=max(1, f))


def maling(spec):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.5, location=spec['dari'])
    o = bpy.context.active_object
    o.name = 'karung-maling'
    o.scale = spec.get('ukuran', (0.34, 0.26, 0.4))
    o.data.materials.append(bahan(spec.get('warna', '#3F3F4A')))
    tiba = round(FRAME_AKHIR * spec.get('tiba', 0.45))
    _jalur_benda(o, [spec['dari'], spec.get('lewat', spec['ke']), spec['ke']], 1, tiba)
    # Nyangkut: goyang-goyang sampai akhir klip
    o.rotation_euler = (0, 0, 0)
    o.keyframe_insert('rotation_euler', frame=tiba)
    f, arah = tiba + 5, 1
    while f < FRAME_AKHIR:
        o.rotation_euler = (math.radians(10 * arah), math.radians(6 * arah), 0)
        o.keyframe_insert('rotation_euler', frame=f)
        f, arah = f + 6, -arah


def debu(spec):
    import random

    acak = random.Random(7)
    n = spec.get('jumlah', 30)
    x0, x1 = spec.get('x', (-0.45, 0.45))
    for i in range(n):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=spec.get('besar', 0.03))
        o = bpy.context.active_object
        o.data.materials.append(bahan(spec.get('warna', '#A89C8C')))
        x = acak.uniform(x0, x1)
        siklus = acak.randint(50, 80)
        f = 1 - acak.randint(0, siklus)
        while f < FRAME_AKHIR:
            titik = [
                (x + acak.uniform(-0.3, 0.3), -1.6, acak.uniform(2.3, 2.9)),
                (x, -0.5, 2.18),
                (x + acak.uniform(-0.1, 0.1), 0.2, 1.9),
            ]
            for j, p in enumerate(titik):
                o.location = p
                o.keyframe_insert('location', frame=f + round(siklus * j / 2))
            f += siklus


def set_rumah_luar(w):
    if not w.get('hanya_jendela'):
        kotak('tanah', (0, -2, -0.05), (14, 8, 0.1), w.get('tanah', '#9BB06F'), bevel=False)
        kotak('dinding', (0, 0, 1.75), (7, 0.2, 3.5), w.get('dinding', '#EADFC8'), bevel=False)
        kotak('plint', (0, -0.115, 0.3), (7, 0.03, 0.6), w.get('plint', '#B9A88C'), bevel=False)
        atap = kotak('atap', (0, -0.55, 3.55), (7.6, 1.3, 0.12), w.get('atap', '#B5523B'), bevel=False)
        atap.rotation_euler = (math.radians(-14), 0, 0)
        kotak('lisplang', (0, -1.18, 3.38), (7.6, 0.06, 0.22), w.get('kayu', '#7A4A2A'), bevel=False)
        for px in w.get('pot', [2.4, -2.4]):
            bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.22, depth=0.4, location=(px, -0.5, 0.2))
            bpy.context.active_object.data.materials.append(bahan('#A0522D'))
            bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.42, location=(px, -0.5, 0.75))
            bpy.context.active_object.data.materials.append(bahan('#5E8C4A'))


def _bangun_panah(warna_hex, skala=1.0):
    bpy.ops.object.empty_add(location=(0, 0, 0))
    induk = bpy.context.active_object
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.06 * skala, depth=0.45 * skala, location=(-0.12 * skala, 0, 0), rotation=(0, math.radians(90), 0))
    batang = bpy.context.active_object
    bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.14 * skala, depth=0.26 * skala, location=(0.22 * skala, 0, 0), rotation=(0, math.radians(90), 0))
    ujung = bpy.context.active_object
    for o in (batang, ujung):
        o.data.materials.append(bahan(warna_hex, 0.3))
        _ke_induk(o, induk)
    return induk


def panah_jalan(titik, warna_hex, mulai, siklus, skala=1.0):
    """Panah berjalan menyusuri titik (bidang XZ), berulang tiap `siklus` frame."""
    p = _bangun_panah(warna_hex, skala)
    seg = len(titik) - 1
    f = mulai
    while f < FRAME_AKHIR + siklus:
        for i, q in enumerate(titik):
            # -2: titik akhir tidak boleh jatuh di frame yang sama dengan titik awal siklus berikutnya
            fi = f + round((siklus - 2) * i / seg)
            a, b = (titik[i], titik[i + 1]) if i < seg else (titik[i - 1], titik[i])
            p.location = q
            p.rotation_euler = (0, -math.atan2(b[2] - a[2], b[0] - a[0]), 0)
            p.scale = (0.001,) * 3 if i in (0, seg) else (1, 1, 1)
            p.keyframe_insert('location', frame=fi)
            p.keyframe_insert('rotation_euler', frame=fi)
            p.keyframe_insert('scale', frame=fi)
            if i == 0:
                p.scale = (1, 1, 1)
                p.keyframe_insert('scale', frame=fi + 6)
            if i == seg:
                p.scale = (1, 1, 1)
                p.keyframe_insert('scale', frame=fi - 6)
        f += siklus


def set_potongan_udara(w):
    # Potongan rumah dilihat dari depan: panas naik lalu keluar lewat bukaan atas jendela kebalik (kanan),
    # udara sejuk masuk dari pintu (kiri bawah).
    dinding = w.get('dinding', '#EADFC8')
    kotak('tanah', (0, 0, -0.15), (9, 2.2, 0.1), w.get('tanah', '#9BB06F'), bevel=False)
    kotak('lantai', (0, 0, -0.05), (4.4, 1.6, 0.1), w.get('lantai', '#B08A63'), bevel=False)
    kotak('dinding-belakang', (0, 0.78, 1.4), (4.4, 0.04, 2.8), w.get('dinding-belakang', '#DCCFB6'), bevel=False)
    kotak('dinding-kiri-atas', (-2.1, 0, 2.35), (0.2, 1.6, 0.9), dinding, bevel=False)
    kotak('dinding-kanan-bawah', (2.1, 0, 0.65), (0.2, 1.6, 1.3), dinding, bevel=False)
    kotak('dinding-kanan-atas', (2.1, 0, 2.6), (0.2, 1.6, 0.4), dinding, bevel=False)
    kotak('plafon', (0, 0, 2.9), (4.4, 1.6, 0.2), w.get('plafon', '#F4EEE4'), bevel=False)
    for sisi in (-1, 1):
        a = kotak(f'atap-{sisi}', (sisi * 1.15, 0, 3.5), (2.75, 1.7, 0.12), w.get('atap', '#B5523B'), bevel=False)
        a.rotation_euler = (0, math.radians(24 * sisi), 0)  # sisi kiri naik ke kanan, kanan naik ke kiri
    # daun jendela kebalik dilihat dari samping: engsel di (2.1, 1.3), tepi atas miring ke luar (+X)
    bpy.ops.object.empty_add(location=(2.2, 0, 1.3))
    induk = bpy.context.active_object
    daun = kotak('daun', (2.2, 0, 1.85), (0.06, 1.4, 1.1), w.get('kusen', '#6B4226'))
    _ke_induk(daun, induk)
    _key_rot(induk, 'y', w.get('sudut', 30), 0, 0, terbuka_awal=True)
    siklus = round(FPS * w.get('detik_siklus', 3.2))
    merah, biru = w.get('panas', '#E53935'), w.get('sejuk', '#1E88E5')
    # keluar lewat bukaan atas jendela (z 1.95-2.4), bukan menembus dinding di atasnya
    jalur_panas = [(-0.9, -0.4, 0.4), (0.2, -0.4, 1.6), (1.4, -0.4, 2.2), (3.0, -0.4, 2.15)]
    jalur_sejuk = [(-3.4, -0.4, 0.5), (-2.0, -0.4, 0.45), (-0.6, -0.4, 0.4)]
    for k in range(3):
        panah_jalan(jalur_panas, merah, 1 + k * siklus // 3, siklus)
        panah_jalan(jalur_sejuk, biru, 1 + k * siklus // 3 + siklus // 6, siklus)


SET = {
    'ruang-primitif': set_ruang_primitif,
    'potongan-keramik': set_potongan_keramik,
    'rumah-luar': set_rumah_luar,
    'potongan-udara': set_potongan_udara,
}
INTERIOR = {'ruang-primitif'}  # set dalam ruangan dapat cahaya jendela


# ---------- lampu, dunia, kamera ----------

def lampu(interior):
    bpy.ops.object.light_add(type='SUN', rotation=(math.radians(50), 0, math.radians(-30)))
    sun = bpy.context.active_object.data
    sun.energy = 3.0
    sun.color = (1.0, 0.95, 0.88)
    sun.angle = math.radians(8)  # bayangan lembut
    if not interior:
        return
    # Cahaya dari jendela, menghadap ke dalam ruangan (-Y)
    bpy.ops.object.light_add(type='AREA', location=(1.5, 3.6, 1.8), rotation=(math.radians(-90), 0, 0))
    area = bpy.context.active_object.data
    area.energy = 80
    area.size = 1.5
    area.color = (0.85, 0.93, 1.0)


def dunia(hexs, kekuatan):
    w = bpy.data.worlds.new('dunia')
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = warna(hexs)
    bg.inputs['Strength'].default_value = kekuatan
    bpy.context.scene.world = w


def kamera(spec):
    dari = spec.get('dari', [2.6, -3.2, 2.4])
    ke = spec.get('ke', [2.0, -2.4, 2.1])
    lihat = spec.get('lihat', [-0.6, 1.6, 0.9])
    bpy.ops.object.empty_add(location=lihat)
    target = bpy.context.active_object
    bpy.ops.object.camera_add(location=dari)
    cam = bpy.context.active_object
    cam.data.lens = spec.get('lensa', 26)
    c = cam.constraints.new('TRACK_TO')
    c.target = target
    c.track_axis = 'TRACK_NEGATIVE_Z'
    c.up_axis = 'UP_Y'
    cam.keyframe_insert('location', frame=1)
    cam.location = ke
    cam.keyframe_insert('location', frame=FRAME_AKHIR)
    bpy.context.scene.camera = cam


# ---------- render ----------

def atur_render():
    s = bpy.context.scene
    for engine in ('BLENDER_EEVEE_NEXT', 'BLENDER_EEVEE'):
        try:
            s.render.engine = engine
            break
        except TypeError:
            continue
    if hasattr(s.eevee, 'taa_render_samples'):
        s.eevee.taa_render_samples = rencana.get('sampel', 32)
    if hasattr(s.eevee, 'use_gtao'):
        s.eevee.use_gtao = True
    try:
        s.view_settings.view_transform = 'Standard'  # warna flat cerah, bukan AgX yang pudar
    except TypeError:
        pass
    s.render.resolution_x = LEBAR
    s.render.resolution_y = TINGGI
    s.render.resolution_percentage = 30 if UJI else 100
    s.frame_step = 15 if UJI else 1
    if UJI and hasattr(s.eevee, 'taa_render_samples'):
        s.eevee.taa_render_samples = 8
    s.render.fps = FPS
    s.frame_start = 1
    s.frame_end = FRAME_AKHIR
    s.render.image_settings.file_format = 'PNG'
    # transparan: untuk prop cutout (PNG berlatar bening), bukan klip latar
    s.render.film_transparent = bool(klip.get('transparan'))
    s.render.image_settings.color_mode = 'RGBA' if klip.get('transparan') else 'RGB'
    os.makedirs(FOLDER_FRAME, exist_ok=True)
    s.render.filepath = os.path.join(FOLDER_FRAME, '#####')


bpy.ops.wm.read_factory_settings(use_empty=True)
nama_set = klip.get('set', 'ruang-primitif')
if nama_set not in SET:
    raise ValueError(f'set tidak dikenal: {nama_set} (tersedia: {", ".join(SET)})')
SET[nama_set]({**klip.get('warna', {}), 'hanya_jendela': klip.get('hanya_jendela', False)})
for spec in klip.get('jendela', []):
    jendela(spec, klip.get('warna', {}))
if 'maling' in klip:
    maling(klip['maling'])
if 'debu' in klip:
    debu(klip['debu'])
for spec in klip.get('objek', []):
    gerakkan(bentuk(spec), spec)
lampu(nama_set in INTERIOR)
# Set luar ruangan (diorama): latar langsung terlihat, jadi dibuat penuh supaya krem, bukan abu-abu
dunia(klip.get('langit', '#F3EBDD'), 0.6 if nama_set in INTERIOR else 1.0)
kamera(klip.get('kamera', {}))
atur_render()
bpy.ops.render.render(animation=True)
print(f'[bangun-adegan] selesai: {NAMA_KLIP}, {FRAME_AKHIR} frame -> {FOLDER_FRAME}')
