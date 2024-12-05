'use client'

import { useEffect } from 'react'
import { useLoading } from '../context/loading-content'
import Content from './content'

export default function About() {
  const { setIsLoading } = useLoading()
  
  useEffect(() => {
    setIsLoading(false)
  }, [setIsLoading])

  return <Content />
}