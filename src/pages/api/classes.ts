import type { NextApiRequest, NextApiResponse } from 'next'
import classes from './data/classes.json'

export interface ClassProps {
  id: string
  name: string
  image: string
}
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json(classes)
}
