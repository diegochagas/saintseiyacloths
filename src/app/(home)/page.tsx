import Image from "next/image";
import { Classes } from "./components/classes";

export default function Home() {
	const items = Array.from({ length: 10 }, (_, i) => ({ name: `Saints ${i}`, image: "/classes/saints-logo.png", url: "", color: "bg-yellow-400", link: "saints" }))
	const artists = Array.from({ length: 10 }, (_, i) => ({ name: `Okada ${i}`, image: "/artists/okada.jpg", url: "", color: "bg-yellow-400", link: "saints" }))

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
          {items.map((item, i) => (
            <li className="text-zinc-800 text-sm" key={item.name}>
              <a className="hover:font-bold" href={item.link}>
                {i > 0 && "/"}&nbsp;{item.name}&nbsp;
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-gray-100 px-5 py-12">
        <ul className="flex items-center gap-2 overflow-auto m-5">
          {artists.map((item, i) => (
            <li className="text-zinc-800 text-sm" key={item.name}>
              <a className="" href={item.link}>
                <Image src={item.image} alt={item.name} width={229} height={217} />

                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
