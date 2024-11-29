import { SaintProps } from '@/pages/api/saints'
import Image from 'next/image'
import Link from 'next/link'
import Title from '../../components/title'
import Saints from '@/app/components/saints'

interface ClassesProps {
  saints: SaintProps[]
}

export default function Classes({ saints }: ClassesProps) {
  return (
    <section className="max-w-7xl mt-20">
      <Title text="Latest schemes" />
      
      <Saints saints={saints} />

      <Link
        className="block text-center w-56 font-bold text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 py-3 mt-9 mb-20 mx-auto"
        href="/classes"
      >
        More
      </Link>
    </section>
  )
}