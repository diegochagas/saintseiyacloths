import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

interface ErrorProps {
  children: ReactNode
  title?: ReactNode
  subTitle?: string
  backButtonText?: string
  backButtonURL?: string
}

export default function Error({ children, title, subTitle, backButtonText, backButtonURL }: ErrorProps) {
  return (
    <div className="w-full flex justify-center flex-col items-center">
      {title && (
        <div className="flex justify-center w-full max-w-7xl">
          <h2 className="capitalize font-extrabold text-4xl md:text-6xl">{title}</h2>
        </div>
      )}
      
      <p className="m-3">{subTitle}</p>
      
      <section className="bg-black p-3 m-4 w-full flex flex-col justify-center items-center max-w-2xl text-white">
        {children}
      </section>

      {backButtonURL && backButtonText && (
        <Link
          className="block text-center w-56 font-bold text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 py-3 mt-9 mb-20 mx-auto"
          href={backButtonURL}
        >
          {backButtonText}
        </Link>
      )}
    </div>
  )
}