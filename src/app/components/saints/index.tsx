import { useTranslations } from 'next-intl'
import ListItem from './list-item'
import { GroupProps, SaintProps } from '@/pages/api/classes'
import { getClothName } from '@/helpers'

interface SaintsProps {
  data: GroupProps[]
}

export default function Saints({ data }: SaintsProps) {
  const t = useTranslations()

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {data.map(item => (
        <div key={item.id} className="border-2 border-black p-1">
          <h4 className="uppercase text-center">{t(item.name)}</h4>
          <ul className="flex flex-wrap gap-4 justify-center">
            {item.saints.length > 0 ? item.saints.map((saint: SaintProps) => (
              <ListItem key={saint.id} id={saint.id} image={saint.image} cloth={getClothName(t, saint?.cloth?.name)} name={saint?.character?.name} />
            )) : (
              <ListItem />
            )}
          </ul>
        </div>
      ))}
    </div>
  )
}