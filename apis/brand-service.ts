import { IAllGetResponse, IGetResponse } from "../interfaces/common";
import http from "./http-common";

export interface IBrand {
  _id: string;
  brandtitle: string;
}

export const createBrand = async (brandtitle: string) => {
  try {
    const { data } = await http.post<IGetResponse<IBrand>>("/brand", {
      brandtitle,
    });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getBrand = async (id: string) => {
  try {
    const { data } = await http.get<IGetResponse<IBrand>>("/brand/" + id);
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getBrands = async ({
  page,
  limit,
  searchTerm,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
}) => {
  try {
    const { data } = await http.get<IAllGetResponse<IBrand[]>>("/brand", {
      params: { page, limit, searchTerm: searchTerm ? searchTerm : undefined },
    });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const updateBrand = async ({ id, brandtitle }: any) => {
  try {
    const { data } = await http.patch<IGetResponse<IBrand>>(
      "/brand/" + id + 1,
      {
        brandtitle,
      }
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const deleteBrand = async (id: string) => {
  try {
    const { data } = await http.delete<{ msg: string }>("/brand/" + id);
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
