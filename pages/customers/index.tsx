import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { ICustomer, deleteCustomer } from "../../apis/customer-service";
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
    </Layout>
  );
}

export default Customer;
