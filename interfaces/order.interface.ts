import { ICustomer } from "../apis/customer-service";
import { IProduct } from "../apis/product-service";

export interface IOrder {
  _id: string;
  customer: ICustomer;
  products: IProduct[];
  to_be_paid: number;
  paid: number;
  payment_method: string;
  discount: number;
  order_return: boolean;
  buy_total: number;
  createdDate?: Date;
}
