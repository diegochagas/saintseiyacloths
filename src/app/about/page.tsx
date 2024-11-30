'use client'

import { useEffect, useState } from 'react'
import { useLoading } from '../context/loading-content'
import Content from './content'

export interface ContentProps {
  title: String,
  paragraphs: string[]
}

export default function About() {
  const [about, setAbout] = useState<ContentProps>()
  const { setIsLoading } = useLoading()
  
  useEffect(() => {
    async function getData() {
      const response = await fetch('/api/about')
      const about = await response.json()
      setAbout(about)
      setIsLoading(false)
    }

    getData()
  }, [])

  return about && <Content title={about.title} paragraphs={about.paragraphs} />
}