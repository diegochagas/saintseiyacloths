import type { NextApiRequest, NextApiResponse } from 'next'
import saintsJson from './data/saints.json'
import newsJson from './data/news.json'
import { getContentByPage, loadSaintData, SaintProps } from './classes'

export interface NewsProps {
  character: string
  title: string
  date: Date
  description: string
  saints: SaintProps[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { q, p } = req.query
  const newsData = newsJson.find(item => item.character === q)
  
  if (newsData) {
    res.status(200).json({
      ...newsData,
      data: saintsJson.filter(saint => saint.character === newsData.character).map(saint => loadSaintData(saint))
    })
  } else if (q === 'latest') {
    const data = newsJson.slice(0, 10).map(item => {
      const saints = saintsJson.filter(saint => saint.character === item.character).map(saint => loadSaintData(saint))
      return { ...item, saints }
    })
    res.status(200).json({ data })
  } else if (!q && p) {
    res.status(200).json({ ...getContentByPage(newsJson, p) })
  } else {
    res.status(400).json({ message: `Error: news not found!` })
  }
}
