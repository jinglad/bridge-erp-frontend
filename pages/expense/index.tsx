import { LoadingButton } from "@mui/lab";
import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useInfiniteQuery } from "react-query";
import Layout from "../../components/Layout/Layout";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { getProfitList } from "../../apis/profit-service";

function ExpensePage() {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery(
    ["customers"],
    getProfitList,
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length === lastPage.totalPages) {
          return undefined;
        } else {
          return pages.length;
        }
      },
    }
  );

  console.log(data);

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
          <Button startIcon={<AddOutlinedIcon />} onClick={() => router.push("/expense/create")}>
            Add Expense
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Expenses</TableCell>
                <TableCell>Expense Total</TableCell>
                <TableCell>Monthly Profit</TableCell>
                <TableCell>Monthly Purchase</TableCell>
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
                          {row.expenses.map((expense) => (
                            <div key={expense.name}>
                              {expense.name} - ৳{expense.spent}
                            </div>
                          ))}
                        </TableCell>

                        <TableCell>{row.expenseTotal}</TableCell>
                        <TableCell>{row.monthlyProfit}</TableCell>
                        <TableCell>{row.monthlyPurchase}</TableCell>
                        <TableCell>{row.monthlySales}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ))}
              </>
            )}
          </Table>
        </TableContainer>
        <Box textAlign="center">
          {hasNextPage && (
            <LoadingButton
              variant="contained"
              loading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              Load More
            </LoadingButton>
          )}
        </Box>
      </Stack>
    </Layout>
  );
}

export default ExpensePage;
