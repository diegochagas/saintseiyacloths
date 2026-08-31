# Series style map — picking style references from the database

Shared by `draw-armor`, `change-saint-style` and `build-saint`. The user names a *series*
style; the database encodes it in `historyCloth` (column 13 of `saints.csv`), `artistCloth`
(column 10) and the filename suffix. Resolve references with both filters — artist alone
misses official schemes with unknown artist, history alone includes fan redraws:

```bash
awk -F, -v h=<history-id> '$13==h {print $11}' csv/data/saints.csv   # by series
awk -F, -v a=<artist-id>  '$10==a {print $11}' csv/data/saints.csv   # by artist
```

| Style | historyCloth ids | artistCloth | Suffix | Coverage |
|---|---|---|---|---|
| classic | 1 (manga), 12 (anime), 13 (hades anime), 42 (final edition) | 1 Kurumada (manga), 32 Araki (anime settei) | none / `-anime` | excellent (~200) |
| episode-g | 8, 10 (Assassin) | 2 Okada | `-eg` | good (~30) |
| lost-canvas | 6 (manga), 15 (anime), 7 (gaiden) | 3 Teshirogi | `-lost-canvas` | good (~45) |
| saintia-sho | 5 (manga), 17 (anime) | 4 Kuori | none | good (~24) |
| time-odyssey | 38 | 18 Alquie | `-time-odyssey` | good (~45) |
| omega | 16 | 31 Umakoshi | `-omega` | good (~36) |
| rerise-of-poseidon | 2 | 37 Suda | `-archetype` | ok (~14) |
| next-dimension | 4 | 1 Kurumada | `-next-dimension` | **thin (~5)** — warn |
| dark-wing | — | 28 Ueda | — | **thin (1: `hades-specters/necromancer-charlotte.jpg`)** — warn |
| saint-marya | — | — | — | **none — stop and ask for reference images** |

Re-check counts at run time — the database grows. For a thin style (≤5 schemes), tell the
user the sample is small and confirm before spending credits.

Selection and description rules are the same as `create-cloth-scheme` steps 2–3: pick 3
references (same army/rank as the subject when possible, covering its features), use the
full-resolution originals from `/home/diego/Nextcloud/Pictures/Cloth Schemes/` when they
exist, Read them, and write the style down concretely (inking, line weight, screentone vs
color, face rendering, typography) — the prompt must *describe* the style, attached
references alone get diluted. `references/artist-styles.md` in `create-cloth-scheme` has
per-artist notes.
