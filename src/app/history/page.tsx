'use client'

import Table from '../components/table'
import { useCallback, useEffect, useState } from 'react'
import { TabProps } from '../components/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLoading } from '../context/loading-content'
import { MidiaProps } from '@/pages/api/midias'

export default function History() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tabs, setTabs] = useState<TabProps[]>([])
  const [subTabs, setSubTabs] = useState<TabProps[]>([])
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('q') || '1')
  const initialPage = parseInt(searchParams?.get('p') || '1')
  const [currentPage, setCurrentPage] = useState<number>(initialPage >= 1 ? initialPage : 1)
  const [data, setData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [leftDescription, setLeftDescription] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { setIsLoading, setLoadingBg } = useLoading()
  
  useEffect(() => {
    async function getTabs() {
      try {
        const midiasResponse = await fetch('/api/midias')
        const midias = await midiasResponse.json()
        setTabs(midias.filter((midia: MidiaProps) => !midia.isEmpty))
        const response = await fetch(`/api/history`)
        const items = await response.json()
        setSubTabs(items)
        setIsLoading(false)
      } catch (error) {
        setErrorMessage(`Error fetching data: ${error}`)
      } finally {
        setIsLoading(false)
      }
    }

    getTabs()
  }, [setIsLoading])

  const handlePageChange = useCallback((page: number) => {
    router.push(`history?q=${activeTab}&p=${page}`)
    setCurrentPage(page)
  }, [activeTab, router])

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBg('bg-white/75')
      setIsLoading(true)
      try {
        const response = await fetch(`/api/history/?q=${activeTab}&p=${currentPage}`)
        const result = await response.json()
        if (!result.data?.length) handlePageChange(1)
        setData(result.data)
        setTotalPages(result.totalPages)
        setLeftDescription(`${result.totalResults} Results ${result.resultInitial} - ${result.resultLast}`)
        setIsLoading(false)
      } catch (error) {
        setErrorMessage(`Error fetching data: ${error}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeTab, currentPage, handlePageChange, setIsLoading, setLoadingBg])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`history?q=${tab}&p=${1}`)
    setCurrentPage(1)
  }

	return (
    <Table
      title="history"
      tabsTitle="history"
      tabs={tabs}
      subTabs={subTabs}
      subTabId="midia"
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      data={data}
      errorMessage={errorMessage}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      totalPages={totalPages}
      leftDescription={leftDescription}
    />
  )
}