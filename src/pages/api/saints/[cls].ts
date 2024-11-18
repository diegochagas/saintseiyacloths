import type { NextApiRequest, NextApiResponse } from 'next'
import classesJson from '../data/classes.json'
import saintsJson from '../data/saints.json'
import { loadSaintData, SaintProps } from '.'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { cls } = req.query
  const classData = classesJson.find(className => className.id === cls)
  
  if (classData) {
    const saints: SaintProps[] = saintsJson
      .filter(saint => saint.god === classData.god)
      .map(saint => loadSaintData(saint))  
    res.status(200).json({ saints })
  } else {
    res.status(400).json({ message: `Error: Saint with class name ${cls} not found!` })
  }
}
