'use client'

import { useEffect, useState } from 'react'
import { SaintProps } from '@/pages/api/saints'
import { NewsProps } from '@/pages/api/news'
import Banner from './components/banner'
import News from './components/news'
import Store from './components/store'
import Classes from './components/classes'
import { useLoading } from '../context/loading-content'

export default function Home() {
  const { setIsLoading } = useLoading()
  const [saints, setSaints] = useState<SaintProps[]>([])
  const [news, setNews] = useState<NewsProps[]>([])
  const [geoLocation, setGeoLocation] = useState({ country: '' })

  useEffect(() => {
    async function getSaints() {
      try {
        const response = await fetch('http://localhost:3000/api/saints')
        const data = await response.json()
        setSaints(data.data)
        return response
      } catch(err) {
        return { status: 500, message: `Error: Saints not found! ${err}` }
      }
    }

    async function getNews() {
      try {
        const response = await fetch('http://localhost:3000/api/news')
        const data = await response.json()
        setNews(data)
        return response
      } catch(err) {
        return { status: 500, message: `Error: News not found! ${err}` }
      }
    }

    async function getGeoLocation() {
      try {
        const response = await fetch('http://ip-api.com/json')
        const data = await response.json()
        setGeoLocation(data)
        return response
      } catch(err) {
        return { status: 500, message: `Error: Country not found! ${err}` }
      }
    }

    async function checkIfIsLoading() {
      const responseSaints = await getSaints()
      const responseNews = await getNews()
      const responseGeoLocation = await getGeoLocation()

      if (!!responseSaints.status && !!responseNews.status && !!responseGeoLocation.status) {
        setIsLoading(false)
      }
    }

    checkIfIsLoading()
  }, [setIsLoading])

  return (
    <>
			<Banner />

      <News news={news.slice(-4)} />

      <Store geoLocation={geoLocation} />

      <Classes saints={saints.slice(-8)} />
    </>
  )
}
