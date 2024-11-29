'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ClassProps } from '@/pages/api/classes'
import Tabs from './components/tabs'
import Pagination from './components/pagination'
import { useLoading } from '../context/loading-content'
import { SaintProps } from '@/pages/api/saints'
import Saints from '../components/saints'
import Icon from '../components/icons'

export default function Classes() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [tabs, setTabs] = useState<ClassProps[]>([])
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('cls') ?? 'saints')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [data, setData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalResults, setTotalResults] = useState(1)
  const [firstResult, setFirstResult] = useState(1)
  const [lastResult, setLastResult] = useState(1)
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const { setIsLoading } = useLoading()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingTable(true)
      try {
        const response = await fetch(
          `http://localhost:3000/api/saints/${encodeURIComponent(activeTab)}?page=${currentPage}`
        )
        const result = await response.json()
        setData(result.data)
        setTotalPages(result.totalPages)
        setTotalResults(result.totalResults)
        setIsLoadingTable(false)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoadingTable(false)
      }
    }

    fetchData()
  }, [activeTab, currentPage, setIsLoading, setIsLoadingTable])

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

  useEffect(() => {
    const currentIndex = currentPage * 12 - 11
    setFirstResult(currentIndex)
    const lastIndex = currentPage * 12
    setLastResult(lastIndex >= totalResults ? lastIndex : totalResults)
  }, [currentPage])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(pathname + '?' + createQueryString('cls', tab))
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  return (
    <div className="my-28 md:my-48">
      <div className="flex w-full">
        <div className="max-w-7xl">
          <h1 className="uppercase font-extrabold text-6xl md:text-8xl">Classes</h1>
        </div>
      </div>
      {tabs?.length > 0 && <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />}
      {data?.length > 0 && (
        <div className="flex justify-center relative">
          {isLoadingTable && (
            <div className="fixed w-full h-full bg-white/75 flex justify-center items-center z-50 top-0">
              <Icon name="zodiac-wheel" color="black" />
            </div>
          )}
          <div className="bg-white p-5">
            <div className="border-2 border-black p-5 max-w-7xl">
              <small className="mb-2 md:my-4 block">{totalResults} Results {firstResult} - {lastResult}</small>
              <Saints data={data} />
            </div>
          </div>
        </div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}