import { useTranslations } from "next-intl";
import { SaintProps } from "@/pages/api/classes";

// The saint's media badge, plus the cloth's own media when it debuted elsewhere.
export default function MediaBadges({ saint }: { saint: SaintProps }) {
  const t = useTranslations();
  const saintMedia = saint.history?.midia?.name;
  const clothMedia = saint?.cloth?.history?.midia?.name;

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {saintMedia && (
        <div className="flex flex-col">
          <span className="font-bold text-xl text-white uppercase bg-black px-10 py-0.5">
            {t(saintMedia)}
          </span>
        </div>
      )}
      {clothMedia && saintMedia !== clothMedia && (
        <div className="flex flex-col md:items-center">
          <h2 className="text-3xl font-extrabold uppercase">{t("cloth")}</h2>
          <span className="font-bold text-xl text-white uppercase bg-black px-10 py-0.5">
            {t(clothMedia)}
          </span>
        </div>
      )}
    </div>
  );
}
