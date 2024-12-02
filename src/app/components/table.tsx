'use client'

import Icon from '@/app/components/icons'
import Pagination from './pagination'
import Saints from '@/app/components/saints'
import Tabs, { TabProps } from './tabs'
import { useCallback, useEffect, useState } from 'react'
import { useLoading } from '@/app/context/loading-content'
import { useRouter, useSearchParams } from 'next/navigation'
import Error from './error'

interface TableProps {
  pathname: string
}

export default function Table({ pathname }: TableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tabs, setTabs] = useState<TabProps[]>([])
  const initialTab = pathname === 'classes' ? 'saints' : '1'
  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('q') || initialTab)
  const initialPage = parseInt(searchParams?.get('p') || '1')
  const [currentPage, setCurrentPage] = useState<number>(initialPage >= 1 ? initialPage : 1)
  const [data, setData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [leftDescription, setLeftDescription] = useState('')
  const [rightDescription, setRightDescription] = useState('')
  const { setIsLoading, setLoadingBg } = useLoading()
  let tabsTitle = 'Class'
  if (pathname === 'artists') tabsTitle = 'artist'
  if (pathname === 'history') tabsTitle = 'history'
  
  useEffect(() => {
    async function getTabs() {
      try {
        const response = await fetch(`/api/${pathname}`)
        const items = await response.json()
        setTabs(items)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getTabs()
  }, [pathname, setIsLoading])

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
      setLoadingBg('bg-white/75')
      setIsLoading(true)
      try {
        const response = await fetch(`/api/${pathname}/?q=${activeTab}&p=${currentPage}`)
        const result = await response.json()
        if (!result.data?.length) handlePageChange(1)
        setData(result.data)
        setTotalPages(result.totalPages)
        setTableDescription(result.resultInitial, result.resultLast, result.totalResults, result.totalRevealed, result.totalSaints)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeTab, currentPage, handlePageChange, pathname, setIsLoading, setLoadingBg, setTableDescription])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`${pathname}?q=${tab}&p=${1}`)
    setCurrentPage(1)
  }

  return (
    <div className="my-28 md:my-48 w-full flex justify-center flex-col items-center">
      <div className="flex w-full max-w-7xl">
        <h1 className="uppercase font-extrabold text-6xl md:text-8xl">{pathname}</h1>
      </div>
      
      {tabs?.length > 0 && (
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} title={tabsTitle} isAlwaysActive />
      )}

      {data?.length > 0 ? (
        <div className="flex justify-center relative">          
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
      ) : (
        <Error title={pathname}>
          Saints not found
        </Error>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}