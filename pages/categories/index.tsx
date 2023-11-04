import {
  ModeEditOutlineOutlined,
  AddOutlined,
  DeleteOutline,
} from "@mui/icons-material";
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
import React, { useState } from "react";
import { ICategory, deleteCategory } from "../../apis/category-service";
import EditcategoryDialog from "../../components/EditCategoryDialog";
import Layout from "../../components/Layout/Layout";
import DataTable from "../../components/Table/DataTable";
import { useCategories } from "../../hooks/useCategories";
import { IColumn } from "../../interfaces/common";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import DeleteDialog from "../../components/DeleteDialog";

type Props = {};

function Categories({}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selected, setSelected] = useState<null | ICategory>(null);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const { data, isLoading } = useCategories({
    page: page + 1,
    limit,
    searchTerm: categoryName,
  });

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const { mutateAsync, isLoading: deleteLoading } = useMutation(
    deleteCategory,
    {
      onSuccess: (data) => {
        toast.success("Category deleted successfully");
        queryClient.invalidateQueries(["categories"]);
      },
      onError: (error: any) => {
        toast.error(error.message || "Something wen't wrong");
      },
    }
  );

  const handleDelete = async () => {
    await mutateAsync(selected?._id as string);
    setDeleteDialogOpen(false);
  };

  const columns: IColumn[] = [
    {
      field: "categorytitle",
      label: "Category Name",
      align: "left",
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (row: ICategory) => (
        <ButtonGroup size="small">
          <Button
            color="info"
            onClick={() => {
              setSelected(row);
              setOpen(true);
            }}
          >
            <ModeEditOutlineOutlined />
          </Button>
          <Button
            color="warning"
            onClick={() => {
              setSelected(row);
              setDeleteDialogOpen(true);
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
          All Categories
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
              data?.data?.map((category) => category.categorytitle) || []
            }
            onChange={(e, value) => {
              setCategoryName(value || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="search category"
                variant="outlined"
              />
            )}
          />

          <Button
            startIcon={<AddOutlined />}
            onClick={() => router.push("/categories/create")}
          >
            Add Category
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

      {selected && (
        <EditcategoryDialog
          onClose={handleClose}
          open={open}
          category={selected}
          key={selected._id}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Category"
        text="Are you sure you want to delete this category?"
        handleDelete={handleDelete}
        deleteLoading={deleteLoading}
      />
    </Layout>
  );
}

export default Categories;
