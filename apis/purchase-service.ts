import { IAllGetResponse, IGetResponse } from "../interfaces/common";
import { IPurchase } from "../interfaces/purchase";
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

export interface ReturnPurchases {
  purchaseReturns: Purchase[];
  count: number;
  page: string;
  size: number;
  totalPages: number;
  totalPurchaseReturn: number;
}

export const createPurchase = async (formData: Purchase) => {
  try {
    const { data } = await http.post<IGetResponse<IPurchase>>(
      "/api/v1/purchase",
      {
        ...formData,
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
};

export const createReturnPurchase = async (id: string) => {
  try {
    const { data } = await http.post<IGetResponse<IPurchase>>(
      "/api/v1/purchase/return",
      { id }
    );
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
};

export const getPurchases = async ({
  createdDate,
  page,
  limit,
  searchTerm,
  supplier,
  purchase_return,
  converted_date,
}: {
  createdDate: string | null;
  page: number;
  limit: number;
  searchTerm?: string;
  supplier?: string;
  purchase_return?: boolean;
  converted_date?: string;
}) => {
  const params = {
    page,
    limit,
    purchase_return,
    createdDate: createdDate ? createdDate : null,
    searchTerm: searchTerm ? searchTerm : undefined,
    supplier: supplier ? supplier : undefined,
    converted_date: converted_date ? converted_date : undefined,
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
    const { data } = await http.delete<{ msg: string }>(
      "/api/v1/purchase/" + id
    );
    return data;
  } catch (error: any) {
    throw Error(error);
  }
};
