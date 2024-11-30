import type { NextApiRequest, NextApiResponse } from 'next'
import artistsJson from './data/artists.json'
import charactersJson from './data/characters.json'
import classesJson from './data/classes.json'
import clothsJson from './data/cloths.json'
import groupsJson from './data/groups.json'
import historyJson from './data/history.json'
import midiasJson from './data/midias.json'
import ranksJson from './data/ranks.json'
import saintsJson from './data/saints.json'
import { ArtistProps } from './artists'
import { HistoryProps } from './history'

interface CharacterProps {
  id: string
  name: string
}
export interface ClassProps {
  id: string
  name: string
  god: CharacterProps
}

interface ClothProps {
  id: string
  name: string
  history: string
  image: string
}

interface RankProps {
  id: string
  name: string
}
export interface GroupProps {
  id: string
  class: string
  name: string
  saints: SaintProps[]
}

export interface SaintProps {
  id: string
  character: CharacterProps
  cloth: ClothProps
  group: GroupProps
  rank: RankProps
  god: CharacterProps
  image: string
  artistSaint: ArtistProps
  artistCloth: ArtistProps
  history: HistoryProps
}

export function groupSaints(saints: any[], groups: any[]) {
  return groups.map(group => {
    const filteredSaints = saints.filter(saint => saint.group === group.id).map(saint => loadSaintData(saint))
    const sortedSaints = filteredSaints.sort((a, b) => a.cloth?.name == b.cloth?.name ? 0 : + (a.cloth?.name > b.cloth?.name) || -1)
    return {
      ...group,
      saints: sortedSaints
    }
  })
}

const isOfficialConstellation = (name: string) => {
  return name.includes('constellation') && !(name.includes('hindu') || name.includes('chinese') || name.includes('former'))
}

const isOfficialEvilStar = (id: string) => {
  return id.includes('star')
}

function filterIfSaints(groups: GroupProps[], className: string) {
  if (className === 'Saints') 
    return groups.filter(item => !(!isOfficialConstellation(item.name) && !item.saints.length))
  return groups
}

function getTotalRevealedOnlyBy(className: string, groups: GroupProps[]) {
  if (className === 'Saints' || className === 'Specters') {
    return groups.reduce((accumulator, currentGroup) => {
      const currentValue = (isOfficialConstellation(currentGroup.name) || isOfficialEvilStar(currentGroup.id)) &&
        currentGroup.saints.length ? 1 : 0
      return accumulator + currentValue
    }, 0)
  }
}

function getTotalOnlyBy(name: string) {
  if (name === 'Saints') return 88
  else if (name === 'Specters' || name === 'Faceless') return 108
}

function getItemsByPage(data: any[], page: number) {
  if (page) {
    const currentIndex = (page * 12 - 12)
    const lastIndex = (page * 12)
    return data.slice(currentIndex, lastIndex)
  } else {
    return data.slice(-10)
  }
}

export const loadHistoryData = (historyId: string) => {
  const history: any = historyJson.find(item => item.id === historyId)
  const midia = midiasJson.find(midia => midia.id === history?.midia)
  return { ...history, midia }
}

const getCharacterAndGod = (saint: any) => {
  let character
  let god
  for (let i = 1; i < charactersJson.length; i++) {
    if (saint.character === charactersJson[i].id) character = charactersJson[i]
    if (saint.god === charactersJson[i].id) god = charactersJson[i]
    if (!!god?.id && !!character?.id) break
  }
  return { character, god }
}

export const loadSaintData = (saint: any) => {
  return {
    ...saint,
    ...getCharacterAndGod(saint),
    artistSaint: artistsJson.find(artist => artist.id === saint.artistSaint),
    artistCloth: artistsJson.find(artist => artist.id === saint.artistCloth),
    cloth: clothsJson.find(cloth => cloth.id === saint.cloth),
    group: groupsJson.find(group => group.id === saint.group),
    rank: ranksJson.find(rank => rank.id === saint.rank)?.name,
    image: !saint.image ? '/cloth-schemes/others/no-scheme.jpg' : saint.image,
    history: loadHistoryData(saint.history),
  }
}

export function getContentByPage(items: any[], p: any) {
  const page = parseInt(`${p || 1}`)
  const itemsPerPage = 12
  const data = getItemsByPage(items, page).map(saint => loadSaintData(saint))
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return {
    data,
    resultInitial: Math.min(startIndex + 1, items.length),
    resultLast: Math.min(endIndex, items.length),
    totalPages: Math.ceil(items.length / itemsPerPage),
    totalResults: items.length,
  }
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { q, p } = req.query
  const classData = classesJson.find(cls => cls.id === q)
  
  if (q === 'latest') {
    const data = saintsJson.slice(-10).map(saint => loadSaintData(saint))
    res.status(200).json({ data })
  } else if (classData) {
    const classes = classesJson.filter(cls => cls.god === classData.god)
    const filteredGroups = groupsJson.filter(group => group.class === classes.find(cls => cls.id === group.class)?.id)
    const filteredSaints = saintsJson.filter(saint => saint.god === classData.god)
    const groupedSaints: GroupProps[] = groupSaints(filteredSaints, filteredGroups)
    const groups = filterIfSaints(groupedSaints, classData.name)
    const totalRevealed = getTotalRevealedOnlyBy(classData.name, groups)
    const totalSaints = getTotalOnlyBy(classData.name)
    res.status(200).json({ ...getContentByPage(groups, `${p || 1}`), totalRevealed, totalSaints })
  } else if (!q) {
    res.status(200).json(classesJson.map(cls => ({
      ...cls,
      god: cls.god ? charactersJson.find(character => character.id === cls.god) : cls.god
    })))
  } else {
    res.status(400).json({ message: `Error: Class name ${q} not found!` })
  }
}
