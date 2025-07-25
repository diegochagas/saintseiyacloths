import Link from "next/link";
import { useTranslations } from "next-intl";
import { SaintProps } from "@/pages/api/classes";
import { getClothName } from "@/helpers";
import Image from "next/image";

interface ClassesProps {
  saints: SaintProps[];
}

export default function Classes({ saints }: ClassesProps) {
  const t = useTranslations();

  return (
    <section className="max-w-7xl mt-20">
      <h2 className="uppercase text-3xl sm:text-6xl lg:text-8xl xl:text-9xl font-extrabold">
        {t("latestSchemes")}
      </h2>

      <ul className="p-5 w-full grid md:grid-cols-2 xl:grid-cols-4 gap-4 max-w-7xl">
        {saints.map((saint) => (
          <li key={saint.id} className="m-2">
            <Link className="w-full group" href={`/classes/${saint.id}`}>
              <div className="my-2.5">
                <h4 className="text-xl font-semibold text-center">
                  {getClothName(t, saint.cloth?.name)}
                </h4>
              </div>
              <figure className="m-3 bg-white overflow-hidden">
                <Image
                  className="w-full h-36 object-contain group-hover:scale-110 duration-300"
                  src={saint.image}
                  width={547}
                  height={400}
                  alt={t("saintClothScheme")}
                />
              </figure>
              <div className="flex justify-between">
                <span className="uppercase block bg-black text-white text-sm font-bold px-2 py-0.5">
                  {t(saint.history?.midia?.name)}
                </span>

                {/* <span className="font-semibold text-sm">{date}</span> */}
              </div>
              <div className="my-2.5">
                <h4 className="text-xl font-semibold text-center">
                  {saint.character?.name || t("unknown")}
                </h4>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        className="block text-center w-56 font-bold text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 py-3 mt-9 mb-20 mx-auto"
        href="/classes"
      >
        {t("more")}
      </Link>
    </section>
  );
}
