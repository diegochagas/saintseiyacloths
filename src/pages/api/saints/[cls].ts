import type { NextApiRequest, NextApiResponse } from 'next'
import classesJson from '../data/classes.json'
import saintsJson from '../data/saints.json'
import groupsJson from '../data/groups.json'
import { getItemsByPage, loadSaintData, SaintProps } from '.'
import { ClassProps } from '../classes'

export interface GroupProps {
  id: string
  class: string
  name: string
}

function orderGroup(groups: string[]) {
  let orderedGroups = groups.sort((a: any, b: any) => a - b)
  const firstOrder = ['Representative', 'Gods']
  const lastOrder = ['Soldiers']
  firstOrder.forEach(name => {
    const group = groups.find(group => group === name)
    if (group) orderedGroups.unshift(group)
  })
  lastOrder.forEach(name => {
    const index = groups.findIndex(group => group === name)
    if (index !== - 1) {
      orderedGroups = orderedGroups.filter(group => group !== name)  
      orderedGroups.push(name)
    }
  })
  return orderedGroups
}

function groupSaints(saints: any[]) {
  const groups = saints.map(saint => saint.group)
  const orderedGroups = orderGroup(groups)
  const uniqueGroups = Array.from(new Set(orderedGroups))
  return uniqueGroups.map(group => ({
    group: groupsJson.find(data => data.id === group),
    saints: saints.filter(saint => saint.group === group).map(saint => loadSaintData(saint))
  }))
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { cls } = req.query
  const classData = classesJson.find(className => className.id === cls)
  
  if (classData) {
    // const page: number = parseInt(req.query.page as string) 
    const filteredSaints = saintsJson.filter(saint => saint.god === classData.god)
    // const saints: SaintProps[] = getItemsByPage(filteredSaints, page)
    // .map(saint => loadSaintData(saint))
    const data: any = groupSaints(filteredSaints)
    res.status(200).json({
      // data: saints,
      // totalPages: Math.ceil(filteredSaints.length / 12),
      totalResults: filteredSaints.length,
      data
    })
  } else {
    res.status(400).json({ message: `Error: Saint with class name ${cls} not found!` })
  }
}
