import type { NextApiRequest, NextApiResponse } from 'next'
import { ArtistProps } from '../artists'
import { ClassProps } from '../classes'
import { HistoryProps } from '../history'
import artists from '../data/artists.json'
import characters from '../data/characters.json'
import cloths from '../data/cloths.json'
import historyJson from '../data/history.json'
import groups from '../data/groups.json'
import midias from '../data/midias.json'
import ranks from '../data/ranks.json'
import saintsJson from '../data/saints.json'

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

export interface CharacterProps {
  id: string
  name: string
}

export interface SaintProps {
  id: string
  character: CharacterProps
  cloth: ClothProps
  // group: GroupProps
  group: string
  rank: RankProps
  god: CharacterProps
  image: string
  artistSaint: ArtistProps
  artistCloth: ArtistProps
  history: HistoryProps
}

export const loadHistoryData = (historyId: string) => {
  const history: any = historyJson.find(item => item.id === historyId)
  const midia = midias.find(midia => midia.id === history?.midia)
  return { ...history, midia }
}

const getCharacterAndGod = (saint: any) => {
  let character
  let god
  for (let i = 1; i < characters.length; i++) {
    if (saint.character === characters[i].id) character = characters[i]
    if (saint.god === characters[i].id) god = characters[i]
    if (!!god?.id && !!character?.id) break
  }
  return { character, god }
}

export const loadSaintData = (saint: any) => {
  return {
    ...saint,
    ...getCharacterAndGod(saint),
    artistSaint: artists.find(artist => artist.id === saint.artistSaint),
    artistCloth: artists.find(artist => artist.id === saint.artistCloth),
    cloth: cloths.find(cloth => cloth.id === saint.cloth),
    // group: groups.find(group => group.id === saint.group),
    rank: ranks.find(rank => rank.id === saint.rank)?.name,
    image: !saint.image ? '/cloth-schemes/others/no-scheme.jpg' : saint.image,
    history: loadHistoryData(saint.history),
  }
}

export function getItemsByPage(data: any[], page: number) {
  if (page) {
    const currentIndex = (page * 12 - 12)
    const lastIndex = (page * 12)
    return data.slice(currentIndex, lastIndex)
  } else {
    return data.slice(-10)
  }
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const page: number = parseInt(req.query.page as string) 
  const saints: SaintProps[] = getItemsByPage(saintsJson, page)
    .map(saint => loadSaintData(saint))
  res.status(200).json({ data: saints, totalPages: Math.ceil(saintsJson.length / 12) })
}
