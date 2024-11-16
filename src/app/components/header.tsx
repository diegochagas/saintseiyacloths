'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import Icon from './icons'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <header className={`${isMenuOpen ? 'fixed h-full' : 'absolute h-16'} z-20 transition-all duration-300 ease-linear w-full flex items-center text-neutral-300 bg-black uppercase font-bold`}>
      <div className="pl-2">
        <Link href="/">
          <Image src="/logo.png" alt="" width={100} height={28} />
        </Link>
      </div>

      <button
        type="button"
        className="fixed top-3 right-2"
        onClick={() => setIsMenuOpen(prev => !prev)}
      >
        <b className="relative block w-6 h-6">
          <Icon name={isMenuOpen ? 'close' : 'menu'} />
        </b>
      </button>
      
      <ul className={`${isMenuOpen ? 'flex flex-col items-center justify-center w-full h-full' : 'hidden'} transition-opacity duration-200`}>
        <li>
          <Link href="/database">Database</Link>
        </li>
        <li>
          <Link href="/history">History</Link>
        </li>
      </ul>
    </header>
  )
}