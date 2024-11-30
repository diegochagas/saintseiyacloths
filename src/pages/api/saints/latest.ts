import type { NextApiRequest, NextApiResponse } from 'next'
import classesJson from '../data/classes.json'
import saintsJson from '../data/saints.json'
import { loadSaintData } from '.'

export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  const latest = saintsJson.slice(-10)
  res.status(200).json({ data: latest.map(saint => loadSaintData(saint)) })
}
