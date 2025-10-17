import { getHistory, getName } from "@/helpers";
import { HistoryProps } from "@/pages/api/history";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface ListItemProps {
  id?: string;
  image?: string;
  cloth?: string;
  name?: string;
  history?: HistoryProps;
  saintClass?: string;
}

export default function ListItem({
  id,
  image = "/cloth-schemes/others/no-scheme.jpg",
  cloth,
  name,
  history,
  saintClass,
}: ListItemProps) {
  const t = useTranslations();
  const locale = useLocale();

  const renderSaint = () => (
    <>
      <small className="font-bold">
        {getName(
          name ?? "",
          cloth ? t(cloth) : "",
          locale,
          saintClass ? t(saintClass) : ""
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
      <small className="font-semibold">{getHistory(t, history)}</small>
    </>
  );

  return (
    <li className="flex flex-col items-center">
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
