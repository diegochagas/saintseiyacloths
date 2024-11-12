import Image from "next/image"

export function Classes() {
  const items = Array.from({ length: 10 }, (_, i) => ({ name: "Saints", image: "/classes/saints-logo.png", url: "", color: "bg-yellow-400", link: "saints" }))

  return (
    <section className="bg-gray-100 px-5 py-12">
      <ul className="flex items-center gap-2 overflow-auto m-5">
        {items.map((item, i) => (
          <li key={item.name + i}>
            <a className="flex flex-col items-center" href={item.link}>
              <div className={`${item.color} w-16 h-w-16 flex items-center justify-center mb-4 p-2`}>
                <Image src={item.image} alt={item.name} width={200} height={192} />
              </div>
              
              <b className="text-zinc-800 uppercase">{item.name}</b>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}