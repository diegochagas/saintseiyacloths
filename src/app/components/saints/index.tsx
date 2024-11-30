import { GroupProps } from '@/pages/api/saints/[cls]'
import ListItem from './list-item'

interface SaintsProps {
  data: GroupProps[]
}

export default function Saints({ data }: SaintsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {data.map(item => (
        <div key={item.id} className="border-2 border-black p-1">
          <h4 className="uppercase text-center">{item.name}</h4>
          <ul className="flex flex-wrap gap-4 justify-center">
            {item.saints.length > 0 ? item.saints.map(saint => (
              <ListItem key={saint.id} image={saint.image} cloth={saint?.cloth?.name} name={saint?.character?.name} />
            )) : (
              <ListItem image="/cloth-schemes/others/no-scheme.jpg" cloth="Unknown cloth" name="Unknown character" />
            )}
          </ul>
        </div>
      ))}
    </div>
  )
}