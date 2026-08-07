# Saint Seiya Cloths — data model and image pipeline reference

Shared reference for the `add-saint` and `update-saint` skills. All paths are relative to the
repo root `/home/diego/Projects/saintseiyacloths` unless absolute.

## Key locations

| What | Where |
|---|---|
| Source-of-truth CSVs | `csv/data/*.csv` |
| CSV → JSON build script | `csv/csvtojson.js` (must run from inside `csv/`) |
| Generated JSON consumed by the app | `src/pages/api/data/*.json` (never edit by hand) |
| Web-optimized images | `public/cloth-schemes/<army-folder>/<image>.jpg` |
| Original full-size images (archive) | `/home/diego/Nextcloud/Pictures/Cloth Schemes/<army-folder>/` |
| Translations (4 languages, all required) | `messages/en.json`, `messages/es.json`, `messages/fr.json`, `messages/pt.json` |

CSV format notes: every CSV starts with a UTF-8 BOM and uses LF line endings with a trailing
newline. Append new rows at the end of the file (ids are not required to be sorted). Never
re-sort or reformat existing rows — diffs should stay minimal.

## CSV schemas

### saints.csv — one row per displayed image/version
`id,character,name,cloth,version,group,rank,god,artistSaint,artistCloth,image,historySaint,historyCloth,curiosities`

- `id` — next integer after the current maximum (check `sort -t, -k1 -n`, not line count).
- `character` — id in `characters.csv` (the person). Blank for group/generic images (e.g. soldiers).
- `name` — id in `names.csv` (display name). Usually equals `character`; differs when the same
  character is displayed under another name (e.g. Lost Canvas incarnations get an extra names row).
- `cloth` — id in `cloths.csv` (the armor's object name, e.g. "Orion"). Blank if the armor has no
  object, and also for characters catalogued without an armor at all (precedents: Lakshu in the
  Shurato group, Sister Maria and the dinosaur-form Pawns in silent-knight, Atavaka) — a saint row
  with only a character, group, and image is valid.
- `version` — blank, `v1`–`v5`, `god`, `omega`, `fake`, `authentic`, `fusion`, `dress`, `beta`, `ultimate`, `unknown`…
- `group` — id in `groups.csv` (e.g. `athena-saints-60` = Orion constellation).
- `rank` — id in `ranks.csv`. Common: 5 bronze, 6 silver, 7 gold, 8 pope, 9 god, 10 goddess,
  13 celestialStar, 14 terrestrialStar, 18 general, 1 soldier.
- `god` — id in `characters.csv` of the deity served. Common ids:
  582 Athena · 494 Poseidon · 168 Hades · 28 Apollo · 495 Odin · 308 Eris · 323 Pallas ·
  33 Ares/Mars · 444 Typhon · 38 Artemis · 306 Zeus · 524 Cronus · 544 Nemesis · 348 Ra ·
  484 Astraea · 492 Balor · 488 Arthur · 30 Apsu · 163 Tezcatlipoca · 342 Pontus · 496 Neck (Hakuryu) ·
  242 Lamech · 149 Garnet · 36 Bellatrix · 84 Oko (Titans). For others, grep `characters.csv`.
- `artistSaint` / `artistCloth` — ids in `artists.csv`: who drew the character art and who drew
  the cloth-object/scheme art (often the same). Blank or 0 = unknown.
- `image` — site path: `/cloth-schemes/<army-folder>/<filename>.jpg`.
- `historySaint` / `historyCloth` — ids in `history.csv`: the media where this saint version and
  this cloth design appeared. 0 = neverReleased. For a fan-designed scheme of a canon character,
  set `historySaint` to the media the character appears in and `historyCloth` to 0 — the design
  itself was never officially released (precedents: Carina Atlas 23,0; Kraken Isaak archetype by
  Albiero 2,0). A fan redrawing of an *official* design keeps that design's history on both.
- `curiosities` — blank, or `1` when trivia text exists in the `curiosities` object of the
  messages files (keyed by this saint id, translated in all 4 languages).

### characters.csv + names.csv — parallel id space
`characters.csv`: `id,name,character` — the canonical person ("Abel / Defteros"). Third column is
rarely used (link to a related character). `names.csv`: `id,name` — display names. A new character
gets **the same new id in both files**. An alternate display name for an existing character gets a
new id in `names.csv` only (use max id + 1 across BOTH files to stay collision-free).

### cloths.csv
`id,name` — armor object names ("Orion", "Sea Horse"). New id = max + 1.

### groups.csv
`id,class,name,cloth`
- `id` — kebab slug. Athena constellations: `athena-saints-<n>` (next free number — never renumber).
  Other armies: descriptive slugs like `poseidon-mariners-generals`, `odin-gods`, `hades-celestial-star-6`.
- `class` — id in `classes.csv` (`saints`, `specters`, `mariners`…).
- `name` — **i18n key** (e.g. `orionConstellation`) that must exist in all 4 messages files.
- `cloth` — i18n key of the armor type: `cloth`, `scale`, `surplice`, `glory`, `robe`, `kamui`,
  `chronotector`, `yoroigear`, `soma`, `shell`…

### history.csv
`id,name,midia,release,description` — `name` is an i18n key (e.g. `timeOdyssey`) required in all 4
messages files; `midia` is an id in `midias.csv` (1 manga, 2 anime, 5 game, 7 movie…); `release`
is the year; `description` is English plain text shown as-is (wrap in quotes if it contains commas).

### artists.csv
`id,name,official,site` — `official`: 1 = official Saint Seiya artist, 2 = fan artist. `site` =
portfolio/social URL. Check existing rows before adding: many fan artists are already registered
(Marco Albiero 5, Felipe Marchioni/Mikhairon 7, Lui Rayson 16, Trident-Poseidon 17…). Kurumada = 1,
Okada (Episode G) = 2, Teshirogi (Lost Canvas) = 3, Kuori (Saintia Shō) = 4, Araki = 32.

## Image conventions

**Filename pattern** (all lowercase, hyphen-separated):
`<cloth-or-constellation>-<character>[-<version>][-<source>].<ext>`

- Cloth version number maps to `version` column: `andromeda-shun-1.jpg` = v1, `-2` = v2…
- Version words: `-god`, `-omega`, `-black` (e.g. `aquarius-camus-god.jpg`).
- Source/adaptation suffixes: `-anime` (TV settei), `-eg` (Episode G), `-los` (Legend of
  Sanctuary), `-kotz` (Knights of the Zodiac CGI), `-time-odyssey`, `-lost-canvas`, `-omega`,
  `-archetype`, `-guardians` (Guardians of the Cosmos). No suffix = original manga/main design.
- Group images without a character: e.g. `jaguars.jpg`, `mariner-soldiers.jpg`, `aquila-saint.jpg`.
- Examples: `gemini-abel.jpg`, `orion-eden-omega.png`, `sea-horse-baian.jpg`,
  `taurus-aldebaran-time-odyssey.jpg`, `phoebus-abel.jpg`.

**Army folder**: find where other saints of the same group/god already live —
`grep '<group-id>' csv/data/saints.csv | cut -d, -f11`. The public and Nextcloud folder sets
differ slightly (e.g. public has `zeus-gods`, Nextcloud has `zeus-olympians`); always `ls` the
actual directory on each side and use the existing folder there. Create a folder only for a
genuinely new army, using the `<god>-<army>` convention on both sides.

**Web copy** (`public/cloth-schemes/...`): JPEG, height exactly 400px (never upscale), white
background, quality ~92:

```bash
convert "<original>" -background white -flatten -resize x400\> -quality 92 "public/cloth-schemes/<folder>/<name>.jpg"
```

**Original** goes to `/home/diego/Nextcloud/Pictures/Cloth Schemes/<folder>/<name>.<original-ext>`
(same base name, original format and resolution) — move it, don't copy, so the inbox stays clean.

**Before that `mv`, always check whether the destination filename already exists** (`ls` the
target folder for that exact name, not just the base name you expect — extensions can differ,
e.g. an old `.png` sitting where you're about to write `.jpg`). If it exists, rename the old file
to a distinguishing suffix first (an artist name, `-manga-panel`, `-cloth-myth`, whatever
identifies what it actually is) before moving the new one in. `mv` overwrites silently — treat
every archive folder as append-only, never as a place you write over blind.

## i18n (messages/*.json)

Any new `groups.csv` name key, `history.csv` name key, or `curiosities` entry must be added to
**all four** files: `en.json`, `es.json`, `fr.json`, `pt.json`. Top-level keys are kept in
alphabetical order — insert accordingly. Curiosities live in the nested `"curiosities"` object
keyed by saint id, with the text translated per language (en → English, es → Spanish, fr → French,
pt → Portuguese). Group-name pattern: `"orionConstellation": "Orion Constellation"` /
`"Constelação de Orion"` / `"Constellation d'Orion"` / `"Constelación de Orión"`.

## Rebuild + verify

```bash
cd /home/diego/Projects/saintseiyacloths/csv && node csvtojson.js
```

This regenerates `src/pages/api/data/*.json`. Then verify:

1. `git status` — expect only the intended CSVs, JSONs, messages files, and new/changed images.
2. `npm test` (jest) still passes.
3. Spot-check the new/updated JSON entry, e.g.
   `python3 -c "import json;print([s for s in json.load(open('src/pages/api/data/saints.json')) if s['id']=='<id>'])"`.

Do not commit or push unless the user asks.
