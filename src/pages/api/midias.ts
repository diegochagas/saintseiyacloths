import type { NextApiRequest, NextApiResponse } from 'next'
import midiasJson from './data/midias.json'
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json(midiasJson)
}
