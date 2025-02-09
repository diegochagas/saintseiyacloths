import { useTranslations } from "next-intl";
import Image from "next/image";
import AdBanner from "../components/adbanner";

export default function Content() {
  const t = useTranslations();

  return (
    <div className="my-28 md:my-48">
      <div className="flex w-full flex-col">
        <div className="max-w-7xl m-6">
          <h1 className="uppercase font-extrabold text-4xl sm:text-6xl md:text-8xl">
            {t("about")}
          </h1>
        </div>

        <div className="flex justify-center relative max-w-7xl">
          <div className="bg-white p-5 flex flex-wrap justify-center gap-10">
            <figure className="lg:order-2">
              <Image
                src="/history/manga-classic.jpg"
                width={234}
                height={370}
                alt={t("aboutImageDescription")}
              />
            </figure>

            <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
              {Array.from({ length: 2 }).map((_, i) => (
                <p key={`paragraph-${i}`} className="flex justify-between">
                  {t(`aboutSaintSeiya.${i}`)}
                </p>
              ))}

              <h2 className="font-bold w-full text-2xl uppercase">
                {t("about")} Saint Seiya Cloths
              </h2>

              <p>{t("aboutSaintSeiyaCloths.description")}</p>

              <h3 className="font-bold w-full text-xl capitalize">
                {t("aboutSaintSeiyaCloths.sections.title")}
              </h3>

              {Array.from({ length: 6 }).map((_, i) => (
                <p key={`about-${i}`} className="flex justify-between">
                  {t(`aboutSaintSeiyaCloths.sections.${i}`)}
                </p>
              ))}
            </div>
          </div>
        </div>

        <section className="max-w-7xl mt-10 bg-white w-full">
          <AdBanner
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
            dataAdSlot="5939387690"
          />
        </section>
      </div>
    </div>
  );
}
