import React from 'react'

export interface TabProps {
  id: string
  name: string
}

interface TabsProps {
  tabs: TabProps[]
  activeTab: string
  onTabChange: (tab: string) => void
  title?: string
  isAlwaysActive?: boolean
}

export default function Tabs({ tabs, activeTab, onTabChange, title, isAlwaysActive }: TabsProps) {
  function handleTabChange(tabId: string) {
    if (isAlwaysActive) {
      onTabChange(tabId)
    } else {
      if (tabId === activeTab) {
        onTabChange('')
      } else {
        onTabChange(tabId)
      }
    }
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      {title && (
        <h2 className="uppercase text-white bg-black text-2xl sm:text-4xl md:text-5xl font-black w-fit px-1 relative top-4 md:top-6">
          Select {title}
        </h2>
      )}
      <div className="bg-neutral-400 pt-2 md:pt-10 md:pb-5 w-full flex justify-center">
        <ul className="flex flex-wrap justify-center items-center gap-1 m-5 max-w-7xl">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                className={`${activeTab === tab.id ? 'bg-black text-white' : 'bg-white text-black'} hover:bg-black hover:text-white border-2 md:border-4 border-black px-1 md:px-5 rounded-3xl font-black text-xs capitalize`}
                onClick={() => handleTabChange(tab.id)}
                disabled={isAlwaysActive && activeTab === tab.id}
              >
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
