import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteProduct, getProducts, Product } from "../../apis/product-service";
import EditProductDialog from "../../components/EditProductDialog";
import Layout from "../../components/Layout/Layout";
import { useInfiniteQuery } from "react-query";
import { LoadingButton } from "@mui/lab";

const Products: NextPage = () => {
  const [page, setPage] = useState(0);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [selected, setSelected] = useState<null | Product>(null);

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery(
    "products",
    getProducts,
    {
      getNextPageParam: (lastPage, pages) => pages.length,
      onSuccess: (data) => {},
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

  const [rows, setRows] = useState<Product[]>([]);
  const [searched, setSearched] = useState<string>("");

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
            disablePortal
            sx={{ flexGrow: 1 }}
            options={[]}
            renderInput={(params) => <TextField placeholder="Search Products" variant="outlined" {...params} />}
          />

          <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>
            Search
          </Button>
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
                    {group?.products.map((row) => (
                      <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>
                          <Box sx={{ height: "30px", width: "30px", background: "gray" }}></Box>
                        </TableCell>
                        <TableCell>{row.brand}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.reorder_limit}</TableCell>
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
          <LoadingButton
            variant="contained"
            // loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load More" : "Nothing more to load"}
          </LoadingButton>
        </Box>
      </Stack>

      {selected && <EditProductDialog onClose={handleClose} open={open} product={selected} key={selected._id} />}
    </Layout>
  );
};

export default Products;
