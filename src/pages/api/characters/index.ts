import type { NextApiRequest, NextApiResponse } from 'next'
import charactersJson from '../data/characters.json'
import clothsJson from '../data/cloths.json'
import ranksJson from '../data/ranks.json'
import saintsJson from '../data/saints.json'
import { loadHistoryData, SaintProps } from '../saints'
 
export interface CharacterProps {
  id: string
  name: string
  cloths?: SaintProps[]
}

export function loadClothsData(characterId: string) {
  return saintsJson.filter(saint => saint.character === characterId).map(saint => {
    const cloth = clothsJson.find(cloth => cloth.id === saint.cloth)
    return {
      id: cloth?.id,
      name: cloth?.name,
      rank: ranksJson.find(rank => rank.id === saint.rank)?.name,
      image: saint.image ?? 'cloth-schemes/others/no-scheme.png',
      history: loadHistoryData(saint.history),
    }
  })
}
 
export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<any>
) {
  const characters = charactersJson.map(character => ({
    ...character,
    cloths: loadClothsData(character.id)
  }))

  res.status(200).json(characters)
}
