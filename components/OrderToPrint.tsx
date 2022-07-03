import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { forwardRef, Fragment } from "react";
import { Product } from "../apis/product-service";

interface OrderToPrintProps {
  payment_method: string;
  discount: number;
  paid: number;
  to_be_paid: number;
  products: Product[];
  customer: string;
  ref: React.RefObject<HTMLDivElement>;
  createdDate: string;
}

// eslint-disable-next-line react/display-name
export const OrderToPrint = forwardRef<HTMLInputElement, OrderToPrintProps>(
  ({ customer, paid, discount, payment_method, products, to_be_paid, createdDate }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          padding: "2mm .6mm",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "78mm",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          pointerEvents: "none",
          "@media screen ": {
            visibility: "hidden",
          },
          "*": {
            fontSize: "7px !important",
            fontWeight: "medium !important",
            fontFamily: "Poppins",
          },
        }}
      >
        <Box sx={{ fontSize: "9px !important" }}>নিউ আমজাদিয়া ভান্ডার</Box>
        <Box sx={{ fontSize: "9px !important" }}>০১৮৭২৫০০৬৪৫ , ০১৭০৯২০২৫৮১</Box>
        <Box sx={{ fontSize: "9px !important" }}>{customer}</Box>
        <DoubleDivider />
        {products.map((product, i) => (
          <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }} key={product._id}>
            <div>
              <Typography>{product.name}</Typography>
              <Typography sx={{ paddingLeft: "3mm" }}>
                {product.qty} X ৳{product.sell_price}
              </Typography>
            </div>
            <div>৳{product.sell_price * product.qty}</div>
          </Box>
        ))}
        <DoubleDivider />
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <Box>Discount</Box>
          <Box>৳{discount}</Box>
        </Box>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <Box>Total</Box>
          <Box>৳{products.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)}</Box>
        </Box>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <Box>{payment_method}</Box>
          <Box>৳{paid}</Box>
        </Box>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <Box>Due</Box>
          <Box>৳{to_be_paid}</Box>
        </Box>
        <DoubleDivider />
        <Box sx={{ fontSize: "6px !important" }}>{createdDate}</Box>
      </Box>
    );
  }
);

const DoubleDivider = () => {
  return (
    <Fragment>
      <Box sx={{ borderTop: "1px dashed black", width: "100%", padding: "1px 0", marginTop: "10px" }} />
      <Box sx={{ borderTop: "1px dashed black", width: "100%", paddingBottom: "4px" }} />
    </Fragment>
  );
};
