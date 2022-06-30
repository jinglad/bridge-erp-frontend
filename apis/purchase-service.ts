import http from "./http-common";
import { Supplier } from "./supplier-service";

export interface Product {
  _id: string;
  name: string;
  qty: number;
  sell_price: number;
  buy_price: number;
}

export interface Purchase {
  _id: string;
  supplier: string;
  products: Product[];
  to_be_paid: number;
  paid: number;
  payment_method: string;
  createdDate: Date;
}

export interface Purchases {
  purchase: Purchase[];
  count: number;
  page: string;
  size: number;
  totalPages: number;
  totalPurchase: number;
}

export const createPurchase = async (formData: Purchase) => {
  const { data } = await http.post<{ msg: string }>("/purchase", {
    ...formData,
  });
  return data;
};

export const getPurchases = async ({ queryKey, pageParam = 0 }: { queryKey: any[]; pageParam?: number }) => {
  const createdDate = queryKey[1]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const params: any = {};

  if (createdDate) {
    params.createdDate = createdDate;
  }
  if (pageParam) {
    params.page = pageParam;
  }

  const { data } = await http.get<Purchases>("/purchase", {
    params: params,
  });
  return data;
};
