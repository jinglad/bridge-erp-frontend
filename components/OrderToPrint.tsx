import React, { forwardRef } from "react";
import { Order } from "../apis/order-service";
import { Product } from "../apis/product-service";
import { visuallyHidden } from "@mui/utils";
import { Box } from "@mui/system";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import moment from "moment";

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
          display: "flex",
          flexDirection: "column",
          //   width: "100%",
          maxWidth: "400px",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          pointerEvents: "none",
          "@media screen ": {
            visibility: "hidden",
          },
        }}
      >
        <Typography>Date : {moment(new Date()).format("LL")}</Typography>
        <Typography>Customer Name : {customer}</Typography>

        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>#SL</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell align="right">Sub Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, i) => (
              <TableRow key={product._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Typography>{product.name}</Typography>
                  <Typography>[{product.sell_price}/=]</Typography>
                </TableCell>
                <TableCell>{product.qty}</TableCell>
                <TableCell align="right">{product.sell_price * product.qty}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>
                <Typography>Grand Total</Typography>
              </TableCell>
              <TableCell align="right">{products.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={1}>Paid Amount</TableCell>
              <TableCell colSpan={2}>Received by {payment_method}</TableCell>
              <TableCell align="right">{paid}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                <Typography>Amount Due</Typography>
              </TableCell>
              <TableCell align="right">{to_be_paid}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    );
  }
);
