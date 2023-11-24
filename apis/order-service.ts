import { IAllGetResponse } from "../interfaces/common";
import { ICustomer } from "./customer-service";
import http from "./http-common";
import { IProduct } from "./product-service";
import { ISupplier } from "./supplier-service";

export interface IOrder {
  _id: string;
  customer: string | ICustomer;
  products: IProduct[];
  to_be_paid: number;
  paid: number;
  payment_method: string;
  discount: number;
  order_return: boolean;
  buy_total: number;
  createdDate?: Date;
}
export interface CreateOrderProps {
  customer: string;
  products: IProduct[];
  to_be_paid: number;
  paid: number;
  payment_method: string;
  discount: number;
}

export const createOrder = async (order: any) => {
  const { data } = await http.post<{ msg: string }>("/api/v1/order", {
    ...order,
  });
  return data;
};

export const salesReturn = async (order: CreateOrderProps) => {
  const { data } = await http.post<{ msg: string }>("/api/v1/sales-return", {
    ...order,
  });
  return data;
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
}: {
  createdDate: string | Date | null;
  page: number;
  limit: number;
  searchTerm?: string;
  supplier?: string;
  order_return?: boolean;
  converted_date?: string;
}) => {
  const params = {
    page,
    limit,
    order_return,
    createdDate: createdDate ? createdDate : null,
    searchTerm: searchTerm ? searchTerm : undefined,
    supplier: supplier ? supplier : undefined,
    converted_date: converted_date ? converted_date : undefined,
  };

  const { data } = await http.get<IAllGetResponse<IOrder[]>>("/api/v1/order", {
    params,
  });
  return data;
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
    const { data } = await http.delete<{ msg: string }>("/order/" + id);
    return data;
  } catch (error: any) {
    throw Error(error);
  }
};
