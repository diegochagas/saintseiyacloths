---
name: change-saint-style
description: Redraw an existing Saint Seiya image — a knight sketch, an armor object, or a full cloth scheme — in another series style (classic, episode g, lost canvas, saintia sho, time odyssey, omega…), preserving the design and composition exactly, using Higgsfield AI. Use when the user asks to "change the style", "redraw this in Lost Canvas style", "muda o estilo", "converte pro estilo clássico". Only GENERATES into tmp/restyled/ — registering results is add-saint/update-saint's job.
---

# Change a saint image's style

Same content, different series style: the output must show exactly what the input shows —
same character, same armor design, same pose, same layout — rendered as if drawn for the
target series.

## Inputs

1. **path** — image to restyle (knight, armor object, or full scheme). Required.
2. **style** — target series style from `.claude/skills/shared/style-map.md`. Required; if
   it equals the image's own style, say so and stop.

## 1. Identify and inventory

Classify the input first (single character wearing armor / armor object alone / full scheme
sheet with insets and labels) — the LAYOUT block depends on it. Resolve cloth + character
from the filename against the CSVs. Then build the `create-cloth-scheme`-style **design
inventory** (crop with ImageMagick, Read the crops, list every part with shapes, colors,
counts), plus a **composition description**: where each element sits, poses, view angles,
and for a full scheme the inset count and every visible label/title text.

## 2. Style references

Resolve 3 references for the target style via `shared/style-map.md` (full-res Nextcloud
originals preferred; warn on thin styles). Read them and describe the style concretely —
inking, screentone vs color, face rendering, typography.

## 3. Generate

`higgsfield generate create nano_banana_pro`, resolution `2k`, aspect ratio matching the
input image (check with `identify`), `--wait`. Prompt blocks:

1. **Roles**: "Image 1 is the CONTENT AUTHORITY — its design AND composition must be
   reproduced exactly; images 2–N are STYLE-ONLY references from <series>."
2. **STYLE**: the concrete target-style description; explicit tone mapping when converting
   color → B&W (which colors become light greys, which become blacks); "no watermark, no
   website text".
3. **DESIGN**: "redraw every element of image 1 in the new style — same shapes, same
   counts, same proportions, same pose; invent nothing, omit nothing" + the inventory.
4. **LAYOUT**: the composition description. For a full scheme keep every inset, callout and
   label in place with the same wording (Latin caps); readable titles in Latin letters.

### QC loop

Download every attempt to `tmp/restyled/<base>-<style>-attempt-<n>.<ext>` (never
overwrite). Read and grade: composition identical? design inventory intact item by item?
style actually matching the references (not generic manga)? labels/titles preserved and
legible (full schemes)? Corrections become explicit lines in the next prompt. Up to **3
attempts**. Warn under 100 credits.

## 4. Save and report

Copy the best attempt to `tmp/restyled/<base>-<style>.png`. Telegram photo per
`shared/telegram.md` (caption: what was restyled, source → target style, attempt chosen,
credits left). Report path, attempts, remaining issues and credits in chat; suggest
`add-saint`/`update-saint` if the user wants it in the database.
