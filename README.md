# Saint Seiya Cloths

Encyclopedia of Saint Seiya cloth schemes, live at [saintseiyacloths.diegochagas.com](https://saintseiyacloths.diegochagas.com.com). Covers armors of Athena's Saints, Hades' Specters, Poseidon's Marinas and more, with artists, ranks and first appearances.

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

All content is stored as JSON files under `src/pages/api/data/`:

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
