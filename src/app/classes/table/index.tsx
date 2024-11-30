import Icon from '@/app/components/icons'
import Pagination from './pagination'
import Saints from '@/app/components/saints'
import Tabs from './tabs'
import { ReactNode } from 'react'

interface TableProps {
  title: string
  tabs: any[]
  data: any[]
  activeTab: string
  isLoading: boolean
  handleTabChange: (tab: string) => void
  handlePageChange: (page: number) => void
  firstResult: number
  lastResult: number
  totalResults: number
  currentPage: number
  totalPages: number
  description?: string
}

export default function Table({
  title,
  tabs,
  data,
  activeTab,
  isLoading,
  handlePageChange,
  handleTabChange,
  firstResult,
  lastResult,
  totalResults,
  currentPage,
  totalPages,
  description
}: TableProps) {
  return (
    <div className="my-28 md:my-48">
      <div className="flex w-full">
        <div className="max-w-7xl">
          <h1 className="uppercase font-extrabold text-6xl md:text-8xl">{title}</h1>
        </div>
      </div>
      {tabs?.length > 0 && <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />}
      {data?.length > 0 && (
        <div className="flex justify-center relative">
          {isLoading && (
            <div className="fixed w-full h-full bg-white/75 flex justify-center items-center z-50 top-0">
              <Icon name="zodiac-wheel" color="black" />
            </div>
          )}
          
          <div className="bg-white p-5">
            <div className="border-2 border-black p-5 max-w-7xl">
              <p className="flex justify-between">
                {((firstResult === 1 && totalResults > lastResult) || firstResult > 1) && (
                  <small className="mb-2 md:my-4 block text-2xs sm:text-xs">{totalResults} Results {firstResult} - {lastResult}</small>
                )}
                {description && <small className="mb-2 md:my-4 block capitalize text-2xs sm:text-xs">{description}</small>}
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