import type { NextApiRequest, NextApiResponse } from 'next'
import characters from './data/characters.json'
 
export interface CharacterProps {
  id: string
  name: string
}
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json(characters)
}
