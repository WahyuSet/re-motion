# Transkrip audio narasi dengan timestamp per kata (faster-whisper), hasilnya JSON.
# Dipanggil oleh scripts/potong-narasi.mjs.
#
# python scripts/lib/transkrip.py <audio> <out.json> <naskah.txt> [model]

import json
import sys

from faster_whisper import WhisperModel

audio, out_path, script_path = sys.argv[1], sys.argv[2], sys.argv[3]
model_name = sys.argv[4] if len(sys.argv) > 4 else "small"

prompt = ""
if script_path:
    try:
        with open(script_path, encoding="utf-8") as f:
            # Naskah sebagai prompt membantu Whisper mengenali nama & ejaan (Syailendra, Raffles, dll.)
            prompt = f.read().strip()
    except Exception:
        pass

model = WhisperModel(model_name, device="cpu", compute_type="int8")

transcribe_args = {
    "language": "id",
    "word_timestamps": True,
    "condition_on_previous_text": False,
}
if prompt:
    transcribe_args["initial_prompt"] = prompt

segments, _ = model.transcribe(audio, **transcribe_args)
segments_list = list(segments)

# Periksa apakah initial_prompt menyebabkan Whisper halusinasi atau degradasi.
# Jika match rate terlalu rendah dibanding naskah, ulangi transkripsi bersih tanpa prompt.
if prompt:
    prompt_words = [w.strip(".,?!*").lower() for w in prompt.split() if w.strip(".,?!*")]
    heard_words = [
        w.word.strip(".,?!*").lower()
        for s in segments_list
        for w in (s.words or [])
        if w.word.strip(".,?!*")
    ]
    match_count = sum(1 for hw in heard_words if hw in prompt_words)
    if len(heard_words) < len(prompt_words) * 0.4 or (
        len(heard_words) > 0 and (match_count / len(heard_words)) < 0.4
    ):
        print("Peringatan: Transkripsi dengan initial_prompt terindikasi halusinasi, mengulang tanpa prompt...", file=sys.stderr)
        retry_args = {
            "language": "id",
            "word_timestamps": True,
            "condition_on_previous_text": False,
        }
        segments_retry, _ = model.transcribe(audio, **retry_args)
        segments_list = list(segments_retry)

words = [
    {"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)}
    for segment in segments_list
    for w in (segment.words or [])
]

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(words, f, ensure_ascii=False)
