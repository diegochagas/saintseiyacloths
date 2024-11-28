'use client'

import { useEffect, useState } from 'react'
import { ClassProps } from '@/pages/api/classes'
import Image from 'next/image'
import Title from '../components/title'
import Tabs from './components/tabs';
import Loading from '../components/loading';
import Table from './components/table';
import Pagination from './components/pagination';
import { useLoading } from '../context/loading-content'

export default function Classes() {
  const [tabs, setTabs] = useState<ClassProps[]>([])
  const [activeTab, setActiveTab] = useState<string>('saints');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { isLoading, setIsLoading } = useLoading() 


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/saints/${encodeURIComponent(activeTab)}?page=${currentPage}`
        )
        const result = await response.json();
        setData(result.data);
        setTotalPages(result.totalPages);
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage, setIsLoading]);

  useEffect(() => {
    async function getClasses() {
      try {
        const classesResponse = await fetch('http://localhost:3000/api/classes')
        const classes: ClassProps[] = await classesResponse.json()
        setTabs(classes)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getClasses()
  }, [setIsLoading])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-100 px-5 py-12 mt-16">
      <Title text="Classes" />
      {/* <ul className="flex items-center gap-2 overflow-auto m-5"> */}
        {/*classes.map((cls, i) => ( */}
          {/* <li key={cls.name + i}> */}
            {/* <div className="flex flex-col clss-center"> */}
              {/* <div className="w-16 h-w-16 flex clss-center justify-center mb-4 p-2"> */}
                {/* <Image src={cls.image} alt={cls.name} width={200} height={192} /> */}
              {/* </div> */}
              
              {/* <b className="text-zinc-800 uppercase">{cls.name}</b> */}
            {/* </div> */}
          {/* </li> */}
        {/* ))} */}
      {/* </ul> */}

      <div style={{ position: 'relative', padding: '2rem' }}>
      {tabs?.length > 0 && <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />}
      {isLoading && <Loading />}
      {data?.length > 0 && <Table data={data} />}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
    </div>
  )
}