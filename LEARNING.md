# Learning track: saintseiyacloths

From the dev-playbook §8. Tick an exercise when its "done when" is true and write what
you measured.

| # | Layer | Done when | Status | Measured / notes |
|---|---|---|---|---|
| 1 | Local gate | A deliberately broken type error blocks `git push` | [ ] | |
| 2 | Unit + data integrity | A missing translation key or image fails the suite | [x] | Found on day one: wrong image extension (Aquarius Mystoria), 4 missing images, 62 missing translation keys across the 4 locales |
| 4 | E2E + evidence | Screenshots attached to a real PR | [ ] | e2e found: About page logged a missing-message error on every visit; mobile menu button had no accessible name |
| 5 | CI | Badge green; a PR shows the screenshots artifact | [ ] | |
| 6 | Cross-browser | Chromium + Firefox + WebKit + mobile green in CI (or a browser bug caught) | [ ] | |
| 7 | Hostile review | 5 PRs reviewed with `/code-review`, findings logged here | [ ] | |
| 11 | Revert drill | Break production on purpose, `git revert && git push`, time it (target < 5 min) | [ ] | |
| 12 | Feedback loop | A real issue arrives via the issue template and gets fixed with a regression test | [ ] | Idea: add a "report a problem" link in the footer pointing to the issue form |

## Numbers (DORA, small scale)

| Month | Deploys | Deploys that broke something | Time to revert | Issue → fix |
|---|---|---|---|---|
| | | | | |
