'use client'

import Icon from '@/app/components/icons'
import Pagination from './pagination'
import Saints from '@/app/components/saints'
import Tabs from './tabs'
import { useCallback, useEffect, useState } from 'react'
import { useLoading } from '@/app/context/loading-content'
import { ClassProps } from '@/pages/api/classes'
import { useRouter, useSearchParams } from 'next/navigation'

interface TableProps {
  pathname: string
}

export default function Table({ pathname }: TableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tabs, setTabs] = useState<ClassProps[]>([])
  const initialTab = pathname === 'classes' ? 'saints' : '1'
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('q') || initialTab)
  const initialPage = parseInt(searchParams?.get('p') || '1')
  const [currentPage, setCurrentPage] = useState<number>(initialPage >= 1 ? initialPage : 1)
  const [data, setData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [leftDescription, setLeftDescription] = useState('')
  const [rightDescription, setRightDescription] = useState('')
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const { setIsLoading } = useLoading()
  
  useEffect(() => {
    async function getTabs() {
      try {
        const classesResponse = await fetch(`/api/${pathname}`)
        const classes: ClassProps[] = await classesResponse.json()
        setTabs(classes)
        setIsLoadingTable(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoadingTable(false)
      }
    }

    getTabs()
  }, [pathname, setIsLoadingTable])

  const handlePageChange = useCallback((page: number) => {
    router.push(`${pathname}?q=${activeTab}&p=${page}`)
    setCurrentPage(page)
  }, [activeTab, pathname, router])

  const setTableDescription = useCallback((resultInitial: number, resultLast: number, totalResults: number, totalRevealed: number, totalSaints: number) => {
    setLeftDescription('')
    setRightDescription('')
    
    if ((resultInitial === 1 && totalResults > resultLast) || resultInitial > 1)
      setLeftDescription(`${totalResults} Results ${resultInitial} - ${resultLast}`)

    if (pathname === 'classes' && (activeTab === 'saints' || activeTab === 'specters'))
      setRightDescription(`${activeTab} ${totalRevealed} of ${totalSaints} revealed`) 
    
    if (pathname === 'artists') {
      setRightDescription('')
    }
  }, [activeTab, pathname])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingTable(true)
      try {
        const response = await fetch(`/api/${pathname}/?q=${activeTab}&p=${currentPage}`)
        const result = await response.json()
        if (!result.data?.length) handlePageChange(1)
        setData(result.data)
        setTotalPages(result.totalPages)
        setTableDescription(result.resultInitial, result.resultLast, result.totalResults, result.totalRevealed, result.totalSaints)
        setIsLoadingTable(false)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoadingTable(false)
      }
    }

    fetchData()
  }, [activeTab, currentPage, handlePageChange, setIsLoading, setTableDescription])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`${pathname}?q=${tab}&p=${currentPage}`)
    setCurrentPage(1)
  }

  return (
    <div className="my-28 md:my-48">
      <div className="flex w-full">
        <div className="max-w-7xl">
          <h1 className="uppercase font-extrabold text-6xl md:text-8xl">{pathname}</h1>
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
              <p className="flex justify-between">
                {leftDescription && <small className="mb-2 md:my-4 block text-2xs sm:text-xs">{leftDescription}</small>}
                {rightDescription && <small className="mb-2 md:my-4 block capitalize text-2xs sm:text-xs">{rightDescription}</small>}
              </p>
              <Saints data={data} />
            </div>
          </div>
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}