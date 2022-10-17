import http from "./http-common";

export interface ITotalSell {
  total_sell: number;
}

export const getTotalSales = async () => {
  try {
    const { data } = await http.get<ITotalSell>("/total-sell");
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
