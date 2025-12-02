import type { NextApiRequest, NextApiResponse } from "next";
import groupsJson from "./data/groups.json";
import historyJson from "./data/history.json";
import midias from "./data/midias.json";
import saintsJson from "./data/saints.json";
import clothsJson from "./data/cloths.json";
import clothDetailsJson from "./data/cloth-details.json";
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

export const getHistory = () => {
  return historyJson.map((item) => loadHistoryData(item));
};

export const getHistoryWithSaints = (
  historyData: any,
  p?: string | string[]
) => {
  const filteredSaints = saintsJson.filter((saint) => {
    const cloth = clothsJson.find((cloth) => cloth.id === saint.cloth);
    const clothDetails = clothDetailsJson.find(
      (details) => details.id === cloth?.id
    );
    return (
      saint.history === historyData.id ||
      clothDetails?.history === historyData.id
    );
  });
  const filteredGroups = groupsJson.filter(
    (group) =>
      group.id ===
      filteredSaints.find((saint) => saint.group === group.id)?.group
  );
  const groups: GroupProps[] = groupSaints(filteredSaints, filteredGroups);
  return { ...historyData, ...getContentByPage(groups, p) };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { q, p } = req.query;
  const historyData = historyJson.find((item) => item.id === q);

  if (historyData) {
    res.status(200).json(getHistoryWithSaints(historyData, p));
  } else if (!q) {
    res.status(200).json(getHistory());
  } else {
    res.status(400).json({ message: `Error: History with id ${q} not found!` });
  }
}
