import type { NextApiRequest, NextApiResponse } from 'next'
import { ArtistProps } from './artists'
import { CharacterProps } from './characters'
import { ClassProps } from './classes'
import { HistoryProps } from './history'
import artists from './data/artists.json'
import characters from './data/characters.json'
import cloths from './data/cloths.json'
import historyJson from './data/history.json'
import groups from './data/groups.json'
import midias from './data/midias.json'
import ranks from './data/ranks.json'
import saints from './data/saints.json'

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
  affiliation: CharacterProps
  image: string
  artistSaint: ArtistProps
  artistCloth: ArtistProps
  history: HistoryProps
}

const loadHistoryData = (historyId: string) => {
  const history: any = historyJson.find(item => item.id === historyId)
  const midia = midias.find(midia => midia.id === history?.midia)
  return { ...history, midia }
}

const loadSaintsData = () => {
  return saints.map((saint: any) => ({
    ...saint,
    character: characters.find(item => item.id === saint.character),
    cloth: cloths.find(cloth => cloth.id === saint.cloth),
    group: groups.find(group => group.id === saint.group),
    rank: ranks.find(rank => rank.id === saint.rank),
    affiliation: characters.find(character => character.id === saint.affiliation),
    artistSaint: artists.find(artist => artist.id === saint.artistSaint),
    artistCloth: artists.find(artist => artist.id === saint.artistCloth),
    image: saint.image ?? 'cloth-schemes/others/no-scheme.png',
    history: loadHistoryData(saint.history),
  }))
}
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  const saints: SaintProps[] = loadSaintsData()
  res.status(200).json(saints)
}
