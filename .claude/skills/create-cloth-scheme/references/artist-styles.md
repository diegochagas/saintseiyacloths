# Official artists — cloth-scheme styles

Only artists with `official` = 1 in `csv/data/artists.csv` are valid for this skill. The counts
and example paths below come from `saints.csv` (`artistCloth`, column 10) — always re-check with
awk at run time, the database grows. Read 2–3 of the artist's actual schemes before prompting;
the notes here tell you what to look for and put into words.

| id | Artist | Schemes | Style in one line |
|---|---|---|---|
| 1 | Masami Kurumada | ~120 | Classic manga/artbook: full-color painted armor (or B&W line art for some), ornate thin-line page frame, cloth totem left + wearer right, numbered circular insets with tiny Japanese notes, red star markers, part labels in Latin caps. Bodies are stocky and heavily muscled (thick necks, wide chests), eyes are narrow/serious, armor reads as smooth simple plate with few panel lines. Example: `athena-saints/leo-aiolia.jpg` |
| 2 | Megumu Okada | ~12 | Episode G: lush painted illustration, heavy sparkle/glow highlights on polished metal, elegant serif title ("ARIES MU"), insets drawn as clean line art inside circles, instructions in English. Bodies are notably tall, lean and long-limbed with an elegant, almost willowy athletic build (narrow waist, sloped shoulders, long neck) — thinner and more elongated than Kurumada's stocky manga bodies. Eyes are large, detailed and slightly almond-shaped with multi-layer iris highlights and visible lashes — more anime-doll-like than the classic manga's narrow eyes. Armor surfaces carry much higher detail density than the classic style: many small overlapping panel subdivisions, fine etched trim lines, rivets/studs, and layered ridge edges — a plain 3-band pauldron in the source should still gain this extra engraving-like surface detail, not just a shinier finish. **Rendering finish** (this is what separates Okada from a merely polished cel drawing): no flat cel shading anywhere — every surface is airbrush-painted with soft gradients; metal is mirror-polished with swirling environment reflections and hard specular bands; dozens of white 4-point star sparkles / cross-shaped lens flares are scattered over the armor; plates carry fine engraved arabesque/filigree etching and small gem studs; the whole figure often has a faint luminous outer glow; hair is painted in flowing individual strands with sheen bands, not as flat cel-shaded blocks. Example: `athena-saints/aries-mu-eg.jpg` |
| 3 | Shiori Teshirogi | ~31 | Lost Canvas: monochrome manga line art with screentones, decorative scroll border top/bottom, brush-style romaji name ("Hakurei DE ALTAR"), Japanese annotations with furigana, star markers, totem form left + wearer right. Bodies are slender and elongated, almost willowy; eyes are large, soft and heavily lashed, drawn with delicate fine linework rather than bold outlines. Examples: `athena-saints/ara-hakurei.jpg`, `hades-specters/sylph-edward.jpg` |
| 4 | Chimaki Kuori | ~19 | Saintia Shō: clean monochrome line art, lighter screentone, airy layout, part labels with macron typography (S̄HOULDER/CHEST…), vertical Japanese title plus bottom romaji title block. Bodies are petite/slender (most subjects are teenage girls), eyes are very large and rounded with sparkling multi-highlight irises typical of shōjo art. Example: `athena-saints/delphinus-mii.jpg` |
| 18 | Jerome Alquie | ~43 | Time Odyssey: modern flat-color European album/BD rendering, crisp cel shading with hard-edged highlight shapes. Bodies are naturalistic and proportioned like a European comic (less exaggerated than manga), armor is rendered with clean geometric surface detailing and sharp specular facets. Example: `athena-saints/taurus-aldebaran-time-odyssey.jpg` |
| 28 | Shinshu Ueda | 1 | Example: `hades-specters/necromancer-charlotte.jpg` |
| 31 | Yoshihiko Umakoshi | ~14 | Omega anime settei: clean animation-studio line art, flat cel color, model-sheet layout. Bodies are trim and athletic per 2010s TV-anime proportions, eyes are medium-large with simple flat-color highlights (no painterly gradient), armor detail is moderate — enough panel lines to read clearly on screen but not ornate. Example: `athena-saints/andromeda-shun-3-omega.jpg` |
| 32 | Shingo Araki | ~8 | 80s TV anime settei: cel-style line art and flat colors, God Warrior sheets. Bodies are lean and angular in classic 80s anime proportion, eyes are narrow and sharply drawn. Example: `odin-god-warriors/megrez-alberich.jpg` |
| 33 | Michi Himeno | 0 | No schemes in DB yet — treat like Araki (same Toei team) if requested. |
| 37 | Tsunagami Suda | ~14 | Rerise of Poseidon: modern manga B&W line art, archetype sheets. Bodies are lean and modern-manga proportioned, armor rendered with dense fine hatching and panel subdivision. Example: `poseidon-mariners/sea-horse-baian-archetype.jpg` |
| 40 | Feeling Lin | 1 | Example: `athena-saints/sextans-luna.jpg` |
| 41 | Setsuko Nobuzane | 0 | No schemes in DB yet — read their linked portfolio art if requested. |

All example paths are under `public/cloth-schemes/`. For artists with 0–1 schemes, tell the user
the style sample is thin and confirm before spending credits.

**Anatomy and detail density are part of the style, not just inking/color.** When an artist's
body build, eye size, or armor detail density differs from the base image's own rendering — this
is the norm, and Okada's lean, big-eyed, densely-detailed figures are the clearest case — the
prompt must say so explicitly, and the generated character's build/eyes/detail level should
follow the *target artist*, not be copied from the base image's rendering. This is separate from
— and must not be confused with — armor **design** fidelity (shapes, part counts, colors,
layout), which always stays locked to the base image regardless of style.
