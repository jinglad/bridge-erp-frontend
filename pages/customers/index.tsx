import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  ICustomer,
  deleteCustomer,
  updateCustomerDue,
} from "../../apis/customer-service";
import Layout from "../../components/Layout/Layout";
import DataTable from "../../components/Table/DataTable";
import { useCustomers } from "../../hooks/useCustomers";
import useDebounce from "../../hooks/useDebounce";
import { IColumn } from "../../interfaces/common";
import { DeleteOutline, ModeEditOutlineOutlined } from "@mui/icons-material";
import DeleteDialog from "../../components/DeleteDialog";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import EditCustomerDialog from "../../components/Customer/EditCustomerDialog";

function Customer() {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const { data, isLoading } = useCustomers({
    page: page + 1,
    limit,
    searchTerm: debouncedCustomerName,
  });

  const { mutateAsync, isLoading: deleteLoading } = useMutation(
    deleteCustomer,
    {
      onSuccess: (data) => {
        console.log(data);
        toast.success("Customer deleted successfully");
        queryClient.invalidateQueries(["customers"]);
      },
      onError: (error: any) => {
        toast.error(error.message || "Something wen't wrong");
      },
    }
  );

  const handleDelete = async () => {
    await mutateAsync(selected?._id as string);
    setDeleteModal(false);
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
            // freeSolo={true}
            sx={{ flex: 1 }}
            loading={isLoading}
            options={
              data?.data?.map((customer) => customer?.customerName) || []
            }
            onInputChange={(e, value) => {
              setCustomerName(value);
              setPage(0);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="search customers"
                variant="outlined"
              />
            )}
          />

          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => router.push("/customers/create")}
          >
            Add customer
          </Button>
        </Box>

        <DataTable
          isLoading={isLoading}
          columns={columns}
          rows={data?.data || []}
          pagination={true}
          total={data?.meta?.total}
          paginationOptions={{
            page,
            limit,
            handleChangePage: (e, page) => setPage(page),
            handleChangePageSize: (e) => setLimit(+e.target.value),
          }}
        />
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
