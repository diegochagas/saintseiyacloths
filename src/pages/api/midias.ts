import type { NextApiRequest, NextApiResponse } from 'next'
import midiasJson from './data/midias.json'
import saintsJson from './data/saints.json'
import { loadSaintData } from './classes'

export interface MidiaProps {
  id: string
  name: string
  isEmpty: boolean
}
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  const midias = midiasJson.map(midia => ({
    ...midia,
    isEmpty: !saintsJson.some(saint => {
      const data = loadSaintData(saint)
      return data.history?.midia?.id === midia.id
    })
  }))
  res.status(200).json(midias)
}
