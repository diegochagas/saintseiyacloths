---
name: draw-armor
description: Draw the armor OBJECT form (the assembled totem, or disassembled parts for lines that don't use totems) of the cloth a knight is wearing, from a sketch of the knight in armor, using Higgsfield AI — either in a chosen series style (classic, episode g, lost canvas, saintia sho, time odyssey, omega…) or in the sketch's own style. Use when the user asks to "draw the armor", "generate the object/totem form", "desenha a armadura/objeto", or when build-saint needs an armor object it wasn't given. Only GENERATES into tmp/armors/ — never touches the database.
---

# Draw the armor object form

From a sketch of a Saint **wearing** their cloth, produce the cloth's **object form**: the
armor disassembled from the body and reassembled as the totem (animal/constellation/object)
shown on the left side of official cloth schemes.

## Inputs

1. **path** — knight sketch file path. Required.
2. **style** — a series style from `.claude/skills/shared/style-map.md`, or `same`
   (default): keep the sketch's own art style.

## 1. Complete a cropped reference

If the knight sketch is cropped and doesn't show the character down to the feet (common with
bust/half-body fan art — cut off at the waist, hip or knees), generate a completed full-body
version FIRST, before doing anything else, and use it — never the original crop — as the
design blueprint for every step below (inventory, totem generation) and, when this skill runs
inside `build-saint`, as the CHARACTER piece in the final composite too. Never invent the
totem's lower-body parts from imagination alone when a completed reference can be generated
first — both must come from the same fully-realized design, or they risk not matching.

`higgsfield generate create gpt_image_2_5 --quality low`, aspect `2:3` (or a closer full-body
ratio if the crop suggests one), image 1 = the cropped sketch. Prompt: "Image 1 shows this
exact character, in this exact costume and art style, cropped at the <waist/hip/knees>.
Extend it into a full-body standing image by adding legs and feet that continue the shown
armor's material, color scheme and detail density naturally — invent nothing above the crop
line. Do NOT change anything above the crop line: same face, hair, torso, arms, colors, pose,
proportions. Plain white background, no watermark, no text."

QC: everything above the original crop line pixel-consistent with the source (face, torso,
arms, colors); new legs/feet match the established material and palette; no extra limbs, no
floating parts. Up to 2 attempts, keep the best.

## 2. Identify and inventory

Resolve cloth + character from the filename against the CSVs and pull group/rank/god if a
`saints.csv` row exists (same recipe as `create-cloth-scheme` step 1):

```bash
grep -in "<name>" csv/data/cloths.csv csv/data/characters.csv csv/data/saints.csv
```

Build the **design inventory** exactly as `create-cloth-scheme` prescribes: Read the sketch,
crop it into regions with ImageMagick, Read the crops, and write down part by part (head,
shoulders, torso, arms, waist, legs, feet, wings/back) the shapes, materials, colors and
**counts**. Note the totem motif — infer it from the cloth/constellation name if the sketch
doesn't show it (Serket → scorpion, Pegasus → winged horse…).

## 3. Style references

- `style = same` → no references; the sketch is the style authority.
- A series style → resolve 3 reference schemes via `shared/style-map.md` (warn on thin
  styles), Read them, and write the style description concretely.

## 4. Generate

`higgsfield generate create gpt_image_2_5 --quality low` (never `gpt_image_2`, the older
model), aspect `1:1`, resolution `2k`, `--wait`, attaching the sketch first and style refs
after. Prompt blocks:

1. **Roles**: "Image 1 is the DESIGN BLUEPRINT (a knight wearing the armor); images 2–N are
   STYLE-ONLY references."
2. **STYLE**: the concrete description (or "exactly the drawing style of image 1" for
   `same`). Plain WHITE background, always — never a colored or painted background — no
   watermark, no text.
3. **DESIGN**: "disassemble the armor worn in image 1 and reassemble it as a standalone
   object: a <motif> totem. Reuse every armored part exactly — same shapes, same counts,
   same proportions; the body, face, hair and any un-armored clothing must NOT appear.
   Invent nothing, omit nothing." Then the full inventory, with tone mapping for B&W
   targets. Parts should map naturally (helmet as the head, boots as legs/paws, shield on
   the flank…).
4. **LAYOUT**: the object alone, centered, three-quarter view like official totem art, no
   character, no labels, no title.

### QC loop

Download every attempt to `~/Downloads/armors/<cloth>-<character>-armor-attempt-<n>.<ext>` (create
the folder; never overwrite). Read it and check: every inventoried part present and
accounted for in the object? counts right? no body parts or invented pieces? style faithful?
Each miss becomes a correction line in the next prompt. Up to **3 attempts**; keep the best.
Warn if `higgsfield account status` shows under 100 credits before starting.

## 5. Save and report

Copy the best attempt to `~/Downloads/armors/<cloth>-<character>-armor.png`. Send it on Telegram per
`.claude/skills/shared/telegram.md` (caption: cloth + character, style used, attempt chosen,
credits left). Report the path, attempts and credits in chat. When called from `build-saint`,
just return the path — build-saint does its own reporting.
