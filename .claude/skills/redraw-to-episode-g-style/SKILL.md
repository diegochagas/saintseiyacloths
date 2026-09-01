---
name: redraw-to-episode-g-style
description: Redraw any image (photo, drawing, comic page, screenshot) into Megumu Okada's Saint Seiya Episode G art style via Higgsfield, preserving the original composition, with visual QC and reroll loop. Use when Diego asks to redraw or restyle an image into Episode G / Okada style — "redraw this in episode g style", "redesenha essa imagem no estilo do Okada", "converte pro estilo Episode G" — for one image or a whole folder.
---

# Redraw to Episode G style — restyle any image as Megumu Okada would draw it

You are the orchestrator and visual QC reviewer; Higgsfield does the image
generation through its CLI (billed in credits to Diego's Higgsfield Plus
plan, 1000 credits/month). No Claude API usage.

The target style is always Megumu Okada / Saint Seiya Episode G — full
traits, prompt block, mandatory checklist and reference images are in
`STYLE.md` (same folder). Read it before the first generation of a session.

## Arguments

`/redraw-to-episode-g-style <image-or-folder>`
- `image-or-folder`: path to one image, several images, or a folder (batch).
- If missing, ask.

## Before the first generation of a session

1. Check credits: `higgsfield account status`. Warn Diego under 100 credits;
   stop and ask under 40.
2. Models & costs (Plus plan, verified 2026-08-08):
   - **`nano_banana_pro` — 2 credits/gen — the default.** Up to 14 image
     references, best fidelity.
   - `nano_banana_flash` — 1.5 credits — cheap reroll when the failure was
     minor (style strength, palette), not structure.
   - NEVER `gpt_image_2` (7 credits) or video models.
   - Batch budget: N images × ~1.5 attempts × 2 credits. If the balance
     can't cover it, tell Diego before generating.
3. If the CLI reports auth errors, stop and ask Diego to run
   `higgsfield auth login` — never work around auth.

## Per-image workflow

1. **Build the prompt** and write it to a temp file (scratchpad), using
   `STYLE.md`'s prompt block as the style description:

   ```
   Redraw the first attached image in <STYLE.md prompt block>.

   The first attached image is the CONTENT — redraw exactly it.
   The other attached images are STYLE REFERENCES ONLY — copy their art
   style (linework, coloring, shading, texture, mood), never their content.

   RULES:
   - Per STYLE.md's style-strength policy: style fidelity comes FIRST,
     likeness second — keep the character recognizable (armor
     pieces/silhouette, color scheme, pose, framing) but fully adopt
     Okada's proportions, facial rendering, hair rendering and detail
     density. This overrides strict composition/likeness preservation
     below wherever the two conflict.
   - Preserve the framing, camera angle, pose, and background elements of
     the original. Do not add, remove, move, or crop any element EXCEPT
     the mandatory Okada armor embellishment/segmentation in STYLE.md.
   - <"Reproduce any text in the original exactly, letter by letter." OR
     "There is no text in the original — render none.">
   - ABSOLUTE PROHIBITION: no watermarks, no signatures, no borders, no
     style-label or caption text of any kind.
   ```

2. **Generate**:
   ```
   python3 .claude/skills/redraw-to-episode-g-style/scripts/redraw.py <source> \
     --prompt-file <tmp.txt> --out <dest> --style-ref <img> [--style-ref <img>]... \
     [--model nano_banana_pro] [--aspect auto] [--resolution 2k]
   ```
   - Pick 4–6 style refs from `refs/` per STYLE.md's table, matching subject
     and output type (color vs B&W).
   - Aspect is auto-matched to the source image; override only if Diego
     asks for a different framing (then relax the "do not crop" rule).
   - Output naming: next to the source as `<stem>__episode-g.png`; batch
     keeps the same rule per file. Tries go to `<stem>__episode-g.tryN.png`;
     copy the approved try to the final name and delete rejected tries
     after approval.

3. **QC — Read the output AND the original**, compare:
   a. **Okada style checklist** — walk every item in STYLE.md's "Mandatory
      Okada details" list; reject if any is missing.
   b. **Composition preserved**: same framing/pose/background; count people
      and key objects in both images (armor embellishment/segmentation is
      the one licensed exception).
   c. **Identity preserved**: faces recognizable as the same people;
      clothing/colors consistent with the source design.
   d. **Text**: original text reproduced exactly (letter by letter, accents
      included) or absent if the original had none; zero gibberish.
   e. **No artifacts**: no watermarks/signatures/borders/style-label text,
      no anatomy failures (hands!), no melted background details.

4. **Decision**:
   - PASS → copy to final name, show it to Diego (side by side with the
     original when practical).
   - FAIL → reroll with a **targeted fix** appended to the prompt naming
     the exact defect. If the result is good except for ONE local flaw,
     prefer an edit: rerun redraw.py with the failed OUTPUT as source, its
     prompt being just the single change ("same image, fix only ..."), ONE
     change per call — edits preserve the rest well, two changes cause a
     relayout.
   - Max 3 generations per image, then flag it, show Diego the best try,
     and move on (batch) or ask (single).

## Field lessons (inherited from comic-ai-tools)

- If a redraw.py call hits the shell timeout, DON'T resubmit blindly — run
  `higgsfield generate list --json` first: the job may still be
  `in_progress` (recover it with `higgsfield generate wait <job_id>`, then
  download the result URL manually) or `failed` (then retry). Resubmitting
  while a job is in progress double-spends credits.

- Whack-a-mole is real: a reroll that fixes one thing often breaks another.
  Re-check the WHOLE image after every fix, not just the target.
- Edit-mode sometimes silently no-ops (output pixel-identical to input).
  If an edit changes nothing after 1 retry, do a full reroll with an
  explicit warning about the specific defect.
- Anchor edit instructions by content ("the person on the left in the red
  shirt"), never by coordinates, and add DO-NOT-CHANGE guards for elements
  a previous attempt damaged.
- Style-label leak recurs: the style name printed on the art. The
  ABSOLUTE PROHIBITION line prevents most of it; if it leaks, fix with a
  surgical edit, don't reroll.
- Body slimness and face form (STYLE.md items 3, 11, 12) tend to REGRESS
  between iterations — re-verify them on EVERY generation, even when the
  previous try passed.

## Batch mode

Process a folder sequentially (results feed nothing into each other, but
sequential keeps credit spend observable). After every 5 images report:
approved / flagged, credits spent, credits left. At the end, list all
outputs and any flagged images with what's wrong with them.
