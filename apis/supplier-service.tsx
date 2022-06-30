import http from "./http-common";

export interface Supplier {
  _id: string;
  name: string;
  email: number;
  phone: string;
  address: string;
}

export interface Suppliers {
  supplier: Supplier[];
  count: number;
  page: string;
  size: number;
  totalPages: number;
  totalProducts: number;
}

export interface CreateSupplierProps {
  name: string;
  email: number;
  phone: string;
  address: string;
}

export const createSupplier = async (sp: CreateSupplierProps) => {
  try {
    const { data } = await http.post<{ msg: string }>("/supplier", { ...sp });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getSupplier = async ({ queryKey, pageParam = 0 }: { queryKey: string[]; pageParam?: number }) => {
  const name = queryKey[1]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const params: any = {};

  if (name) {
    params.name = name;
  }
  if (pageParam) {
    params.page = pageParam;
  }

  try {
    const { data } = await http.get<Suppliers>("/supplier", {
      params: params,
    });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const updateSupplier = async (sp: Supplier) => {
  try {
    const { data } = await http.patch<{
      msg: string;
    }>("/Supplier/" + sp._id, { ...sp });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const deleteSupplier = async (id: string) => {
  try {
    const { data } = await http.delete<{ msg: string }>("/supplier/" + id);
    return data;
  } catch (error: any) {
    throw Error(error);
  }
};
