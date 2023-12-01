import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { IError } from "../interfaces/common";
import { getSupplier, getSuppliers } from "../apis/supplier-service";

export const useSuppliers = ({
  page = 1,
  limit = 10,
  searchTerm,
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
}) => {
  return useQuery(
    ["suppliers", page, limit, searchTerm],
    () => getSuppliers({ page, limit, searchTerm }),
    {
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onError: (error: IError) => {
        toast.error(error?.response?.data?.message);
      },
    }
  );
};

export const useSupplier = (id: string) => {
  return useQuery(["suppliers", id], () => getSupplier(id), {
    refetchOnWindowFocus: false,
    retry: 0,
    onError: (error: IError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};
