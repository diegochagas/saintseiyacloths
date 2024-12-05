import type { NextApiRequest, NextApiResponse } from 'next'
import artistsJson from './data/artists.json'
import groupsJson from './data/groups.json'
import saintsJson from './data/saints.json'
import { getContentByPage, GroupProps, groupSaints } from './classes'

export interface ArtistProps {
  id: string
  name: string
  official: boolean
  site: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { q, p } = req.query
  const artistData = artistsJson.find(artist => artist.id === q)

  if (artistData) {
    const filteredSaints = saintsJson.filter(saint => saint.artistSaint === artistData.id || saint.artistCloth === artistData.id)
    const filteredGroups = groupsJson.filter(group => group.id === filteredSaints.find(saint => saint.group === group.id)?.group)
    const groups: GroupProps[] = groupSaints(filteredSaints, filteredGroups)
    res.status(200).json({ ...artistData, ...getContentByPage(groups, p) })
  } else if (!q) {
    res.status(200).json(artistsJson)
  } else {
    res.status(400).json({ message: `Error: Artist with id ${q} not found!` })
  }
}
