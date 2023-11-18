import { useQuery } from "react-query";
import { getBrand, getBrands } from "../apis/brand-service";
import { toast } from "react-toastify";
import { IError } from "../interfaces/common";

export const useBrands = ({
  page = 1,
  limit = 10,
  searchTerm,
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
}) => {
  return useQuery(
    ["brands", page, limit, searchTerm],
    () => getBrands({ page, limit, searchTerm }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0,
      onError: (error: IError) => {
        toast.error(error?.response?.data?.message);
      },
    }
  );
};

export const useBrand = (id: string) => {
  return useQuery(["brands", id], () => getBrand(id), {
    refetchOnWindowFocus: false,
    retry: 0,
    onError: (error: IError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};
