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
      className={`${isMenuOpen ? 'hidden' : 'block'} fixed right-4 lg:right-8 bottom-1 z-50 ${opacity} transition-all duration-300`}
      onClick={onScrollTo}
    >
      <p className="uppercase absolute right-0 bottom-0 flex flex-col items-end text-xl lg:text-2xl font-black text-stroke-white">
        <span className="-mb-2.5 lg:-mb-3">Page</span>
        <span>Top</span>
      </p>
      <Icon className="w-20 lg:w-28 h-auto" name="nike-stroke" />
    </a>
  )
}