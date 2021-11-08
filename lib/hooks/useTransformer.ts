import useSWR from "swr";
import { Mutator } from "swr/dist/types";
import { fetcher } from "../fetcher";

export const useTransfomer = (): {
  url: string;
  isLoading: boolean;
  isError: any;
  mutate: Mutator;
} => {
  const { data, error, mutate } = useSWR(
    `https://calla-rest.azurewebsites.net/transformer/scratch`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    url: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
