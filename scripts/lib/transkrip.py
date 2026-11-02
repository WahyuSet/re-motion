# Transkrip audio narasi dengan timestamp per kata (faster-whisper), hasilnya JSON.
# Dipanggil oleh scripts/potong-narasi.mjs.
#
# python scripts/lib/transkrip.py <audio> <out.json> <naskah.txt> [model]

import json
import sys

from faster_whisper import WhisperModel

audio, out_path, script_path = sys.argv[1], sys.argv[2], sys.argv[3]
model_name = sys.argv[4] if len(sys.argv) > 4 else "small"

with open(script_path, encoding="utf-8") as f:
    # Naskah sebagai prompt membantu Whisper mengenali nama & ejaan (Syailendra, Raffles, dll.)
    prompt = f.read()

model = WhisperModel(model_name, device="cpu", compute_type="int8")
segments, _ = model.transcribe(
    audio,
    language="id",
    word_timestamps=True,
    initial_prompt=prompt,
    condition_on_previous_text=False,
)

words = [
    {"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)}
    for segment in segments
    for w in (segment.words or [])
]

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(words, f, ensure_ascii=False)
