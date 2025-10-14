import { getName } from "@/helpers";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface ListItemProps {
  id?: string;
  image?: string;
  cloth?: string;
  name?: string;
  history?: string;
}

export default function ListItem({
  id,
  image = "/cloth-schemes/others/no-scheme.jpg",
  cloth,
  name,
  history,
}: ListItemProps) {
  const t = useTranslations();
  const locale = useLocale();

  const renderSaint = () => (
    <>
      <small className="capitalize font-bold">
        {getName(
          name ?? `${t("unknown")} ${t("character")}`,
          cloth ?? "",
          locale
        )}
      </small>
      <figure className="h-28 overflow-hidden">
        <Image
          className="w-full h-full object-contain group-hover:scale-110 duration-300"
          src={image}
          alt={t("saintClothScheme")}
          width={542}
          height={400}
        />
      </figure>
      <small className="font-semibold">
        {history ? t(history) : t("unknown")}
      </small>
    </>
  );

  return (
    <li>
      {id ? (
        <Link
          className="w-full group flex flex-col items-center"
          href={`/classes/${id}`}
        >
          {renderSaint()}
        </Link>
      ) : (
        renderSaint()
      )}
    </li>
  );
}
