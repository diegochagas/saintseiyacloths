import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Error from "@/app/components/error";
import Icon from "@/app/components/icons";
import { NewsProps } from "@/pages/api/news";
import { getClothName } from "@/helpers";
import AdBanner from "@/app/components/adbanner";

interface ContentProps {
  data: NewsProps;
  error: any;
  url: string;
  isBrazil?: boolean;
}

export default function Content({ data, error, url, isBrazil }: ContentProps) {
  const t = useTranslations();

  const renderListItem = (title: string, description: any) => (
    <li className="list-disc">
      <h6 className="font-bold text-lg">{t(title)}</h6>
      {description?.id ? (
        description?.site ? (
          <a
            className="hover:font-bold"
            href={description.site}
            target="_blank"
            rel="noopener noreferrer"
          >
            {description.name}
          </a>
        ) : (
          description.name
        )
      ) : (
        description
      )}
    </li>
  );

  return (
    <div className="my-28 md:my-48 w-full flex justify-center flex-col items-center">
      <div className="flex w-full max-w-7xl">
        <h1 className="uppercase font-extrabold text-6xl md:text-8xl">
          {t("news")}
        </h1>
      </div>

      <div className="flex flex-col justify-center relative bg-zinc-100 w-full my-5 py-10 px-6 items-center">
        <div className="flex justify-center items-center w-full max-w-4xl">
          <div className="flex flex-col w-full">
            {!error && data.date ? (
              <>
                <span className="font-bold text-lg block my-5">
                  {data.date}
                </span>

                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex flex-col">
                    <span className="font-bold text-xl text-white uppercase bg-black px-10 py-0.5">
                      {t(data.saint.history.midia.name)}
                    </span>
                  </div>
                  {data.saint?.cloth?.history?.midia?.name &&
                    data.saint?.history?.midia?.name !==
                      data.saint?.cloth?.history?.midia?.name && (
                      <div className="flex flex-col md:items-center">
                        <h2 className="text-3xl font-extrabold uppercase">
                          {t("cloth")}
                        </h2>
                        <span className="font-bold text-xl text-white uppercase bg-black px-10 py-0.5">
                          {t(data.saint?.cloth?.history?.midia?.name)}
                        </span>
                      </div>
                    )}
                </div>

                <h2 className="mt-5 text-3xl font-extrabold">
                  {data.saint?.character?.name ?? t("unknown")}
                </h2>

                <div className="bg-neutral-400 my-5 md:my-10 p-4 md:p-8">
                  <h1 className="text-2xl font-bold">
                    {t(data.saint.history.name)}
                  </h1>
                </div>

                {t(`newsDescription.${data.saint.id}`)
                  .split("\n")
                  .map((text) => (
                    <p className="my-2" key={text}>
                      {text}
                    </p>
                  ))}

                <AdBanner dataAdSlot="1835086184" className="my-5" />

                <figure className="flex flex-col items-center my-5 w-full">
                  <Image
                    className="border-2 border-black"
                    src={data.saint.image}
                    width={536}
                    height={400}
                    alt={t("saintClothScheme")}
                  />

                  <figcaption>
                    <small className="font-semibold capitalize">
                      {getClothName(t, data.saint.cloth?.name)}
                    </small>
                  </figcaption>
                </figure>

                <ul className="flex flex-col gap-2 ml-4 mt-10">
                  {renderListItem("god", data.saint.god?.name)}
                  {renderListItem("class", {
                    id: data.saint.group.id,
                    name: t(data.saint.group.class),
                    site: `/classes?q=${data.saint.group.class}&p=1`,
                  })}
                  {renderListItem("rank", t(data.saint.rank || "unknown"))}
                  {data.saint.artist && data.saint.cloth.artist ? (
                    data.saint.artist.id === data.saint.cloth.artist.id ? (
                      renderListItem("schemeBy", data.saint.artist)
                    ) : (
                      <>
                        {data.saint.artist &&
                          renderListItem("characterBy", data.saint.artist)}
                        {data.saint.cloth.artist &&
                          renderListItem("clothBy", data.saint.cloth.artist)}
                      </>
                    )
                  ) : (
                    <>
                      {data.saint.artist &&
                        renderListItem("characterBy", data.saint.artist)}
                      {data.saint.cloth.artist &&
                        renderListItem("clothBy", data.saint.cloth.artist)}
                      {!data.saint.artist &&
                        !data.saint.cloth.artist &&
                        renderListItem("schemeBy", t("unknown"))}
                    </>
                  )}
                </ul>

                {isBrazil && data.amazon ? (
                  <div className="my-16">
                    <a
                      className="hover:font-bold cursor-pointer text-lg flex flex-col"
                      href={data.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b className="inline-flex items-center gap-1">
                        <Icon name="arrow-right" size={15} />
                        <span className="uppercase">Clique aqui!</span>
                      </b>
                      <span className="">
                        E compre a história onde esse personagem apareceu!
                      </span>
                    </a>
                  </div>
                ) : (
                  <AdBanner dataAdSlot="7861476475" className="my-16" />
                )}

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
                      `${data.saint?.character?.name ?? "unknown"} - ${t(
                        data.saint.history.midia.name
                      )}: ${t(data.saint.history.name)}`
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
                    {t("newsNotFound")}
                  </figcaption>
                </figure>
              </Error>
            )}

            <div className="mt-20 mb-20 mx-auto flex justify-center md:justify-end">
              <Link
                className="block text-center w-64 font-extrabold text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 py-3"
                href="/news"
              >
                {t("backToNewsList")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AdBanner dataAdSlot="9118717820" className="mt-20" />
    </div>
  );
}
