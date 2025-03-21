import type { NextApiRequest, NextApiResponse } from "next";
import groupsJson from "./data/groups.json";
import historyJson from "./data/history.json";
import midias from "./data/midias.json";
import saintsJson from "./data/saints.json";
import clothsJson from "./data/cloths.json";
import { getContentByPage, GroupProps, groupSaints } from "./classes";
import { MidiaProps } from "./midias";

export interface HistoryProps {
  id: string;
  name: string;
  midia: MidiaProps;
  release: string;
  description: string;
}

export const loadHistoryData = (history: any) => {
  const midia = midias.find((midia) => midia.id === history?.midia);
  return { ...history, midia };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { q, p } = req.query;
  const historyData = historyJson.find((item) => item.id === q);

  if (historyData) {
    const filteredSaints = saintsJson.filter((saint) => {
      const cloth = clothsJson.find((cloth) => cloth.id === saint.cloth);
      return (
        saint.history === historyData.id || cloth?.history === historyData.id
      );
    });
    const filteredGroups = groupsJson.filter(
      (group) =>
        group.id ===
        filteredSaints.find((saint) => saint.group === group.id)?.group
    );
    const groups: GroupProps[] = groupSaints(filteredSaints, filteredGroups);
    res.status(200).json({ ...historyData, ...getContentByPage(groups, p) });
  } else if (!q) {
    res.status(200).json(historyJson.map((item) => loadHistoryData(item)));
  } else {
    res.status(400).json({ message: `Error: History with id ${q} not found!` });
  }
}
