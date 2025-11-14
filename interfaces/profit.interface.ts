export interface IExpense {
  name: string;
  spent: number;
}

export interface IProfit {
  _id: string;
  date: string;
  expenseTotal: number;
  expenses: IExpense[];
  monthlyBuys: number;
  monthlySales: number;
  monthlyProfit: number;
  createdDate: string;
  convertedDate: string;
}
