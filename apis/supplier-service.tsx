import http from "./http-common";

export interface Supplier {
  _id: string;
  name: string;
  email: number;
  phone: string;
  address: string;
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

export const getSupplier = async () => {
  try {
    const { data } = await http.get<Supplier[]>("/supplier");
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
