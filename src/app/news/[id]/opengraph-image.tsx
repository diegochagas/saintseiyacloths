import { NewsProps } from '@/pages/api/news'
import { ImageResponse } from 'next/og'
 
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

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {news.saint?.image && <img src={`${baseURL}${news.saint.image}`} alt="" style={{ width: '100%' }} />}
      </div>
    ),
    {
      ...size,
    }
  )
}