import type { NextApiRequest, NextApiResponse } from "next";
import saintsJson from "../data/saints.json";
import { loadSaintData } from ".";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query;
  const saint = saintsJson.find((saint) => saint.id === id);

  if (saint) {
    res.status(200).json({ saint: loadSaintData(saint) });
  } else {
    res.status(400).json({ message: `Error: class not found!` });
  }
}
