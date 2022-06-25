import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchIcon from "@mui/icons-material/Search";
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
import { useInfiniteQuery } from "react-query";
import { getCustomers } from "../../apis/customer-service";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Customer({}: Props) {
  const router = useRouter();
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery(
    "customers",
    getCustomers,
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length === lastPage.totalPages) {
          return undefined;
        } else {
          return pages.length;
        }
      },
      onSuccess: () => {},
    }
  );

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
            disablePortal
            sx={{ flexGrow: 1 }}
            options={[]}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search customer" size="small" variant="outlined" />
            )}
          />

          <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>
            Search
          </Button>
          <Button startIcon={<AddOutlinedIcon />} onClick={() => router.push("/customers/create")}>
            Add customer
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: "100vw" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>customer Name </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            {status === "loading" ? (
              <TableBody sx={{ display: "flex", m: "4rem", width: "100%" }}>
                <TableRow>
                  <TableCell>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
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
