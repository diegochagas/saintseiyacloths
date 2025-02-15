import type { NextApiRequest, NextApiResponse } from "next";
import artistsJson from "./data/artists.json";
import charactersJson from "./data/characters.json";
import classesJson from "./data/classes.json";
import clothsJson from "./data/cloths.json";
import groupsJson from "./data/groups.json";
import historyJson from "./data/history.json";
import ranksJson from "./data/ranks.json";
import saintsJson from "./data/saints.json";
import { ArtistProps } from "./artists";
import { HistoryProps, loadHistoryData } from "./history";

interface CharacterProps {
  id: string;
  name: string;
}
export interface ClassProps {
  id: string;
  name: string;
  god: CharacterProps;
}

interface ClothProps {
  id: string;
  name: string[];
  artist: ArtistProps;
  history: HistoryProps;
}

export interface GroupProps {
  id: string;
  class: string;
  name: string;
  saints?: SaintProps[];
}

export interface SaintProps {
  id: string;
  character: CharacterProps;
  cloth: ClothProps;
  group: GroupProps;
  rank: string;
  god: CharacterProps;
  artist: ArtistProps;
  image: string;
  history: HistoryProps;
}

export function groupSaints(saints: any[], groups: any[]) {
  return groups.map((group) => {
    const filteredSaints = saints
      .filter((saint) => saint.group === group.id)
      .map((saint) => loadSaintData(saint));
    const sortedSaints = filteredSaints.sort((a, b) =>
      a.cloth?.name == b.cloth?.name
        ? 0
        : +((a.cloth?.name ?? "") > (b.cloth?.name ?? "")) || -1
    );
    return {
      ...group,
      saints: sortedSaints,
    };
  });
}

const isOfficialConstellation = (name: string) => {
  return (
    name.includes("constellation") &&
    !(
      name.includes("hindu") ||
      name.includes("chinese") ||
      name.includes("former")
    )
  );
};

const isOfficialEvilStar = (id: string) => {
  return id.includes("star");
};

function filterIfSaints(groups: GroupProps[], className: string) {
  if (className.toLocaleLowerCase() === "saints")
    return groups.filter(
      (item) =>
        !(
          !isOfficialConstellation(item.name.toLocaleLowerCase()) &&
          !item.saints?.length
        )
    );
  return groups;
}

function getTotalRevealedOnlyBy(className: string, groups: GroupProps[]) {
  if (className === "saints" || className === "specters") {
    return groups.reduce((accumulator, currentGroup) => {
      const currentValue =
        (isOfficialConstellation(currentGroup.name.toLocaleLowerCase()) ||
          isOfficialEvilStar(currentGroup.id)) &&
        currentGroup.saints?.length
          ? 1
          : 0;
      return accumulator + currentValue;
    }, 0);
  }
}

function getTotalOnlyBy(name: string) {
  if (name === "saints") return 88;
  else if (name === "specters" || name === "faceless") return 108;
}

export function getItemsByPage(data: any[], page: number) {
  if (page) {
    const currentIndex = page * 12 - 12;
    const lastIndex = page * 12;
    return data.slice(currentIndex, lastIndex);
  } else {
    return data.slice(-10);
  }
}

const getCharacterAndGod = (saint: any) => {
  let character;
  let god;
  for (let i = 0; i < charactersJson.length; i++) {
    if (saint.character === charactersJson[i].id) character = charactersJson[i];
    if (saint.god === charactersJson[i].id) god = charactersJson[i];
    if (!!god?.id && !!character?.id) break;
  }
  return { character, god };
};

export const loadSaintData = (saint: any) => {
  const history = historyJson.find((item) => item.id === saint?.history);
  const cloth = clothsJson.find((cloth) => cloth.id === saint.cloth);
  return {
    id: saint.id,
    ...getCharacterAndGod(saint),
    cloth: {
      id: cloth?.id,
      name: cloth?.name.split("_"),
      history: loadHistoryData(
        historyJson.find((item) => item.id === cloth?.history)
      ),
      artist: artistsJson.find((artist) => artist.id === saint.artistCloth),
    },
    group: groupsJson.find((group) => group.id === saint.group),
    rank: ranksJson.find((rank) => rank.id === saint.rank)?.name,
    artist: artistsJson.find((artist) => artist.id === saint.artistSaint),
    image: !saint.image ? "/cloth-schemes/others/no-scheme.jpg" : saint.image,
    history: loadHistoryData(history),
  };
};

export function getContentByPage(items: any[], p: any) {
  if (items.length === 0) {
    return {
      data: items,
      resultInitial: 0,
      resultLast: 0,
      totalPages: 0,
      totalResults: 0,
    };
  }
  const page = parseInt(`${p || 1}`);
  const itemsPerPage = 12;
  const data = getItemsByPage(items, page);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return {
    data,
    resultInitial: Math.min(startIndex + 1, items.length),
    resultLast: Math.min(endIndex, items.length),
    totalPages: Math.ceil(items.length / itemsPerPage),
    totalResults: items.length,
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { q, p } = req.query;
  const classData = classesJson.find((cls) => cls.id === q);

  if (q === "latest") {
    const data = saintsJson.slice(-10).map((saint) => loadSaintData(saint));
    res.status(200).json({ data });
  } else if (classData) {
    // If groups stay split by class for an year, delete the following lines
    // const classes = classesJson.filter((cls) => cls.god === classData.god);
    // const filteredGroups = groupsJson.filter(
    //   (group) =>
    //     group.class === classes.find((cls) => cls.id === group.class)?.id
    // );
    const filteredGroups = groupsJson.filter((group) => group.class === q);
    const filteredSaints = saintsJson.filter(
      (saint) => saint.god === classData.god
    );
    const groupedSaints: GroupProps[] = groupSaints(
      filteredSaints,
      filteredGroups
    );
    const groups = filterIfSaints(groupedSaints, classData.name);
    const totalRevealed = getTotalRevealedOnlyBy(classData.name, groups);
    const totalSaints = getTotalOnlyBy(classData.name);
    res.status(200).json({
      ...getContentByPage(groups, `${p || 1}`),
      totalRevealed,
      totalSaints,
    });
  } else if (!q) {
    res.status(200).json(
      classesJson.map((cls) => ({
        ...cls,
        god: cls.god
          ? charactersJson.find((character) => character.id === cls.god)
          : cls.god,
      }))
    );
  } else {
    res.status(400).json({ message: `Error: Class name ${q} not found!` });
  }
}
