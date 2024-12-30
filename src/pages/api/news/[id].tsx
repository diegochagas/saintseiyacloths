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
  const data = newsJson.find(item => item.saint === saint?.id)
  
  if (data?.date) {
    res.status(200).json({ ...data, date: new Date(data.date).toLocaleDateString(), saint: loadSaintData(saint) })
  } else {
    res.status(400).json({ message: `Error: news not found!` })
  }
}
