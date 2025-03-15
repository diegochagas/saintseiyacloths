import type { NextApiRequest, NextApiResponse } from "next";
import artistsJson from "./data/artists.json";
import groupsJson from "./data/groups.json";
import saintsJson from "./data/saints.json";
import officialJson from "./data/official.json";
import { getContentByPage, GroupProps, groupSaints } from "./classes";

export interface ArtistProps {
  id: string;
  name: string;
  official: string;
  site: string;
}

export function getArtists() {
  try {
    return artistsJson.map((item: any) => ({
      ...item,
      official: officialJson.find((official) => official.id === item.official),
    }));
  } catch (err) {
    console.log("Error", err);
  }
}

export function getArtist(q: string | string[], p?: string | string[]) {
  try {
    const artistData = artistsJson.find((artist) => artist.id === q);

    const filteredSaints = saintsJson.filter(
      (saint) =>
        (saint.artistSaint || "0") === artistData?.id ||
        (saint.artistCloth || "0") === artistData?.id
    );
    const filteredGroups = groupsJson.filter(
      (group) =>
        group.id ===
        filteredSaints.find((saint) => saint.group === group.id)?.group
    );
    const groups: GroupProps[] = groupSaints(filteredSaints, filteredGroups);
    return { ...artistData, ...getContentByPage(groups, p) };
  } catch (err) {
    console.log("Error", err);
  }
}

export function getFilteredArtists() {
  try {
    return artistsJson
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item: any) => ({
        ...item,
        official: officialJson.find(
          (official) => official.id === item.official
        ),
      }));
  } catch (err) {
    console.log("Error", err);
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { q, p } = req.query;

  if (q) {
    const data = q === "filtered" ? getFilteredArtists() : getArtist(q, p);
    res.status(200).json(data);
  } else if (!q) {
    res.status(200).json(getArtists());
  } else {
    res.status(400).json({ message: `Error: Artist with id ${q} not found!` });
  }
}
