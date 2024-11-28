import type { NextApiRequest, NextApiResponse } from 'next'
import data from './data/about.json'

export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json(data)
}
