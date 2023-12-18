import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getProfitList } from "../apis/profit-service";
import { IError } from "../interfaces/common";

export const useProfitList = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  return useQuery(
    ["profit", page, limit],
    () => getProfitList({ page, limit }),
    {
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0,
      onError: (error: IError) => {
        toast.error(error?.response?.data?.message);
      },
    }
  );
};
