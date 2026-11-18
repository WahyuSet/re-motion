# Potongan rumah dari depan: udara panas naik lalu keluar lewat bukaan atas, udara sejuk masuk dari pintu.

import math

from inti import gerak, ke_induk, kosong, kotak, panah, rencana

DINDING = "#EADFC8"
MERAH = "#E53935"
BIRU = "#1E88E5"
DETIK_SIKLUS = 2.0
SKALA_PANAH = 1.3
Y_PANAH = -0.4
JUMLAH_PANAH = 3

JALUR_NAIK = [(-0.7, Y_PANAH, 0.4), (0.0, Y_PANAH, 1.2), (0.7, Y_PANAH, 1.95)]
JALUR_KELUAR = [(0.7, Y_PANAH, 2.05), (1.4, Y_PANAH, 2.15), (1.85, Y_PANAH, 2.15)]
JALUR_SEJUK = [(-1.85, Y_PANAH, 0.5), (-1.2, Y_PANAH, 0.45), (-0.3, Y_PANAH, 0.4)]


def bangun(isi):
    kotak("tanah", (0, 0, -0.15), (7, 2.2, 0.1), "#9BB06F", bevel=False)
    kotak("lantai", (0, 0, -0.05), (3.2, 1.6, 0.1), "#B08A63", bevel=False)
    kotak("dinding-belakang", (0, 0.78, 1.4), (3.2, 0.04, 2.8), "#DCCFB6", bevel=False)
    kotak("dinding-kiri-atas", (-1.5, 0, 2.35), (0.2, 1.6, 0.9), DINDING, bevel=False)
    kotak("dinding-kanan-bawah", (1.5, 0, 0.65), (0.2, 1.6, 1.3), DINDING, bevel=False)
    kotak("dinding-kanan-atas", (1.5, 0, 2.6), (0.2, 1.6, 0.4), DINDING, bevel=False)
    kotak("plafon", (0, 0, 2.9), (3.2, 1.6, 0.2), "#F4EEE4", bevel=False)
    for sisi in (-1, 1):
        a = kotak(f"atap-{sisi}", (sisi * 0.84, 0, 3.4), (2.05, 1.7, 0.12), "#B5523B", bevel=False)
        a.rotation_euler = (0, math.radians(24 * sisi), 0)
    # Daun jendela kebalik dilihat dari samping: tepi atas miring ke luar.
    induk = kosong((1.6, 0, 1.3))
    daun = kotak("daun", (1.6, 0, 1.85), (0.06, 1.4, 1.1), "#6B4226")
    ke_induk(daun, induk)
    induk.rotation_euler = (0, math.radians(30), 0)
    return {}


def _panah_jalan(nama, titik, hexs, mulai, siklus, frame_akhir):
    p = panah(nama, hexs, SKALA_PANAH)
    seg = len(titik) - 1
    f = mulai
    while f < frame_akhir + siklus:
        for i, q in enumerate(titik):
            # -2: titik akhir tidak boleh jatuh di frame titik awal siklus berikutnya
            fi = f + round((siklus - 2) * i / seg)
            a, b = (titik[i], titik[i + 1]) if i < seg else (titik[i - 1], titik[i])
            p.location = q
            p.rotation_euler = (0, -math.atan2(b[2] - a[2], b[0] - a[0]), 0)
            p.scale = (0.001,) * 3 if i in (0, seg) else (1, 1, 1)
            for jalur in ("location", "rotation_euler", "scale"):
                p.keyframe_insert(jalur, frame=fi)
            if i in (0, seg):
                p.scale = (1, 1, 1)
                p.keyframe_insert("scale", frame=fi + (6 if i == 0 else -6))
        f += siklus


def _aliran(nama, titik, hexs, mulai, frame_akhir):
    siklus = round(rencana()["fps"] * DETIK_SIKLUS)
    for k in range(JUMLAH_PANAH):
        _panah_jalan(f"{nama}-{k}", titik, hexs, mulai + k * siklus // JUMLAH_PANAH, siklus, frame_akhir)


@gerak("panas-naik")
def panas_naik(obj, mulai, selesai, frame_akhir):
    _aliran("panas-naik", JALUR_NAIK, MERAH, mulai, frame_akhir)


@gerak("panas-keluar")
def panas_keluar(obj, mulai, selesai, frame_akhir):
    _aliran("panas-keluar", JALUR_KELUAR, MERAH, mulai, frame_akhir)


@gerak("sejuk-masuk")
def sejuk_masuk(obj, mulai, selesai, frame_akhir):
    _aliran("sejuk-masuk", JALUR_SEJUK, BIRU, mulai, frame_akhir)
