import { HistoryProps } from "@/pages/api/history";

// Cloths whose display name is a fixed phrase per locale instead of
// "<class> <rank> <cloth>". Unknown locales fall back to English.
const SPECIAL_CLOTH_NAMES: Record<string, Record<string, string>> = {
  Super: {
    en: "Super Black Cloth",
    pt: "Super Armadura Negra",
    es: "Super Armadura Negra",
    fr: "Super Armure Noire",
  },
  Synapse: {
    en: "Supreme Synapse Gold Cloth",
    pt: "Suprema Armadura de Ouro Sinapse",
    es: "Armadura Dorada Suprema Synapse",
    fr: "Suprême Armure d'Or Synapse",
  },
};

// Word placed between the saint's name and the cloth name ("Seiya de Pegasus").
// Locales missing here use the English order ("Pegasus Seiya").
const NAME_PREPOSITION: Record<string, string> = { pt: "de", es: "de", fr: "du" };

export interface ClothNameOptions {
  name: string;
  locale: string;
  cls: string;
  rank: string;
  version: string;
}

export interface NameOptions {
  name: string;
  clothName: string;
  locale: string;
  cls: string;
  version: string;
  rank?: string;
}

/**
 * Fixed translation of the Super and Synapse cloths, undefined for every other cloth.
 *
 * @example specialClothName("Super", "fr") // "Super Armure Noire"
 */
export function specialClothName(clothName: string, locale: string): string | undefined {
  const translations = SPECIAL_CLOTH_NAMES[clothName];
  if (!translations) return undefined;
  return translations[locale] ?? translations.en;
}

function formatVersion(version: string): string {
  return version ? ` (${version})` : "";
}

function formatRank(rank: string, locale: string): string {
  if (locale !== "pt") return rank;
  if (rank === "Deus") return "Divina";
  if (rank === "Negro") return "Negra";
  return ` de ${rank}`;
}

function isRomanceLocale(locale: string): boolean {
  return locale === "pt" || locale === "es";
}

// pt/es: "Armadura de Bronze de Pégaso"; the basic cloth drops the "de".
function romanceClothName({ name, locale, cls, rank, version }: ClothNameOptions): string {
  const rankPart = rank ? formatRank(rank, locale) : "";
  const namePart = name ? `${name !== "Básica" ? "de " : ""}${name}` : "";
  return `${cls || ""} ${rankPart} ${namePart}${formatVersion(version)}`;
}

// fr: "Armure du Bronze du Pégase"; without a cloth name the rank has no "du".
function frenchClothName({ name, cls, rank, version }: ClothNameOptions): string {
  const suffix = formatVersion(version);
  if (!name) return `${cls || ""}${rank ? ` ${rank}` : ""} ${suffix}`;
  return `${cls || ""}${rank ? ` du ${rank}` : ""} du ${name}${suffix}`;
}

// en: "Pegasus Bronze Cloth"
function englishClothName({ name, cls, rank, version }: ClothNameOptions): string {
  return `${name} ${rank ? ` ${rank}` : ""} ${cls ? ` ${cls}` : ""}${formatVersion(version)}`;
}

/**
 * Caption of a cloth scheme: cloth name, rank and class in the locale's word order.
 *
 * @example getClothName({ name: "Pegasus", locale: "en", cls: "Cloth", rank: "Bronze", version: "" })
 * // "Pegasus  Bronze  Cloth"
 */
export function getClothName(options: ClothNameOptions): string {
  const special = specialClothName(options.name, options.locale);
  if (special) return special;
  if (isRomanceLocale(options.locale)) return romanceClothName(options);
  if (options.locale === "fr") return frenchClothName(options);
  return englishClothName(options);
}

function isSameAsCloth(name: string, clothName: string): boolean {
  return !clothName || name.toLocaleLowerCase() === clothName.toLocaleLowerCase();
}

// No saint name: "Cavaleiro de Pegasus", or "Cavaleiro Bronze" when the cloth is unknown.
function romanceClassName({ clothName, cls, rank = "", version }: NameOptions): string {
  if (!clothName && rank) return `${cls} ${rank} ${formatVersion(version)}`;
  if (cls === clothName) return cls;
  return `${cls} de ${clothName}`;
}

function englishName({ name, clothName, locale, cls, rank = "", version }: NameOptions): string {
  const suffix = formatVersion(version);
  if (!clothName && rank) return `${rank} ${cls}${suffix}`;
  const cloth = specialClothName(clothName, locale) ?? clothName;
  return `${cloth} ${name || cls}${suffix}`;
}

/**
 * Display name of a saint: "Pegasus Seiya" in English, "Seiya de Pegasus" in pt/es,
 * "Seiya du Pégase" in French; falls back to rank and class when the name is unknown.
 *
 * @example getName({ name: "Seiya", clothName: "Pegasus", locale: "en", cls: "Saint", version: "" })
 * // "Pegasus Seiya"
 */
export function getName(options: NameOptions): string {
  const { name, clothName, locale, version } = options;
  if (name && isSameAsCloth(name, clothName)) return `${name}${formatVersion(version)}`;
  const preposition = NAME_PREPOSITION[locale];
  if (!preposition) return englishName(options);
  if (!name) return romanceClassName(options);
  const cloth = specialClothName(clothName, locale) ?? clothName;
  return `${name} ${preposition} ${cloth}${formatVersion(version)}`;
}

export interface SaintNameSource {
  name?: string;
  cloth?: string;
  saintClass?: string;
  version?: string;
  rank?: string;
}

export type TranslateFn = (key: string, values?: { count: number }) => string;

/**
 * getName for a saint record: translates class, version and rank and ignores the
 * "basic" placeholder cloth. Shared by every list and detail view.
 *
 * @example getSaintName({ name: "Seiya", cloth: "Pegasus", saintClass: "saints" }, "en", t)
 * // "Pegasus Seiya"
 */
export function getSaintName(saint: SaintNameSource, locale: string, t: TranslateFn): string {
  return getName({
    name: saint.name || "",
    clothName: saint.cloth && saint.cloth !== "basic" ? saint.cloth : "",
    locale,
    cls: saint.saintClass ? t(saint.saintClass, { count: 1 }) : "",
    version: saint.version ? t(saint.version) : "",
    rank: saint.rank ? t(saint.rank) : "",
  });
}

export interface SaintRecord {
  name?: string;
  cloth?: { name?: string };
  group?: { class?: string };
  version?: string;
  rank?: string;
}

/**
 * getSaintName for a SaintProps-shaped record (cloth and class nested).
 *
 * @example getSaintRecordName(saint, "pt", t) // "Seiya de Pegasus"
 */
export function getSaintRecordName(saint: SaintRecord, locale: string, t: TranslateFn): string {
  return getSaintName(
    {
      name: saint.name,
      cloth: saint.cloth?.name,
      saintClass: saint.group?.class,
      version: saint.version,
      rank: saint.rank,
    },
    locale,
    t,
  );
}

export function getHistory(t: (key: string) => string, history?: HistoryProps) {
  if (!history?.midia) return t("neverReleased");

  const name = t(history.name);
  const midia = t(history.midia.name);

  // some entries repeat the same label (e.g. "Never released") in both fields
  return name === midia ? name : `${name} (${midia})`;
}
