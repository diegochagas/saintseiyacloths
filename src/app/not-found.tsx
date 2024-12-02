'use client'

import { useLoading } from './context/loading-content'
import { useEffect } from 'react'
import Error from './components/error'
import Image from 'next/image'
 
export default function NotFound() {
  const { setIsLoading } = useLoading()

  useEffect(() => setIsLoading(false), [setIsLoading])

  return (
    <div className="w-full bg-zinc-100 mt-16 md:mt-24 pt-10 md:pt-20">
      <Error
        title={<span>403 Forbidden/<br className="lg:hidden" />404 Not Found</span>}
        subTitle="Could not find requested resource"
        backButtonText="Home"
        backButtonURL="/"
      >
        <Image className="w-full max-w-72" src="/banners/sorry.jpg" width={532} height={984} alt="Manga scene" />
        <div className="my-10 text-xs sm:text-base">
          <p>Possible reasons for the error:</p>
          <ul className="list-disc">
            <li>You may have mistyped the page URL</li>
            <li>The page may have been moved</li>
            <li>You don&apos;t have permission to access this page</li>
          </ul>
        </div>
      </Error>
    </div>
  )
}