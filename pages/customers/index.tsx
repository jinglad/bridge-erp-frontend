import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
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
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useState } from "react";
import { InfiniteData, useInfiniteQuery } from "react-query";
import { Customers, getCustomers } from "../../apis/customer-service";
import Layout from "../../components/Layout/Layout";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchIcon from "@mui/icons-material/Search";

function Customer() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery(
    ["customers", customerName],
    getCustomers,
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

  const getCustomerFormattedData = (data: InfiniteData<Customers> | undefined) => {
    const customers = data?.pages.flatMap((page) => page.customer.map((c) => c.customerName));
    return [...new Set(customers)];
  };

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All customer
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: ["column", "row", "row"],
          }}
        >
          <Autocomplete
            sx={{ flex: 1 }}
            loading={status === "loading"}
            options={getCustomerFormattedData(data)}
            onInputChange={(e, value) => {
              setCustomerName(value);
            }}
            renderInput={(params) => <TextField {...params} placeholder="search customer" variant="outlined" />}
          />

          <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>
            Search
          </Button>
          <Button startIcon={<AddOutlinedIcon />} onClick={() => router.push("/customers/create")}>
            Add customer
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>customer Name </TableCell>
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
                    {group?.customer.map((row) => (
                      <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>{row.customerName}</TableCell>
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

export default Customer;
