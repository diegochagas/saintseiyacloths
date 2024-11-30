import { NewsProps } from '@/pages/api/news'
import Image from 'next/image'
import Link from 'next/link'
import Title from '../../components/title'

interface NewsComponentProps {
  news: NewsProps[]
}

export default function News({ news }: NewsComponentProps) {
  function getClothName(clothName: string) {
    const chronotector = 'Chronotector'
    if (clothName.includes(chronotector)) return clothName.replace(chronotector, '')
  }

  return (
    <section className="max-w-7xl mt-20">
      <Title text="News" />

      <ul className="p-5 w-full grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {news.map((item: NewsProps) => (
          <li key={item.character} className="m-2">
            <Link className="w-full group" href={`/news/${item.character}`}>
            <figure className="m-3 bg-white overflow-hidden">
              {item.saints.length > 0 && <Image className="w-full h-36 object-contain group-hover:scale-110 duration-300" src={item.saints[0].image} width={547} height={400} alt="Saint image" />}
            </figure>
            <div className="flex justify-between">
            {item.saints.length > 0 && <span className="uppercase block bg-black text-white text-sm font-bold px-2 py-0.5">{item.saints[0].history?.midia?.name}</span>}
      
              <span className="font-semibold text-sm">{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <div className="my-4">
              <h4 className="text-xl font-semibold">
                {item.saints.length > 0 ? getClothName(item.saints[0].cloth?.name || '') : ''}
                {item.saints.length > 0 ? item.saints[0].character?.name : ''}
              </h4>
            </div>
          </Link>
          </li>
        ))}
      </ul>

      <Link
        className="block text-center w-56 font-bold text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 py-3 mt-9 mb-20 mx-auto"
        href="/news"
      >
        More
      </Link>
    </section>
  )
}