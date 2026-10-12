import saintsJson from "@/pages/api/data/saints.json";
import classesJson from "@/pages/api/data/classes.json";
import { loadSaintData } from "@/pages/api/classes";

export interface DeityClass {
  id: string;
  nameKey: string;
}

export interface DeityGroup {
  key: string;
  title: string;
  classes: DeityClass[];
  versions: ReturnType<typeof loadSaintData>[];
}

// "Supreme Synapse Gold Cloth Seiya" (saint 316) sits in the athena-gods group
// but wears the unrelated Synapse cloth, not an Athena cloth — not a version of Athena.
const EXCLUDED_SAINT_IDS = ["316"];

const classNameKeyById: Record<string, string> = Object.fromEntries(
  classesJson.map((cls) => [cls.id, cls.name]),
);

type Version = ReturnType<typeof loadSaintData>;

function loadPantheonVersions(groupIds: string[]): Version[] {
  return saintsJson
    .filter(
      (saint) =>
        groupIds.includes(saint.group) &&
        !EXCLUDED_SAINT_IDS.includes(saint.id),
    )
    .map((saint) => loadSaintData(saint));
}

const keyOf = (version: Version) =>
  (version.cloth?.name || version.character?.name || "?").toLowerCase();

// Union-find over cloth keys: `parent` maps each key to the key it was merged into.
function findRoot(parent: Map<string, string>, key: string): string {
  let root = key;
  while (parent.get(root) && parent.get(root) !== root) {
    root = parent.get(root)!;
  }
  return root;
}

function unionKeys(parent: Map<string, string>, a: string, b: string) {
  const rootA = findRoot(parent, a);
  const rootB = findRoot(parent, b);
  if (rootA !== rootB) parent.set(rootA, rootB);
}

function clothKeysByCharacter(versions: Version[]): Map<string, Set<string>> {
  const keysByCharacter = new Map<string, Set<string>>();
  versions.forEach((version) => {
    const characterId = version.character?.id;
    if (!characterId) return;
    if (!keysByCharacter.has(characterId)) {
      keysByCharacter.set(characterId, new Set());
    }
    keysByCharacter.get(characterId)!.add(keyOf(version));
  });
  return keysByCharacter;
}

function mergeKeysSharingCharacter(versions: Version[]): Map<string, string> {
  const parent = new Map<string, string>();
  versions.forEach((version) => parent.set(keyOf(version), keyOf(version)));
  clothKeysByCharacter(versions).forEach((keys) => {
    const [first, ...rest] = [...keys];
    rest.forEach((key) => unionKeys(parent, first, key));
  });
  return parent;
}

function bucketVersionsByDeity(versions: Version[]): Version[][] {
  const parent = mergeKeysSharingCharacter(versions);
  const buckets = new Map<string, Version[]>();
  versions.forEach((version) => {
    const root = findRoot(parent, keyOf(version));
    if (!buckets.has(root)) buckets.set(root, []);
    buckets.get(root)!.push(version);
  });
  return [...buckets.values()];
}

function deityTitle(bucketVersions: Version[]): string {
  const characterIds = new Set(
    bucketVersions.map((v) => v.character?.id).filter(Boolean),
  );
  const bySingleCharacter =
    characterIds.size === 1
      ? bucketVersions.find((v) => v.character?.name)?.character?.name
      : undefined;
  return (
    bySingleCharacter ||
    bucketVersions.find((v) => v.cloth?.name)?.cloth?.name ||
    bucketVersions[0].character?.name ||
    "?"
  );
}

function deityClasses(bucketVersions: Version[]): DeityClass[] {
  const classes: DeityClass[] = [];
  bucketVersions.forEach((version) => {
    const classId = version.group?.class;
    if (classId && !classes.some((c) => c.id === classId)) {
      classes.push({ id: classId, nameKey: classNameKeyById[classId] });
    }
  });
  return classes;
}

function deityGroupFromBucket(bucketVersions: Version[]): DeityGroup {
  const title = deityTitle(bucketVersions);
  return {
    key: `${title}-${bucketVersions[0].id}`,
    title,
    classes: deityClasses(bucketVersions),
    versions: bucketVersions,
  };
}

// A saint's cloth is literally named after the deity it represents (Odin,
// Loki, Hypnos...), so two different hosts wearing the SAME cloth (Aiolia and
// Seiya both wearing Odin) are the same god, while two different clothes in
// one curated group (Ares and Zeus, both in zeus-gods) are different gods.
// When the cloth hasn't been revealed, a character's own name is used
// instead — which coincidentally already matches an existing cloth bucket
// for gods with no separate "host" (e.g. Poseidon's own empty-cloth cameo
// falls into the same "poseidon" bucket as Julian Solo's Poseidon cloth).
// A second pass then merges any buckets that still share a character (e.g.
// Cronus wearing three differently-named cloths across sagas).
export function getDeityGroups(groupIds: string[]): DeityGroup[] {
  return bucketVersionsByDeity(loadPantheonVersions(groupIds)).map(deityGroupFromBucket);
}
