'use client'

import { MouseEvent, useEffect, useState } from 'react'
import { animateScroll } from 'react-scroll'
import Icon from './icons'
import { useMenu } from '../context/menu-context'

export default function ScrollTop() {
  const { isMenuOpen } = useMenu()
  const [showArrow, setShowArrow] = useState(false)
  const opacity = showArrow ? 'opacity-100' : 'opacity-0'

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY >= 200)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
}, [])

  function onScrollTo(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    animateScroll.scrollToTop({
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    })
  }

  return (
    <a
      href="#"
      className={`${isMenuOpen ? 'hidden' : 'block'} fixed right-4 ${opacity} transition-all duration-300 bg-zinc-800 hover:bg-emerald-300 w-10 h-10 bottom-1 z-50 p-3 border-0 border-none`}
      onClick={onScrollTo}
    >
      <Icon name="arrow-up" size={16} />
    </a>
  )
}