import http from "./http-common";

export interface Category {
  _id: string;
  categorytitle: string;
}

export const createCategory = async (categorytitle: string) => {
  try {
    const { data } = await http.post<{ msg: string }>("/category", { categorytitle });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getCategories = async () => {
  try {
    const { data } = await http.get<Category[]>("/category");
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
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
