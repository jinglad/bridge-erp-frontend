import { useQuery } from "react-query";
import { getCategories, getCategory } from "../apis/category-service";

export const useCategories = ({
  page,
  limit,
  searchTerm,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
}) => {
  return useQuery(
    ["categories", page, limit, searchTerm],
    () => getCategories({ page, limit, searchTerm }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      retry: 0,
    }
  );
};

export const useCategory = (id: string) => {
  return useQuery(["categories", id], () => getCategory(id));
};
