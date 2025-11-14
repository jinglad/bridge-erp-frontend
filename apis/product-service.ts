import http from "./http-common";

export interface Product {
  _id: string;
  name: string;
  category: ICategory;
  categoryName?: string;
  brand: IBrand;
  brandName?: string;
  reorder_limit: string;
  brand: string;
  category: string;
  image: string;
  qty: number;
  purchase_qty?: number;
  sell_price: number;
  buy_price: number;
  available?: number;
}

export interface Products {
  products: Product[];
  count: number;
  page: string;
  size: number;
  totalPages: number;
  totalProducts: number;
}

export const createProduct = async (formData: any) => {
  try {
    const { data } = await http.post<{ msg: string }>("/products", formData);
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getProducts = async ({ pageParam = 0 }) => {
  try {
    const { data } = await http.get<Products>("/products", {
      params: {
        page: pageParam,
      },
    });
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

  const { data } = await http.get<Products>("/search-product", {
    params: params,
  });
  return data;
};

export const updateProduct = async ({ formData, id }: any) => {
  try {
    const { data } = await http.patch<{
      msg: string;
    }>("/products/" + id, formData);
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { data } = await http.delete<{ msg: string }>("/products/" + id);
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
