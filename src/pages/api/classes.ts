import type { NextApiRequest, NextApiResponse } from 'next'
import classes from './data/classes.json'
import { CharacterProps } from './saints'

export interface ClassProps {
  id: string
  name: string
  god: CharacterProps
  image: string
}
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json(classes)
}
