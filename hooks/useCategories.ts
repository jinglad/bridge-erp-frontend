import { useQuery } from "react-query";
import { getCategories, getCategory } from "../apis/category-service";
import { IError } from "../interfaces/common";
import { toast } from "react-toastify";

export const useCategories = ({
  page = 1,
  limit = 10,
  searchTerm,
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
}) => {
  return useQuery(
    ["categories", page, limit, searchTerm],
    () => getCategories({ page, limit, searchTerm }),
    {
      keepPreviousData: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      retry: 0,
      onError: (error: IError) => {
        toast.error(error?.response?.data?.message);
      },
    }
  );
};

export const useCategory = (id: string) => {
  return useQuery(["categories", id], () => getCategory(id), {
    refetchOnWindowFocus: false,
    retry: 0,
    onError: (error: IError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};
