'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLoading } from '@/app/context/loading-content'
import { NewsProps } from '@/pages/api/news'
import Content from './content'

export default function Details() {
  const pathname = usePathname()
  const id = pathname?.split('/')?.pop()
  const { setIsLoading } = useLoading()
  const [data, setData] = useState<NewsProps>()
  const [errorMessage, setErrorMessage] = useState<any>()
  const [country, setCountry] = useState('')

  useEffect(() => {
    async function getNews() {
      try {
        const response = await fetch(`/api/news/${id}`)
        const result = await response.json()
        setData(result)
        return response
      } catch(err) {
        setErrorMessage('errorNewsNotFound')
        return { status: 500, err }
      }
    }

    async function getCountry() {
      try {
        const response = await fetch('http://ip-api.com/json')
        const result = await response.json()
        setCountry(result?.country)
        return response
      } catch(err) {
        setErrorMessage('countryNotFound')
        return { status: 500, err }
      }
    }

    async function checkIfIsLoading() {
      const responseNews = await getNews()
      const responseGeoLocation = await getCountry()

      if (!!responseNews.status && !!responseGeoLocation.status) {
        setIsLoading(false)
      }
    }

    checkIfIsLoading()
  }, [id, setIsLoading])

  return data ? <Content data={data} error={errorMessage} url={window.location.href} isBrazil={country === 'Brazil'} /> : null
}