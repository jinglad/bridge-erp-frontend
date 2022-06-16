import { AxiosError } from "axios";
import http from "./http-common";

interface Product {
  name: string;
  reorder_limit: number;
  brand: string;
  category: string;
  image: string;
}

export const createProduct = async (formData: any) => {
  try {
    const { data } = await http.post("/products", formData);
    return { data };
  } catch (error: any) {
    console.log(error);
    // throw Error(error.response.data.message);
  }
};
