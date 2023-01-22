import http from "./http-common";

export interface ProfitList {
  page: string;
  size: number;
  totalPages: number;
  totalProfit: number;
  profits: Profit[];
}

export interface Profit {
  _id: string;
  convertedDate: string;
  createdDate: string;
  date: string;
  expenseTotal: number;
  expenses: Expense[];
  monthlyProfit: number;
  monthlyBuys: number;
  monthlySales: number;
}

export interface Expense {
  name: string;
  spent: number;
}

export const createExpense = async ({
  date,
  expenses,
}: {
  date: string;
  expenses: Expense[];
}) => {
  try {
    const { data } = await http.post<{ msg: string }>("/monthly-profit", {
      date,
      expenses,
      expenseTotal: expenses.reduce((acc, cur) => acc + cur.spent, 0),
    });
    return data;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
};

export const getProfitList = async ({
  queryKey,
  pageParam = 0,
}: {
  queryKey: string[];
  pageParam?: number;
}) => {
  const customerName = queryKey[1]; // queryKey[0] is the original query key 'infiniteLookupDefs'
  const params: any = {};

  if (customerName) {
    params.customerName = customerName;
  }
  if (pageParam) {
    params.page = pageParam;
  }

  const { data } = await http.get<ProfitList>("/monthly-profit-list", {
    params: params,
  });

  return data;
};
