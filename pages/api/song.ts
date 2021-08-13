import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getSongInfo } from "../../lib/hooks/useSong";

const getSong: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.status(200).json(await getSongInfo());
};

export default getSong;
