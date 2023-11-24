import { useQuery } from "react-query";
import { getPurchases } from "../apis/purchase-service";

// const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
//   ["purchases", createdDate],
//   getPurchases,
//   {
//     getNextPageParam: (lastPage, pages) => {
//       if (pages.length === lastPage.totalPages) {
//         return undefined;
//       } else {
//         return pages.length;
//       }
//     },
//     onSuccess: () => {},
//   }
// );

export const usePurchase = ({
  createdDate = null,
  page = 1,
  limit = 10,
  searchTerm,
  supplier,
  purchase_return = false,
  converted_date,
}: {
  createdDate?: string | null;
  page?: number;
  limit?: number;
  searchTerm?: string;
  supplier?: string;
  purchase_return?: boolean;
  converted_date?: string;
}) => {
  return useQuery({
    queryKey: [
      "purchases",
      createdDate,
      page,
      limit,
      searchTerm,
      supplier,
      purchase_return,
      converted_date,
    ],
    queryFn: () =>
      getPurchases({
        createdDate,
        page,
        limit,
        searchTerm,
        supplier,
        purchase_return,
        converted_date,
      }),
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
    onError: (error: any) => {
      console.log(error);
    },
  });
};
