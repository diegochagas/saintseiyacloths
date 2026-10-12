import { getHistory, getSaintName } from "@/helpers";
import { HistoryProps } from "@/pages/api/history";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface ListItemProps {
  id?: string;
  image?: string;
  cloth?: string;
  version?: string;
  name?: string;
  history?: HistoryProps;
  saintClass?: string;
  rank?: string;
}

function SaintCard({
  image = "/cloth-schemes/others/no-scheme.jpg",
  cloth,
  version,
  name,
  history,
  saintClass,
  rank,
}: ListItemProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <>
      <small className="font-bold">
        {getSaintName({ name, cloth, saintClass, version, rank }, locale, t)}
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
}

// Linked to the saint's page when it has one; placeholder entries have no id.
export default function ListItem(props: ListItemProps) {
  if (!props.id) {
    return (
      <li className="flex flex-col items-center">
        <SaintCard {...props} />
      </li>
    );
  }

  return (
    <li className="flex flex-col items-center">
      <Link className="w-full group flex flex-col items-center" href={`/classes/${props.id}`}>
        <SaintCard {...props} />
      </Link>
    </li>
  );
}
