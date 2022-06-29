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
import { useFieldArray, useForm } from "react-hook-form";
import Layout from "../components/Layout/Layout";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Box } from "@mui/system";

const Purchase = () => {
  const [value, setValue] = React.useState<Date | null>(new Date());

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product: [{ name: undefined, quantity: 1, purchasePerUnit: 0, sellsPerUnit: 0 }],
      invoice: undefined,
      chequeDisposalDate: new Date(),
      chequeNo: undefined,
      amountToBePaid: undefined,
      paidAmount: undefined,
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    name: "product",
    control,
  });
  const onSubmit = (data: any) => console.log(data);

  return (
    <Layout>
      <Grid container spacing={3} columns={12}>
        <Grid item xs={12} sm={12} lg={6} md={12}>
          <Typography variant="h6" gutterBottom>
            Purchase Product From Here
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container item spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField required id="invoice" label="Invoice" fullWidth {...register("invoice")} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  options={["Shibli", "Jihan"]}
                  renderInput={(params) => <TextField {...params} label="Supplier" />}
                />
              </Grid>
              {fields.map((field, index) => {
                return (
                  <Grid item container key={field.id} spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField
                        placeholder="name"
                        {...register(`product.${index}.name` as const, {
                          required: true,
                        })}
                        label="Product Name"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <TextField
                        placeholder="quantity"
                        label="Purchase Quantity"
                        type="number"
                        {...register(`product.${index}.quantity` as const, {
                          valueAsNumber: true,
                          required: true,
                        })}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <TextField
                        placeholder="value"
                        type="number"
                        label="Purchase Per Unit"
                        {...register(`product.${index}.purchasePerUnit` as const, {
                          valueAsNumber: true,
                          required: true,
                        })}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <TextField
                        label="Sells Per Unit"
                        placeholder="value"
                        type="number"
                        {...register(`product.${index}.sellsPerUnit` as const, {
                          valueAsNumber: true,
                          required: true,
                        })}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <Button fullWidth color="error" variant="contained" onClick={() => remove(index)}>
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                );
              })}
              <Grid item xs={12} sm={12} justifySelf="start">
                <Button
                  variant="contained"
                  onClick={() =>
                    append({
                      name: undefined,
                      quantity: 0,
                      purchasePerUnit: 0,
                      sellsPerUnit: 0,
                    })
                  }
                >
                  ADD PRODUCT
                </Button>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  {...register("amountToBePaid")}
                  type="number"
                  required
                  id="amountToBePaid"
                  label="Amount to be paid"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  {...register("paidAmount")}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  required
                  type="number"
                  id="paidAmount"
                  label="Paid Amount"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  disablePortal
                  options={["Bkash", "Rocket", "Nagad", "IIBL"]}
                  renderInput={(params) => <TextField {...params} label="Payment Method" />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("chequeNo")}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  type="number"
                  label="Cheque No ( Optional )"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    inputFormat="MM/dd/yyyy"
                    label="Cheque Disposal Date ( Set if not Today )"
                    value={value}
                    {...register("chequeDisposalDate")}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonGroup>
                  <Button type="submit" color="success">
                    Submit
                  </Button>
                  <Button color="error">Cancel</Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </form>
        </Grid>
        {/* <Grid item xs={12} md={12} lg={6} sm={12}>
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
        </Grid> */}
      </Grid>
    </Layout>
  );
};

export default Purchase;
