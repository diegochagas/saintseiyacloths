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
originals preferred; warn on thin styles). For a single-character input, follow the style
map's cropping rule: attach wearer-figure *crops* (or standalone color art) as the style
references, never whole scheme sheets — whole sheets dilute the rendering signal into "white
page with line art". Read them and describe the style concretely —
inking, screentone vs color, face rendering, typography — **and explicitly body build
(stocky/muscular vs. tall/lean/willowy, limb length, shoulder-to-waist ratio), eye size and
rendering (narrow vs. large/multi-highlight/lashed), and armor detail density (panel
subdivisions, trim lines, rivets, ridge layers per plate)**. `references/artist-styles.md` in
`create-cloth-scheme` has per-artist notes on all of this. These anatomy/detail traits are part
of the artist's style, not the input's — a plain-bodied or simply-rendered input must still come
out with the target artist's own build, eyes and surface-detail level.

## 3. Generate

`higgsfield generate create nano_banana_pro`, resolution `2k`, aspect ratio matching the
input image (check with `identify`), `--wait`. Prompt blocks:

1. **Roles**: "Image 1 is the CONTENT AUTHORITY — its design AND composition must be
   reproduced exactly; images 2–N are STYLE-ONLY references from <series>."
2. **STYLE**: the concrete target-style description; explicit tone mapping when converting
   color → B&W (which colors become light greys, which become blacks); "no watermark, no
   website text". Then a **rendering-transformation line**: name image 1's own finish and
   forbid it explicitly — e.g. "discard image 1's flat TV-anime cel shading, thin uniform
   outlines and simple two-tone highlights entirely; repaint every surface from scratch in
   <artist>'s finish, as if <artist> repainted this illustration" — the design lock in the
   DESIGN block otherwise makes the model preserve the source's rendering too, and the output
   comes back as the input with extra gloss.
3. **DESIGN**: "redraw every armor element of image 1 in the new style — same shapes, same
   counts, same colors, same pose; invent nothing, omit nothing" + the inventory. Then a
   separate **anatomy line**: "render the character's body build, face and eyes in <artist>'s
   own style (see style description above), not image 1's proportions — armor shape/count/color
   stays locked to the inventory, but anatomy follows the artist." And a **detail-density line**:
   "render every armor plate with <artist>'s typical surface detail (panel subdivisions, trim
   etching, rivets) even where image 1's rendering was simpler or flatter — add surface detail,
   never add or remove a shape."
4. **LAYOUT**: the composition description. For a full scheme keep every inset, callout and
   label in place with the same wording (Latin caps); readable titles in Latin letters. For a
   single character: "the full figure fits inside the frame head to toe with a margin — never
   crop feet, helmet or shoulder pieces; add nothing image 1 does not show: no armor
   object/totem, no insets, no background scenery, no text".

### QC loop

Download every attempt to `tmp/restyled/<base>-<style>-attempt-<n>.<ext>` (never
overwrite). Read and grade: composition identical, nothing cropped, nothing invented (no
totem/insets/text the input lacks)? design inventory intact item by item? style actually
matching the references — including body build, eye size/rendering and armor detail density,
not just color/inking (not generic manga, not a flatter/under-detailed default build)?
labels/titles preserved and legible (full schemes)?

**Style gate**: put the attempt mentally next to the input — if it still reads as the input's
own rendering with extra polish (same cel shading, same outline weight, same highlight
shapes), it FAILS on style even with a perfect design score. The next attempt must escalate,
not repeat: move the STYLE block first, restate the forbidden source finish, and describe the
target finish in more concrete physical terms (e.g. for episode-g: airbrushed gradients on
every plate, mirror reflections, scattered 4-point star sparkles, engraved filigree, outer
glow — see `references/artist-styles.md`).

Corrections become explicit lines in the next prompt. Up to **3 attempts**. Warn under 100
credits.

## 4. Save and report

Copy the best attempt to `tmp/restyled/<base>-<style>.png`. Telegram photo per
`shared/telegram.md` (caption: what was restyled, source → target style, attempt chosen,
credits left). Report path, attempts, remaining issues and credits in chat; suggest
`add-saint`/`update-saint` if the user wants it in the database.
