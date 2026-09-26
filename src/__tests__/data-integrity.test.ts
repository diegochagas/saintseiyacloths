/**
 * Integrity of the generated data (csv/data/*.csv -> src/pages/api/data/*.json):
 * every reference points to an existing row and every image exists in public/.
 * KNOWN_* lists are the gaps that already existed when this suite was added;
 * remove entries as they get fixed, never add new ones to make a test pass.
 */
import fs from "node:fs";
import path from "node:path";

type Row = Record<string, string>;

const dataDir = path.join(process.cwd(), "src/pages/api/data");
const publicDir = path.join(process.cwd(), "public");
const load = (name: string): Row[] =>
  JSON.parse(fs.readFileSync(path.join(dataDir, `${name}.json`), "utf8"));
const ids = (rows: Row[]) => new Set(rows.map((row) => row.id));

const saints = load("saints");
const characters = ids(load("characters"));
const names = ids(load("names"));
const cloths = ids(load("cloths"));
const artists = ids(load("artists"));
const history = load("history");
const historyIds = ids(history);
const midias = ids(load("midias"));
const groups = load("groups");
const groupIds = ids(groups);
const classes = load("classes");
const classIds = ids(classes);
const ranks = ids(load("ranks"));

// Image files referenced by saints.csv that are not in public/cloth-schemes.
const KNOWN_MISSING_IMAGES = new Set([
  "/cloth-schemes/athena-saints/soldier-ohko-lei-hu.jpg",
  "/cloth-schemes/eris-dryads/oblivion-maria.jpg",
  "/cloth-schemes/athena-saints/soldier-ohko.jpg",
  "/cloth-schemes/athena-saints/aries-mu-anime.jpg",
]);

const danglingRefs = (field: string, valid: Set<string>) =>
  saints
    .filter((saint) => saint[field] && saint[field] !== "0" && !valid.has(saint[field]))
    .map((saint) => `saint ${saint.id}: ${field}=${saint[field]}`);

describe("saints data", () => {
  it("has unique ids", () => {
    const seen = new Set<string>();
    const duplicates = saints.filter((saint) => seen.size === seen.add(saint.id).size);
    expect(duplicates.map((saint) => saint.id)).toEqual([]);
  });

  it.each([
    ["character", characters],
    ["name", names],
    ["cloth", cloths],
    ["rank", ranks],
    ["god", characters],
    ["artistSaint", artists],
    ["artistCloth", artists],
    ["historySaint", historyIds],
    ["historyCloth", historyIds],
  ])("every %s reference exists", (field, valid) => {
    expect(danglingRefs(field, valid)).toEqual([]);
  });

  it("every saint belongs to an existing group", () => {
    const orphans = saints
      .filter((saint) => !groupIds.has(saint.group))
      .map((saint) => `saint ${saint.id}: group=${saint.group}`);
    expect(orphans).toEqual([]);
  });

  it("every referenced image exists in public/", () => {
    const missing = saints
      .filter((saint) => saint.image && !KNOWN_MISSING_IMAGES.has(saint.image))
      .filter((saint) => !fs.existsSync(path.join(publicDir, saint.image)))
      .map((saint) => `saint ${saint.id}: ${saint.image}`);
    expect(missing).toEqual([]);
  });

  it("known missing images are still missing (drop them from the list once fixed)", () => {
    const fixed = [...KNOWN_MISSING_IMAGES].filter((image) =>
      fs.existsSync(path.join(publicDir, image)),
    );
    expect(fixed).toEqual([]);
  });
});

describe("groups, classes and history", () => {
  it("every group belongs to an existing class", () => {
    const orphans = groups
      .filter((group) => !classIds.has(group.class))
      .map((group) => `${group.id}: class=${group.class}`);
    expect(orphans).toEqual([]);
  });

  it("every class god exists", () => {
    const orphans = classes
      .filter((cls) => cls.god && cls.god !== "0" && !characters.has(cls.god))
      .map((cls) => `${cls.id}: god=${cls.god}`);
    expect(orphans).toEqual([]);
  });

  it("every history entry points to an existing media", () => {
    const orphans = history
      .filter((entry) => !midias.has(entry.midia))
      .map((entry) => `${entry.id}: midia=${entry.midia}`);
    expect(orphans).toEqual([]);
  });

  it("group and class ids are unique (they are used as URL slugs)", () => {
    expect(groupIds.size).toBe(groups.length);
    expect(classIds.size).toBe(classes.length);
  });
});
