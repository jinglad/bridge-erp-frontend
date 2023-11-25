import { IAllGetResponse, IGetResponse } from "../interfaces/common";
import { IBrand } from "./brand-service";
import { ICategory } from "./category-service";
import http from "./http-common";

export interface IProduct {
  _id: string;
  name: string;
  category: ICategory;
  brand: IBrand;
  reorder_limit: string;
  image: string;
  qty: number;
  purchase_qty?: number;
  sell_price: number;
  buy_price: number;
}

export const createProduct = async (input: Omit<IProduct, "_id">) => {
  try {
    const { data } = await http.post<IGetResponse<IProduct>>(
      "/api/v1/product",
      input
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getProduct = async (id: string) => {
  try {
    const { data } = await http.get<IGetResponse<IProduct>>(
      "/api/v1/product/" + id
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getProducts = async ({
  page,
  limit,
  searchTerm,
  brand,
  category,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
  brand?: string;
  category?: string;
}) => {
  try {
    const { data } = await http.get<IAllGetResponse<IProduct[]>>(
      "/api/v1/product",
      {
        params: {
          page,
          limit,
          searchTerm: searchTerm ? searchTerm : undefined,
          brand: brand ? brand : undefined,
          category: category ? category : undefined,
        },
      }
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getAndSearchProduct = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: string[];
  pageParam?: number;
}) => {
  const name = queryKey[1]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const brand = queryKey[2]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const category = queryKey[3]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const params: any = {};

  if (name) {
    params.name = name;
  }
  if (brand) {
    params.brand = brand;
  }
  if (category) {
    params.category = category;
  }
  if (pageParam) {
    params.page = pageParam;
  }

  const { data } = await http.get<IAllGetResponse<IProduct[]>>(
    "/search-product",
    {
      params: params,
    }
  );
  return data;
};

export const updateProduct = async ({
  id,
  info,
}: {
  id: string;
  info: Omit<IProduct, "_id">;
}) => {
  try {
    const { data } = await http.patch<IGetResponse<IProduct>>(
      "/api/v1/product/" + id,
      info
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { data } = await http.delete<{ msg: string }>(
      "/api/v1/product/" + id
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
