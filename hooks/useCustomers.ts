import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getCustomer, getCustomers } from "../apis/customer-service";
import { IError } from "../interfaces/common";

export const useCustomers = ({
  page = 1,
  limit = 10,
  searchTerm,
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
}) => {
  return useQuery(
    ["customers", page, limit, searchTerm],
    () => getCustomers({ page, limit, searchTerm }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onError: (error: IError) => {
        toast.error(error?.response?.data?.message);
      },
    }
  );
};

export const useCustomer = (id: string) => {
  return useQuery(["customers", id], () => getCustomer(id), {
    refetchOnWindowFocus: false,
    retry: 0,
    onError: (error: IError) => {
      toast.error(error?.response?.data?.message);
    },
  });
};
