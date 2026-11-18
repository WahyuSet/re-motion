# Bahan bersama semua set: bentuk, keyframe, lampu, kamera, dan pengaturan render.
# Frame di sini berbasis 0 dan sama dengan frame lokal scene di Remotion.

import math
import os

import bpy

GERAK = {}
_rencana = {}
_bahan = {}
_skala_asli = {}


def gerak(nama):
    """Daftarkan fungsi gerak dengan nama yang sama seperti di katalog.json."""

    def daftar(fungsi):
        GERAK[nama] = fungsi
        return fungsi

    return daftar


def mulai(rencana_baru):
    _rencana.clear()
    _rencana.update(rencana_baru)
    _bahan.clear()
    _skala_asli.clear()
    GERAK.clear()


def rencana():
    return _rencana


def pakai_lingkungan():
    """False saat merender prop transparan: hanya bendanya yang dibangun."""
    return not _rencana.get("transparan", False)


# ---------- warna dan bahan ----------


def _linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def warna(hexs):
    h = hexs.lstrip("#")
    r, g, b = (int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))
    return (_linear(r), _linear(g), _linear(b), 1.0)


def _nama_emisi(bsdf):
    return "Emission Color" if "Emission Color" in bsdf.inputs else "Emission"


def bahan(hexs, emisi=0.0, unik=False):
    kunci = (hexs, emisi)
    if not unik and kunci in _bahan:
        return _bahan[kunci]
    m = bpy.data.materials.new(f"w{hexs}{emisi}")
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = warna(hexs)
    bsdf.inputs["Roughness"].default_value = 0.85
    bsdf.inputs[_nama_emisi(bsdf)].default_value = warna(hexs)
    bsdf.inputs["Emission Strength"].default_value = emisi
    if not unik:
        _bahan[kunci] = m
    return m


# ---------- bentuk ----------


def _aktif(nama, hexs, emisi=0.0):
    o = bpy.context.active_object
    o.name = nama
    o.data.materials.append(bahan(hexs, emisi))
    return o


def kotak(nama, posisi, ukuran, hexs, emisi=0.0, bevel=True):
    bpy.ops.mesh.primitive_cube_add(size=1, location=posisi)
    o = bpy.context.active_object
    o.name = nama
    o.scale = ukuran
    if bevel:
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mod = o.modifiers.new("bevel", "BEVEL")
        mod.width = min(0.03, min(ukuran) * 0.3)
        mod.segments = 2
    o.data.materials.append(bahan(hexs, emisi))
    return o


def bola(nama, posisi, radius, hexs, emisi=0.0, subdivisi=2):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisi, radius=radius, location=posisi)
    return _aktif(nama, hexs, emisi)


def silinder(nama, posisi, radius, tinggi, hexs, emisi=0.0, rotasi=(0, 0, 0), sisi=12):
    bpy.ops.mesh.primitive_cylinder_add(vertices=sisi, radius=radius, depth=tinggi, location=posisi, rotation=rotasi)
    return _aktif(nama, hexs, emisi)


def kerucut(nama, posisi, radius, tinggi, hexs, emisi=0.0, rotasi=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=radius, depth=tinggi, location=posisi, rotation=rotasi)
    return _aktif(nama, hexs, emisi)


def kosong(posisi):
    bpy.ops.object.empty_add(location=posisi)
    return bpy.context.active_object


def ke_induk(o, induk):
    o.parent = induk
    o.matrix_parent_inverse = induk.matrix_world.inverted()


def engsel(o, pivot):
    """Parent objek ke empty di titik putar, lalu kembalikan empty itu."""
    e = kosong(pivot)
    ke_induk(o, e)
    return e


def panah(nama, hexs, skala=1.0, emisi=0.3):
    """Panah menghadap +X dengan titik asal di tengah."""
    induk = kosong((0, 0, 0))
    induk.name = nama
    samping = (0, math.radians(90), 0)
    batang = silinder(f"{nama}-batang", (-0.12 * skala, 0, 0), 0.06 * skala, 0.45 * skala, hexs, emisi, samping)
    ujung = kerucut(f"{nama}-ujung", (0.22 * skala, 0, 0), 0.14 * skala, 0.26 * skala, hexs, emisi, samping)
    ke_induk(batang, induk)
    ke_induk(ujung, induk)
    return induk


# ---------- keyframe ----------


def ubah(o, jalur, nilai, mulai_f, selesai_f):
    """Dari nilai saat `mulai_f` ke `nilai` saat `selesai_f`, jadi gerak berurutan saling menyambung."""
    bpy.context.scene.frame_set(mulai_f)
    o.keyframe_insert(jalur, frame=mulai_f)
    setattr(o, jalur, nilai)
    o.keyframe_insert(jalur, frame=selesai_f)


def sembunyi(o):
    """Objek tidak terlihat sampai `tampil` dipanggil oleh geraknya."""
    _skala_asli[o.name] = tuple(o.scale)
    o.scale = (0.001, 0.001, 0.001)
    o.keyframe_insert("scale", frame=0)


def tampil(o, frame):
    o.keyframe_insert("scale", frame=max(0, frame - 1))
    o.scale = _skala_asli[o.name]
    o.keyframe_insert("scale", frame=frame)


# ---------- lampu, dunia, kamera, render ----------


def lampu(interior):
    bpy.ops.object.light_add(type="SUN", rotation=(math.radians(50), 0, math.radians(-30)))
    sun = bpy.context.active_object.data
    sun.energy = 3.0
    sun.color = (1.0, 0.95, 0.88)
    sun.angle = math.radians(8)
    if not interior:
        return
    bpy.ops.object.light_add(type="AREA", location=(1.5, 3.6, 1.8), rotation=(math.radians(-90), 0, 0))
    area = bpy.context.active_object.data
    area.energy = 80
    area.size = 1.5
    area.color = (0.85, 0.93, 1.0)


def dunia(hexs, kekuatan):
    w = bpy.data.worlds.new("dunia")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = warna(hexs)
    bg.inputs["Strength"].default_value = kekuatan
    bpy.context.scene.world = w


def kamera(spec, frame_akhir):
    target = kosong(spec["lihat"])
    bpy.ops.object.camera_add(location=spec["dari"])
    cam = bpy.context.active_object
    cam.data.lens = spec["lensa"]
    c = cam.constraints.new("TRACK_TO")
    c.target = target
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    cam.keyframe_insert("location", frame=0)
    cam.location = spec["ke"]
    cam.keyframe_insert("location", frame=max(1, frame_akhir - 1))
    bpy.context.scene.camera = cam


def atur_render(folder, uji):
    s = bpy.context.scene
    r = _rencana
    for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
        try:
            s.render.engine = engine
            break
        except TypeError:
            continue
    if hasattr(s.eevee, "taa_render_samples"):
        s.eevee.taa_render_samples = 8 if uji else 32
    if hasattr(s.eevee, "use_gtao"):
        s.eevee.use_gtao = True
    try:
        s.view_settings.view_transform = "Standard"
    except TypeError:
        pass
    s.render.resolution_x = r["lebar"]
    s.render.resolution_y = r["tinggi"]
    s.render.resolution_percentage = 30 if uji else 100
    s.render.fps = r["fps"]
    s.frame_start = 0
    s.frame_end = r["frame_akhir"] - 1
    s.frame_step = 15 if uji else 1
    s.frame_set(0)
    s.render.image_settings.file_format = "PNG"
    s.render.film_transparent = bool(r["transparan"])
    s.render.image_settings.color_mode = "RGBA" if r["transparan"] else "RGB"
    os.makedirs(folder, exist_ok=True)
    s.render.filepath = os.path.join(folder, "#####")
