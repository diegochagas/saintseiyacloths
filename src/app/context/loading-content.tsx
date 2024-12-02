'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

interface LoadingContextType {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  loadingBg: string
  setLoadingBg: Dispatch<SetStateAction<string>>
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setIsLoading: () => {},
  loadingBg: 'bg-white',
  setLoadingBg: () => {},
})

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingBg, setLoadingBg] = useState('bg-white')

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, loadingBg, setLoadingBg }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)