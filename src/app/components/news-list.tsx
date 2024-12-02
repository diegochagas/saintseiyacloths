import { NewsProps } from '@/pages/api/news'
import Image from 'next/image'
import Link from 'next/link'

interface NewsListProps {
  news: NewsProps[]
}

export default function NewsList({ news }: NewsListProps) {
  return (
    <ul className="p-5 w-full grid md:grid-cols-2 xl:grid-cols-4 gap-4 max-w-7xl">
      {news.map(item => (
        <li key={item.date} className="m-2">
          <Link className="w-full group" href={`/news/${item.saint.id}`}>
            <div className="my-2.5">
              <h4 className="text-xl font-semibold text-center">
                {item.saint.cloth?.name || 'Unknown cloth'}
              </h4>
            </div>
            <figure className="m-3 bg-white overflow-hidden">
              <Image
                className="w-full h-36 object-contain group-hover:scale-110 duration-300"
                src={item.saint.image}
                width={547}
                height={400}
                alt="Saint image"
              />
            </figure>
            <div className="flex justify-between">
              <span className="uppercase block bg-black text-white text-sm font-bold px-2 py-0.5">{item.saint.history?.midia?.name}</span>
      
              <span className="font-semibold text-sm">{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <div className="my-2.5">
              <h4 className="text-xl font-semibold text-center">
                {item.saint.character?.name || 'Unknown character'}
              </h4>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}