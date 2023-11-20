import { IAllGetResponse } from "../interfaces/common";
import { IPurchase } from "../interfaces/purchase";
import http from "./http-common";
import { ISupplier } from "./supplier-service";

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

// export interface Purchases {
//   purchase: Purchase[];
//   count: number;
//   page: string;
//   size: number;
//   totalPages: number;
//   totalPurchase: number;
// }

export interface ReturnPurchases {
  purchaseReturns: Purchase[];
  count: number;
  page: string;
  size: number;
  totalPages: number;
  totalPurchaseReturn: number;
}

export const createPurchase = async (formData: Purchase) => {
  const { data } = await http.post<{ msg: string }>("/api/v1/purchase", {
    ...formData,
  });
  return data;
};

export const createReturnPurchase = async (formData: Purchase) => {
  const { data } = await http.post<{ msg: string }>("/api/v1/purchase-return", {
    ...formData,
  });
  return data;
};

export const getReturnPurchases = async ({
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

  const { data } = await http.get<ReturnPurchases>("/api/v1/purchase-return", {
    params: params,
  });
  return data;
};
export const getPurchases = async ({
  createdDate,
  page,
  limit,
}: {
  createdDate: string | null;
  page: number;
  limit: number;
}) => {
  const params = {
    createdDate: createdDate ? createdDate : null,
    page,
    limit,
  };

  const { data } = await http.get<IAllGetResponse<IPurchase[]>>(
    "/api/v1/purchase",
    {
      params: params,
    }
  );
  return data;
};

export const deletePurchase = async (id: string) => {
  try {
    const { data } = await http.delete<{ msg: string }>("/api/v1/purchase/" + id);
    return data;
  } catch (error: any) {
    throw Error(error);
  }
};
