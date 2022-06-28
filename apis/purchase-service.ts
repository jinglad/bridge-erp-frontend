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
  supplier: Supplier;
  products: Product;
  to_be_paid: number;
  paid: number;
  payment_method: string;
}

export const createPurchase = async (formData: Purchase) => {
  const { data } = await http.post<{ msg: string }>("/purchase", {
    ...formData,
  });
  return data;
};
