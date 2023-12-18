import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import ModeEditOutlineOutlined from "@mui/icons-material/ModeEditOutlineOutlined";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ISupplier, deleteSupplier } from "../../apis/supplier-service";
import DeleteDialog from "../../components/DeleteDialog";
import EditSupplierDialog from "../../components/Supplier/EditSupplierDialog";
import Layout from "../../components/Layout/Layout";
import DataTable from "../../components/Table/DataTable";
import useDebounce from "../../hooks/useDebounce";
import { useSuppliers } from "../../hooks/useSuppliers";
import { IColumn } from "../../interfaces/common";
type Props = {};

function Suppliers({}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: ISupplier | null;
  }>({
    open: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selected, setSelected] = useState<null | ISupplier>(null);
  const [supplierName, setSupplierName] = useState("");
  const debouncedSupplierName = useDebounce(supplierName, 500);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const { data, isLoading } = useSuppliers({
    page: page + 1,
    limit,
    searchTerm: debouncedSupplierName,
  });

  const { mutateAsync, isLoading: deleteLoading } = useMutation(
    deleteSupplier,
    {
      onSuccess: (data) => {
        console.log(data);
        toast.success("Supplier deleted successfully");
        queryClient.invalidateQueries(["suppliers"]);
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
      field: "name",
      label: "Supplier Name",
      align: "left",
    },
    {
      field: "email",
      label: "Email",
    },
    {
      field: "phone",
      label: "Phone",
    },
    {
      field: "address",
      label: "Address",
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (row: ISupplier) => (
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
            <DeleteOutlined />
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <Layout>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All Suppliers
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: ["column", "row", "row"],
          }}
        >
          <Autocomplete
            freeSolo={true}
            sx={{ flex: 1 }}
            loading={isLoading}
            options={
              data?.data?.map((supplier: ISupplier) => supplier?.name) || []
            }
            onInputChange={(e, value) => {
              setSupplierName(value);
              setPage(0);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="search suppliers"
                variant="outlined"
              />
            )}
          />

          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => router.push("/suppliers/create")}
          >
            Add Supplier
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
      {editModal.open ? (
        <EditSupplierDialog
          onClose={() =>
            setEditModal({
              open: false,
              data: null,
            })
          }
          open={editModal.open}
          supplier={editModal.data as ISupplier}
        />
      ) : null}

      <DeleteDialog
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Supplier"
        text="Are you sure you want to delete this supplier?"
        handleDelete={handleDelete}
        deleteLoading={deleteLoading}
      />
    </Layout>
  );
}

export default Suppliers;
