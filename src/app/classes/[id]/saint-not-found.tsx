import Image from "next/image";
import { useTranslations } from "next-intl";
import Error from "@/app/components/error";

export default function SaintNotFound() {
  const t = useTranslations();

  return (
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
  );
}
