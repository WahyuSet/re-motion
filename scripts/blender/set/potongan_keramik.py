# Potongan lantai: tanah, pasir, adukan, dan deretan keramik yang bisa terangkat membentuk tenda.

import math

from inti import engsel, gerak, kotak, panah, ubah

SUDUT_TENDA = 22
GESER_PANAH = 0.35


def bangun(isi):
    kotak("tanah", (0, 0, -0.95), (3, 1.2, 1.3), "#7A5236", bevel=False)
    kotak("pasir", (0, 0, -0.18), (3, 1.2, 0.24), "#D8B98A", bevel=False)
    kotak("adukan", (0, 0, 0.0), (3, 1.2, 0.12), "#9A9A96", bevel=False)
    tenda = []
    for i in range(6):
        x = -1.25 + i * 0.5
        tegel = kotak(f"keramik-{i}", (x, 0, 0.08), (0.48, 1.18, 0.04), "#EDE6DA" if i % 2 else "#E1D7C6")
        if i == 2:
            tenda.append((engsel(tegel, (x - 0.25, 0, 0.1)), -SUDUT_TENDA))
        elif i == 3:
            tenda.append((engsel(tegel, (x + 0.25, 0, 0.1)), SUDUT_TENDA))
    daftar_panah = []
    if isi["panah"] == "ada":
        for sisi in (-1, 1):
            p = panah(f"panah-{sisi}", "#E53935", 0.9, emisi=0.0)
            p.location = (sisi * 1.15, -0.7, 0.4)
            p.rotation_euler = (0, 0, math.pi if sisi > 0 else 0)
            daftar_panah.append((p, sisi))
    return {"tenda": tenda, "panah": daftar_panah}


@gerak("dorong-samping")
def dorong_samping(obj, mulai, selesai, frame_akhir):
    for p, sisi in obj["panah"]:
        tujuan = (p.location.x - sisi * GESER_PANAH, p.location.y, p.location.z)
        ubah(p, "location", tujuan, mulai, selesai)


@gerak("keramik-naik")
def keramik_naik(obj, mulai, selesai, frame_akhir):
    for e, sudut in obj["tenda"]:
        ubah(e, "rotation_euler", (0, math.radians(sudut), 0), mulai, selesai)
