import { useQuery } from "react-query";
import { getOrders } from "../apis/order-service";

export const useOrders = ({
  createdDate = null,
  page = 1,
  limit = 10,
  searchTerm,
  supplier,
  order_return = false,
  converted_date,
}: {
  createdDate?: string | Date | null;
  page?: number;
  limit?: number;
  searchTerm?: string;
  supplier?: string;
  order_return?: boolean;
  converted_date?: string;
}) => {
  return useQuery({
    queryKey: [
      "orders",
      createdDate,
      page,
      limit,
      searchTerm,
      supplier,
      order_return,
      converted_date,
    ],
    queryFn: () =>
      getOrders({
        createdDate,
        page,
        limit,
        searchTerm,
        supplier,
        order_return,
        converted_date,
      }),
    keepPreviousData: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 0,
    onError: (error: any) => {
      console.log(error);
    },
  });
};
