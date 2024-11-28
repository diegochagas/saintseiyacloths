import type { NextApiRequest, NextApiResponse } from 'next'
import classesJson from '../data/classes.json'
import saintsJson from '../data/saints.json'
import { getItemsByPage, loadSaintData, SaintProps } from '.'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { cls } = req.query
  const classData = classesJson.find(className => className.id === cls)
  
  if (classData) {
    const page: number = parseInt(req.query.page as string) 
    const filteredSaints = saintsJson.filter(saint => saint.god === classData.god)
    const saints: SaintProps[] = getItemsByPage(saintsJson, page)
      .map(saint => loadSaintData(saint))
    res.status(200).json({ data: saints, totalPages: Math.round(filteredSaints.length / 10) })
  } else {
    res.status(400).json({ message: `Error: Saint with class name ${cls} not found!` })
  }
}
