'use client'

import { useEffect, useState } from 'react'
import { NewsProps } from '@/pages/api/news'
import { SaintProps } from '@/pages/api/classes'
import Banner from './components/banner'
import News from './components/news'
import Store from './components/store'
import Classes from './components/classes'
import { useLoading } from '../context/loading-content'
import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations()
  const { setIsLoading } = useLoading()
  const [saints, setSaints] = useState<SaintProps[]>([])
  const [news, setNews] = useState<NewsProps[]>([])
  const [language, setLanguage] = useState('')

  useEffect(() => {
    setLanguage(navigator.language || navigator.languages.find(language => language.includes('pt')) || '')
  }, [])

  useEffect(() => {
    async function getSaints() {
      try {
        const response = await fetch('/api/classes?q=latest')
        const result = await response.json()
        setSaints(result.data)
        return response
      } catch(err) {
        return { status: 500, message: `${t('saintNotFound')} ${err}` }
      }
    }

    async function getNews() {
      try {
        const response = await fetch('/api/news')
        const result = await response.json()
        setNews(result.data)
        return response
      } catch(err) {
        return { status: 500, message: `${t('errorNewsNotFound')} ${err}` }
      }
    }

    async function checkIfIsLoading() {
      const responseSaints = await getSaints()
      const responseNews = await getNews()

      if (!!responseSaints.status && !!responseNews.status) {
        setIsLoading(false)
      }
    }

    checkIfIsLoading()
  }, [setIsLoading, t])

  return (
    <>
			<Banner />

      {news && <News news={news.slice(-4)} />}

      {language.includes('pt') && <Store />}

      {saints && <Classes saints={saints.slice(-8)} />}
    </>
  )
}
