import { Button, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import Layout from "../../components/Layout/Layout";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useState } from "react";
import DataTable from "../../components/Table/DataTable";
import { useProfitList } from "../../hooks/useProfits";
import { IColumn } from "../../interfaces/common";
import { IProfit } from "../../interfaces/profit.interface";

function ExpensePage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useProfitList({
    page: page + 1,
    limit,
  });

  const columns: IColumn[] = [
    {
      field: "date",
      label: "Date",
    },
    {
      field: "expenses",
      label: "Expenses ",
      render: (row: IProfit) => (
        <>
          {row.expenses.map((expense: any) => (
            <div key={expense.name}>
              {expense.name} - ৳{expense.spent?.toFixed(2)}
            </div>
          ))}
        </>
      ),
    },
    {
      field: "expenseTotal",
      label: "Monthly Total",
      render: (row: IProfit) => (
        <Typography fontWeight="bold">
          ৳{Number(row.expenseTotal).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "monthlyProfit",
      label: "Monthly Profit",
      render: (row: IProfit) => (
        <Typography fontWeight="bold">
          ৳{Number(row.monthlyProfit).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "monthlyBuys",
      label: "Monthly Buys",
      render: (row: IProfit) => (
        <Typography fontWeight="bold">
          ৳{Number(row.monthlyBuys).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "monthlySales",
      label: "Monthly Sales",
      render: (row: IProfit) => (
        <Typography fontWeight="bold">
          ৳{Number(row.monthlySales).toFixed(2)}
        </Typography>
      ),
    },
  ];

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          Profit List
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: ["column", "row", "row"],
          }}
        >
          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => router.push("/expense/create")}
          >
            Add Expense
          </Button>
        </Box>

        <DataTable
          isLoading={isLoading}
          columns={columns}
          rows={data?.data || []}
          total={data?.meta?.total}
          pagination={true}
          paginationOptions={{
            page,
            limit,
            handleChangePage: (e, page) => setPage(page),
            handleChangePageSize: (e) => setLimit(+e.target.value),
          }}
        />
      </Stack>
    </Layout>
  );
}

export default ExpensePage;

{
  /*
   *
  *
  * <TableContainer component={Paper}>
<Table aria-label="simple table">
  <TableHead>
    <TableRow>
      <TableCell>Date</TableCell>
      <TableCell>Expenses</TableCell>
      <TableCell>Expense Total</TableCell>
      <TableCell>Monthly Profit</TableCell>
      <TableCell>Monthly Buys</TableCell>
      <TableCell>Monthly Sales</TableCell>
    </TableRow>
  </TableHead>

  {status === "loading" ? (
    <TableBody sx={{ display: "flex", m: "4rem", width: "100%" }}>
      <CircularProgress />
    </TableBody>
  ) : (
    <>
      {data?.pages.map((group, i) => (
        <TableBody key={i}>
          {group?.profits.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>
                {row.expenses.map((expense: any) => (
                  <div key={expense.name}>
                    {expense.name} - ৳{expense.spent}
                  </div>
                ))}
              </TableCell>

              <TableCell>
                {Number(row.expenseTotal).toFixed(2)}
              </TableCell>
              <TableCell>{row.monthlyProfit.toFixed(2)}</TableCell>
              <TableCell>{row.monthlyBuys.toFixed(2)}</TableCell>
              <TableCell>{row.monthlySales.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      ))}
    </>
  )}
</Table>
</TableContainer> */
}
