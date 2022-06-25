import http from "./http-common";

export interface Brand {
  _id: string;
  brandtitle: string;
}

export const createBrand = async (brandtitle: string) => {
  try {
    const { data } = await http.post<{ msg: string }>("/brand", { brandtitle });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getBrands = async () => {
  try {
    const { data } = await http.get<Brand[]>("/brand");
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const updateBrand = async ({ id, brandtitle }: any) => {
  try {
    const { data } = await http.patch<{
      msg: string;
    }>("/brand/" + id, { brandtitle });
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
    throw Error(error);
  }
};
