/**
 * Every translation key exists in every locale under messages/.
 * KNOWN_MISSING lists the gaps that already existed when this suite was added;
 * translate them and remove the entries, never add new ones to make a test pass.
 */
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "messages");
const locales = fs.readdirSync(dir).filter((file) => file.endsWith(".json"));

const flatten = (obj: Record<string, unknown>, prefix = ""): string[] =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === "object"
      ? flatten(value as Record<string, unknown>, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );

const keysByLocale = Object.fromEntries(
  locales.map((file) => [
    file,
    new Set(flatten(JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")))),
  ]),
);
const allKeys = new Set(Object.values(keysByLocale).flatMap((keys) => [...keys]));

const missingIn = (locale: string) =>
  [...allKeys].filter((key) => !keysByLocale[locale].has(key)).sort();

const KNOWN_MISSING: Record<string, string[]> = {
  "en.json": ["dracodent", "dryad", "katar", "martiancommander", "nasu", "pallasite",
    "piscisaustrinus", "soulkiller", "sparrow", "vuivreo", "walkyrie"],
  "es.json": ["comaberenicecorona", "coronaaustralis", "coronaborealis", "demonimpact",
    "dracodent", "genesis", "katar", "lynxcorona", "mephistopheles", "nasu", "pallasites",
    "phantasos", "scale", "soulkiller", "sparrow", "starcrusherchronotectorv2", "virtues",
    "walkyrie"],
  "fr.json": ["comaberenicecorona", "coronaaustralis", "coronaborealis", "demonimpact",
    "dracodent", "genesis", "katar", "lynxcorona", "mephistopheles", "nasu", "pallasites",
    "phantasos", "soulkiller", "sparrow", "starcrusherchronotectorv2", "virtues", "vuivreo"],
  "pt.json": ["comaberenicecorona", "coronaaustralis", "coronaborealis", "demonimpact",
    "dryad", "genesis", "leukotes", "lynxcorona", "mephistopheles", "pallasites",
    "phantasos", "piscisaustrinus", "starcrusherchronotectorv2", "virtues", "vuivreo",
    "walkyrie"],
};

describe.each(locales)("%s", (locale) => {
  const known = new Set(KNOWN_MISSING[locale] ?? []);

  it("has every key used by the other locales", () => {
    expect(missingIn(locale).filter((key) => !known.has(key))).toEqual([]);
  });

  it("known gaps are still gaps (drop them from KNOWN_MISSING once translated)", () => {
    expect([...known].filter((key) => keysByLocale[locale].has(key))).toEqual([]);
  });

  it("has no empty translations", () => {
    const messages = JSON.parse(fs.readFileSync(path.join(dir, locale), "utf8"));
    const empty = flatten(messages).filter((key) => {
      const value = key.split(".").reduce<unknown>(
        (node, part) => (node as Record<string, unknown>)[part],
        messages,
      );
      return typeof value === "string" && value.trim() === "";
    });
    expect(empty).toEqual([]);
  });
});
