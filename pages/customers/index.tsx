import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
<<<<<<< HEAD
  CircularProgress,
  Paper,
=======
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
>>>>>>> dc7ef7a65be175974f4da4702aa0fbcd6b79ae99
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
import {
  ICustomer,
  deleteCustomer,
  updateCustomerDue,
} from "../../apis/customer-service";
import Layout from "../../components/Layout/Layout";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchIcon from "@mui/icons-material/Search";

function Customer() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [selected, setSelected] = useState<null | ICustomer>(null);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: ICustomer | null;
  }>({
    open: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    customer: ICustomer | null;
  }>({
    open: false,
    customer: null,
  });
  const [paymentInputs, setPaymentInputs] = useState<{ [key: string]: number }>(
    {}
  );
  const debouncedCustomerName = useDebounce(customerName, 500);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

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

  const handleOpenPaymentModal = (customer: ICustomer) => {
    setPaymentModal({ open: true, customer });
  };

  const handleClosePaymentModal = () => {
    setPaymentModal({ open: false, customer: null });
  };

  const handlePaymentSubmit = async (paymentAmount: number) => {
    if (!paymentModal.customer) return;

    if (paymentAmount <= 0) {
      toast.error("Payment amount must be greater than zero.");
      return;
    }
    if (paymentAmount > (paymentModal.customer.to_be_paid || 0)) {
      toast.error("Payment amount exceeds the customer's total due.");
      return;
    }

    const newDueAmount =
      (paymentModal.customer.to_be_paid || 0) - paymentAmount;

    try {
      await updateCustomerDue(paymentModal.customer._id, newDueAmount);
      toast.success("Payment successful");
      queryClient.invalidateQueries(["customers"]);
      handleClosePaymentModal();
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
    }
  };

  const columns: IColumn[] = [
    {
      field: "customerName",
      label: "Customer Name",
      align: "left",
    },
    {
      field: "to_be_paid",
      label: "Total Due",
      align: "center",
    },
    {
      field: "payment",
      label: "Payment",
      align: "center",
      render: (row: ICustomer) => {
        if (row.to_be_paid && row.to_be_paid > 0) {
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenPaymentModal(row)}
            >
              Pay
            </Button>
          );
        }
        return <></>;
      },
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

      {/* Payment modal */}
      {paymentModal.open && (
        <Dialog open={paymentModal.open} onClose={handleClosePaymentModal}>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Payment Amount"
              type="number"
              fullWidth
              onChange={(e) =>
                setPaymentInputs({
                  [paymentModal.customer?._id || ""]: Number(e.target.value),
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePaymentModal} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={() =>
                handlePaymentSubmit(
                  paymentInputs[paymentModal.customer?._id || ""] || 0
                )
              }
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Layout>
  );
}

export default Customer;
