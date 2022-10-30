import http from "./http-common";

export interface ITotalSell {
  total_sell: number;
}
export interface ITotalStocks {
  total_stock: number;
}
export interface ITodaySales {
  today_sale: number;
}

export interface IMonthlySales {
  monthly_sales: number;
}

export const getTotalSales = async () => {
  try {
    const { data } = await http.get<ITotalSell>("/total-sell");
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getTotalStocks = async () => {
  try {
    const { data } = await http.get<ITotalStocks>("/total_purchase");
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getTodaySales = async () => {
  try {
    const { data } = await http.get<ITodaySales>("/today-sales");
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
}

export const getMonthlySales = async () => {
  try {
    const { data } = await http.get<IMonthlySales>("/monthly-sales");
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
}


