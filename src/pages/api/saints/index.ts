import type { NextApiRequest, NextApiResponse } from 'next'
import { ArtistProps } from '../artists'
import { CharacterProps } from '../characters'
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
  debut: string
  image: string
}

interface GroupProps {
  id: string
  class: ClassProps
  name: string
}

interface RankProps {
  id: string
  name: string
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

export const loadHistoryData = (historyId: string) => {
  const history: any = historyJson.find(item => item.id === historyId)
  const midia = midias.find(midia => midia.id === history?.midia)
  return { ...history, midia }
}

export const loadSaintData = (saint: any) => {
  let character
  let god
  let artistSaint
  let artistCloth
  for (let i = 1; i < characters.length; i++) {
    if (saint.character === characters[i].id) character = characters[i]
    if (saint.god === characters[i].id) god = characters[i]
    if (!!god?.id && !!character?.id) break
  }
  for (let i = 1; i < artists.length; i++) {
    if (saint.artistSaint === artists[i].id) artistSaint = artists[i]
    if (saint.artistCloth === artists[i].id) artistCloth = artists[i]
    if (!!artistSaint?.id && !!artistCloth?.id) break
  }
  return {
    ...saint,
    character,
    god,
    artistSaint,
    artistCloth,
    cloth: cloths.find(cloth => cloth.id === saint.cloth)?.name,
    group: groups.find(group => group.id === saint.group),
    rank: ranks.find(rank => rank.id === saint.rank)?.name,
    image: saint.image ?? 'cloth-schemes/others/no-scheme.png',
    history: loadHistoryData(saint.history),
  }
}
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  const saints: SaintProps[] = saintsJson.map(saint => loadSaintData(saint))
  res.status(200).json(saints)
}
