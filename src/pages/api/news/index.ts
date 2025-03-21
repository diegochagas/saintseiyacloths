import type { NextApiRequest, NextApiResponse } from "next";
import saintsJson from "../data/saints.json";
import midiasJson from "../data/midias.json";
import newsJson from "../data/news.json";
import { getContentByPage, loadSaintData, SaintProps } from "../classes";

export interface NewsProps {
  saint: SaintProps;
  date: string;
  amazon?: string;
}

function filterNewsBySearchValueAndMidia(
  news: any[],
  searchValue: string,
  midia: any
) {
  return news.filter((item) => {
    if (midia && midia.id !== item.saint?.history?.midia?.id) return false;
    return (
      item.date.includes(searchValue) ||
      item.saint?.character?.name?.toLowerCase().includes(searchValue) ||
      item.saint?.cloth?.name?.some((name: string) =>
        name.toLowerCase().includes(searchValue)
      ) ||
      item.saint?.history?.midia?.name?.includes(searchValue)
    );
  });
}

export function getNews(
  p?: string | string[],
  m?: string | string[],
  s?: string | string[]
) {
  const midia = midiasJson.find((midia) => midia.id === m);

  // TODO: REMOVE THIS FILTER WHEN THE NEWS OF THE SAINT 680 IS RELEASED
  const newsDraft = newsJson.filter((item) => !!item.date);
  // TODO: REMOVE THIS FILTER WHEN THE NEWS OF THE SAINT 680 IS RELEASED

  const news = newsDraft.map((item) => {
    const saint = saintsJson.find((saint) => saint.id === item.saint);
    return {
      ...item,
      date: new Date(item.date).toLocaleDateString(),
      saint: loadSaintData(saint),
    };
  });
  if (s) {
    const searchValue = s.toString().toLowerCase();
    const filteredNews = filterNewsBySearchValueAndMidia(
      news,
      searchValue,
      midia
    );
    return { ...getContentByPage(filteredNews, p) };
  } else if (midia) {
    const filteredNews = news.filter(
      (item) => item.saint.history?.midia?.id === midia.id
    );
    return { ...getContentByPage(filteredNews, p) };
  } else {
    return { ...getContentByPage(news, p) };
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { p, m, s } = req.query;

  res.status(200).json(getNews(p, m, s));
}
