import Link from "next/link";
import { useTranslations } from "next-intl";
import AdBanner from "../components/adbanner";
import ListItem from "../components/saints/list-item";
import { DeityGroup, getDeityGroups } from "./deity-groups";
import { Pantheon, pantheons } from "./pantheons";

function DeityCard({ deity }: { deity: DeityGroup }) {
  const t = useTranslations();

  return (
    <li className="min-w-0 max-w-full border-2 border-black bg-white p-3">
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
  );
}

function PantheonItem({ pantheon }: { pantheon: Pantheon }) {
  const t = useTranslations();
  const deities = getDeityGroups(pantheon.groupIds);

  return (
    <li className="relative pl-8 md:pl-10 pb-10 md:pb-14 last:pb-0">
      <span className="absolute -left-2 top-2 w-4 h-4 rounded-full border-4 border-black bg-yellow-500" />
      <span className="absolute left-0 top-4 w-8 md:w-10 h-1 bg-black" />

      <div className={`inline-block ${pantheon.accent} border-2 border-black px-4 py-1.5`}>
        <h2 className="uppercase font-extrabold text-white text-sm md:text-lg">
          {t(pantheon.labelKey)}
        </h2>
      </div>

      <ul className="mt-5 flex flex-wrap items-start gap-5">
        {deities.map((deity) => (
          <DeityCard key={deity.key} deity={deity} />
        ))}
      </ul>
    </li>
  );
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
            {pantheons.map((pantheon) => (
              <PantheonItem key={pantheon.labelKey} pantheon={pantheon} />
            ))}
          </ul>
        </div>
      </div>

      <AdBanner dataAdSlot="9118717820" className="mt-10" />
    </div>
  );
}
