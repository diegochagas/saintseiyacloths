'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import Table from '../components/table'
import { useLoading } from '../context/loading-content'
import { TabProps } from '../components/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function Artists() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [subTabs, setSubTabs] = useState<TabProps[]>([])
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('q') || '1')
  const initialPage = parseInt(searchParams?.get('p') || '1')
  const [currentPage, setCurrentPage] = useState<number>(initialPage >= 1 ? initialPage : 1)
  const [data, setData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [leftDescription, setLeftDescription] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const tabs: TabProps[] = useMemo(() => [
    { id: '1', name: 'official' },
    { id: '2', name: 'fanart' },
    { id: '0', name: 'unknown' }
  ], [])
  const { setIsLoading, setLoadingBg } = useLoading()

  useEffect(() => {
    async function getSubTabs() {
      try {
        const response = await fetch(`/api/artists`)
        const items = await response.json()
        setSubTabs(items.map((item: any) => ({ ...item, official: tabs.find(tab => tab.id === item.official) })))
        setIsLoading(false)
      } catch (error) {
        setErrorMessage(`${t('errorFetchingData')} ${error}`)
      } finally {
        setIsLoading(false)
      }
    }

    getSubTabs()
  }, [setIsLoading, t, tabs])

  const handlePageChange = useCallback((page: number) => {
    router.push(`artists?q=${activeTab}&p=${page}`)
    setCurrentPage(page)
  }, [activeTab, router])

  useEffect(() => {
    const fetchData = async () => {
      setLoadingBg('bg-white/75')
      setIsLoading(true)
      try {
        const response = await fetch(`/api/artists/?q=${activeTab}&p=${currentPage}`)
        const result = await response.json()
        if (!result.data?.length) handlePageChange(1)
        setData(result.data)
        setTotalPages(result.totalPages)
        setLeftDescription(`${result.totalResults} ${t('results')} ${result.resultInitial} - ${result.resultLast}`)
        setIsLoading(false)
      } catch (error) {
        setErrorMessage(`${t('errorFetchingData')} ${error}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeTab, currentPage, handlePageChange, setIsLoading, setLoadingBg, t])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`artists?q=${tab}&p=${1}`)
    setCurrentPage(1)
  }

	return (
    <Table
      title={t('artists')}
      tabsTitle={t('artist')}
      tabs={tabs}
      subTabs={subTabs}
      subTabId="official"
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