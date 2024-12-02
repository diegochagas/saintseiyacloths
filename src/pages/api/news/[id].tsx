import type { NextApiRequest, NextApiResponse } from 'next'
import newsJson from '../data/news.json'
import saintsJson from '../data/saints.json'
import { loadSaintData } from '../classes'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query
  const saint = saintsJson.find(saint => saint.id === id)
  
  if (saint) {
    const data = newsJson.find(item => item.saint === saint.id)
    res.status(200).json({ ...data, saint: loadSaintData(saint) })
  } else {
    res.status(400).json({ message: `Error: news not found!` })
  }
}
