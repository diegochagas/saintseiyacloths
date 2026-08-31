---
name: build-saint
description: Build a complete Saint Seiya cloth-scheme sheet (聖衣分解装着図) by COMPOSITING with GIMP — series background template + armor object + character + 4 AI-drafted part insets in white circles + labeled pointer arrows with stars — instead of generating the whole sheet in one AI shot. Use when the user asks to "build a saint", "monta o esquema", "build the scheme with GIMP", or provides a full sketch (armor + character) plus a background style. Shows the result for approval, then hands off to add-saint/update-saint.
---

# Build a cloth scheme with GIMP

Deterministic assembly: Higgsfield draws only the art pieces; GIMP composes the sheet from
the templates in `templates/cloth-scheme/`, so titles, labels, circles, stars and arrows are
always crisp. Everything is staged under `tmp/build-saint/<cloth>-<character>/`.

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
`tmp/build-saint/<cloth>-<character>/`. It returns the final sheet + preview paths and a QC
summary, keeping the many image reads out of this conversation. Steps 1 and 5
(identification, approval, database) always stay here. If the agent can't be spawned, do
steps 2–4 inline as written.

## 2. Prepare the art pieces

- **Full sketch given**: measure with `identify`, split armor/character halves with
  ImageMagick `-crop` (respect reverse order), Read both crops to verify the split.
- **Separate sketches**: use them as-is (running draw-armor first if needed).
- **4 part insets** — HEAD, ARM, WAIST, LEG: generate each with
  `higgsfield generate create nano_banana_pro` (aspect `1:1`, resolution `1k` is enough,
  ~2 credits each), prompt: image 1 = the armor/knight sketch as design blueprint; draw ONLY
  that armor's <part> as a positioning draft — the part floating slightly above where it
  attaches, with a small directional arrow, same art style as image 1, plain white
  background, no text. Read each result and QC against the sketch (right part, right
  design); one reroll max per part, then keep the best.
- **Backgrounds are ALWAYS white**: every generated piece must sit on a plain white
  background — never ask the generator to paint or tint a background, and never repaint the
  template's background. Then knock the paper out of every piece so pieces can overlap
  cleanly: `convert piece.png -fuzz 6% -transparent white piece-t.png`.

Warn if `higgsfield account status` is under 100 credits; a full build is ~8–12 credits
plus draw-armor if needed.

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
   with `tmp/build-saint/<cloth>-<character>/<cloth>-<character>.jpg`.
   On rejection: apply the requested fixes (job JSON for layout/text, regeneration for art)
   and show again.
