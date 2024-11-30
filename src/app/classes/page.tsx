'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ClassProps } from '@/pages/api/classes'
import { useLoading } from '../context/loading-content'
import Table from './table'

export default function Classes() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramsPage = parseInt(searchParams?.get('page') || '1')
  const pathname = usePathname()
  const [tabs, setTabs] = useState<ClassProps[]>([])
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('cls') || 'saints')
  const [currentPage, setCurrentPage] = useState<number>(paramsPage >= 1 ? paramsPage : 1)
  const [data, setData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalResults, setTotalResults] = useState(1)
  const [firstResult, setFirstResult] = useState(1)
  const [lastResult, setLastResult] = useState(1)
  const [totalRevealed, setTotalRevealed] = useState()
  const [totalSaints, setTotalSaints] = useState()
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const { setIsLoading } = useLoading()
  const isSaints = activeTab === 'saints'
  const isSpecters = activeTab === 'specters'

  const handlePageChange = useCallback((page: number) => {
    router.push(`${pathname}?cls=${activeTab}&page=${page}`)
    setCurrentPage(page)
  }, [activeTab, pathname, router])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingTable(true)
      try {
        const response = await fetch(
          `http://localhost:3000/api/saints/${activeTab}?page=${currentPage}`
        )
        const result = await response.json()

        if (!result.data?.length) handlePageChange(1)
        setData(result.data)
        setFirstResult(result.resultInitial)
        setLastResult(result.resultLast)
        setTotalPages(result.totalPages)
        setTotalResults(result.totalResults)
        setTotalRevealed(result.totalRevealed)
        setTotalSaints(result.totalSaints)
        setIsLoadingTable(false)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoadingTable(false)
      }
    }

    fetchData()
  }, [activeTab, currentPage, handlePageChange, setIsLoading, setIsLoadingTable])

  useEffect(() => {
    async function getClasses() {
      try {
        const classesResponse = await fetch('http://localhost:3000/api/classes')
        const classes: ClassProps[] = await classesResponse.json()
        setTabs(classes)
        setIsLoadingTable(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoadingTable(false)
      }
    }

    getClasses()
  }, [setIsLoadingTable])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`${pathname}?cls=${tab}&page=${currentPage}`)
    setCurrentPage(1)
  }
  return (
    <Table
      title="Classes"
      tabs={tabs}
      data={data}
      activeTab={activeTab}
      isLoading={isLoadingTable}
      handleTabChange={handleTabChange}
      handlePageChange={handlePageChange}
      firstResult={firstResult}
      lastResult={lastResult}
      totalResults={totalResults}
      currentPage={currentPage}
      totalPages={totalPages}
      description={(isSaints || isSpecters) ? `${activeTab} ${totalRevealed} of ${totalSaints} revealed` : undefined}
    />
  )
}