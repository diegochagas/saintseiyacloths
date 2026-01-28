import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import Error from "@/app/components/error";
import Icon from "@/app/components/icons";
import { getClothName, getName } from "@/helpers";
import AdBanner from "@/app/components/adbanner";
import { SaintProps } from "@/pages/api/classes";
import Select from "./select";

interface ContentProps {
  saint: SaintProps;
  error: any;
  url: string;
}

export default function Content({ saint, error, url }: ContentProps) {
  const t = useTranslations();
  const locale = useLocale();

  const renderListItem = (title: string, description: any) => (
    <li className="list-disc">
      <h6 className="font-bold text-lg">{t(title)}</h6>
      {description?.id &&
        (description?.site ? (
          description?.official ? (
            <a
              className="hover:font-bold"
              href={description.site}
              target="_blank"
              rel="noopener noreferrer"
            >
              {description.name}
            </a>
          ) : (
            <Link className="hover:font-bold" href={description.site}>
              {description.name}
            </Link>
          )
        ) : (
          description.name
        ))}

      {Array.isArray(description) && (
        <Select options={description} defaultOption={saint.id} />
      )}

      {typeof description === "string" && description}
    </li>
  );

  return (
    <div className="my-28 md:my-48 w-full flex justify-center flex-col items-center">
      <div className="flex w-full max-w-7xl">
        <h1 className="uppercase font-extrabold text-6xl md:text-8xl">
          {t("classes")}
        </h1>
      </div>

      <div className="flex flex-col justify-center relative bg-zinc-100 w-full my-5 py-10 px-6 items-center">
        <div className="flex justify-center items-center w-full max-w-4xl">
          <div className="flex flex-col w-full">
            {!error && saint ? (
              <>
                <div className="flex flex-wrap gap-4 items-end">
                  {saint.history?.midia?.name && (
                    <div className="flex flex-col">
                      <span className="font-bold text-xl text-white uppercase bg-black px-10 py-0.5">
                        {t(saint.history.midia.name)}
                      </span>
                    </div>
                  )}
                  {saint?.cloth?.history?.midia?.name &&
                    saint?.history?.midia?.name !==
                      saint?.cloth?.history?.midia?.name && (
                      <div className="flex flex-col md:items-center">
                        <h2 className="text-3xl font-extrabold uppercase">
                          {t("cloth")}
                        </h2>
                        <span className="font-bold text-xl text-white uppercase bg-black px-10 py-0.5">
                          {t(saint?.cloth?.history?.midia?.name)}
                        </span>
                      </div>
                    )}
                </div>

                <h2 className="mt-5 text-3xl font-extrabold">
                  {getName(
                    saint?.name || "",
                    saint.cloth?.name && saint.cloth.name !== "basic"
                      ? saint.cloth?.name
                      : "",
                    locale,
                    saint.group?.class
                      ? t(saint.group.class, { count: 1 })
                      : "",
                    saint.version ? t(saint.version) : "",
                    saint.rank ? t(saint.rank) : "",
                  )}
                </h2>

                {saint.history?.name && (
                  <div className="bg-neutral-400 my-5 md:my-10 p-4 md:p-8">
                    <h1 className="text-2xl font-bold">
                      {t(saint.history.name)}
                    </h1>
                  </div>
                )}

                {saint.curiosities &&
                  t(`curiosities.${saint.id}`)
                    .split("\n")
                    .map((text) => (
                      <p className="my-2" key={text}>
                        {text}
                      </p>
                    ))}

                <AdBanner dataAdSlot="1835086184" className="my-5" />

                <figure className="flex flex-col items-center my-5 w-full">
                  <Image
                    className="border-2 border-black w-auto h-full"
                    src={saint.image}
                    width={536}
                    height={400}
                    alt={t("saintClothScheme")}
                  />

                  <figcaption>
                    <small className="font-semibold">
                      {getClothName(
                        saint.cloth?.name ?? "",
                        locale,
                        saint.group?.cloth
                          ? t(saint.group.cloth, { count: 1 })
                          : "",
                        saint.rank ? t(saint.rank) : "",
                        saint.version ? t(saint.version) : "",
                      )}
                    </small>
                  </figcaption>
                </figure>

                <ul className="flex flex-col gap-2 ml-4 mt-10">
                  {renderListItem("god", saint.god?.name)}
                  {renderListItem("class", {
                    id: saint.group?.id,
                    name: t(saint.group?.class, { count: 1 }),
                    site: `/classes?q=${saint.group?.class}&p=1`,
                  })}

                  {saint.rank &&
                    renderListItem("rank", t(saint.rank || "unknown"))}

                  {saint.artist && saint.cloth.artist ? (
                    saint.artist.id === saint.cloth.artist.id ? (
                      renderListItem("schemeBy", saint.artist)
                    ) : (
                      <>
                        {saint.artist &&
                          renderListItem("characterBy", saint.artist)}
                        {saint.cloth.artist &&
                          renderListItem("clothBy", saint.cloth.artist)}
                      </>
                    )
                  ) : (
                    <>
                      {saint.artist &&
                        renderListItem("characterBy", saint.artist)}
                      {saint.cloth?.artist &&
                        renderListItem("clothBy", saint.cloth.artist)}
                      {!saint.artist &&
                        !saint.cloth?.artist &&
                        renderListItem("schemeBy", t("unknown"))}
                      {saint.artist &&
                        !saint.cloth?.artist &&
                        renderListItem("clothBy", t("unknown"))}
                    </>
                  )}

                  {saint.others &&
                    saint.others?.length > 1 &&
                    renderListItem("otherVersions", saint.others)}

                  {saint.cloth.history.id !== saint.history.id &&
                    renderListItem(
                      "clothRelease",
                      t(saint.cloth?.history?.name || "unknown"),
                    )}
                </ul>

                <AdBanner dataAdSlot="7861476475" className="my-16" />

                <div className="relative self-end">
                  <h3 className="absolute top-9 md:top-20 -left-1 font-extrabold text-2xl md:text-5xl -rotate-6 uppercase">
                    {t("share")}
                  </h3>

                  <Image
                    className="w-72 md:w-[570px]"
                    src="/banners/bg_share.png"
                    alt={t("shareImage")}
                    width={1044}
                    height={398}
                  />

                  <a
                    className="absolute -bottom-2 left-16 md:left-32 w-12 h-12 md:w-20 md:h-20 rounded-full border-4 border-black flex items-center justify-center bg-white group"
                    href={`http://www.facebook.com/share.php?u=${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon
                      className="w-5 md:w-10 md:group-hover:w-12 h-auto"
                      name="facebook"
                    />
                  </a>

                  <a
                    className="absolute -bottom-2 left-32 md:left-60 w-12 h-12 md:w-20 md:h-20 rounded-full border-4 border-black flex items-center justify-center bg-white group"
                    href={`http://twitter.com/share?text=${encodeURI(
                      `${saint?.character?.name ?? "unknown"} - ${t(
                        saint.history?.midia?.name,
                      )}: ${t(saint.history?.name)}`,
                    )}+%23saintseiya %23clothmyth %23actionfigures %23cavaleirosdozodiaco %23caballerosdelzodiaco %23leschevaliersduzodiaque %23icavalieridellozodiaco %23bandai %23cdz&url=${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon
                      className="w-5 md:w-10 md:group-hover:w-12 h-auto"
                      name="x"
                    />
                  </a>
                </div>
              </>
            ) : (
              <Error>
                <figure className="flex flex-col items-center gap-10 p-5 md:p-10">
                  <Image
                    className="w-full max-w-72"
                    src="/banners/sorry.jpg"
                    width={532}
                    height={984}
                    alt={t("errorMangaImage")}
                  />
                  <figcaption className="text-xs sm:text-base">
                    {t("saintNotFound")}
                  </figcaption>
                </figure>
              </Error>
            )}

            <div className="mt-20 mb-20 mx-auto flex justify-center md:justify-end">
              <Link
                className="block text-center w-64 font-extrabold text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 py-3"
                href="/classes"
              >
                {t("backToClasses")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AdBanner dataAdSlot="9118717820" className="mt-20" />
    </div>
  );
}
