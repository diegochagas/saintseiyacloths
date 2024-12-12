import { NewsProps } from '@/pages/api/news'
import { ImageResponse } from 'next/og'
import OpenImage from './opengraph-image'
 
export const runtime = 'edge'
 
export const alt = 'Saint Seiya Character'
export const size = {
  width: 542,
  height: 400,
}
 
export const contentType = 'image/jpg'

const baseURL = 'https://www.saintseiyacloths.com'

async function getNews(id: string): Promise<NewsProps> {
  const response = await fetch(`${baseURL}/api/news/${id}`, {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  })

  const news = await response.json()

  return news
}
 
export default async function Image({ params }: { params: { id: string } }) {
  const news = await getNews(params.id)

  return OpenImage
}