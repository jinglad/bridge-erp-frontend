import http from "./http-common";

export interface Category {
  _id: string;
  categorytitle: string;
}

export interface Categories {
  categories: Category[];
  page: string;
  size: number;
  totalPages: number;
  totalCategories: number;
}

export const createCategory = async (categorytitle: string) => {
  try {
    const { data } = await http.post<{ msg: string }>("/category", { categorytitle });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getCategories = async ({ queryKey, pageParam = 0 }: { queryKey: string[]; pageParam?: number }) => {
  const categorytitle = queryKey[1]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const params: any = {};

  if (categorytitle) {
    params.categorytitle = categorytitle;
  }
  if (pageParam) {
    params.page = pageParam;
  }

  const { data } = await http.get<Categories>("/category", {
    params: params,
  });
  return data;
};

export const updateCategory = async ({ id, categorytitle }: any) => {
  try {
    const { data } = await http.patch<{
      msg: string;
    }>("/category/" + id, { categorytitle });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const { data } = await http.delete<{ msg: string }>("/category/" + id);
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
