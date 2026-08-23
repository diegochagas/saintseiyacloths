---
name: create-cloth-scheme
description: Generate a full Saint Seiya cloth-scheme sheet (聖衣分解装着図 — the official "cloth disassembly" page with the armor's object form, assembly insets, part labels, and the character wearing it) from a base image, using Higgsfield AI, in the style of an official artist (Kurumada, Okada, Teshirogi, Kuori, Alquie, Araki, Umakoshi, Suda…) or matching the base image's own style. Use whenever the user asks to "create/generate a cloth scheme", "gera o esquema", "make a disassembly sheet", "turn this art into a scheme", or provides a character/cloth image plus an artist name expecting a scheme. This skill only GENERATES the image into a temp folder — registering it in the database is add-saint/update-saint's job.
---

# Create a cloth scheme with Higgsfield

Turn a base image of a Saint (character art, a plain armor design, an incomplete sheet) into a
full official-style **cloth scheme**: the sheet format used in Saint Seiya manga/artbooks that
shows the disassembled cloth in its object (totem) form on one side, the character wearing the
full cloth on the other, circular insets illustrating assembly steps, and labeled part callouts
(HEAD / BODY / ARM / WAIST / LEG…) connected by lines.

The result is staged in `tmp/cloth-schemes/` (gitignored) — it does NOT enter the database.
Diego reviews it and later runs `add-saint` or `update-saint` himself.

## Inputs

1. **Base image** — a file path. Required.
2. **Artist** — either the name of an **official** artist, or `no-artist`.
   - Validate against `csv/data/artists.csv`: the artist must have `official` = 1. If the name
     given is a fan artist (official = 2) or unknown, stop and tell the user which official
     artists are available (see `references/artist-styles.md`) — don't silently substitute.
   - `no-artist` means: keep the art style of the base image itself; only convert its *format*
     into a scheme sheet.

## 1. Identify what's in the image

The filename follows the repo pattern `<cloth>-<character>[-<version>][-<source>].<ext>`
(e.g. `serket-youssef.jpg` → cloth "Serket", character "Youssef"). Both halves can be
multi-word (`sea-horse-baian`) — resolve ambiguity against the CSVs, which are the source of
truth:

```bash
grep -in "<name>" csv/data/cloths.csv csv/data/characters.csv csv/data/saints.csv
```

If a `saints.csv` row exists, pull its group, rank, god, and history — they sharpen the prompt
(a Hades Specter wears a Surplice, a Poseidon general a Scale, an Athena saint a Cloth) and feed
the Telegram caption.

Then build a **design inventory** — this is what keeps the generation faithful, and skipping it
is the number-one cause of a wrong result. Read the base image, then crop it into halves/regions
with ImageMagick and Read the crops too (details like ornament counts and trim shapes are
invisible at full-page zoom). Write down, part by part — head, collar, shoulders, wings/back,
torso, arms/hands, waist/belt, legs, feet, fabric accessories — the exact shapes, materials,
colors, and **counts** (how many feather tiers, how many rings down the leg, how many bead
strings). Note the armor's motif (animal/constellation/object the totem form should assemble
into — infer from the cloth name if the image doesn't show it) and whether an object form is
already depicted. This inventory goes verbatim into the prompt and is also the QC checklist.

## 2. Style references

For an official artist, find scheme images the site already credits to them — `artistCloth` is
column 10 of `saints.csv`, the image path column 11:

```bash
awk -F, -v a=<artist-id> '$10==a {print $11}' csv/data/saints.csv
```

Pick 3 as style references, preferring the same army/rank as the subject (a Specter scheme for
a Specter) and covering the features the subject has (e.g. a winged scheme if the subject has
wings). Use the full-resolution originals from `/home/diego/Nextcloud/Pictures/Cloth Schemes/`
when they exist — the 400px web copies are too small to carry the style. Read them plus the
notes in `references/artist-styles.md` and write down the style concretely: inking (line
weight, solid blacks vs. flat color), shading technique (screentone, cross-hatching, cel
shading), face rendering, label typography, border decoration, title lettering. The prompt must
*describe* the style in these terms, not just attach the images — attached references alone get
diluted into generic manga.

For `no-artist`: no style references — the base image is the style authority.

## 3. Generate

Use the `higgsfield` CLI (if missing: `curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh`;
if `higgsfield account status` says not authenticated, ask Diego to run `higgsfield auth login`).

Model: **`nano_banana_pro`** (reference-driven stylized image work, ~2 credits/generation —
never `gpt_image_2`, it costs 7). Landscape sheet:

```bash
higgsfield generate create nano_banana_pro \
  --prompt "<prompt>" \
  --image <base-image> --image <style-ref-1> --image <style-ref-2> \
  --aspect_ratio 4:3 --resolution 2k \
  --wait
```

Prompt recipe — structure it in labeled blocks, in this order:

1. **Image roles, by number.** "Image 1 is the DESIGN BLUEPRINT; images 2–4 are STYLE-ONLY
   references drawn by <artist>." Without explicit roles the model blends design from the style
   refs and style from the base — the exact failure this recipe exists to prevent.
2. **STYLE block**: the concrete style description from step 2 (inking, shading, faces,
   typography, border, title lettering). End with: pure white background, no color (if the
   artist works in B&W), no watermark, no website text, no scanner credit — reference scans
   often carry fan-site watermarks and the model will happily copy them.
3. **DESIGN block**: "reproduce every element of image 1 exactly — same shapes, same counts,
   same proportions; invent nothing, omit nothing" followed by the full part-by-part inventory
   from step 1. For a B&W target style, add an explicit **tone mapping** so colors don't
   collapse into random values: e.g. "all pale-gold parts (wing feathers, trims, rings, buckle)
   render as LIGHT metallic grey-white with fine line shading; all dark-purple armor renders as
   near-black gloss with white specular highlights; the white cloth stays white". The only
   licensed invention is the object-form assembly itself, and it should visibly reuse the
   inventoried parts (wings as wings, boots as legs/pincers…).
4. **LAYOUT block**: left side — the cloth assembled in its object/totem form (name the motif —
   e.g. "a scorpion totem" for Serket), or its disassembled parts if this line's schemes don't
   use totems. Right side — the character (name them, describe hair/face from the base image)
   standing front view in the complete armor, including back pieces like wings. Around them —
   4–6 circular insets showing individual parts being fitted, with small handwritten Japanese
   annotations; part labels in Latin capitals (HEAD, BODY, ARM, WAIST, LEG…) connected by
   straight callout lines; a title with the character and cloth name in Latin letters (big
   AI-generated Japanese turns to gibberish — keep Japanese small and decorative, put the
   readable title in English/romaji like the real sheets do).

### QC loop

Download every result immediately to `tmp/cloth-schemes/<base-name>-attempt-<n>.<ext>` — **every
attempt is kept**, never deleted or overwritten, so Diego (and later sessions) can review the
whole series and compare. Then Read the image and grade it against, in order:

1. **Design fidelity** — walk the inventory item by item against the generated wearer: every
   part present? counts right (rings, tiers, tassels)? tones mapped correctly? nothing invented?
2. **Format** — totem/parts side + wearer + insets + labels + title all present.
3. **Cleanliness** — no watermark/logo, no garbled large text, no anatomical glitches.

Every mismatch becomes an explicit correction line in the next attempt's prompt ("the wings must
be LIGHT grey-white feathers, not black"; "the leg band has EIGHT gold rings"). Up to **3
attempts** per run; if none is fully faithful, keep the best and tell the user exactly which
details are still off. Warn if `higgsfield account status` shows under 100 credits before
starting.

## 4. Save, notify, report

1. Copy the chosen best attempt to `tmp/cloth-schemes/<cloth>-<character>[-<suffixes>].jpg`
   (repo-root `tmp/` is gitignored; create the folder if needed) — same base name as the input
   so add-saint/update-saint can consume it as-is. Convert to JPG if the API returned PNG/WebP.
   Leave all the `-attempt-<n>` files in place alongside it.
2. Get remaining credits: `higgsfield account status`.
3. Send the image on Telegram per `.claude/skills/shared/telegram.md` (sendPhoto), caption with:
   cloth + character, army/god and rank if known, the artist style used (or "original style"),
   which attempt was chosen out of how many, the saved path, and Higgsfield credits left.
4. Report in chat: the identification, style references used, attempts made, final file path,
   credits remaining, and the suggested next step (`add-saint` or `update-saint`).
