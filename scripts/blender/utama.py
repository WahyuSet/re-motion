# Titik masuk Blender. Dipanggil oleh scripts/3d/render.mjs:
#   blender -b --factory-startup --python-exit-code 1 -P utama.py -- <rencana.json> <folder-frame> [uji]

import importlib.util
import json
import os
import sys

import bpy

DIR = os.path.dirname(os.path.abspath(__file__))
sys.dont_write_bytecode = True
sys.path.insert(0, DIR)

import inti  # noqa: E402


def muat_set(file):
    jalur = os.path.join(DIR, "set", file)
    spec = importlib.util.spec_from_file_location(f"set_{os.path.splitext(file)[0]}", jalur)
    modul = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modul)
    return modul


def main():
    argumen = sys.argv[sys.argv.index("--") + 1 :]
    file_rencana, folder = argumen[0], argumen[1]
    uji = len(argumen) > 2 and argumen[2] == "uji"
    with open(file_rencana, encoding="utf-8") as f:
        rencana = json.load(f)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    inti.mulai(rencana)
    modul = muat_set(rencana["file"])
    obj = modul.bangun(rencana["isi"])
    akhir = rencana["frame_akhir"]
    for g in rencana["gerak"]:
        if g["jenis"] not in inti.GERAK:
            raise ValueError(f'gerak tidak dikenal di {rencana["file"]}: {g["jenis"]}')
        inti.GERAK[g["jenis"]](obj, g["mulai"], g["selesai"], akhir)

    interior = getattr(modul, "INTERIOR", False)
    inti.lampu(interior)
    inti.dunia(rencana["langit"], 0.6 if interior else 1.0)
    inti.kamera(rencana["kamera"], akhir)
    inti.atur_render(folder, uji)
    bpy.ops.render.render(animation=True)


main()
