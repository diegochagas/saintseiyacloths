import Link from "next/link";
import { useTranslations } from "next-intl";
import AdBanner from "../components/adbanner";
import ListItem from "../components/saints/list-item";
import saintsJson from "@/pages/api/data/saints.json";
import classesJson from "@/pages/api/data/classes.json";
import { loadSaintData } from "@/pages/api/classes";

interface Pantheon {
  labelKey: string;
  accent: string;
  groupIds: string[];
}

interface DeityClass {
  id: string;
  nameKey: string;
}

interface DeityGroup {
  key: string;
  title: string;
  classes: DeityClass[];
  versions: ReturnType<typeof loadSaintData>[];
}

// "Supreme Synapse Gold Cloth Seiya" (saint 316) sits in the athena-gods group
// but wears the unrelated Synapse cloth, not an Athena cloth — not a version of Athena.
const EXCLUDED_SAINT_IDS = ["316"];

const pantheons: Pantheon[] = [
  {
    labelKey: "teogoniaGreekOlympians",
    accent: "bg-blue-800",
    groupIds: [
      "zeus-gods",
      "athena-gods",
      "poseidon-gods",
      "hades-gods",
      "hades-pluton-facelessgods",
      "hades-brother-gods",
      "hades-dream-gods",
      "apollo-gods",
      "apollo-abel-gods",
      "apollo-golden-warriors-gods",
      "artemis-gods",
      "ares-gods",
      "ares-mars-gods",
      "ares-mars-heavenly-kings",
      "eris-gods",
      "eris-phantoms",
    ],
  },
  {
    labelKey: "teogoniaGreekTitansPrimordials",
    accent: "bg-emerald-800",
    groupIds: [
      "chronos-gods",
      "cronus-titans-1",
      "pontos-primordial-gods",
      "typhon-gods",
      "astraea-gods",
      "pallas-gods",
      "nemesis-gods",
    ],
  },
  {
    labelKey: "teogoniaNordicMythology",
    accent: "bg-indigo-800",
    groupIds: ["odin-gods"],
  },
  {
    labelKey: "teogoniaEgyptianMythology",
    accent: "bg-amber-700",
    groupIds: ["ra-egyptian-gods"],
  },
  {
    labelKey: "teogoniaAztecMythology",
    accent: "bg-orange-800",
    groupIds: ["tezcatlipoca-gods"],
  },
  {
    labelKey: "teogoniaCelticArthurianLegend",
    accent: "bg-teal-800",
    groupIds: ["balor-gods", "arthur-gladiators-king"],
  },
  {
    labelKey: "teogoniaMesopotamianMythology",
    accent: "bg-red-900",
    groupIds: ["apsu-anunnakis"],
  },
  {
    labelKey: "teogoniaOriginalDeities",
    accent: "bg-purple-800",
    groupIds: ["garnet-vampire", "bellatrix-gods", "lamech-gods", "hakuryu-gods"],
  },
];

const classNameKeyById: Record<string, string> = Object.fromEntries(
  classesJson.map((cls) => [cls.id, cls.name]),
);

type Version = ReturnType<typeof loadSaintData>;

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
function getDeityGroups(groupIds: string[]): DeityGroup[] {
  const versions = saintsJson
    .filter(
      (saint) =>
        groupIds.includes(saint.group) &&
        !EXCLUDED_SAINT_IDS.includes(saint.id),
    )
    .map((saint) => loadSaintData(saint));

  const keyOf = (version: Version) =>
    (version.cloth?.name || version.character?.name || "?").toLowerCase();

  const parent = new Map<string, string>();
  const find = (key: string): string => {
    let root = key;
    while (parent.get(root) && parent.get(root) !== root) {
      root = parent.get(root)!;
    }
    return root;
  };
  const union = (a: string, b: string) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent.set(rootA, rootB);
  };

  versions.forEach((version) => parent.set(keyOf(version), keyOf(version)));

  const keysByCharacter = new Map<string, Set<string>>();
  versions.forEach((version) => {
    const characterId = version.character?.id;
    if (!characterId) return;
    if (!keysByCharacter.has(characterId)) {
      keysByCharacter.set(characterId, new Set());
    }
    keysByCharacter.get(characterId)!.add(keyOf(version));
  });
  keysByCharacter.forEach((keys) => {
    const [first, ...rest] = [...keys];
    rest.forEach((key) => union(first, key));
  });

  const buckets = new Map<string, Version[]>();
  versions.forEach((version) => {
    const root = find(keyOf(version));
    if (!buckets.has(root)) buckets.set(root, []);
    buckets.get(root)!.push(version);
  });

  return [...buckets.values()].map((bucketVersions) => {
    const characterIds = new Set(
      bucketVersions.map((v) => v.character?.id).filter(Boolean),
    );
    const bySingleCharacter =
      characterIds.size === 1
        ? bucketVersions.find((v) => v.character?.name)?.character?.name
        : undefined;
    const title =
      bySingleCharacter ||
      bucketVersions.find((v) => v.cloth?.name)?.cloth?.name ||
      bucketVersions[0].character?.name ||
      "?";

    const classes: DeityClass[] = [];
    bucketVersions.forEach((version) => {
      const classId = version.group?.class;
      if (classId && !classes.some((c) => c.id === classId)) {
        classes.push({ id: classId, nameKey: classNameKeyById[classId] });
      }
    });

    return {
      key: `${title}-${bucketVersions[0].id}`,
      title,
      classes,
      versions: bucketVersions,
    };
  });
}

export default function Content() {
  const t = useTranslations();

  return (
    <div className="my-28 md:my-48 w-full flex justify-center flex-col items-center">
      <div className="flex w-full max-w-7xl px-6">
        <h1 className="uppercase font-extrabold text-4xl sm:text-6xl md:text-8xl">
          {t("teogonia")}
        </h1>
      </div>

      <div className="flex justify-center relative max-w-7xl px-6">
        <p className="bg-white p-5 md:p-8 max-w-4xl">
          {t("teogoniaPageDescription")}
        </p>
      </div>

      <div className="flex flex-col justify-center relative bg-zinc-100 w-full my-5 py-10 px-4 md:px-10 items-center">
        <div className="w-full max-w-6xl">
          <div className="ml-4 md:ml-6">
            <div className="inline-block uppercase font-extrabold text-white bg-black border-2 border-black px-6 py-2 text-lg md:text-xl">
              {t("teogonia")}
            </div>
            <div className="w-1 h-6 md:h-8 bg-black" />
          </div>

          <ul className="border-l-4 border-black ml-4 md:ml-6">
            {pantheons.map((pantheon) => {
              const deities = getDeityGroups(pantheon.groupIds);

              return (
                <li
                  key={pantheon.labelKey}
                  className="relative pl-8 md:pl-10 pb-10 md:pb-14 last:pb-0"
                >
                  <span className="absolute -left-2 top-2 w-4 h-4 rounded-full border-4 border-black bg-yellow-500" />
                  <span className="absolute left-0 top-4 w-8 md:w-10 h-1 bg-black" />

                  <div
                    className={`inline-block ${pantheon.accent} border-2 border-black px-4 py-1.5`}
                  >
                    <h2 className="uppercase font-extrabold text-white text-sm md:text-lg">
                      {t(pantheon.labelKey)}
                    </h2>
                  </div>

                  <ul className="mt-5 flex flex-wrap items-start gap-5">
                    {deities.map((deity) => (
                      <li
                        key={deity.key}
                        className="min-w-0 max-w-full border-2 border-black bg-white p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <h3 className="whitespace-nowrap uppercase font-bold text-sm md:text-base">
                            {deity.title}
                          </h3>

                          <div className="flex flex-wrap gap-1">
                            {deity.classes.map((deityClass) => (
                              <Link
                                key={deityClass.id}
                                href={`/classes?q=${deityClass.id}&p=1`}
                                className="whitespace-nowrap uppercase text-2xs font-bold bg-black text-yellow-500 hover:bg-yellow-500 hover:text-black px-1.5 py-0.5"
                              >
                                {t(deityClass.nameKey, { count: 1 })}
                              </Link>
                            ))}
                          </div>
                        </div>

                        <ul className="flex flex-wrap gap-4">
                          {deity.versions.map((version) => (
                            <ListItem
                              key={version.id}
                              id={version.id}
                              image={version.image}
                              cloth={version.cloth?.name}
                              name={version.name}
                              history={version.history}
                              saintClass={version.group?.class}
                              version={version.version}
                              rank={version.rank}
                            />
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <AdBanner dataAdSlot="9118717820" className="mt-10" />
    </div>
  );
}
