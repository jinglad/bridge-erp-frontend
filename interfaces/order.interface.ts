import { ICustomer } from "../apis/customer-service";
import { IProduct } from "../apis/product-service";

export interface IOrder {
  _id: string;
  customer: ICustomer;
  customerName?: string;
  products: IProduct[];
  to_be_paid: number;
  to_be_paid_total: number;
  paid: number;
  payment_method: string;
  discount: number;
  order_return: boolean;
  buy_total: number;
  createdDate?: Date;
  previous_due?: number;
}
