import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  ButtonGroup,
  IconButton,
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
import React from "react";
import Layout from "../../components/Layout/Layout";
import { useRouter } from "next/router";

type Props = {};

function createData(id: number, createdBy: string, productDetails: string, category: string, image: string) {
  return {
    id,
    createdBy,
    productDetails,
    category,
    image,
  };
}

function Products({}: Props) {
  const rows = [
    createData(0, "John Doe", "Product Details", "Category", "https://source.unsplash.com/random/400x200"),
    createData(1, "John Doe", "Product Details", "Category", "https://source.unsplash.com/random/400x200"),
    createData(2, "John Doe", "Product Details", "Category", "https://source.unsplash.com/random/400x200"),
    createData(3, "John Doe", "Product Details", "Category", "https://source.unsplash.com/random/400x200"),
    createData(4, "John Doe", "Product Details", "Category", "https://source.unsplash.com/random/400x200"),
    createData(5, "John Doe", "Product Details", "Category", "https://source.unsplash.com/random/400x200"),
    createData(6, "John Doe", "Product Details", "Category", "https://source.unsplash.com/random/400x200"),
  ];

  const router = useRouter();

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
          }}
        >
          <TextField
            sx={{ flexGrow: 1 }}
            size="small"
            placeholder="Search Products"
            inputProps={{ "aria-label": "search products" }}
            variant="outlined"
          />

          <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>
            Search
          </Button>
          <Button onClick={() => router.push("/products/create")} startIcon={<AddOutlinedIcon />}>
            Add Product
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #dee2e6",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Product Details</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>
                    {/* {row.image} */}
                    <Box sx={{ height: "30px", width: "30px", background: "gray" }}></Box>
                  </TableCell>
                  <TableCell>{row.productDetails}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.createdBy}</TableCell>
                  <TableCell align="right">
                    <ButtonGroup size="small">
                      <Button color="info" variant="contained" onClick={() => router.push(`/products/edit/${row.id}`)}>
                        <ModeEditOutlineOutlinedIcon />
                      </Button>
                      <Button color="error" variant="contained">
                        <DeleteOutlineOutlinedIcon />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Layout>
  );
}

export default Products;
