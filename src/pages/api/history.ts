import type { NextApiRequest, NextApiResponse } from 'next'
import historyJson from './data/history.json'
import midias from './data/midias.json'

export interface MidiaProps {
  id: string
  name: string
}
 
export interface HistoryProps {
  id: string
  name: string
  midia: MidiaProps
  release: string
  description: string
  image: string
}

const loadHistoryData = () => {
  return historyJson.map((history: any) => {
    const midia = midias.find(midia => midia.id === history.midia)
    return { ...history, midia }
  })
}
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  const history: HistoryProps[] = loadHistoryData()
  res.status(200).json(history.filter(item => !!item.name))
}
