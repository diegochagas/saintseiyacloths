import { SaintProps } from '@/pages/api/saints'
import Image from 'next/image'
import Link from 'next/link'
import Title from './title'

interface ClassesProps {
  saints: SaintProps[]
}

export default function Classes({ saints }: ClassesProps) {
  return (
    <section className="max-w-7xl mt-20">
      <Title text="Latest schemes" />
      
      <ul className="grid md:grid-cols-2 xl:grid-cols-4 gap-7">
        {saints.map(saint => (
          <li className="group" key={saint.id}>
            <Link className="w-full h-full flex flex-col items-center" href={`/saints/${saint.id}`}>
              <b className="capitalize">{saint?.cloth?.name || 'Unknown cloth'}</b>
              <figure className="w-56 h-56 border-2 border-black overflow-hidden">
                <Image className="w-full h-full object-contain group-hover:scale-110 duration-300" src={saint.image} alt="Saint image" width={542} height={400} />
              </figure>
              <h4 className="font-semibold text-sm">{saint?.character?.name}</h4>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        className="block text-center w-56 font-bold text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 py-3 mt-9 mb-20 mx-auto"
        href="/classes"
      >
        More
      </Link>
    </section>
  )
}