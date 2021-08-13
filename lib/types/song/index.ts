export type { IQueryFileIMSLP } from "./IMSLP";
export type { IQueryIMSLP } from "./IMSLP";

export interface ISongInfo {
  file: string;
  info: {
    [index: string]: string;
  };
  copy: string;
}
