import type { NextApiRequest, NextApiResponse } from 'next'
import classesJson from '../data/classes.json'
import saintsJson from '../data/saints.json'
import groupsJson from '../data/groups.json'
import { getItemsByPage, loadSaintData, SaintProps } from '.'

export interface GroupProps {
  id: string
  class: string
  name: string
  saints: SaintProps[]
}

function groupSaints(saints: any[], groups: any[]) {
  return groups.map(group => {
    const filteredSaints = saints.filter(saint => saint.group === group.id).map(saint => loadSaintData(saint))
    const sortedSaints = filteredSaints.sort((a, b) => a.cloth?.name == b.cloth?.name ? 0 : + (a.cloth?.name > b.cloth?.name) || -1)
    return {
      ...group,
      saints: sortedSaints
    }
  })
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { cls } = req.query
  const classData = classesJson.find(item => item.id === cls)
  
  if (classData) {
    const classes = classesJson.filter(item => item.god === classData.god)
    const filteredGroups = groupsJson.filter(group => group.class === classes.find(item => item.id === group.class)?.id)
    const filteredSaints = saintsJson.filter(saint => saint.god === classData.god)
    const groups: GroupProps[] = groupSaints(filteredSaints, filteredGroups)
    const page: number = parseInt(req.query.page as string)
    const itemsPerPage = 12
    const data = getItemsByPage(groups, page).map(saint => loadSaintData(saint))
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    res.status(200).json({
      data,
      resultInitial: Math.min(startIndex + 1, groups.length),
      resultLast: Math.min(endIndex, groups.length),
      totalPages: Math.ceil(groups.length / itemsPerPage),
      totalResults: groups.length
    })
  } else {
    res.status(400).json({ message: `Error: Class name ${cls} not found!` })
  }
}
