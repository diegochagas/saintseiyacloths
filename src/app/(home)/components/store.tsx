import AdBanner from "@/app/components/adbanner";
import Image from "next/image";

interface StoreProps {
  isBrazil: boolean;
}

export default function Store({ isBrazil }: StoreProps) {
  return isBrazil ? (
    <a
      className="max-w-7xl bg-yellow-400 w-full p-4 flex justify-center flex-col md:flex-row items-center gap-9 md:gap-14 mt-20"
      href="https://lista.mercadolivre.com.br/_CustId_26475573_PrCategId_AD"
      target="_blank"
      rel="noopener noreferrer"
    >
      <figure className="flex flex-col items-center">
        <figcaption className="uppercase font-extrabold text-indigo-900 text-4xl mb-8">
          Estamos no
        </figcaption>
        <Image
          className="w-full max-w-96 h-auto"
          src="/logos/mercado-livre-logo.png"
          width={764}
          height={194}
          alt="Logo Mercado Livre"
        />
      </figure>
      <button className="bg-sky-900 text-white text-xl rounded-lg font-extrabold uppercase p-3 whitespace-nowrap">
        Visite nossa loja
      </button>
    </a>
  ) : (
    <AdBanner dataAdSlot="4587579900" className="mt-20" />
  );
}
