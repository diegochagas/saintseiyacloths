import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getClothName } from "@/helpers";
import { SaintProps } from "@/pages/api/classes";

export default function SchemeFigure({ saint }: { saint: SaintProps }) {
  const t = useTranslations();
  const locale = useLocale();
  const caption = getClothName({
    name: saint.cloth?.name ?? "",
    locale,
    cls: saint.group?.cloth ? t(saint.group.cloth, { count: 1 }) : "",
    rank: saint.rank ? t(saint.rank) : "",
    version: saint.version ? t(saint.version) : "",
  });

  return (
    <figure className="flex flex-col items-center my-5 w-full">
      <Image
        className="border-2 border-black w-full h-auto sm:w-auto sm:h-[404px] sm:max-w-full sm:object-contain"
        src={saint.image}
        width={536}
        height={400}
        alt={t("saintClothScheme")}
      />

      <figcaption>
        <small className="font-semibold capitalize">{caption}</small>
      </figcaption>
    </figure>
  );
}
