import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { parse } from "node-html-parser";

interface IQueryFileIMSLP {
  id: number;
  ns: number;
  title: string;
}

interface IQueryIMSLP {
  query: {
    random: Array<IQueryFileIMSLP>;
  };
}

export interface ISongInfo {
  file: string;
  info: {
    [index: string]: string;
  };
}

// interface ISongIMSLP {
//   id: number;
//   title: string;
// }

const getIMSLPApi = async () => {
  const res = await fetch(
    "https://imslp.org/api.php?action=query&format=json&list=random&rnlimit=10&rnnamespace=6"
  );
  return await res.json();
};

const findSongsByIMSLPApi: any = async () => {
  const data: IQueryIMSLP = await getIMSLPApi();
  const files = data.query.random;
  const songs: Array<IQueryFileIMSLP> = [];
  files.forEach((file) => {
    if (file.title.indexOf(".mp3") !== -1) {
      songs.push(file);
    }
  });
  if (songs.length === 0) {
    return await findSongsByIMSLPApi();
  }
  return songs;
};

const getInfoInIMSLP = async (link: string) => {
  const res = await fetch(link);
  const htmlText = await res.text();
  const document = parse(htmlText);

  let info = {};
  const infoList = document.querySelector(".wi_body")?.querySelectorAll("tr");
  infoList?.forEach((tr) => {
    if (tr.querySelector("th") === null || !tr.querySelector("td") === null) {
      return;
    }
    info = {
      ...info,
      // @ts-ignore
      [tr.querySelector("th").innerText]: tr.querySelector("td").innerText,
    };
  });

  return info;
};

const getInfoByFilenameInIMSLP = async (title: string) => {
  const res = await fetch(`https://imslp.org/wiki/${title}`);
  const htmlText = await res.text();
  const document = parse(htmlText);
  const fileLink: string = `https://imslp.org${document
    .querySelector("a.internal")
    .getAttribute("href")}`;
  const songInfoLinkTag: any = document.querySelector(
    "#mw-imagepage-linkstoimage-ns0"
  ).childNodes[0];
  const songInfoLink: string = songInfoLinkTag.getAttribute("href");
  const songInfo = await getInfoInIMSLP(`https://imslp.org${songInfoLink}`);
  console.log(fileLink, songInfo);
  return {
    file: fileLink,
    info: songInfo,
  };
};

export const getSongInfo = async () => {
  const songs: Array<IQueryFileIMSLP> = await findSongsByIMSLPApi();
  const song: ISongInfo = await getInfoByFilenameInIMSLP(songs[0].title);
  return song;
};

const getSong: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.status(200).json(await getSongInfo);
};

export default getSong;
