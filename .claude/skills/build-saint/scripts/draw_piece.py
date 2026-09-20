#!/usr/bin/env python3
"""Draw one part-inset positioning draft (HEAD / ARM / WAIST / LEG) from a
knight sketch — the pieces build-saint drops into the sheet's circles.

Two backends, same contract (one square PNG on a plain white background):

  local       Qwen-Image-Edit-2511 on a ComfyUI server running on this
              machine. Free, unlimited, ~110 s per piece once the model is
              warm (the first call after an idle server pays ~12 min of GGUF
              loading). The DEFAULT: measured on 2026-09-19 against the
              Higgsfield recipe below, all four parts came out usable on the
              first try with no reroll, copying the sketch's own colours and
              inking exactly. The sketch is its own style authority here,
              which is what an edit model is good at — do NOT reach for this
              backend for work that needs an external art style (redrawing to
              Okada, converting a series style): it ignores style references.
  higgsfield  `higgsfield generate create gpt_image_2_5`, ~1.5 credits per
              piece. The fallback when ComfyUI is down or the local result
              keeps failing QC.

Usage:
    draw_piece.py --sketch <img> --part HEAD --out <png>
                  [--backend local|higgsfield] [--describe "<the piece>"]
                  [--colors "<palette>"] [--seed N] [--dry-run]

`--describe` is what makes the difference between a generic guess and the
right piece: write what that part actually looks like in THIS sketch (read the
sketch first), e.g. --describe "the arm armor: shoulder guard, upper arm,
forearm bracer and the golden clawed gauntlet". Same for --colors.

Local backend requirements (see the ComfyUI section in SKILL.md): the
ComfyUI-GGUF custom node plus unet/qwen-image-edit-2511-Q4_K_M.gguf,
text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors,
vae/qwen_image_vae.safetensors and
loras/Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors.
Settings come from the environment, or from ~/.config/saintseiyacloths/comfyui.env
(KEY=VALUE, outside the repo because this one is public): COMFYUI_URL
(default http://127.0.0.1:8188) and COMFYUI_SERVICE, a systemd --user unit
this script starts when the server is down.
"""
import argparse
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

import cv2
import numpy as np

CONFIG = os.path.expanduser("~/.config/saintseiyacloths/comfyui.env")


def _config(key, default=""):
    """Env var wins; otherwise the KEY=VALUE file outside the repo (this
    repository is public — no machine-specific values live in it)."""
    if key in os.environ:
        return os.environ[key]
    try:
        with open(CONFIG) as f:
            for line in f:
                k, _, v = line.partition("=")
                if k.strip() == key and not k.lstrip().startswith("#"):
                    return v.strip().strip("'\"")
    except OSError:
        pass
    return default


URL = _config("COMFYUI_URL", "http://127.0.0.1:8188").rstrip("/")
SERVICE = _config("COMFYUI_SERVICE")
UNET = "qwen-image-edit-2511-Q4_K_M.gguf"
CLIP = "qwen_2.5_vl_7b_fp8_scaled.safetensors"
VAE = "qwen_image_vae.safetensors"
LORA = "Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors"
MODEL_MP = 1.0       # megapixels the model works at (quality/speed sweet spot on 6 GB VRAM)
STEPS = 4            # Lightning LoRA; more steps buy nothing here (measured)
TIMEOUT = 1800       # s per model call, cold GGUF load included

PARTS = {
    "HEAD": ("the helmet / head armor", "the head"),
    "ARM": ("the arm armor: shoulder guard, upper arm, forearm bracer and gauntlet", "the arm"),
    "WAIST": ("the waist / hip armor", "the waist"),
    "LEG": ("the leg armor: thigh plate, knee guard, shin greave and boot", "the leg"),
}


def build_prompt(part, describe, colors):
    piece = describe or PARTS[part][0]
    where = PARTS[part][1]
    palette = f" same colors ({colors})," if colors else " same colors,"
    return (
        "Image 1 is the DESIGN BLUEPRINT: a knight wearing a complete armor.\n\n"
        f"Draw a positioning draft of ONE piece of that armor - {piece}.\n\n"
        "Show that piece completely on its own, as if it had just been lifted off the wearer "
        "and photographed by itself, with a small directional arrow beside it pointing toward "
        f"{where} it attaches to. The wearer is NOT drawn: no body, no skin, no face, no hair, "
        "and none of the armor's other pieces - the piece floats in empty white space.\n\n"
        "Copy the exact design from image 1 - same shapes, same segmentation,"
        f"{palette} same art style, same inking and shading. Invent nothing, omit nothing.\n\n"
        "Nothing else in the picture: no character, no other armor pieces, plain pure white "
        "background. NO TEXT ANYWHERE: no letters, no words, no caption next to the arrow, no "
        "label, no signature, no watermark - the arrow is a bare arrow with nothing written by it."
    )


# --------------------------------------------------------------- local backend

def get(path, timeout=10):
    with urllib.request.urlopen(URL + path, timeout=timeout) as r:
        return r.read()


def available():
    """ComfyUI reachable (started through COMFYUI_SERVICE if needed) with the
    GGUF loader and all four model files."""
    for attempt in range(2):
        try:
            info = json.loads(get("/object_info/UnetLoaderGGUF"))
            if "UnetLoaderGGUF" not in info:
                return False, "ComfyUI-GGUF custom node missing"
            have = set(info["UnetLoaderGGUF"]["input"]["required"]["unet_name"][0])
            have |= set(json.loads(get("/models/text_encoders")))
            have |= set(json.loads(get("/models/vae"))) | set(json.loads(get("/models/loras")))
            missing = [f for f in (UNET, CLIP, VAE, LORA) if f not in have]
            return not missing, f"model files missing: {', '.join(missing)}"
        except (urllib.error.URLError, OSError, ValueError, KeyError):
            if attempt or not SERVICE:
                return False, f"ComfyUI not reachable at {URL}"
            print(f"starting systemd --user unit {SERVICE} ...", file=sys.stderr)
            subprocess.run(["systemctl", "--user", "start", SERVICE], check=False)
            for _ in range(60):
                time.sleep(2)
                try:
                    get("/system_stats", 3)
                    break
                except (urllib.error.URLError, OSError):
                    pass
    return False, f"ComfyUI not reachable at {URL}"


def upload(bgr):
    name = f"build_saint_{uuid.uuid4().hex[:12]}.png"
    png = cv2.imencode(".png", bgr)[1].tobytes()
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"subfolder\"\r\n\r\nsaintseiyacloths\r\n"
            f"--{b}\r\nContent-Disposition: form-data; name=\"overwrite\"\r\n\r\ntrue\r\n"
            f"--{b}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"{name}\"\r\n"
            f"Content-Type: image/png\r\n\r\n").encode() + png + f"\r\n--{b}--\r\n".encode()
    req = urllib.request.Request(URL + "/upload/image", body,
                                 {"Content-Type": f"multipart/form-data; boundary={b}"})
    res = json.load(urllib.request.urlopen(req, timeout=60))
    return f"{res['subfolder']}/{res['name']}" if res.get("subfolder") else res["name"]


def workflow(image_name, side, prompt, seed):
    imgs = {"image1": ["8", 0]}
    return {
        "1": {"class_type": "UnetLoaderGGUF", "inputs": {"unet_name": UNET}},
        "2": {"class_type": "CLIPLoader",
              "inputs": {"clip_name": CLIP, "type": "qwen_image", "device": "default"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": VAE}},
        "4": {"class_type": "ModelSamplingAuraFlow", "inputs": {"model": ["1", 0], "shift": 3.1}},
        "5": {"class_type": "CFGNorm", "inputs": {"model": ["4", 0], "strength": 1.0}},
        "6": {"class_type": "LoraLoaderModelOnly",
              "inputs": {"model": ["5", 0], "lora_name": LORA, "strength_model": 1.0}},
        "7": {"class_type": "LoadImage", "inputs": {"image": image_name}},
        "8": {"class_type": "ImageScale",
              "inputs": {"image": ["7", 0], "upscale_method": "lanczos",
                         "width": side, "height": side, "crop": "disabled"}},
        "9": {"class_type": "TextEncodeQwenImageEditPlus",
              "inputs": {"clip": ["2", 0], "vae": ["3", 0], "prompt": prompt, **imgs}},
        "10": {"class_type": "TextEncodeQwenImageEditPlus",
               "inputs": {"clip": ["2", 0], "vae": ["3", 0], "prompt": "", **imgs}},
        "11": {"class_type": "FluxKontextMultiReferenceLatentMethod",
               "inputs": {"conditioning": ["9", 0], "reference_latents_method": "index_timestep_zero"}},
        "12": {"class_type": "FluxKontextMultiReferenceLatentMethod",
               "inputs": {"conditioning": ["10", 0], "reference_latents_method": "index_timestep_zero"}},
        "13": {"class_type": "EmptySD3LatentImage",
               "inputs": {"width": side, "height": side, "batch_size": 1}},
        "14": {"class_type": "KSampler",
               "inputs": {"model": ["6", 0], "positive": ["11", 0], "negative": ["12", 0],
                          "latent_image": ["13", 0], "seed": seed, "steps": STEPS, "cfg": 1.0,
                          "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}},
        "15": {"class_type": "VAEDecode", "inputs": {"samples": ["14", 0], "vae": ["3", 0]}},
        "16": {"class_type": "PreviewImage", "inputs": {"images": ["15", 0]}},  # temp/, not output/
    }


def square(path):
    """The sketch on a white square canvas — the inset circles are 1:1, and the
    model copies the source's aspect."""
    img = cv2.imread(path, cv2.IMREAD_COLOR)
    if img is None:
        sys.exit(f"ERROR cannot read {path}")
    h, w = img.shape[:2]
    side = max(h, w) + 40
    canvas = np.full((side, side, 3), 255, np.uint8)
    y, x = (side - h) // 2, (side - w) // 2
    canvas[y:y + h, x:x + w] = img
    return canvas


def run_local(a, prompt):
    ok, why = available()
    if not ok:
        sys.exit(f"ERROR local backend unavailable ({why}) — rerun with --backend higgsfield")
    side = max(16, round((MODEL_MP * 1e6) ** 0.5 / 16) * 16)
    name = upload(square(a.sketch))
    req = urllib.request.Request(URL + "/prompt",
                                 json.dumps({"prompt": workflow(name, side, prompt, a.seed)}).encode(),
                                 {"Content-Type": "application/json"})
    t0 = time.time()
    try:
        pid = json.load(urllib.request.urlopen(req, timeout=30))["prompt_id"]
    except urllib.error.HTTPError as e:
        sys.exit(f"ERROR ComfyUI rejected the workflow: {e.read().decode()[:500]}")
    while time.time() - t0 < TIMEOUT:
        time.sleep(3)
        hist = json.loads(get(f"/history/{pid}"))
        if pid not in hist:
            continue
        st = hist[pid]["status"]
        if st.get("status_str") != "success":
            sys.exit(f"ERROR ComfyUI run failed: {json.dumps(st.get('messages'))[-500:]}")
        img = next(i for o in hist[pid]["outputs"].values() for i in o.get("images", []))
        q = urllib.parse.urlencode({"filename": img["filename"], "subfolder": img["subfolder"],
                                    "type": img["type"]})
        out = cv2.imdecode(np.frombuffer(get(f"/view?{q}", 60), np.uint8), cv2.IMREAD_COLOR)
        cv2.imwrite(a.out, out)
        print(f"OK {a.out} {out.shape[1]}x{out.shape[0]} in {time.time() - t0:.0f}s (local, free)")
        return
    sys.exit(f"ERROR ComfyUI run timed out after {TIMEOUT}s")


# ---------------------------------------------------------- higgsfield backend

def run_higgsfield(a, prompt):
    import shutil
    hf = shutil.which("higgsfield")
    if not hf:
        sys.exit("ERROR higgsfield CLI not found in PATH")
    cmd = [hf, "generate", "create", "gpt_image_2_5", "--prompt", prompt,
           "--aspect_ratio", "1:1", "--resolution", "1k", "--quality", "low",
           "--image-references", a.sketch, "--wait"]
    print(" ".join(cmd[:6]) + " ... (~1.5 credits)")
    r = subprocess.run(cmd, capture_output=True, text=True)
    sys.stdout.write(r.stdout)
    sys.stderr.write(r.stderr)
    if r.returncode:
        sys.exit(f"ERROR higgsfield exited {r.returncode}")
    print(f"download the result URL above to {a.out}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sketch", required=True, help="knight sketch — the design blueprint")
    ap.add_argument("--part", required=True, choices=sorted(PARTS))
    ap.add_argument("--out", required=True)
    ap.add_argument("--backend", default="local", choices=["local", "higgsfield"])
    ap.add_argument("--describe", default="", help="what this part looks like in THIS sketch")
    ap.add_argument("--colors", default="", help="the piece's palette, e.g. 'navy blue, gold'")
    ap.add_argument("--seed", type=int, default=42, help="change it to reroll")
    ap.add_argument("--dry-run", action="store_true", help="print the prompt and stop")
    a = ap.parse_args()

    prompt = build_prompt(a.part, a.describe, a.colors)
    if a.dry_run:
        print(prompt)
        return
    (run_local if a.backend == "local" else run_higgsfield)(a, prompt)


main()
