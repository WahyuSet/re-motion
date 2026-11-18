# Dinding luar rumah dengan jendela biasa (engsel atas) atau kebalik (engsel bawah).

import math
import random

import bpy

from inti import bahan, bola, gerak, ke_induk, kosong, kotak, pakai_lingkungan, sembunyi, silinder, tampil, ubah

KAYU = "#6B4226"
KACA = "#9CC7D9"
LOGAM = "#E0B43A"
DEPAN = -0.1
TEBAL = 0.1
LEBAR = 1.0
TINGGI = 1.3
Z_TENGAH = 1.6
SUDUT_BUKA = 30
SUDUT_KAYANG = 48
X_DUA = 0.75


def _lingkungan():
    kotak("tanah", (0, -2, -0.05), (14, 8, 0.1), "#9BB06F", bevel=False)
    kotak("dinding", (0, 0, 1.75), (7, 0.2, 3.5), "#EADFC8", bevel=False)
    kotak("plint", (0, -0.115, 0.3), (7, 0.03, 0.6), "#B9A88C", bevel=False)
    atap = kotak("atap", (0, -0.55, 3.55), (7.6, 1.3, 0.12), "#B5523B", bevel=False)
    atap.rotation_euler = (math.radians(-14), 0, 0)
    kotak("lisplang", (0, -1.18, 3.38), (7.6, 0.06, 0.22), "#7A4A2A", bevel=False)
    for px in (2.4, -2.4):
        silinder("pot", (px, -0.5, 0.2), 0.22, 0.4, "#A0522D", sisi=10)
        bola("tanaman", (px, -0.5, 0.75), 0.42, "#5E8C4A", subdivisi=1)


def _jendela(jenis, x, terbuka):
    kebalik = jenis == "kebalik"
    y, zc, lb, tg, t = DEPAN, Z_TENGAH, LEBAR, TINGGI, TEBAL
    kotak("ruang-dalam", (x, y - 0.005, zc), (lb, 0.02, tg), "#2E2620", bevel=False)
    kotak("kusen-atas", (x, y - 0.06, zc + tg / 2 + t / 2), (lb + 2 * t, 0.12, t), KAYU)
    kotak("kusen-bawah", (x, y - 0.08, zc - tg / 2 - t / 2), (lb + 2 * t + 0.08, 0.16, t), KAYU)
    kotak("kusen-kiri", (x - lb / 2 - t / 2, y - 0.06, zc), (t, 0.12, tg), KAYU)
    kotak("kusen-kanan", (x + lb / 2 + t / 2, y - 0.06, zc), (t, 0.12, tg), KAYU)

    z_engsel = zc - tg / 2 if kebalik else zc + tg / 2
    induk = kosong((x, y - 0.05, z_engsel))
    b = 0.07
    bagian = [
        kotak("daun-atas", (x, y - 0.05, zc + tg / 2 - b / 2), (lb, 0.05, b), KAYU),
        kotak("daun-bawah", (x, y - 0.05, zc - tg / 2 + b / 2), (lb, 0.05, b), KAYU),
        kotak("daun-kiri", (x - lb / 2 + b / 2, y - 0.05, zc), (b, 0.05, tg), KAYU),
        kotak("daun-kanan", (x + lb / 2 - b / 2, y - 0.05, zc), (b, 0.05, tg), KAYU),
        kotak("daun-tengah", (x, y - 0.05, zc), (lb, 0.04, 0.05), KAYU),
        kotak("kaca", (x, y - 0.05, zc), (lb - 2 * b, 0.02, tg - 2 * b), KACA, bevel=False),
    ]
    for o in bagian:
        ke_induk(o, induk)

    bahan_pin = []
    for dx in (-lb * 0.3, lb * 0.3):
        pin = silinder("engsel", (x + dx, y - 0.08, z_engsel), 0.035, 0.14, LOGAM, rotasi=(0, math.radians(90), 0))
        m = bahan(LOGAM, unik=True)
        pin.data.materials[0] = m
        bahan_pin.append(m)

    # Kebalik: rotasi +X membuat tepi atas maju. Biasa: rotasi -X membuat tepi bawah maju.
    sudut = SUDUT_BUKA if kebalik else -SUDUT_BUKA
    if terbuka:
        induk.rotation_euler = (math.radians(sudut), 0, 0)
    return {"engsel": induk, "sudut": sudut, "kebalik": kebalik, "pin": bahan_pin, "x": x}


def bangun(isi):
    if pakai_lingkungan():
        _lingkungan()
    terbuka = isi["awal"] == "terbuka"
    if isi["jendela"] == "dua":
        daun = [_jendela("biasa", -X_DUA, terbuka), _jendela("kebalik", X_DUA, terbuka)]
    else:
        daun = [_jendela(isi["jendela"], 0.0, terbuka)]
    x_celah = next((d["x"] for d in daun if d["kebalik"]), 0.0)
    karung = bola("karung", (x_celah + 2.2, -1.8, 2.6), 0.5, "#3F3F4A")
    karung.scale = (0.52, 0.36, 0.46)
    sembunyi(karung)
    return {"daun": daun, "karung": karung, "x_celah": x_celah}


@gerak("buka-jendela")
def buka_jendela(obj, mulai, selesai, frame_akhir):
    for d in obj["daun"]:
        ubah(d["engsel"], "rotation_euler", (math.radians(d["sudut"]), 0, 0), mulai, selesai)


@gerak("kayang")
def kayang(obj, mulai, selesai, frame_akhir):
    puncak = round(mulai + (selesai - mulai) * 0.45)
    for d in obj["daun"]:
        if not d["kebalik"]:
            continue
        e = d["engsel"]
        bpy.context.scene.frame_set(mulai)
        asal = tuple(e.rotation_euler)
        ubah(e, "rotation_euler", (math.radians(SUDUT_KAYANG), 0, 0), mulai, puncak)
        ubah(e, "rotation_euler", asal, puncak, selesai)


@gerak("engsel-nyala")
def engsel_nyala(obj, mulai, selesai, frame_akhir):
    for d in obj["daun"]:
        for m in d["pin"]:
            kuat = m.node_tree.nodes.get("Principled BSDF").inputs["Emission Strength"]
            kuat.default_value = 0.0
            kuat.keyframe_insert("default_value", frame=mulai)
            kuat.default_value = 3.0
            kuat.keyframe_insert("default_value", frame=selesai)


@gerak("karung-datang")
def karung_datang(obj, mulai, selesai, frame_akhir):
    k, x = obj["karung"], obj["x_celah"]
    tengah = round((mulai + selesai) / 2)
    tampil(k, mulai)
    ubah(k, "location", (x + 0.9, -1.1, 2.3), mulai, tengah)
    ubah(k, "location", (x, -0.5, 2.25), tengah, selesai)


@gerak("karung-nyangkut")
def karung_nyangkut(obj, mulai, selesai, frame_akhir):
    k, x = obj["karung"], obj["x_celah"]
    ubah(k, "location", (x, -0.46, 2.2), mulai, selesai)
    k.keyframe_insert("rotation_euler", frame=selesai)
    f, arah = selesai + 5, 1
    while f < frame_akhir:
        k.rotation_euler = (math.radians(10 * arah), math.radians(6 * arah), 0)
        k.keyframe_insert("rotation_euler", frame=f)
        f, arah = f + 6, -arah


@gerak("debu-masuk")
def debu_masuk(obj, mulai, selesai, frame_akhir):
    acak = random.Random(7)
    x_tengah = obj["x_celah"]
    for i in range(40):
        o = bola(f"debu-{i}", (x_tengah, -1.6, 2.6), 0.045, "#A89C8C", subdivisi=1)
        sembunyi(o)
        x = x_tengah + acak.uniform(-0.45, 0.45)
        siklus = acak.randint(50, 80)
        f = mulai + acak.randint(0, max(1, selesai - mulai))
        tampil(o, f)
        while f < frame_akhir:
            titik = [
                (x + acak.uniform(-0.3, 0.3), -1.6, acak.uniform(2.3, 2.9)),
                (x, -0.5, 2.18),
                (x + acak.uniform(-0.1, 0.1), 0.2, 1.9),
            ]
            for j, p in enumerate(titik):
                o.location = p
                # -2: titik akhir tidak boleh menimpa titik awal siklus berikutnya
                o.keyframe_insert("location", frame=f + round((siklus - 2) * j / 2))
            f += siklus
