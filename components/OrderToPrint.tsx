import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { forwardRef } from "react";
import { Product } from "../apis/product-service";

interface OrderToPrintProps {
  payment_method: string;
  discount: number;
  paid: number;
  to_be_paid: number;
  products: Product[];
  customer: string;
  ref: React.RefObject<HTMLDivElement>;
}

// eslint-disable-next-line react/display-name
export const OrderToPrint = forwardRef<HTMLInputElement, OrderToPrintProps>(
  ({ customer, paid, discount, payment_method, products, to_be_paid }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          padding: "20px 10px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "80mm",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          pointerEvents: "none",
          "@media screen ": {
            visibility: "hidden",
          },
          "*": {
            fontSize: "7px",
          },
        }}
      >
        <Typography>নিউ আমজাদিয়া ভান্ডার</Typography>
        <Typography>০১৮৭২৫০০৬৪৫ , ০১৭০৯২০২৫৮১</Typography>
        <Typography>Customer name : {customer}</Typography>
        <Box sx={{ borderTop: "1px dashed black", width: "100%", padding: "1px 0", marginTop: "10px" }} />
        <Box sx={{ borderTop: "1px dashed black", width: "100%" }} />
        <Table
          size="small"
          sx={{
            "tr, td, th": {
              padding: "8px",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell align="right">Sub total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, i) => (
              <TableRow key={product._id}>
                <TableCell>
                  <Typography>{product.name}</Typography>
                  <Typography>
                    {product.qty} X ৳{product.sell_price}
                  </Typography>
                </TableCell>
                <TableCell>{product.qty}</TableCell>
                <TableCell align="right">৳{product.sell_price * product.qty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table
          size="medium"
          sx={{
            "tr, td, th": {
              padding: "8px",
            },
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell colSpan={3}>Discount</TableCell>
              <TableCell align="right">৳{discount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell align="right">
                ৳{products.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Paid </TableCell>
              <TableCell colSpan={1}>Received by {payment_method}</TableCell>
              <TableCell align="right">৳{paid}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Due</TableCell>
              <TableCell align="right">৳{to_be_paid}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    );
  }
);
