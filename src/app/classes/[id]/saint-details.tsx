import { useLocale, useTranslations } from "next-intl";
import AdBanner from "@/app/components/adbanner";
import { getSaintRecordName } from "@/helpers";
import { SaintProps } from "@/pages/api/classes";
import DetailsList from "./details-list";
import MediaBadges from "./media-badges";
import SchemeFigure from "./scheme-figure";
import ShareBanner from "./share-banner";

interface SaintDetailsProps {
  saint: SaintProps;
  url: string;
}

export default function SaintDetails({ saint, url }: SaintDetailsProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <>
      <MediaBadges saint={saint} />

      <h2 className="mt-5 text-3xl font-extrabold">
        {getSaintRecordName(saint, locale, t)}
      </h2>

      {saint.history?.name && (
        <div className="bg-neutral-400 my-5 md:my-10 p-4 md:p-8">
          <h1 className="text-2xl font-bold">{t(saint.history.name)}</h1>
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
      <SchemeFigure saint={saint} />
      <DetailsList saint={saint} />
      <AdBanner dataAdSlot="7861476475" className="my-16" />
      <ShareBanner saint={saint} url={url} />
    </>
  );
}
