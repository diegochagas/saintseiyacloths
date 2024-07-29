import Image from 'next/image'
import { history } from '../data/history'

export default function History() {
  return (
    <main>
      <h2 className="text-center py-8 uppercase text-3xl font-bold">History</h2>
      {history.map(item => (
        <div key={item.id}>
          <div>
            <Image src={item.logo} alt="logo" width={236} height={193} />
            <span>{item.name}</span>
            <span>{item.midia}</span>
            <span>{item.release}</span>
          </div>
          <Image src={item.image} alt="poster" width={208} height={300} />
        </div>
      ))}
    </main>
  )
}