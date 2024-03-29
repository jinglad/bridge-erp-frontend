import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getProduct, getProducts } from "../apis/product-service";
import { IError } from "../interfaces/common";

export const useProducts = ({
  page = 1,
  limit = 10,
  searchTerm,
  brand,
  category,
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  brand?: string;
  category?: string;
}) => {
  return useQuery(
    ["products", page, limit, searchTerm, brand, category],
    () => getProducts({ page, limit, searchTerm, brand, category }),
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

export const useProduct = (id: string) => {
  return useQuery(["products", id], () => getProduct(id), {
    refetchOnWindowFocus: false,
    retry: 0,
    onError: (error: IError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};
