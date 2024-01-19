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
<<<<<<< HEAD
  const [selected, setSelected] = useState<null | ICustomer>(null);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: ICustomer | null;
  }>({
    open: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const debouncedCustomerName = useDebounce(customerName, 500);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
=======
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c

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

<<<<<<< HEAD
  const columns: IColumn[] = [
    {
      field: "customerName",
      label: "Customer Name",
      align: "left",
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (row: ICustomer) => (
        <ButtonGroup size="small">
          <Button
            color="info"
            onClick={() => {
              setSelected(row);
              setEditModal({
                open: true,
                data: row,
              });
            }}
          >
            <ModeEditOutlineOutlined />
          </Button>

          <Button
            color="warning"
            onClick={() => {
              setSelected(row);
              setDeleteModal(true);
            }}
          >
            <DeleteOutline />
          </Button>
        </ButtonGroup>
      ),
    },
  ];

=======
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c
  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All customers
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
              setPage(0);
            }}
            renderInput={(params) => <TextField {...params} placeholder="search customer" variant="outlined" />}
          />

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
                      <TableRow key={row._id} >
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
<<<<<<< HEAD

      {/* Edit & delete modal */}
      {editModal.open ? (
        <EditCustomerDialog
          open={editModal.open}
          onClose={() =>
            setEditModal({
              open: false,
              data: null,
            })
          }
          customer={editModal.data as ICustomer}
        />
      ) : null}
      <DeleteDialog
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Customer"
        text="Are you sure you want to delete this customer?"
        handleDelete={handleDelete}
        deleteLoading={deleteLoading}
      />
=======
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c
    </Layout>
  );
}

export default Customer;
