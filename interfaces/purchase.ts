import { IProduct } from "../apis/product-service";
import { ISupplier } from "../apis/supplier-service";

export interface IPurchase {
  purchase_return: boolean;
  _id: string;
  supplier: ISupplier;
  products: IProduct[];
  to_be_paid?: number;
  paid?: number;
  payment_method?: string;
  createdDate: string;
  converted_date: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
