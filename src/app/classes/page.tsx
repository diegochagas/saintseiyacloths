import { ClassProps } from '@/pages/api/classes'
import Image from 'next/image'

export default async function Classes() {
  const classesResponse = await fetch('http://localhost:3000/api/classes')
  const classes: ClassProps[] = await classesResponse.json()

  return (
    <section className="bg-gray-100 px-5 py-12">
      <ul className="flex items-center gap-2 overflow-auto m-5">
        {classes.map((cls, i) => (
          <li key={cls.name + i}>
            <div className="flex flex-col clss-center">
              <div className="w-16 h-w-16 flex clss-center justify-center mb-4 p-2">
                <Image src={cls.image} alt={cls.name} width={200} height={192} />
              </div>
              
              <b className="text-zinc-800 uppercase">{cls.name}</b>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}