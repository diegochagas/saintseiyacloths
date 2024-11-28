import type { NextApiRequest, NextApiResponse } from 'next'
import saints from './data/saints.json'
import news from './data/news.json'
import { loadSaintData, SaintProps } from './saints'

export interface NewsProps {
  saint: SaintProps
  title: string
  date: Date
  description: string
}
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data: NewsProps[] = news.map((item: any) => {
    const saint = saints.find((saint: any ) => saint.id === item.saint)
    return {
      ...item,
      saint: loadSaintData(saint) as SaintProps
    }
  })

  res.status(200).json(data)
}
