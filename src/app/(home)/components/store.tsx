import Image from 'next/image'

export default function Store() {
  return (
    <a
      className="bg-yellow-400 w-full p-4 flex justify-center max-w-5xl flex-col md:flex-row items-center gap-9 md:gap-14"
      href="https://lista.mercadolivre.com.br/_CustId_26475573_PrCategId_AD"
      target="_blank"
      rel="noopener noreferrer"
    >
      <figure className="flex flex-col items-center">
        <figcaption className="uppercase font-extrabold text-indigo-900 text-4xl mb-8">Estamos no</figcaption>
        <Image className="w-full max-w-96 h-auto" src="/logos/mercado-livre-logo.png" width={764} height={194} alt="Logo Mercado Livre" />
      </figure>
      <button
        className="bg-sky-900 text-white text-xl rounded-lg font-extrabold uppercase p-3 whitespace-nowrap"
      >
        Visite nossa loja
      </button>
    </a>
  )
}