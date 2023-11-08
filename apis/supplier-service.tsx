import { IAllGetResponse, IGetResponse } from "../interfaces/common";
import http from "./http-common";

export interface ISupplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const createSupplier = async (sp: Omit<ISupplier, "_id">) => {
  try {
    const { data } = await http.post<IGetResponse<ISupplier>>(
      "/api/v1/supplier",
      sp
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getSupplier = async (id: string) => {
  try {
    const { data } = await http.get<IGetResponse<ISupplier>>(
      "/api/v1/supplier/" + id
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getSuppliers = async ({
  page,
  limit,
  searchTerm,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
}) => {
  try {
    const { data } = await http.get<IAllGetResponse<ISupplier[]>>(
      "/api/v1/supplier",
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

export const updateSupplier = async ({
  id,
  input,
}: {
  id: string;
  input: Omit<ISupplier, "_id">;
}) => {
  try {
    const { data } = await http.patch<IGetResponse<ISupplier>>(
      "/api/v1/supplier/" + id,
      input
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const deleteSupplier = async (id: string) => {
  try {
    const { data } = await http.delete<{ msg: string }>(
      "/api/v1/supplier/" + id
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
