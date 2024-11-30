import type { NextApiRequest, NextApiResponse } from 'next'
import saintsJson from './data/saints.json'
import newsJson from './data/news.json'
import { getItemsByPage, loadSaintData, SaintProps } from './saints'

export interface NewsProps {
  character: string
  title: string
  date: Date
  description: string
  saints: SaintProps[]
}

function getNewsWithSaints(news: NewsProps[]) {
  return news.map((item: any) => {
    const saints = saintsJson.filter((saint: any ) => saint.character === item.character)
    return {
      ...item,
      saints: saints.map(saint => loadSaintData(saint) as SaintProps)
    }
  })
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const page: number = parseInt(req.query.page as string) 
  const news: NewsProps[] = getItemsByPage(newsJson, page)
    .map(item => ({ ...item, saints: item.saints?.map((saint: any) => loadSaintData(saint)) }))
  const data: NewsProps[] = getNewsWithSaints(news)
  
  res.status(200).json({ data, totalPages: Math.ceil(newsJson.length / 12) })
}
