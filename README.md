# Saint Seiya Cloths

Encyclopedia of Saint Seiya cloth schemes, live at [saintseiyacloths.diegochagas.com](https://saintseiyacloths.diegochagas.com). Covers armors of Athena's Saints, Hades' Specters, Poseidon's Marinas and more, with artists, ranks and first appearances.

## Features

- Browse cloth schemes by class (Gold, Silver, Bronze, God, Specter, Marina…)
- Filter saints by rank, group and media appearance
- Internationalisation (next-intl) — multiple languages supported
- Dynamic Open Graph images per cloth page
- JSON-based data API served via Next.js API routes
- Sitemap and robots.txt auto-generation

## Tech Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Framework  | Next.js 16 (App Router)            |
| Language   | TypeScript                         |
| Styling    | Tailwind CSS                       |
| Runtime    | React 19                           |
| i18n       | next-intl                          |
| Testing    | Jest + React Testing Library + MSW |
| Deployment | Vercel                             |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run test          # Run test suite
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Data

The **source of truth is the CSVs** in `csv/data/` (`saints.csv`, `characters.csv`,
`cloths.csv`, `groups.csv`, `classes.csv`, `ranks.csv`, `artists.csv`, `history.csv`,
`midias.csv`, `names.csv`). They are compiled into the JSON the site serves:

```bash
cd csv && node csvtojson.js
```

Output goes to `src/pages/api/data/*.json` — never edit those by hand.

| File           | Description                         |
| -------------- | ----------------------------------- |
| `cloths.json`  | Cloth scheme records                |
| `saints.json`  | Saint characters                    |
| `classes.json` | Cloth classes (Gold, Silver, etc.)  |
| `artists.json` | Cloth designers/artists             |
| `groups.json`  | Factions (Athena, Hades, Poseidon…) |
| `ranks.json`   | Saint ranks                         |
| `history.json` | Timeline entries                    |
| `midias.json`  | Media appearances                   |

UI strings and per-saint texts live in `messages/{en,es,fr,pt}.json` — every new key must
exist in all four files.

### Images

Web copies live in `public/cloth-schemes/<army-folder>/<name>.jpg` (400px tall, quality 92);
full-resolution originals are archived outside the repo. Filenames follow
`<cloth>-<character>[-<version>][-<source>].jpg` — e.g. `aries-mu-eg.jpg` is Mu's Episode G
scheme.

## AI tooling (Claude Code)

The repo ships [Claude Code](https://claude.com/claude-code) skills in `.claude/skills/`
that automate the whole catalogue workflow. In a Claude Code session opened at the repo
root, invoke them by name (`/add-saint …`) or just describe what you want.

| Skill                | What it does                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `add-saint`          | Register a NEW saint from a cloth-scheme image: identifies it, renames/resizes, archives the original, updates CSVs + i18n, rebuilds JSON, commits.       |
| `update-saint`       | Swap in a better image for an EXISTING saint (image + artist credit only, no data changes).                                                              |
| `create-cloth-scheme`| Generate a full official-style scheme sheet from a base image with Higgsfield AI, in an official artist's style or the image's own.                      |
| `draw-armor`         | Draw the armor's OBJECT/totem form from a sketch of the knight wearing it, in a chosen series style or the sketch's own.                                 |
| `change-saint-style` | Redraw a knight / armor / full scheme in another series style (classic, Episode G, Lost Canvas, Saintia Shō…), preserving design and composition.        |
| `build-saint`        | Composite a complete scheme sheet with GIMP: series background template + armor + character + 4 AI-drafted part insets (pointer circles aimed at the matching part) + labeled arrows. Deterministic text and layout — the AI only draws the art pieces. Delivers a flattened JPG plus a layered, editable `.xcf` for manual touch-ups. |

Generation skills stage results in the gitignored `tmp/` folder and never touch the
database; you review the sheet and then run `add-saint`/`update-saint`.

Shared references live in `.claude/skills/shared/` (data model, series→style mapping,
Telegram notes). Series style names resolve to database examples via
`.claude/skills/shared/style-map.md`.

### The saint-builder agent

`.claude/agents/saint-builder.md` is a project subagent that runs the heavy middle of
`build-saint` — Higgsfield generation, transparency prep, and the GIMP compose/QC
iteration — in an isolated context. The `build-saint` skill spawns it automatically; you
don't call it directly. Identification, your approval of the finished sheet, and database
registration always happen in the main conversation.

### Templates

`templates/cloth-scheme/` holds the GIMP assets `build-saint` composites from:

- `background-<style>.xcf` — one per series (classic, lost-canvas, saintia-sho so far),
  always on white, with editable text layers for the sheet titles.
- `circle.xcf` / `arrow.xcf` — the inset backdrop (a white circle with a pointer tail the
  script rotates toward the part it refers to), and the pointer arrow (head, black star and
  label; the connecting line is drawn by the script).
- `manifest.json` — maps each template's text layers to roles (character/cloth/group).

To support a new series style: add its `background-<style>.xcf` plus a `manifest.json`
entry, and make sure the database has a few reference schemes for that series.

### Requirements

- **Claude Code** — runs the skills/agent.
- **ImageMagick** (`convert`, `identify`) — resizing, cropping, transparency.
- **GIMP 3** (Flatpak `org.gimp.GIMP`) — headless compositing for `build-saint`. Fonts used
  by the templates must be installed on the host.
- **Higgsfield CLI** — image generation. Authenticate with `higgsfield auth login`
  (browser); no API keys are stored in the repo.

### Configuration & secrets

Nothing secret is committed. Runtime configuration lives outside the repo in
`~/.config/saintseiyacloths/telegram.env`:

```bash
TELEGRAM_BOT_TOKEN=<your bot token>
TELEGRAM_CHAT_ID=<your chat id>
```

The skills read it to send result notifications; if the file is missing they skip
notifications and tell you, nothing breaks. Higgsfield credentials are managed entirely by
its CLI session (`higgsfield auth login`).
