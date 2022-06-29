import http from "./http-common";

export interface Customer {
  _id: string;
  customerName: string;
}

export interface Customers {
  customer: Customer[];
  count: number;
  page: string;
  size: number;
  totalPages: number;
  totalProducts: number;
}

export const createCustomer = async (customerName: string) => {
  try {
    const { data } = await http.post<{ msg: string }>("/customer", { customerName });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getCustomers = async () => {
  try {
    const { data } = await http.get<Customers>("/customer");
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
