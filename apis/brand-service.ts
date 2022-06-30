import http from "./http-common";

export interface Brand {
  _id: string;
  brandtitle: string;
}

export interface Brands {
  brands: Brand[];
  page: string;
  size: number;
  totalPages: number;
  totalBrands: number;
}

export const createBrand = async (brandtitle: string) => {
  try {
    const { data } = await http.post<{ msg: string }>("/brand", { brandtitle });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getBrands = async ({ queryKey, pageParam = 0 }: { queryKey: string[]; pageParam?: number }) => {
  const brandtitle = queryKey[1]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const params: any = {};

  if (brandtitle) {
    params.brandtitle = brandtitle;
  }
  if (pageParam) {
    params.page = pageParam;
  }

  const { data } = await http.get<Brands>("/brand", {
    params: params,
  });
  return data;
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
