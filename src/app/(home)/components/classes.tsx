import Image from 'next/image'
import Link from 'next/link'
import Title from '../../components/title'
import { SaintProps } from '@/pages/api/classes'

interface ClassesProps {
  saints: SaintProps[]
}

export default function Classes({ saints }: ClassesProps) {
  return (
    <section className="max-w-7xl mt-20">
      <Title text="Latest schemes" />
    
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {saints.map(saint => (
            <li className="group w-full h-full flex flex-col items-center border-2 border-black" key={saint.id}>
              <b className="capitalize text-xs md:text-base">{saint?.cloth?.name || 'Unknown cloth'}</b>
              <figure className="w-28 h-28 md:w-56 md:h-56 overflow-hidden">
                <Image
                  className="w-full h-full object-contain group-hover:scale-110 duration-300"
                  src={saint.image}
                  alt="Saint image"
                  width={542}
                  height={400}
                />
              </figure>
              <h4 className="font-semibold text-xs md:text-sm">{saint?.character?.name ?? 'Unknown saint'}</h4>
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