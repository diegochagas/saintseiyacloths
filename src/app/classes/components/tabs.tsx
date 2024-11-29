import React from 'react'
import { ClassProps } from '@/pages/api/classes'

interface TabsProps {
  tabs: ClassProps[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="relative w-full flex flex-col items-center">
      <h2 className="uppercase text-white bg-black text-2xl sm:text-4xl md:text-5xl font-black w-fit px-1 relative top-4 md:top-6">Select class</h2>
      <div className="bg-neutral-400 pt-2 md:pt-10 md:pb-5 w-full">
        <ul className="flex flex-wrap justify-center items-center gap-1 md:gap-2 m-5">
          {tabs.map(tab => (
            <li
              key={tab.id}
              className={`${activeTab === tab.id ? 'bg-black text-white' : 'bg-white text-black'} hover:bg-black hover:text-white border-2 md:border-4 border-black px-1 md:px-10 rounded-3xl cursor-pointer font-black whitespace-nowrap text-xs md:text-base`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
