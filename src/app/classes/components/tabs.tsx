import React from 'react'
import { ClassProps } from '@/pages/api/classes'

interface TabsProps {
  tabs: ClassProps[]
  activeTab: string
  onTabChange: (tab: string) => void
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div style={{ display: 'flex', marginBottom: '1rem' }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: '0.5rem 1rem',
            margin: '0 0.5rem',
            border: '1px solid #ccc',
            backgroundColor: activeTab === tab.id ? '#3498db' : '#fff',
            color: activeTab === tab.id ? '#fff' : '#000',
            cursor: 'pointer',
          }}
        >
          {tab.name}
        </button>
      ))}
    </div>
  )
}

export default Tabs
