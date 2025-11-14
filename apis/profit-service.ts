import { IAllGetResponse, IGetResponse } from "../interfaces/common";
import { IExpense, IProfit } from "../interfaces/profit.interface";
import http from "./http-common";

// export const createExpense = async ({
//   date,
//   expenses,
// }: {
//   date: string;
//   expenses: Expense[];
// }) => {
//   try {
//     const { data } = await http.post<{ msg: string }>("/monthly-profit", {
//       date,
//       expenses,
//       expenseTotal: expenses.reduce((acc, cur) => acc + cur.spent, 0),
//     });
//     return data;
//   } catch (error: any) {
//     throw Error(error.response.data.message);
//   }
// };

// export const getProfitList = async ({
//   queryKey,
//   pageParam = 0,
// }: {
//   queryKey: string[];
//   pageParam?: number;
// }) => {
//   const customerName = queryKey[1]; // queryKey[0] is the original query key 'infiniteLookupDefs'
//   const params: any = {};

//   if (customerName) {
//     params.customerName = customerName;
//   }
//   if (pageParam) {
//     params.page = pageParam;
//   }

//   const { data } = await http.get<ProfitList>("/monthly-profit-list", {
//     params: params,
//   });

//   return data;
// };

export const getProfitList = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  try {
    const { data } = await http.get<IAllGetResponse<IProfit[]>>(
      "/api/v1/profit",
      {
        params: {
          page,
          limit,
        },
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message);
  }
};

export const createExpense = async ({
  date,
  expenses,
}: {
  date: string;
  expenses: IExpense[];
}) => {
  try {
    const { data } = await http.post<IGetResponse<IProfit>>("/api/v1/profit", {
      date,
      expenses,
      expenseTotal: expenses.reduce((acc, cur) => acc + cur.spent, 0),
    });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};
