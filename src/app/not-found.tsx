'use client'

import { useLoading } from './context/loading-content'
import { useEffect } from 'react'
import Error from './components/error'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
 
export default function NotFound() {
  const t = useTranslations()
  const { setIsLoading } = useLoading()

  useEffect(() => setIsLoading(false), [setIsLoading])

  return (
    <div className="w-full bg-zinc-100 mt-16 md:mt-24 pt-10 md:pt-20">
      <Error
        title={<span>403 {t('errorForbidden')}/<br className="lg:hidden" />404 {t('errorNotFound')}</span>}
        subTitle={t('errorResource')}
        backButtonText={t('home')}
        backButtonURL="/"
      >
        <Image className="w-full max-w-72" src="/banners/sorry.jpg" width={532} height={984} alt={t('errorMangaImage')} />
        <div className="my-10 text-xs sm:text-base">
          <p>{t('errorReasons')}</p>
          <ul className="list-disc">
            <li>{t('errorURL')}</li>
            <li>{t('errorMovedPage')}</li>
            <li>{t('errorPermission')}</li>
          </ul>
        </div>
      </Error>
    </div>
  )
}