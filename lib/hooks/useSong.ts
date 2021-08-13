import { parse } from "node-html-parser";
import useSWR from "swr";
import { Mutator } from "swr/dist/types";
import { fetcher } from "../fetcher";
import { IQueryFileIMSLP, IQueryIMSLP, ISongInfo } from "../types/song";

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
  return {
    file: fileLink,
    copy: `https://imslp.org/wiki/${title}`,
    info: songInfo,
  };
};

export const getSongInfo = async () => {
  const songs: Array<IQueryFileIMSLP> = await findSongsByIMSLPApi();
  const song: ISongInfo = await getInfoByFilenameInIMSLP(songs[0].title);
  return song;
};

export const useSong = (
  initialData: ISongInfo | null | undefined
): {
  song: ISongInfo;
  isLoading: boolean;
  isError: any;
  mutate: Mutator;
} => {
  const { data, error, mutate } = useSWR(`/api/song`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    initialData: initialData,
  });

  return {
    song: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
