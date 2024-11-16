import { ReactNode } from 'react'
import { MenuProvider } from '../context/menu-context'
import Header from '../components/header'
import Footer from '../components/footer'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <MenuProvider>
      <Header />

      {children}

      <Footer />
    </MenuProvider>
  )
}