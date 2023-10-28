import { useQuery } from "react-query";
import { getBrand, getBrands } from "../apis/brand-service";

export const useBrands = ({
  page,
  limit,
  searchTerm,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
}) => {
  return useQuery(
    ["brands", page, limit, searchTerm],
    () => getBrands({ page, limit, searchTerm }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      retry: 0,
    }
  );
};

export const useBrand = (id: string) => {
  return useQuery(["brands", id], () => getBrand(id));
};
