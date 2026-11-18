# Ruangan sederhana dengan meja, kursi, bola, dan kardus.

import math

from inti import bola, gerak, kotak, pakai_lingkungan, ubah

INTERIOR = True
KAYU = "#8B5A3C"
KURSI = "#B33A3A"


def _ruangan():
    kotak("lantai", (0, 0, -0.05), (8, 8, 0.1), "#C9A27E", bevel=False)
    kotak("dinding-belakang", (0, 4, 1.5), (8, 0.1, 3), "#E8DCC8", bevel=False)
    kotak("dinding-kiri", (-4, 0, 1.5), (0.1, 8, 3), "#D9CBB4", bevel=False)
    plafon = kotak("plafon", (0, 0, 3.05), (8, 8, 0.1), "#F4EEE4", bevel=False)
    plafon.visible_shadow = False
    kotak("jendela", (1.5, 3.94, 1.7), (1.4, 0.02, 1.2), "#BFE3F5", emisi=1.0, bevel=False)
    kotak("kusen", (1.5, 3.96, 1.7), (1.56, 0.03, 1.36), "#FFFFFF", bevel=False)
    kotak("karpet", (0.8, 0.2, 0.005), (2.4, 1.6, 0.01), "#6E8B74", bevel=False)


def _perabot():
    mx, my = -1.2, 1.5
    kotak("meja", (mx, my, 0.75), (1.6, 0.9, 0.08), KAYU)
    for dx in (-0.72, 0.72):
        for dy in (-0.37, 0.37):
            kotak("kaki-meja", (mx + dx, my + dy, 0.375), (0.08, 0.08, 0.75), KAYU)
    kotak("dudukan-kursi", (-1.2, 0.6, 0.45), (0.5, 0.5, 0.06), KURSI)
    kotak("sandaran-kursi", (-1.2, 0.37, 0.78), (0.5, 0.06, 0.6), KURSI)
    for dx in (-0.21, 0.21):
        for dy in (0.39, 0.81):
            kotak("kaki-kursi", (-1.2 + dx, dy, 0.21), (0.05, 0.05, 0.42), KAYU)


def bangun(isi):
    if pakai_lingkungan():
        _ruangan()
    _perabot()
    return {
        "bola": bola("bola", (1.2, 1.0, 0.3), 0.3, "#F2B134"),
        "kardus": kotak("kardus", (-0.75, 1.5, 0.94), (0.4, 0.3, 0.3), "#C48A52"),
    }


@gerak("bola-gelinding")
def bola_gelinding(obj, mulai, selesai, frame_akhir):
    b = obj["bola"]
    ubah(b, "location", (0.45, 0.75, 0.3), mulai, selesai)
    ubah(b, "rotation_euler", (math.radians(-240), 0, math.radians(-120)), mulai, selesai)


@gerak("kardus-jatuh")
def kardus_jatuh(obj, mulai, selesai, frame_akhir):
    k = obj["kardus"]
    tengah = round((mulai + selesai) / 2)
    ubah(k, "location", (-0.2, 1.5, 0.9), mulai, tengah)
    ubah(k, "location", (0.05, 1.45, 0.15), tengah, selesai)
    ubah(k, "rotation_euler", (0.1, math.radians(80), 0.2), mulai, selesai)
