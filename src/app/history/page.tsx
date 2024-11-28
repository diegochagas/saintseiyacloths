import { HistoryProps } from '@/pages/api/history'
import Image from 'next/image'

export default async function History() {
  const historyResponse = await fetch('http://localhost:3000/api/history')
  const history: HistoryProps[] = await historyResponse.json()

  return (
    <section className="bg-black">
      <h2 className="uppercase text-center font-bold text-4xl text-white">History</h2>
      <ul className="grid grid-cols-4">
        {history?.map((item: any) => (
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
    </section>
  )
}