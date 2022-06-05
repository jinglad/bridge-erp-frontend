import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  ButtonGroup,
  Chip,
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

type Props = {};

function createData(id: number, categoryName: string, expirable: boolean, warrantiable: boolean, createdBy: string) {
  return {
    id,
    categoryName,
    expirable,
    warrantiable,
    createdBy,
  };
}

function Categories({}: Props) {
  const rows = [
    createData(0, "Category Name", true, true, "John Doe"),
    createData(1, "Category Name", false, true, "John Doe"),
    createData(2, "Category Name", true, false, "John Doe"),
    createData(3, "Category Name", true, false, "John Doe"),
    createData(4, "Category Name", false, true, "John Doe"),
    createData(5, "Category Name", true, false, "John Doe"),
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
          }}
        >
          <TextField
            sx={{ flexGrow: 1 }}
            size="small"
            placeholder="Search Products"
            inputProps={{ "aria-label": "search products" }}
          />

          <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>
            Search
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
            }}
            startIcon={<AddOutlinedIcon />}
          >
            Add Category
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
                <TableCell>Category Name </TableCell>
                <TableCell>Expirable</TableCell>
                <TableCell>Warrantiable</TableCell>
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
                  <TableCell>{row.categoryName}</TableCell>
                  <TableCell>
                    {row.expirable ? (
                      <Chip label="Yes" size="small" color="success" />
                    ) : (
                      <Chip label="No" size="small" color="error" />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.warrantiable ? (
                      <Chip label="Yes" size="small" color="success" />
                    ) : (
                      <Chip label="No" size="small" color="error" />
                    )}
                  </TableCell>
                  <TableCell>{row.createdBy}</TableCell>
                  <TableCell align="right">
                    <ButtonGroup>
                      <IconButton aria-label="edit">
                        <ModeEditOutlineOutlinedIcon color="info" />
                      </IconButton>
                      <IconButton aria-label="delete">
                        <CheckOutlinedIcon color="success" />
                      </IconButton>
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

export default Categories;
