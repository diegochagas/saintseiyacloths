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
  const [language, setLanguage] = useState('')

  useEffect(() => {
    setLanguage(navigator.language || navigator.languages.find(language => language.includes('pt')) || '')
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/news/${id}`)
        const newData = await response.json()
        setData(newData)
        setIsLoading(false)
      } catch (err) {
        setErrorMessage(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, setIsLoading])

  return data ? <Content data={data} error={errorMessage} url={window.location.href} isBrazil={language.includes('pt')} /> : null
}