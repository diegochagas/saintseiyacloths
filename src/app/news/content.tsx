import { FormEvent } from 'react'
import { NewsProps } from '@/pages/api/news'
import Pagination from '../components/pagination'
import NewsList from '../components/news-list'
import Tabs, { TabProps } from '../components/tabs'
import Icon from '../components/icons'
import Error from '../components/error'

interface ContentProps {
  news: NewsProps[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  tabs: TabProps[]
  activeTab: string
  onTabChange: (tab: string) => void
  searchValue: string
  onSearchValue: (text: string) => void
  onSearchSubmit: () => void
  onSearchClear: () => void
}

export default function Content({
  news,
  currentPage,
  totalPages,
  onPageChange,
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  onSearchValue,
  onSearchSubmit,
  onSearchClear
}: ContentProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearchSubmit()
  }

  return (
    <div className="my-28 md:my-48 w-full flex justify-center flex-col items-center">
      <div className="flex w-full max-w-7xl">
        <h1 className="uppercase font-extrabold text-6xl md:text-8xl">News</h1>
      </div>
      
      {tabs?.length > 0 && <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} title="Midia" />}

      <div className="flex flex-col justify-center relative bg-zinc-100 w-full items-center">
        <div className="flex items-center w-full max-w-7xl gap-4 p-5">
          <form onSubmit={handleSubmit} className="w-full max-w-md h-10 flex items-center bg-zinc-300">
            <input
              className="border-2 bg-zinc-300 border-none w-full h-full p-3 text-xs focus:outline-none font-bold"
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={event => onSearchValue(event.target.value)}
            />
            <button
              type="submit"
              className="flex justify-center items-center w-12 h-10"
              disabled={searchValue === ''}
            >
              <Icon name="search" color="#373737" />
            </button>
          </form>

          <button
            className="bg-white hover:bg-black disabled:hover:bg-white hover:text-white disabled:hover:text-black w-20 h-10 px-3 text-xs font-bold"
            onClick={onSearchClear}
            disabled={searchValue === ''}
          >
            Clear
          </button>
        </div>
    
        <NewsList news={news} />

        {news.length === 0  && (
          <Error>
            News not found
          </Error>
        )}
        
        <div className="mb-20">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  )
}