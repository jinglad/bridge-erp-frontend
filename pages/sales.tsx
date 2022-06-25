import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import React, { useState } from "react";
import AddCustomerDialog from "../components/AddCustomerDialog";
import Layout from "../components/Layout/Layout";

type Props = {};

function Sales({}: Props) {
  const products = Array.from(Array(20).keys());
  const [cartItems, setCartItems] = useState<any>([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addToCart = (id: number) => {
    let cartItem = {
      id: id,
      name: "Product 1",
      price: 69,
      qty: 1,
    };

    const item = cartItems.find((item: any) => item.id === cartItem.id);

    if (item) {
      return;
    }

    setCartItems([...cartItems, cartItem]);
  };

  const deleteItemFromCart = (id: any) => {
    const newCart = cartItems.filter((c: any) => c.id !== id);
    setCartItems(newCart);
  };

  const [openAddCustomer, setOpenAddCustomer] = React.useState(false);

  const addCustomerDialogToggle = () => {
    setOpenAddCustomer(!openAddCustomer);
  };

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item container spacing={3} xs={12} sm={7}>
          <Grid item xs={12} sm={6}>
            <ButtonGroup fullWidth>
              <Button>Brand</Button>
              <Button>Category</Button>
              <Button>All</Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              options={["Apple", "Banana", "Orange", "Apple", "Banana", "Orange"]}
              renderInput={(params) => <TextField {...params} label="Search Product" variant="outlined" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sales Product
            </Typography>
          </Grid>
          <Grid item container spacing={3} xs={12}>
            {products.map((product, i) => (
              <Grid key={product} item xs={12} sm={3}>
                <Card
                  sx={{
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHw%3D&w=1000&q=80"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      ১কেজি নাম্বার ওয়ান লবন
                    </Typography>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6">BDT 150</Typography>
                      <Typography variant="h6">QTY : 210</Typography>
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => addToCart(i)}>
                      Add
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Stack spacing={2}>
            <Autocomplete
              disablePortal
              sx={{ flexGrow: 1 }}
              options={[{ label: "shibli" }, { label: "Jihan" }]}
              renderInput={(params) => (
                <TextField placeholder="Search Products" name="customerName" variant="outlined" {...params} />
              )}
            />

            <LoadingButton variant="contained" onClick={addCustomerDialogToggle}>
              Add Customer
            </LoadingButton>
          </Stack>
          <Box mt={5}>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Cost</TableCell>
                      <TableCell>Dis</TableCell>
                      <TableCell>Sub</TableCell>
                      <TableCell>LP</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <IconButton size="small" onClick={() => deleteItemFromCart(product.id)}>
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <TextField
                            onChange={(e) => {
                              console.log(e.target.value);
                              setCartItems(
                                cartItems.map((item: any) => {
                                  if (item.id === product.id) {
                                    item.qty = e.target.value;
                                  }
                                  return item;
                                })
                              );
                            }}
                            sx={{ width: "100px" }}
                            variant="outlined"
                            type="number"
                            defaultValue={product.qty}
                          />
                        </TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.price * product.qty}</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>{product.price * product.qty}</TableCell>
                        <TableCell>{product.price * product.qty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button onClick={handleOpen} fullWidth disabled={cartItems.length === 0}>
                Pay Now
              </Button>
              <Dialog maxWidth="md" onClose={handleClose} fullWidth open={open}>
                <DialogTitle>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Payment Details</Typography>
                    <IconButton color="error" onClick={handleClose}>
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </DialogTitle>
                <DialogContent dividers>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>SKU</TableCell>
                          <TableCell>Qty</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Cost</TableCell>
                          <TableCell>Dis</TableCell>
                          <TableCell>Sub</TableCell>
                          <TableCell>LP</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map((product: any) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.qty}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.price * product.qty}</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>{product.price * product.qty}</TableCell>
                            <TableCell>{product.price * product.qty}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} rowSpan={4}>
                            <FormControl fullWidth>
                              <InputLabel id="paymentMethod">Payment Method</InputLabel>
                              <Select
                                size="small"
                                labelId="paymentMethod"
                                id="demo-simple-select"
                                label="Payment Method"
                                defaultValue={10}
                                // onChange={handleChange}
                              >
                                <MenuItem value={10}>BKASH</MenuItem>
                                <MenuItem value={20}>ROCKET</MenuItem>
                                <MenuItem value={30}>NAGAD</MenuItem>
                                <MenuItem value={40}>CASH</MenuItem>
                              </Select>
                            </FormControl>
                            {/* <TextField
                              size="small"
                              fullWidth
                              label="Amount"
                              sx={{ marginTop: "4px" }}
                              variant="outlined"
                            /> */}
                          </TableCell>

                          <TableCell colSpan={2}>GrandTotal : </TableCell>
                          <TableCell>7105.5</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>7105.5</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>Discount :0</TableCell>
                          <TableCell colSpan={2}>&nbsp;</TableCell>
                          <TableCell>0</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>TAX @ 0 :</TableCell>
                          <TableCell colSpan={2}>&nbsp;</TableCell>
                          <TableCell>0</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>Net Total :</TableCell>
                          <TableCell colSpan={2}>&nbsp;</TableCell>
                          <TableCell id="netSalePrice">7105.5</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose}>
                    Complete Transaction
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      <AddCustomerDialog onToggle={addCustomerDialogToggle} open={openAddCustomer} />
    </Layout>
  );
}

export default Sales;
