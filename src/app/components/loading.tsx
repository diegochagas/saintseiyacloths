'use client'

import { useLoading } from '../context/loading-content'
import Icon from './icons'

export default function Loading() {
  const { isLoading } = useLoading()

  return isLoading ? (
    <div className="fixed w-full h-full bg-white flex justify-center items-center z-50">
      <Icon name="zodiac-wheel" color="black" />
    </div>
  ) : null
}