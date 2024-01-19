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
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteProduct, getAndSearchProduct, Product, Products } from "../../apis/product-service";
import EditProductDialog from "../../components/EditProductDialog";
import Layout from "../../components/Layout/Layout";
import useDebounce from "../../hooks/useDebounce";
<<<<<<< HEAD
import { useProducts } from "../../hooks/useProducts";
import { IColumn } from "../../interfaces/common";
import DataTable from "../../components/Table/DataTable";
import DeleteDialog from "../../components/DeleteDialog";
import { set } from "nprogress";
=======
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c

const Products: NextPage = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = useState<null | Product>(null);
  const debouncedSearchQuery = useDebounce(productName, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ["searchedProducts", debouncedSearchQuery],
    getAndSearchProduct,
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

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation("deleteProduct", deleteProduct, {
    onSuccess: (data) => {
      toast.success(data.msg, {
        toastId: "delete-product" + selected?._id,
      });
      queryClient.invalidateQueries("searchedProducts");
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const getProductFormattedData = (data: InfiniteData<Products> | undefined) => {
    const productName = data?.pages.flatMap((page) => page.products.map((product) => product.name));
    return [...new Set(productName)];
  };

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
<<<<<<< HEAD
            loading={isLoading}
            options={data?.data?.map((product) => product.name) || []}
            onChange={(e, value) => {
              setProductName(value || "");
              setPage(0);
=======
            loading={status === "loading"}
            options={getProductFormattedData(data)}
            onInputChange={(e, value) => {
              setProductName(value);
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c
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
                      {status === "loading" ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          <Button onClick={() => router.push("/products/create")} startIcon={<AddOutlinedIcon />}>
            Add Product
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ maxWidth: "100vw" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Sell Price</TableCell>
                <TableCell>Buy Price</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Re-order Limit</TableCell>
                <TableCell align="right">Actions</TableCell>
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
                    {group?.products.map((row) => (
                      <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>
                          {/* <Box sx={{ height: "30px", width: "30px", background: "gray" }}></Box> */}
                          {row.sell_price}
                        </TableCell>
                        <TableCell>{row.buy_price}</TableCell>
                        <TableCell>{row.brand}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.qty}</TableCell>
                        <TableCell
                          sx={{ color: Number(row.reorder_limit) < row.qty ? "black" : "red", fontWeight: "bold" }}
                        >
                          {row.reorder_limit}
                        </TableCell>
                        <TableCell align="right">
                          <ButtonGroup size="small">
                            <Button
                              color="info"
                              variant="contained"
                              onClick={() => {
                                setSelected(row);
                                handleClickOpen();
                              }}
                            >
                              <ModeEditOutlineOutlinedIcon />
                            </Button>
                            <Button
                              color="error"
                              variant="contained"
                              onClick={() => {
                                mutateAsync(row._id);
                              }}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </Button>
                          </ButtonGroup>
                        </TableCell>
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

      {selected && <EditProductDialog onClose={handleClose} open={open} product={selected} key={selected._id} />}
    </Layout>
  );
};

export default Products;
