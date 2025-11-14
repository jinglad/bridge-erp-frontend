import http from "./http-common";

export interface Customer {
  _id: string;
  customerName: string;
  to_be_paid?: number;
}

export interface Customers {
  customer: Customer[];
  count: number;
  page: string;
  size: number;
  totalPages: number;
  totalCustomers: number;
}

export const createCustomer = async (customerName: string) => {
  try {
    const { data } = await http.post<{ msg: string }>("/customer", { customerName });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getCustomers = async ({ queryKey, pageParam = 0 }: { queryKey: string[]; pageParam?: number }) => {
  const customerName = queryKey[1]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const params: any = {};

  if (customerName) {
    params.customerName = customerName;
  }
  if (pageParam) {
    params.page = pageParam;
  }

  const { data } = await http.get<Customers>("/customer", {
    params: params,
  });

  return data;
};

export const updateCustomerDue = async (id: string, to_be_paid: number) => {
  try {
    const { data } = await http.patch<IGetResponse<ICustomer>>(
      `/api/v1/customer/${id}`,
      {
        to_be_paid,
      }
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
