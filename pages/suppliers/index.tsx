import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  ButtonGroup,
  Chip,
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
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout/Layout";
type Props = {};

function createData(SL: number, supplierName: string, email: string, contactNo: number, fullAddress: string) {
  return {
    SL,
    supplierName,
    email,
    contactNo,
    fullAddress,
  };
}

function Suppliers({}: Props) {
  const rows = [
    createData(0, "Supplier Name", "email@gmail.com", 1234567890, "Full Address"),
    createData(1, "Supplier Name", "email@gmail.com", 1234567890, "Full Address"),
    createData(2, "Supplier Name", "email@gmail.com", 1234567890, "Full Address"),
    createData(3, "Supplier Name", "email@gmail.com", 1234567890, "Full Address"),
    createData(4, "Supplier Name", "email@gmail.com", 1234567890, "Full Address"),
    createData(5, "Supplier Name", "email@gmail.com", 1234567890, "Full Address"),
  ];

  const router = useRouter();
  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All Suppliers
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
            placeholder="Search Suppliers"
            inputProps={{ "aria-label": "search suppliers" }}
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
            onClick={() => router.push("/suppliers/create")}
          >
            Add Supplier
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
                <TableCell>SL</TableCell>
                <TableCell>Supplier Name</TableCell>
                <TableCell>Email </TableCell>
                <TableCell>Contact No.</TableCell>
                <TableCell>Full Address</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.SL} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.SL}
                  </TableCell>
                  <TableCell>{row.supplierName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.contactNo}</TableCell>
                  <TableCell>{row.fullAddress}</TableCell>
                  <TableCell align="right">
                    <ButtonGroup size="small">
                      <Button color="info" variant="contained" onClick={() => router.push("/suppliers/edit/" + row.SL)}>
                        <ModeEditOutlineOutlinedIcon />
                      </Button>
                      <Button color="success" variant="contained">
                        <CheckOutlinedIcon />
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

export default Suppliers;
