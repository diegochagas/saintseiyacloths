---
name: add-saint
description: Add a NEW Saint to the Saint Seiya Cloths site from a cloth-scheme image. Use whenever the user provides an image (file path or attachment) of a Saint Seiya armor/cloth scheme, character sheet, or fan-art cloth design that is not yet in the database — e.g. "add this saint", "new cloth scheme", "cadastra esse cavaleiro", or an image dropped with little context. Identifies the character, renames and resizes the image, archives the original to Nextcloud, updates the CSVs/i18n files, and rebuilds the JSON. If the exact character+cloth+version already exists in saints.csv, use update-saint instead.
---

# Add a new Saint from a cloth-scheme image

Full pipeline: identify the saint in the image → name the files → produce the 400px web JPG →
archive the original → register the data in the CSVs and messages files → rebuild the JSON.

**First, read the shared reference** at `.claude/skills/shared/saint-data-model.md`
(repo `/home/diego/Projects/saintseiyacloths`) — it defines every CSV column, the id rules, the
filename pattern, and the exact ImageMagick/rebuild commands. Don't guess formats from memory.

## 1. Identify the saint

Read the image with the Read tool and extract every clue:

- Japanese labels are gold: `聖衣` = cloth, `白銀聖衣` = silver, `黄金聖衣` = gold, `青銅聖衣` =
  bronze, `〜座` = constellation, katakana furigana often spells the English name (オリオン = Orion).
  Official manga "cloth disassembly" line-art pages (聖衣分解装着図) come from a specific manga/
  artbook — that determines `historyCloth`.
- Art style hints at the source: Kurumada line-art → classic manga; colored settei → anime;
  Okada style → Episode G; a visible signature → fan artist.
- Search the project before the internet: grep `csv/data/characters.csv`, `cloths.csv`,
  `saints.csv` (image paths are readable names) for the suspected character/constellation. Rows
  for the same character or group tell you the correct `group`, `god`, `rank`, and folder.
- Use web search (Saint Seiya wiki at seiya.fandom.com, seiyapedia, Pharaon website) when the
  character, media of origin, or artist is uncertain.

Confidence check: character, cloth/constellation, army/god, rank, version, source media, and
artist(s). If after searching you still can't pin down the character or the artist, tell the user
what you found and ask — a wrong identification pollutes the database and is hard to spot later.

Confirm it's genuinely new: `grep -i "<character>" csv/data/saints.csv` (also try the constellation
in the image column). If the exact character+cloth+version row exists, switch to the
`update-saint` skill.

## 2. Files

1. Build the filename per the shared reference pattern
   (`<cloth>-<character>[-<version>][-<source>]`).
2. Find the army folder on each side (`ls public/cloth-schemes/` and
   `ls "/home/diego/Nextcloud/Pictures/Cloth Schemes/"` — names can differ between them).
3. Create the web copy: JPEG, max height 400px, white background, quality 92 (exact `convert`
   command in the shared reference) → `public/cloth-schemes/<folder>/<name>.jpg`.
4. Move (not copy) the original, renamed to the same base name with its original extension, to
   `/home/diego/Nextcloud/Pictures/Cloth Schemes/<folder>/`.
5. Sanity-check the result: `identify` the new JPG (height must be ≤400) and confirm the original
   is gone from its old location.

## 3. Data

Work bottom-up so every foreign key exists before `saints.csv` references it. Only add what's
missing — most characters, cloths, groups, and artists already exist:

1. `characters.csv` + `names.csv` — new character gets the same new id in both.
2. `cloths.csv` — the armor object name, if new.
3. `groups.csv` — if the group is new, also add its `name` i18n key to all 4 messages files.
4. `artists.csv` — if the artist is new (fan artist → `official` = 2, include portfolio URL).
5. `history.csv` — if the source media is new, also add its i18n key to the 4 messages files.
6. `saints.csv` — the new row, next sequential id, image path from step 2.
7. Curiosities (optional): if the user provided trivia, set the column to `1` and add the
   translated text under `curiosities.<saintId>` in all 4 messages files.

## 4. Rebuild and report

Run `node csvtojson.js` from `csv/`, then verify per the shared reference (git status, npm test,
spot-check the JSON). Report: the identification (with the reasoning), files created/moved, CSV
rows added, and anything left uncertain. Don't commit unless asked.
