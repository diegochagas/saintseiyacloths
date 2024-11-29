import { SaintProps } from '@/pages/api/saints'
import { GroupProps } from '@/pages/api/saints/[cls]'
import Image from 'next/image'
import Link from 'next/link'

interface DataProps {
  group: GroupProps
  saints: SaintProps[]
}

interface SaintsProps {
  data: DataProps[]
}

export default function Saints({ data }: SaintsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {data.map(item => (
        <div className="">
          <h4 className="font-bold uppercase text-center">{item.group.name}</h4>
          <ul className="flex gap-4 items-end">
            {item.saints.map(saint => (
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
        </div>
      ))}
    </div>
  )
}