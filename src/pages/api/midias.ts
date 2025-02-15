import type { NextApiRequest, NextApiResponse } from "next";
import midiasJson from "./data/midias.json";

export interface MidiaProps {
  id: string;
  name: string;
}

export default function handler(_: NextApiRequest, res: NextApiResponse<any>) {
  res.status(200).json(midiasJson);
}
