import { IAllGetResponse } from "../interfaces/common";
import { IOrder } from "../interfaces/order.interface";
import http from "./http-common";

export interface CreateOrderProps extends Omit<IOrder, "customer"> {
  customer: string;
}

export const createOrder = async (order: any) => {
  const { data } = await http.post<{ msg: string }>("/api/v1/order", {
    ...order,
  });
  return data;
};

export const createOrderReturn = async (id: string) => {
  const { data } = await http.post<{ msg: string }>("/api/v1/order/return", {
    id,
  });
  return data;
};

export const salesReturn = async (order: CreateOrderProps) => {
  console.log(order);
  try {
    const { data } = await http.post<{ msg: string }>(
      `/api/v1/order/return?id=${order?._id}`,
      {
        ...order,
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.msg);
  }
};

// Get all orders
export const getOrders = async ({
  createdDate,
  page,
  limit,
  searchTerm,
  supplier,
  order_return,
  converted_date,
  customer,
}: {
  createdDate: string | Date | null;
  page: number;
  limit: number;
  searchTerm?: string;
  supplier?: string;
  order_return?: boolean;
  converted_date?: string;
  customer?: string | null;
}) => {
  const params = {
    page,
    limit,
    order_return,
    createdDate: createdDate ? createdDate : null,
    searchTerm: searchTerm ? searchTerm : undefined,
    supplier: supplier ? supplier : undefined,
    converted_date: converted_date ? converted_date : undefined,
    customer: customer ? customer : null,
  };

  try {
    const { data } = await http.get<IAllGetResponse<IOrder[]>>(
      "/api/v1/order",
      {
        params,
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.msg);
  }
};

export const getSalesReturn = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: any[];
  pageParam?: number;
}) => {
  const createdDate = queryKey[1]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const params: any = {};

  if (createdDate) {
    params.createdDate = createdDate;
  }
  if (pageParam) {
    params.page = pageParam;
  }

  const { data } = await http.get<any>("/sales-return", {
    params: params,
  });

  return data;
};

export const deleteOrder = async (id: string) => {
  try {
    const { data } = await http.delete<{ msg: string }>("/api/v1/order/" + id);
    return data;
  } catch (error: any) {
    throw Error(error);
  }
};
