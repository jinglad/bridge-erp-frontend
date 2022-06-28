import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
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
import { deleteProduct, getAndSearchProduct, getProducts, Product, Products } from "../../apis/product-service";
import EditProductDialog from "../../components/EditProductDialog";
import Layout from "../../components/Layout/Layout";

const Products: NextPage = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = useState<null | Product>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ["searchedProducts", productName],
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
      queryClient.invalidateQueries("products");
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
            sx={{ flex: 1 }}
            loading={status === "loading"}
            options={getProductFormattedData(data)}
            onInputChange={(e, value) => {
              setProductName(value);
            }}
            renderInput={(params) => <TextField {...params} placeholder="search products" variant="outlined" />}
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
                <TableCell>Image</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Category</TableCell>
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
                          <Box sx={{ height: "30px", width: "30px", background: "gray" }}></Box>
                        </TableCell>
                        <TableCell>{row.brand}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        {row.reorder_limit < row.qty ? (
                          <TableCell>{row.reorder_limit}</TableCell>
                        ) : (
                          <TableCell sx={{ color: "red" }}>{row.reorder_limit}</TableCell>
                        )}
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
