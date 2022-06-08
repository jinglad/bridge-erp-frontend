import {
  Autocomplete,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Table,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";
import Layout from "../components/Layout/Layout";

const Purchase = () => {
  const [value, setValue] = React.useState<Date | null>(new Date("2014-08-18T21:11:54"));

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Purchase Product From Here
          </Typography>

          <Grid container item spacing={3}>
            <Grid item xs={12}>
              <TextField required id="invoice" name="invoice" label="Invoice" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                options={["Apple", "Banana", "Orange", "Apple", "Banana", "Orange"]}
                renderInput={(params) => <TextField {...params} label="Supplier" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                options={["Apple", "Banana", "Orange", "Apple", "Banana", "Orange"]}
                renderInput={(params) => <TextField {...params} label="Products" />}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="number"
                required
                id="purchaseQuantity"
                name="purchaseQuantity"
                label="Purchase Quantity"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="number"
                required
                id="purchasePerUnitPrice"
                name="purchasePerUnitPrice"
                label="Purchase per Unit Price"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="number"
                required
                id="sellsPerUnitPrice"
                name="sellsPerUnitPrice"
                label="Sells per Unit Price"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField type="number" required id="amountToBePaid" name="amountToBePaid" label="Amount to be paid" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                options={["Bkash", "Rocket", "Nagad", "IIBL"]}
                renderInput={(params) => <TextField {...params} label="Payment Method" />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                required
                type="number"
                id="paidAmount"
                name="paidAmount"
                label="Paid Amount"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                type="number"
                id="checkNo"
                name="checkNo"
                label="Check No ( Optional )"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  inputFormat="MM/dd/yyyy"
                  label="Cheque Disposal Date ( Set if not Today )"
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ButtonGroup>
                <Button color="success">Submit</Button>
                <Button color="error">Cancel</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            ৫০০ নাম্বার ওয়ান লবন
          </Typography>
          <Divider />
          <Table size="small">
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Id:</TableCell>
              <TableCell>28</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Image :</TableCell>
              <TableCell>
                <img src="https://via.placeholder.com/30" alt="Product Image" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Product Name:</TableCell>
              <TableCell>৫০০ নাম্বার ওয়ান লবন...</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Category : </TableCell>
              <TableCell>লবণ</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Configuration : </TableCell>
              <TableCell>Product</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Expirable ? </TableCell>
              <TableCell>No</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>warrantable ? : </TableCell>
              <TableCell>No</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Last Sold unit Price:</TableCell>
              <TableCell>123</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Last Purchased unit Price:</TableCell>
              <TableCell>710</TableCell>
            </TableRow>
          </Table>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Purchase;
