import type { NextApiRequest, NextApiResponse } from 'next'
import classesJson from '../data/classes.json'
import groupsJson from '../data/groups.json'
import saintsJson from '../data/saints.json'
import { loadSaintData, SaintProps } from '.'

const filterGroups = (classId: string) => {
  let groupName = 'none'
  // if (classId === 'berserkers') groupName = 'martians'
  // if (classId === 'martians') groupName = 'berserkers'
  // if (classId === 'specters') groupName = 'faceless'
  // if (classId === 'faceless') groupName = 'specters'
  // if (classId === 'blue-warriors') groupName = 'god-warriors'
  // if (classId === 'god-warriors') groupName = 'blue-warriors'
  return groupsJson.filter(group => group.class === classId || group.class === groupName)
}
 
const loadSaintsData = (classId: string): SaintProps[] => {
  const saints: SaintProps[] = []
  const groups = filterGroups(classId)
  groups.forEach(group => {
    saintsJson.forEach(saint => {
      if (saint.group === group.id) saints.push(loadSaintData(saint))
    })
  })
  return saints
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { cls } = req.query
  const classData = classesJson.find(className => className.id === cls)
  
  if (classData) {
    const saints: SaintProps[] = loadSaintsData(classData.id)  
    res.status(200).json({ saints })
  } else {
    res.status(400).json({ message: `Error: Saint with class name ${cls} not found!` })
  }
}
