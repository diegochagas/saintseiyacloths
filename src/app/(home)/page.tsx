import Image from "next/image"
import ScrollTop from "../components/scroll-top"
import { HistoryProps } from "@/pages/api/history"
import { ClassProps } from "@/pages/api/classes"
import { ArtistProps } from "@/pages/api/artists"
import { SaintProps } from "@/pages/api/saints"

export default async function Home() {
  const classesResponse = await fetch('http://localhost:3000/api/classes')
  const classes: ClassProps[] = await classesResponse.json()
  const saintsResponse = await fetch('http://localhost:3000/api/saints')
	const saintsFull: SaintProps[] = await saintsResponse.json()
  const saints = saintsFull.slice(0, 10)
	const artistsResponse = await fetch('http://localhost:3000/api/artists')
	const artists: ArtistProps[] = await artistsResponse.json()
  const historyResponse = await fetch('http://localhost:3000/api/history')
  const history: HistoryProps[] = await historyResponse.json()

  return (
    <main className="pt-16">
			<section className="bg-black relative pb-40">
        <div className="absolute bottom-5 w-full px-6 pb-5 z-10">
          <h5 className="text-white uppercase font-bold text-sm pb-1">Join the community of cloth scheme fans</h5>
          <hr className="opacity-30" />
          <h1 className="text-orange-400 text-4xl text-center uppercase font-black py-2">Saint Seiya</h1>
          <hr className="opacity-30" />
          <b className="text-white text-xs">聖闘士星矢</b>
        </div>
        <Image className="relative w-full h-full" src="/banner.jpg" width={1920} height={493} alt="manga banner" />
      </section>

      <section className="bg-gray-100 px-5 py-12">
        <ul className="flex flex-wrap items-center justify-center">
          {classes.map((item, i) => (
            <li className="text-zinc-800 text-sm" key={item.id}>
              <a className="hover:font-bold" href={item.id}>
                {i > 0 && "/"}&nbsp;{item.name}&nbsp;
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="uppercase text-center font-bold text-lg">Recent posts</h3>
        <h2 className="uppercase text-center font-bold text-4xl">Latest schemes</h2>
        
        <ul className="flex">
          {saints.map(saint => (
            <li key={saint.id}>
              <a href="">
                <Image src={saint.image} alt="te" width={270} height={200} />
                <b>{saint?.group?.name}</b>
                <h4>{saint?.character?.name}</h4>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {history?.length > 0 && (
        <section className="bg-black">
          {/* IF COUNTRY EQUALS TO BRAZIL */}
          {true && (
            <div className="text-white flex flex-col items-center justify-center bg-[url('../../public/cover.jpg')] bg-[center_center] bg-cover min-h-[700px]">
              <h3>Loja online</h3>
              <h2>Ajude o nosso site comprando os nossos produtos</h2>
              <a className="bg-white text-black uppercase p-4" href="https://lista.mercadolivre.com.br/_CustId_26475573_PrCategId_AD" target="_blank" rel="noopener noreferrer">Veja mais detalhes</a>
            </div>
          )}

          <div>
            <h3 className="uppercase text-center font-bold text-lg text-white">Schemes by</h3>
            <h2 className="uppercase text-center font-bold text-4xl text-white">History</h2>
            <ul className="flex">
              {history.map((item: any) => (
                <li className="flex" key={`${item.id}${item.name}`}>
                  <div className="">
                    {item.logo && <Image src={item.logo} width={236} height={103} alt="" />}
                    <span className="text-white">{item.midia.name}: {item.name}</span>
                    <span className="text-white">{item.release}</span>
                  </div>
                  {item.image && <Image src={item.image} width={212} height={300} alt="" />}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-gray-100 px-5 py-12">
        <h3 className="uppercase text-center font-bold text-lg">Schemes by</h3>
        <h2 className="uppercase text-center font-bold text-4xl">Artist</h2>
        <ul className="flex items-center gap-2 overflow-auto m-5">
          {artists.map((item, i) => (
            <li className="text-zinc-800 text-sm" key={item.name}>
              <a className="" href={item.site}>
                {item.image && <Image src={item.image} alt={item.name} width={229} height={217} />}

                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <ScrollTop />
    </main>
  )
}
