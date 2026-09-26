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
