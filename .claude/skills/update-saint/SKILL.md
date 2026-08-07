---
name: update-saint
description: Update an EXISTING Saint's cloth-scheme image on the Saint Seiya Cloths site — swap in a better scan/artwork and credit its artist, nothing else. Use when the user provides a new image for a saint already in the database ("better scan", "replace the image", "atualiza esse cavaleiro", "found the official scheme for X"). Renames/resizes the image, archives the original to Nextcloud, updates only the image path and artistSaint/artistCloth columns, and rebuilds the JSON. If the image is a character+cloth+version combination not yet in saints.csv, use add-saint instead — this skill never creates rows or changes rank/group/history/version/curiosities.
---

# Update an existing Saint's image

Replace a saint's image and credit its artist — nothing more. This skill has one job: swap the
picture, keeping the whole pipeline consistent (web JPG, Nextcloud original, `saints.csv`,
generated JSON). It does not touch any other data on the row, and it never creates a new row.

**First, read the shared reference** at `.claude/skills/shared/saint-data-model.md`
(repo `/home/diego/Projects/saintseiyacloths`) — it defines every CSV column, the filename
pattern, and the exact ImageMagick/rebuild commands.

## 1. Locate the saint and decide the operation

Identify the image the same way as in the add-saint skill (read the image, use the Japanese
labels, art style, signatures; grep the CSVs; web-search if uncertain). Then find the row:

```bash
grep -in "<character-or-constellation>" csv/data/saints.csv
```

Match on the image path column — it's human-readable. Now decide, and hold this distinction hard:

- **Same character + cloth + version, same design** (a higher-quality scan, official art
  replacing fan art, colored replacing line-art of the *same armor concept*) → this skill:
  replace the image in place, keep the saint id, touch nothing else on the row.
- **Anything else** — no existing row for this character+cloth+version, a different version or
  source (anime settei, `-god` cloth, a Time Odyssey redesign), or a genuinely new
  interpretation/redesign — is **not an update**. Stop and use the `add-saint` skill instead,
  which is the only one allowed to insert a `saints.csv` row or touch rank/group/history/version.
  If you're not sure which case you're in, treat it as add-saint's job, not this skill's — do not
  force a new concept into an existing row just because the character matches.

If several rows share the image (some saints reuse another's image as placeholder), list them and
consider whether the new image applies to all or the placeholder row should now get its own file —
ask the user if it changes the outcome.

## 2. Replace the image

1. Keep the established base name unless the identification says it was wrong; the shared
   reference has the naming pattern.
2. Create the web copy (JPEG, max height 400px, white background, quality 92 — exact command in
   the shared reference) into the same `public/cloth-schemes/<folder>/`.
   - If the old public file has a different extension (e.g. legacy `.png`), delete it and update
     the `image` path in `saints.csv` — the goal is `.jpg` everywhere.
3. Move (not copy) the renamed original to `/home/diego/Nextcloud/Pictures/Cloth Schemes/<folder>/`.
   If an old original with the same name exists there, the new one replaces it — but if the old
   one might be a different artwork worth keeping, ask before overwriting.
4. `identify` the new JPG (height ≤400) and confirm the source file left the inbox.

## 3. Update the data

Touch exactly two things on the existing row, nothing more:

1. `image` — the new path from step 2.
2. `artistSaint`/`artistCloth` — the credit for this new picture (add the artist to
   `artists.csv` first if new: fan artist → `official` = 2, with portfolio URL).

Leave `character`, `name`, `cloth`, `version`, `group`, `rank`, `god`, `historySaint`,
`historyCloth`, and `curiosities` exactly as they were. Those describe the saint/cloth as a
*concept*, not the picture of it — a new image of the same design doesn't change what the design
is, when it released, or what the saint's rank is. If the new artwork seems to imply one of those
should change (e.g. it looks like a different history/media than the row currently says), that's
a sign this isn't actually the same design — stop and re-read step 1, this probably belongs in
add-saint as a new row instead of being forced through here.

The one narrow exception: if the old image file had a different extension (legacy `.png`) that
you're replacing with `.jpg` per convention, that's still just the `image` column — same rule.

## 4. Rebuild and report

Run `node csvtojson.js` from `csv/`, then verify per the shared reference (git status, npm test,
spot-check the changed JSON entry). Confirm the diff on the row touches only `image` and the
artist columns — if it touches more, back out and reconsider. Report: which saint row was
touched, what changed (image + artist only) and why, files replaced/moved, and anything
uncertain. Don't commit unless asked.
