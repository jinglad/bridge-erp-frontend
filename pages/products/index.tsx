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

const Products: NextPage = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [selected, setSelected] = useState<null | Product>(null);

  const { isLoading, data } = useQuery("products", getProducts, {
    onSuccess: (data) => {
      setRows(data);
    },
  });
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

  const formatAutoCompleteData = (products: Product[] | undefined) => {
    const arr: any = [];

    products && products?.map((d) => arr.push({ label: d.name }));
    return arr;
  };

  const [rows, setRows] = useState<Product[]>([]);
  const [searched, setSearched] = useState<string>("");

  const requestSearch = (searchedVal: string) => {
    if (data) {
      const filteredRows = data?.filter((row) => {
        return row.name.toLowerCase().includes(searchedVal.toLowerCase());
      });
      setRows(filteredRows);
    }
  };

  function handleInputChange(event: any, value: any) {
    requestSearch(value);
  }

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
            options={formatAutoCompleteData(data)}
            onInputChange={handleInputChange}
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
            {isLoading ? (
              <TableBody sx={{ display: "flex", m: "4rem", width: "100%" }}>
                <TableRow>
                  <TableCell>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <>
                <TableBody>
                  {rows.map((row: Product) => (
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
              </>
            )}
          </Table>
        </TableContainer>
      </Stack>

      {selected && <EditProductDialog onClose={handleClose} open={open} product={selected} key={selected._id} />}
    </Layout>
  );
};

export default Products;
