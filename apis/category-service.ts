import { IAllGetResponse, IGetResponse } from "../interfaces/common";
import http from "./http-common";

export interface ICategory {
  _id: string;
  categorytitle: string;
}

export const createCategory = async (categorytitle: string) => {
  try {
    const { data } = await http.post<IGetResponse<ICategory>>(
      "/api/v1/category",
      {
        categorytitle,
      }
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getCategory = async (id: string) => {
  try {
    const { data } = await http.get<IGetResponse<ICategory>>(
      +"/api/v1/category/" + id
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getCategories = async ({
  page,
  limit,
  searchTerm,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
}) => {
  try {
    const { data } = await http.get<IAllGetResponse<ICategory[]>>(
      "/api/v1/category",
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

export const updateCategory = async ({ id, categorytitle }: any) => {
  try {
    const { data } = await http.patch<IGetResponse<ICategory>>(
      "/api/v1/category/" + id,
      { categorytitle }
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const { data } = await http.delete<{ message: string }>(
      "/api/v1/category/" + id
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
