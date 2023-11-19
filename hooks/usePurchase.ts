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
  createdDate,
  page,
  limit,
}: {
  createdDate: string | null;
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["purchases", createdDate, page, limit],
    queryFn: () => getPurchases({ createdDate, page, limit }),
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
    onError: (error: any) => {
      console.log(error);
    },
  });
};
