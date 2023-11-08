import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  ButtonGroup,
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
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "react-query";
import { toast } from "react-toastify";
import {
  deleteProduct,
  getAndSearchProduct,
  IProduct,
} from "../../apis/product-service";
import EditProductDialog from "../../components/Product/EditProductDialog";
import Layout from "../../components/Layout/Layout";
import useDebounce from "../../hooks/useDebounce";
import { useProducts } from "../../hooks/useProducts";
import { IColumn } from "../../interfaces/common";
import DataTable from "../../components/Table/DataTable";
import DeleteDialog from "../../components/DeleteDialog";

const Products: NextPage = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selected, setSelected] = useState<null | IProduct>(null);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const { data, isLoading } = useProducts({
    page: page + 1,
    limit,
    searchTerm: productName,
  });

  const debouncedSearchQuery = useDebounce(productName, 500);

  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
  //   useInfiniteQuery(
  //     ["searchedProducts", debouncedSearchQuery],
  //     getAndSearchProduct,
  //     {
  //       getNextPageParam: (lastPage, pages) => {
  //         if (pages.length === lastPage.totalPages) {
  //           return undefined;
  //         } else {
  //           return pages.length;
  //         }
  //       },
  //     }
  //   );

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading: deleteLoading } = useMutation(
    "deleteProduct",
    deleteProduct,
    {
      onSuccess: (data) => {
        toast.success(data.msg, {
          toastId: "delete-product" + selected?._id,
        });
        queryClient.invalidateQueries(["products"]);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const columns: IColumn[] = [
    {
      field: "name",
      label: "Name",
      align: "left",
    },
    {
      field: "sell_price",
      label: "Sell Price",
    },
    {
      field: "buy_price",
      label: "Buy Price",
    },
    {
      field: "brand",
      label: "Brand",
      render: (row: IProduct) => (
        <Typography variant="body2">{row?.brand?.brandtitle}</Typography>
      ),
    },
    {
      field: "category",
      label: "Category",
      render: (row: IProduct) => (
        <Typography variant="body2">{row?.category?.categorytitle}</Typography>
      ),
    },
    {
      field: "qty",
      label: "Qty",
    },
    {
      field: "reorder_limit",
      label: "Re-order Limit",
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (row: IProduct) => (
        <ButtonGroup size="small">
          <Button
            color="info"
            onClick={() => {
              setSelected(row);
              handleClickOpen();
            }}
          >
            <ModeEditOutlineOutlinedIcon />
          </Button>
          <Button
            color="warning"
            onClick={() => {
              setSelected(row);
              setDeleteDialogOpen(true);
            }}
          >
            <DeleteOutlineOutlinedIcon />
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All Products
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
            options={data?.data?.map((product) => product.name) || []}
            onChange={(e, value) => {
              setProductName(value || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="search products"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          <Button
            onClick={() => router.push("/products/create")}
            startIcon={<AddOutlinedIcon />}
          >
            Add Product
          </Button>
        </Box>

        <DataTable
          columns={columns}
          rows={data?.data || []}
          isLoading={isLoading}
          pagination={true}
          total={data?.meta?.total || 0}
          paginationOptions={{
            page,
            limit,
            handleChangePage: (e, page) => setPage(page),
            handleChangePageSize: (e) => setLimit(+e.target.value),
          }}
        />
      </Stack>

      {selected && (
        <EditProductDialog
          onClose={handleClose}
          open={open}
          product={selected}
          key={selected._id}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Product"
        text="Are you sure you want to delete this product?"
        handleDelete={handleDelete}
        deleteLoading={deleteLoading}
      />
    </Layout>
  );
};

export default Products;
