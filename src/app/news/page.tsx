'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLoading } from '../context/loading-content'
import Content from './content'
import { TabProps } from '../components/tabs'

export default function News() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tabs, setTabs] = useState<TabProps[]>([])
  const [activeTab, setActiveTab] = useState(searchParams?.get('m') || '')
  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams?.get('p') || '1'))
  const [data, setData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [searchValue, setSearchValue] = useState(searchParams?.get('s') || '')
  const [pageParam, setPageParam] = useState('')
  const [midiaParam, setMidiaParam] = useState('')
  const [searchParam, setSearchParam] = useState('')
  const { setIsLoading } = useLoading()
  
  useEffect(() => {
    async function getTabs() {
      try {
        const midiasResponse = await fetch('/api/midias')
        const midias = await midiasResponse.json()
        setTabs(midias)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getTabs()
  }, [setIsLoading])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/news${pageParam}${midiaParam}${searchParam}`)
        const result = await response.json()
        if (!result.data?.length) handlePageChange(1)
        setData(result.data)
        setTotalPages(result.totalPages)
        setIsLoading(false)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [handlePageChange, midiaParam, pageParam, searchParam, setIsLoading])

  useEffect(() => {
    if (currentPage) {
      const newPageParam = currentPage ? `?p=${currentPage}` : ''
      router.push(`news?${newPageParam}${midiaParam}${searchParam}`)
      setPageParam(newPageParam)
    }
  }, [currentPage, midiaParam, router, searchParam])

  useEffect(() => {
    const newMidiaParam = activeTab ? `&m=${activeTab}` : ''
    router.push(`news?p=${1}${newMidiaParam}${searchParam}`)
    setCurrentPage(1)
    setMidiaParam(newMidiaParam)
  }, [activeTab, router, searchParam])

  useEffect(() => {
    router.push(`news?p=${1}${searchParam}${midiaParam}`)
    setCurrentPage(1)
  }, [midiaParam, router, searchParam])

  const handleSearchClear = () => {
    setSearchParam(() => {
      setSearchValue('')
      return ''
    })
  }

  return (
    <Content
      news={data}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={searchValue}
      onSearchValue={setSearchValue}
      onSearchSubmit={() => setSearchParam(searchValue ? `&s=${searchValue}` : '')}
      onSearchClear={handleSearchClear}
    />
  )
}