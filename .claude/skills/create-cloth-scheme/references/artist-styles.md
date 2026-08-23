# Official artists — cloth-scheme styles

Only artists with `official` = 1 in `csv/data/artists.csv` are valid for this skill. The counts
and example paths below come from `saints.csv` (`artistCloth`, column 10) — always re-check with
awk at run time, the database grows. Read 2–3 of the artist's actual schemes before prompting;
the notes here tell you what to look for and put into words.

| id | Artist | Schemes | Style in one line |
|---|---|---|---|
| 1 | Masami Kurumada | ~120 | Classic manga/artbook: full-color painted armor (or B&W line art for some), ornate thin-line page frame, cloth totem left + wearer right, numbered circular insets with tiny Japanese notes, red star markers, part labels in Latin caps. Example: `athena-saints/leo-aiolia.jpg` |
| 2 | Megumu Okada | ~12 | Episode G: lush colored illustration, sparkles/glow on the metal, elegant serif title ("ARIES MU"), insets drawn as clean line art inside circles, instructions in English. Example: `athena-saints/aries-mu-eg.jpg` |
| 3 | Shiori Teshirogi | ~31 | Lost Canvas: monochrome manga line art with screentones, decorative scroll border top/bottom, brush-style romaji name ("Hakurei DE ALTAR"), Japanese annotations with furigana, star markers, totem form left + wearer right. Examples: `athena-saints/ara-hakurei.jpg`, `hades-specters/sylph-edward.jpg` |
| 4 | Chimaki Kuori | ~19 | Saintia Shō: clean monochrome line art, lighter screentone, airy layout, part labels with macron typography (S̄HOULDER/CHEST…), vertical Japanese title plus bottom romaji title block. Example: `athena-saints/delphinus-mii.jpg` |
| 18 | Jerome Alquie | ~43 | Time Odyssey: modern flat-color European album rendering, crisp cel shading. Example: `athena-saints/taurus-aldebaran-time-odyssey.jpg` |
| 28 | Shinshu Ueda | 1 | Example: `hades-specters/necromancer-charlotte.jpg` |
| 31 | Yoshihiko Umakoshi | ~14 | Omega anime settei: clean animation-studio line art, flat color, model-sheet layout. Example: `athena-saints/andromeda-shun-3-omega.jpg` |
| 32 | Shingo Araki | ~8 | 80s TV anime settei: cel-style line art and flat colors, God Warrior sheets. Example: `odin-god-warriors/megrez-alberich.jpg` |
| 33 | Michi Himeno | 0 | No schemes in DB yet — treat like Araki (same Toei team) if requested. |
| 37 | Tsunagami Suda | ~14 | Rerise of Poseidon: modern manga B&W line art, archetype sheets. Example: `poseidon-mariners/sea-horse-baian-archetype.jpg` |
| 40 | Feeling Lin | 1 | Example: `athena-saints/sextans-luna.jpg` |
| 41 | Setsuko Nobuzane | 0 | No schemes in DB yet — read their linked portfolio art if requested. |

All example paths are under `public/cloth-schemes/`. For artists with 0–1 schemes, tell the user
the style sample is thin and confirm before spending credits.
