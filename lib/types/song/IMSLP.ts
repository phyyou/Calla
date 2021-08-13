export interface IQueryFileIMSLP {
  id: number;
  ns: number;
  title: string;
}

export interface IQueryIMSLP {
  query: {
    random: Array<IQueryFileIMSLP>;
  };
}
