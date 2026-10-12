# Agent instructions

## Testing and shipping (dev-playbook)

This repo follows the dev-playbook (`~/.claude/skills/dev-playbook/PLAYBOOK.md`).
Push to `main` deploys the live site, so the pre-push gate is the last check.

- One gate: `npm run check` (types, lint, Jest, build). The pre-push hook runs it
  (`git config core.hooksPath .githooks`). Never push with `--no-verify`.
- After any data change (add-saint, update-saint, create-cloth-scheme, CSV → JSON),
  run `npm run check`: the data-integrity suite catches broken references and missing images.
- New translation keys go into all four `messages/*.json` files; the i18n suite enforces it.
- UI changes: run `npm run e2e` and attach desktop + mobile screenshots from
  `e2e/screenshots/` of every changed page to the PR or final message.
- Bugs: write a failing regression test first, then fix.
- Never weaken, skip or delete a test, and never add entries to the KNOWN_* lists
  to make a test pass. Those lists only shrink.
- Risk class: none (public content site). Rollback = `git revert <sha> && git push`.
- Before finishing: run `/code-review` on the diff, then give the evidence package:
  summary, test results, screenshots, rollback steps.

## Clean code (dev-playbook CLEAN-CODE.md)

Language: TypeScript, Next.js App Router. Style is whatever `npx eslint .` accepts; don't discuss it.

- Functions 4–20 lines; React components ≤40 lines, split into hooks/subcomponents.
  Files ≤300 lines, hard max 500. ESLint limits live in `eslint-clean-code.mjs`;
  `scripts/clean-code-audit` (in `scripts/check`) reports Python/bash offenders in `.claude/skills/*/scripts`.
- One responsibility per module. Layout: `src/app/<route>/` pages, `src/app/components/`,
  `src/helpers/`, `src/i18n/` + `messages/`, generated data in `public/data/`, tests in `src/__tests__/`, `e2e/`.
- Names specific and searchable (<5 grep hits). Banned: `data`, `handler`, `utils`, `Manager`, `Service`.
- Types explicit: no `any`, typed exports, zod/schema-validated JSON at the data boundary.
- Early returns, max 2 nested levels. Extract duplicated logic the second time it appears.
- Errors include the offending value and the expected shape (`unknown class "bronse": expected one of bronze|silver|gold…`).
- Comments: keep the ones you find, they carry intent. Write WHY, cite issue numbers / SHAs.
  Docstring + one usage example on exported helpers. Never `// increment i`.
- Dependencies injected via parameters; data loading goes through the existing helpers, not raw `fetch` in components;
  tests use MSW handlers or named fakes, not inline stubs.
- Logging: none in the browser bundle beyond errors; skill scripts print plain text (they are CLIs).
- Defensive code this repo needs (flag anything else instead of adding it silently): input validation at
  build time (data-integrity suite), graceful empty states for filters with no results. Skill scripts that call
  Telegram or ComfyUI: per-request timeout, one retry on connection error, clear message when the service is down.
- README keeps an "Architecture" section (CSV → JSON pipeline → routes) with a short diagram; update it when the shape changes.
- `scripts/check` is the single validation command (`npm run check`).
