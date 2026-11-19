# Potongan rumah plafon rendah dan plafon tinggi: panas naik, menumpuk di bawah plafon,
# genteng memancarkan panas, dan lubang angin di ruang tinggi membuangnya.

import math

from inti import bahan, gerak, kotak, pakai_lingkungan, panah, rencana, sembunyi, tampil, ubah

DINDING = "#EADFC8"
MERAH = "#E53935"
ORANYE = "#FB8C00"
BIRU = "#1E88E5"
GARIS = "#37474F"
TEBAL = 0.12
LEBAR = 1.6
DALAM = 1.6
Y_PANAH = -0.4
TINGGI_KEPALA = 1.7
TEBAL_PANAS = 1.0
DETIK_SIKLUS = 2.0
JUMLAH_PANAH = 3
SKALA_PANAH = 0.9

# Posisi ruang tetap untuk setiap pilihan, supaya kamera katalog selalu mengenai ruang yang sama.
RUANG = {"rendah": (-1.05, 2.7), "tinggi": (1.05, 3.8)}


def _bahan_tembus(hexs, alfa):
    m = bahan(hexs, 0.4, unik=True)
    m.node_tree.nodes.get("Principled BSDF").inputs["Alpha"].default_value = alfa
    if hasattr(m, "surface_render_method"):
        m.surface_render_method = "BLENDED"
    elif hasattr(m, "blend_method"):
        m.blend_method = "BLEND"
    return m


def _ruang(jenis):
    x, h = RUANG[jenis]
    kiri, kanan = x - LEBAR / 2, x + LEBAR / 2
    kotak(f"lantai-{jenis}", (x, 0, -0.05), (LEBAR + TEBAL, DALAM, 0.1), "#B08A63", bevel=False)
    kotak(f"belakang-{jenis}", (x, DALAM / 2 - 0.02, h / 2), (LEBAR, 0.04, h), "#DCCFB6", bevel=False)
    # Dinding kiri berlubang pintu di bawah (z < 1.9), tempat udara sejuk masuk.
    kotak(f"kiri-{jenis}", (kiri, 0, (1.9 + h) / 2), (TEBAL, DALAM, h - 1.9), DINDING, bevel=False)
    roster = None
    if jenis == "tinggi":
        bawah, atas = h - 0.55, h - 0.25
        kotak(f"kanan-bawah-{jenis}", (kanan, 0, bawah / 2), (TEBAL, DALAM, bawah), DINDING, bevel=False)
        kotak(f"kanan-atas-{jenis}", (kanan, 0, (atas + h) / 2), (TEBAL, DALAM, h - atas), DINDING, bevel=False)
        roster = kotak("roster", (kanan, 0, (bawah + atas) / 2), (TEBAL, DALAM, atas - bawah), "#B9A88C", bevel=False)
    else:
        kotak(f"kanan-{jenis}", (kanan, 0, h / 2), (TEBAL, DALAM, h), DINDING, bevel=False)
    kotak(f"plafon-{jenis}", (x, 0, h + 0.05), (LEBAR + TEBAL, DALAM, 0.1), "#F4EEE4", bevel=False)

    bahan_atap = bahan("#B5523B", unik=True)
    for sisi in (-1, 1):
        a = kotak(f"atap-{jenis}-{sisi}", (x + sisi * 0.42, 0, h + 0.29), (1.05, DALAM + 0.1, 0.1), "#B5523B", bevel=False)
        a.rotation_euler = (0, math.radians(24 * sisi), 0)
        a.data.materials[0] = bahan_atap

    # Kursi sebagai penanda skala manusia (video ini tanpa karakter).
    kotak(f"dudukan-{jenis}", (x - 0.2, 0.2, 0.45), (0.42, 0.42, 0.05), "#B33A3A")
    kotak(f"sandaran-{jenis}", (x - 0.2, 0.4, 0.75), (0.42, 0.05, 0.55), "#B33A3A")
    for dx in (-0.17, 0.17):
        for dy in (0.03, 0.37):
            kotak(f"kaki-{jenis}", (x - 0.2 + dx, dy, 0.21), (0.04, 0.04, 0.42), "#7A4A2A")

    lapisan = kotak(f"panas-{jenis}", (x, 0, h - TEBAL_PANAS / 2), (LEBAR - 0.04, DALAM - 0.2, TEBAL_PANAS), MERAH, bevel=False)
    lapisan.data.materials[0] = _bahan_tembus(MERAH, 0.38)
    sembunyi(lapisan)

    garis = []
    for i in range(7):
        g = kotak(f"kepala-{jenis}-{i}", (kiri + 0.15 + i * 0.22, Y_PANAH - 0.1, TINGGI_KEPALA), (0.13, 0.02, 0.035), GARIS, bevel=False)
        sembunyi(g)
        garis.append(g)

    return {"jenis": jenis, "x": x, "h": h, "roster": roster, "lapisan": lapisan, "garis": garis, "bahan_atap": bahan_atap}


def bangun(isi):
    if pakai_lingkungan():
        kotak("tanah", (0, 0, -0.15), (9, 2.4, 0.1), "#9BB06F", bevel=False)
    jenis = ["rendah", "tinggi"] if isi["plafon"] == "dua" else [isi["plafon"]]
    return {"ruang": [_ruang(j) for j in jenis]}


def _panah_jalan(nama, titik, hexs, mulai, siklus, frame_akhir):
    # Sama dengan potongan_udara.py; disalin agar hash klip set lain tidak berubah.
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
    for r in obj["ruang"]:
        x, h = r["x"], r["h"]
        jalur = [(x - 0.3, Y_PANAH, 0.3), (x, Y_PANAH, 1.2), (x + 0.15, Y_PANAH, h - 0.3)]
        _aliran(f"panas-naik-{r['jenis']}", jalur, MERAH, mulai, frame_akhir)


@gerak("panas-menumpuk")
def panas_menumpuk(obj, mulai, selesai, frame_akhir):
    for r in obj["ruang"]:
        lapisan, h = r["lapisan"], r["h"]
        tampil(lapisan, mulai)
        tipis = (lapisan.scale.x, lapisan.scale.y, 0.001)
        lapisan.scale = tipis
        lapisan.location.z = h - 0.005
        lapisan.keyframe_insert("scale", frame=mulai)
        lapisan.keyframe_insert("location", frame=mulai)
        ubah(lapisan, "scale", (tipis[0], tipis[1], TEBAL_PANAS), mulai, selesai)
        ubah(lapisan, "location", (r["x"], 0, h - TEBAL_PANAS / 2), mulai, selesai)


@gerak("garis-kepala")
def garis_kepala(obj, mulai, selesai, frame_akhir):
    for r in obj["ruang"]:
        for i, g in enumerate(r["garis"]):
            tampil(g, mulai + round((selesai - mulai) * i / len(r["garis"])))


@gerak("genteng-panas")
def genteng_panas(obj, mulai, selesai, frame_akhir):
    for r in obj["ruang"]:
        kuat = r["bahan_atap"].node_tree.nodes.get("Principled BSDF").inputs["Emission Strength"]
        kuat.default_value = 0.0
        kuat.keyframe_insert("default_value", frame=mulai)
        kuat.default_value = 1.2
        kuat.keyframe_insert("default_value", frame=selesai)
        x, h = r["x"], r["h"]
        jalur = [(x + 0.4, Y_PANAH, h - 0.05), (x + 0.4, Y_PANAH, h - 0.4), (x + 0.4, Y_PANAH, h - 0.75)]
        _aliran(f"genteng-{r['jenis']}", jalur, ORANYE, selesai, frame_akhir)


@gerak("lubang-angin")
def lubang_angin(obj, mulai, selesai, frame_akhir):
    for r in obj["ruang"]:
        roster = r["roster"]
        if roster is None:
            continue
        ubah(roster, "scale", (roster.scale.x, roster.scale.y, 0.01), mulai, selesai)
        x, h = r["x"], r["h"]
        jalur = [(x + 0.1, Y_PANAH, h - 0.45), (x + 0.7, Y_PANAH, h - 0.4), (x + 1.15, Y_PANAH, h - 0.4)]
        _aliran("lubang-angin", jalur, MERAH, selesai, frame_akhir)


@gerak("sejuk-masuk")
def sejuk_masuk(obj, mulai, selesai, frame_akhir):
    for r in obj["ruang"]:
        x = r["x"]
        jalur = [(x - 0.95, Y_PANAH, 0.45), (x - 0.5, Y_PANAH, 0.42), (x, Y_PANAH, 0.4)]
        _aliran(f"sejuk-{r['jenis']}", jalur, BIRU, mulai, frame_akhir)
