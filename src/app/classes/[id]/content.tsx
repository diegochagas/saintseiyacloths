import Link from "next/link";
import { useTranslations } from "next-intl";
import AdBanner from "@/app/components/adbanner";
import { SaintProps } from "@/pages/api/classes";
import SaintDetails from "./saint-details";
import SaintNotFound from "./saint-not-found";

interface ContentProps {
  saint: SaintProps;
  error: unknown;
  url: string;
}

export default function Content({ saint, error, url }: ContentProps) {
  const t = useTranslations();

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
            {!error && saint ? <SaintDetails saint={saint} url={url} /> : <SaintNotFound />}

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
