import { IGetResponse } from "../interfaces/common";
import http from "./http-common";

export interface IDataSummary {
  total: number;
  _id: string | null;
}

// export const getTotalSales = async () => {
//   try {
//     const { data } = await http.get<ITotalSell>("/total-sell");
//     return data;
//   } catch (error: any) {
//     throw Error(error.response.data.message);
//   }
// };

// export const getTotalStocks = async () => {
//   try {
//     const { data } = await http.get<ITotalStocks>("/total_purchase");
//     return data;
//   } catch (error: any) {
//     throw Error(error.response.data.message);
//   }
// };

export const getTodaySales = async () => {
  try {
    const { data } = await http.get<IGetResponse<IDataSummary>>(
      "/api/v1/order/today-sales"
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getMonthlySales = async () => {
  try {
    const { data } = await http.get<IGetResponse<IDataSummary>>(
      "/api/v1/order/monthly-sales"
    );
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getMonthlyPurchases = async () => {
  const response = await http.get<IGetResponse<IDataSummary>>(
    "/api/v1/purchase/monthly-purchase"
  );
  return response.data;
};
