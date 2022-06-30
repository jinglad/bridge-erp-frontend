import {
  Dialog,
  DialogTitle,
  Stack,
  Typography,
  IconButton,
  DialogContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Product } from "../apis/product-service";

type PaymentDetailsDialogProps = {
  cartItems: Product[];
};

const PaymentDetailsDialog = ({ cartItems }: PaymentDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
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
                {cartItems.map((product, i) => (
                  <TableRow key={product._id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.qty}</TableCell>
                    <TableCell>{product.sell_price}</TableCell>
                    <TableCell>{product.sell_price * product.qty}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{product.sell_price * product.qty}</TableCell>
                    <TableCell>{product.sell_price * product.qty}</TableCell>
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
                      >
                        <MenuItem value={10}>BKASH</MenuItem>
                        <MenuItem value={20}>ROCKET</MenuItem>
                        <MenuItem value={30}>NAGAD</MenuItem>
                        <MenuItem value={40}>CASH</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell colSpan={2}>GrandTotal : </TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>{cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)}</TableCell>
                  <TableCell>{cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)}</TableCell>
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
                  <TableCell id="netSalePrice">
                    {cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)}
                  </TableCell>
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
    </>
  );
};

export default PaymentDetailsDialog;
