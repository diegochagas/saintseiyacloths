---
name: build-saint
description: Build a complete Saint Seiya cloth-scheme sheet (聖衣分解装着図) by COMPOSITING with GIMP — series background template + armor object + character + 4 AI-drafted part insets in white circles + labeled pointer arrows with stars — instead of generating the whole sheet in one AI shot. Use when the user asks to "build a saint", "monta o esquema", "build the scheme with GIMP", or provides a full sketch (armor + character) plus a background style. Shows the result for approval, then hands off to add-saint/update-saint.
---

# Build a cloth scheme with GIMP

Deterministic assembly: the AI draws only the art pieces (part insets locally by default,
armor object via Higgsfield); GIMP composes the sheet from the templates in
`templates/cloth-scheme/`, so titles, labels, circles, stars and arrows are always crisp. Everything is staged under `~/Downloads/build-saint/<cloth>-<character>/` (never inside the repo — files enter the project only after Diego OKs the XCF).

## Inputs (ask for whatever is missing)

1. **Full sketch** — one image with armor object AND character. Default reading: armor on
   the LEFT, character on the RIGHT, unless the user says "reverse order". If blank, ask
   for:
   - **Knight** — character sketch path (required).
   - **Armor object** — armor sketch path. If blank, run the **draw-armor** skill with
     `style = same` to create it from the knight sketch.
2. **Background style** — must be a key in `templates/cloth-scheme/manifest.json`
   (currently: classic, lost-canvas, saintia-sho; more will be added). If the requested
   style has no template yet, list the available ones and stop.

## 1. Identify

Resolve cloth + character against the CSVs (`grep -in "<name>" csv/data/*.csv`) and pull
group/rank/god if the saint exists. Decide the sheet texts:

- `character` → "CONSTELLATION CHARACTER" (e.g. "LEO AIOLIA")
- `cloth` → "<CLOTH> CLOTH" (e.g. "LEO CLOTH")
- `group` → rank + army wording (e.g. "GOLD SAINT", "BRONZE CLOTH")

`manifest.json` says which of these roles each template actually has.

## Delegate the heavy work when possible

Steps 2–4 (generation, composition, QC iteration) are made to run in the **saint-builder**
agent (`.claude/agents/saint-builder.md`): spawn it with the Agent tool, passing the
identification, texts, sketch paths, style, and a staging dir under
`~/Downloads/build-saint/<cloth>-<character>/` (never inside the repo — files enter the project only after Diego OKs the XCF). It returns the final sheet + preview paths and a QC
summary, keeping the many image reads out of this conversation. Steps 1 and 5
(identification, approval, database) always stay here. If the agent can't be spawned, do
steps 2–4 inline as written.

## 2. Prepare the art pieces

- **Full sketch given**: measure with `identify`, split armor/character halves with
  ImageMagick `-crop` (respect reverse order), Read both crops to verify the split.
- **Separate sketches**: use them as-is (running draw-armor first if needed).
- **Cropped knight (no full body/legs shown)**: draw-armor's "Complete a cropped reference"
  step handles this automatically whenever draw-armor runs (armor object generation). Use its
  completed full-body output — never the original crop — as BOTH the design blueprint for the
  parts below AND the CHARACTER piece placed in the final composite, so the totem's legs and
  the on-page character portrait always come from the same fully-realized design.
- **4 part insets** — HEAD, ARM, WAIST, LEG: generate each with `scripts/draw_piece.py`,
  which drives either backend from the same prompt recipe (image 1 = the armor/knight sketch
  as design blueprint; draw ONLY that armor's <part> as a positioning draft — the part
  floating slightly above where it attaches, with a small directional arrow, same art style
  as image 1, plain white background, no text):

  ```bash
  python3 .claude/skills/build-saint/scripts/draw_piece.py \
    --sketch <knight.png> --part ARM --out <stage>/arm-attempt-1.png \
    --describe "the arm armor: shoulder guard, upper arm, forearm bracer and the golden clawed gauntlet" \
    --colors "dark navy blue, violet, magenta-pink accents, gold"
  ```

  **Always pass `--describe` and `--colors`**, written from the sketch you just read — the
  per-part defaults are generic ("the arm armor: shoulder guard, upper arm, forearm bracer and
  gauntlet"), and a generic description is what produces a piece that misses this design's
  distinguishing details.

  The default backend is **`local`** (free, ~110 s per piece; see "Local backend" below).
  `--backend higgsfield` is the fallback (`gpt_image_2_5`, 1:1, 1k, quality low, ~1.5 credits
  each) when ComfyUI is down or the local result keeps failing QC.

  Read each result and QC against the sketch (right part, right design, **no stray text or
  letters** — the local model occasionally writes a garbled caption next to the arrow);
  one reroll max per part with a different `--seed`, then keep the best.
- **Backgrounds are ALWAYS white**: every generated piece must sit on a plain white
  background — never ask the generator to paint or tint a background, and never repaint the
  template's background. Then knock the paper out of every piece so pieces can overlap
  cleanly: `convert piece.png -fuzz 6% -transparent white piece-t.png`.

With the default local backend a build spends credits only on draw-armor (if it runs). When
any piece uses `--backend higgsfield`, warn if `higgsfield account status` is under 100
credits; an all-Higgsfield build is ~8–12 credits plus draw-armor.

### Local backend

`draw_piece.py --backend local` runs Qwen-Image-Edit-2511 on a ComfyUI server on this
machine — free and unlimited. Measured 2026-09-19 against the Higgsfield recipe: all four
parts usable on the first try, no reroll, copying the sketch's own colours and inking
exactly. ~110 s per piece warm; the first call after an idle server adds ~12 min of GGUF
loading, so expect the HEAD piece to be slow and the rest fast.

It works here because **the sketch is its own style authority**. Do NOT reach for it when an
external art style is the point (draw-armor's totem reassembly, change-saint-style,
redraw-to-episode-g-style): the model ignores style-reference images, caps at 3 images total,
and tops out near 1 MP. Those skills stay on Higgsfield.

Needs the ComfyUI-GGUF custom node plus `unet/qwen-image-edit-2511-Q4_K_M.gguf`,
`text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors`, `vae/qwen_image_vae.safetensors` and
`loras/Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors`. Settings live outside the repo in
`~/.config/saintseiyacloths/comfyui.env` (same convention as `telegram.env`), or as env vars
which win over the file:

```bash
COMFYUI_URL=http://127.0.0.1:8188
COMFYUI_SERVICE=<systemd --user unit name>   # the script starts it when the server is down
```

If the server is unreachable the script exits and tells you to rerun with
`--backend higgsfield` — it never silently falls back and spends credits.

## 3. Compose with GIMP

Write a job JSON (schema documented at the top of `scripts/gimp_compose.py`) and run:

```bash
timeout 600 flatpak run --env=COMPOSE_JOB=/abs/job.json org.gimp.GIMP -id \
  --batch-interpreter=python-fu-eval \
  -b "exec(open('.claude/skills/build-saint/scripts/gimp_compose.py').read())" --quit
```

**`-id`, never `-idf`** — fonts must load or text layers break. Check the job's `.log` ends
with `DONE`.

**Match the background to the art, not the art to the background.** Never upscale a knight,
armor or part image beyond ~1.3× its native pixel size — it goes blurry. When the pieces are
small relative to the template canvas, set `canvas_width` in the job so the BACKGROUND
shrinks to the art instead: pick the largest width at which every piece is placed at ≤1.3×
its native size (e.g. a 900px-wide armor filling ~35% of the sheet → canvas_width ≈
900 × 1.2 / 0.35 ≈ 3000; a 500px armor → ≈ 1700). Keep the final sheet ≥1600px wide when the
art allows. The script replaces the template texts before scaling (required — scaled text
layers can't be edited), and all job coordinates are in the scaled canvas space.

Layout guidance (coordinates scale with the template's `canvas` from the manifest, times
`canvas_width` / manifest width when you set it):

- Armor object: left side, ~30–35% of canvas width, vertically centered.
- Character: right side, ~22–25% of canvas width, full height standing.
- 4 insets: middle column (and/or flanking the character like the official sheets), diameter
  ~20–22% of canvas height, top-to-bottom HEAD → ARM → WAIST → LEG, no overlaps. Each inset
  MUST set `point_to` to where that part sits on the CHARACTER (the knight's head for HEAD,
  and so on) — the circle's pointer tail is rotated to aim at it.
- Arrows connect each circle to the armor OBJECT: `points` start at the circle's edge
  (arrow-head end) and finish with the black star ON the matching part of the armor object.
  Use 1–2 elbow points so lines stay horizontal/vertical where possible; `size` ≈ 2% of
  canvas width, `label_size` in points ≈ canvas width / 70 (the script defaults to that if
  omitted) — labels must be clearly readable on the full sheet; bump the size if QC shows
  them small. NEVER change fonts: labels and titles always keep the template's own fonts
  (the script preserves them; only sizes are adjusted), and the template `.xcf` files are
  never modified on disk.
- Labels (`label_pos`): as close as possible to their arrow + circle, but ALWAYS over blank
  white background — never on top of the armor, character, insets or template text/graphics.
- Armor shadow: when the template's manifest entry has a `shadow` layer (classic), ALWAYS
  pass `"armor_shadow": {"path": <transparent armor object PNG>}` — the script replaces the
  placeholder silhouette with an all-black copy of the armor object in the same area. Use
  the knocked-out (`-transparent white`) version of the armor, or the silhouette comes out
  as a black rectangle.
- Keep clear of the template's own title/text areas (classic: top-left; lost-canvas &
  saintia-sho: bottom band).

## 4. QC and iterate

Read the `preview` PNG. Check: page background PURE WHITE (the script white-points gray
paper tones automatically — if the sheet still looks gray, something is wrong; sample with
`convert out.jpg -format "%[pixel:p{60,600}]" info:`); texts correct and unclipped; pieces not overlapping each
other or template text; every arrow's star landing on the right armor-object part; every
circle tail aiming at the right spot on the character; every label over blank background
and legible. GIMP runs are free and deterministic — adjust coordinates in the job JSON and
rerun as many times as needed.

## 5. Approve, then register

1. Send the final JPG on Telegram (`shared/telegram.md`) and show it in chat with the piece
   paths, the **editable layered XCF path** (every piece is its own named layer — Diego can
   fix mistakes by hand in GIMP before giving his OK), credits spent/left, and what to
   double-check.
2. **Wait for Diego's approval** — do not touch the database before it.
3. On approval, ask/check whether he edited the XCF (compare mtimes). If he did, re-export
   the JPG from HIS file before registering:

   ```bash
   flatpak run org.gimp.GIMP -idf --batch-interpreter=python-fu-eval \
     -b "import gi; gi.require_version('Gimp','3.0'); from gi.repository import Gimp, Gio; \
   i=Gimp.file_load(Gimp.RunMode.NONINTERACTIVE, Gio.File.new_for_path('<out.xcf>')); i.flatten(); \
   Gimp.file_save(Gimp.RunMode.NONINTERACTIVE, i, Gio.File.new_for_path('<out.jpg>'), None)" --quit
   ```

4. Then run **add-saint** (new character+cloth+version) or **update-saint** (existing row)
   with `~/Downloads/build-saint/<cloth>-<character>/<cloth>-<character>.jpg`.
   On rejection: apply the requested fixes (job JSON for layout/text, regeneration for art)
   and show again.
