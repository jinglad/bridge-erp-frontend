import http from "./http-common";
import { Product } from "./product-service";
import { Supplier } from "./supplier-service";

export interface Order {
  _id: string;
  customer: string;
  products: Product[];
  to_be_paid: number;
  paid: number;
  payment_method: string;
  createdDate?: Date;
  discount: number;
}
export interface CreateOrderProps {
  customer: string;
  products: Product[];
  to_be_paid: number;
  paid: number;
  payment_method: string;
  discount: number;
}

export interface Orders {
  orders: Order[];
  page: string;
  size: number;
  totalPages: number;
  totalPurchase: number;
}

export const createOrder = async (order: CreateOrderProps) => {
  const { data } = await http.post<{ msg: string }>("/order", {
    ...order,
  });
  return data;
};

export const getOrders = async ({ queryKey, pageParam = 0 }: { queryKey: any[]; pageParam?: number }) => {
  const createdDate = queryKey[1]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const params: any = {};

  if (createdDate) {
    params.createdDate = createdDate;
  }
  if (pageParam) {
    params.page = pageParam;
  }

  const { data } = await http.get<Orders>("/order", {
    params: params,
  });
  return data;
};
