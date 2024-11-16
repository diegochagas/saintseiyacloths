import type { NextApiRequest, NextApiResponse } from 'next'
import artists from './data/artists.json'

export interface ArtistProps {
  id: string
  name: string
  site: string
  image: string
}
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json(artists)
}
