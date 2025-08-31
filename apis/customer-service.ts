import { IAllGetResponse, IGetResponse } from "../interfaces/common";
import http from "./http-common";

export interface ICustomer {
  _id: string;
  customerName: string;
  to_be_paid?: number;
}

export const createCustomer = async (customerName: string) => {
  try {
    const { data } = await http.post<IGetResponse<ICustomer>>(
      "/api/v1/customer",
      {
        customerName,
      }
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getCustomer = async (id: string) => {
  try {
    const { data } = await http.get<IGetResponse<ICustomer>>(
      "/api/v1/customer/" + id
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getCustomers = async ({
  page,
  limit,
  searchTerm,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
}) => {
  try {
    const { data } = await http.get<IAllGetResponse<ICustomer[]>>(
      "/api/v1/customer",
      {
        params: {
          page,
          limit,
          searchTerm: searchTerm ? searchTerm : undefined,
        },
      }
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const updateCustomer = async ({
  id,
  customerName,
}: {
  id: string;
  customerName: string;
}) => {
  try {
    const { data } = await http.patch<IGetResponse<ICustomer>>(
      "/api/v1/customer/" + id,
      {
        customerName,
      }
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const { data } = await http.delete<{ msg: string }>(
      "/api/v1/customer/" + id
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
