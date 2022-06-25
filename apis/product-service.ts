import http from "./http-common";

export interface Product {
  _id: string;
  name: string;
  reorder_limit: number;
  brand: string;
  category: string;
  image: string;
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
