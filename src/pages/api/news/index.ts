import type { NextApiRequest, NextApiResponse } from 'next'
import saintsJson from '../data/saints.json'
import midiasJson from '../data/midias.json'
import newsJson from '../data/news.json'
import { getContentByPage, loadSaintData, SaintProps } from '../classes'

export interface NewsProps {
  date: string
  saint: SaintProps
  title: string
  description: string
}

function filterNewsBySearchValueAndMidia(news: NewsProps[], searchValue: string, midia: any) {
  return news.filter(item => {
    if (midia && midia.id !== item.saint?.history?.midia?.id) return false
    return (
      item.date.includes(searchValue) ||
      item.saint?.character?.name?.toLowerCase().includes(searchValue) ||
      item.saint?.cloth?.name?.toLowerCase().includes(searchValue) ||
      item.saint?.history?.midia?.name?.includes(searchValue)
    )
  })
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { p, m, s } = req.query
  const midia = midiasJson.find(midia => midia.id === m)
  const news = newsJson.reverse().map(item => {
    const saint = saintsJson.find(saint => saint.id === item.saint)
    return { ...item, saint: loadSaintData(saint) }
  })
  if (s) {
    const searchValue = s.toString().toLowerCase()
    const filteredNews = filterNewsBySearchValueAndMidia(news, searchValue, midia)
    res.status(200).json({ ...getContentByPage(filteredNews, p) })
  } else if (midia) {
    const filteredNews = news.filter(item => item.saint.history?.midia?.id === midia.id)
    res.status(200).json({ ...getContentByPage(filteredNews, p) })
  } else if (p) {
    res.status(200).json({ ...getContentByPage(news, p) })
  } else {
    res.status(200).json({ ...getContentByPage(news.slice(0, 10), p) })
  }
}