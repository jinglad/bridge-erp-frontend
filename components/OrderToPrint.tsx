import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
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
  (
    {
      customer,
      paid,
      discount,
      payment_method,
      products,
      to_be_paid,
      createdDate,
    },
    ref
  ) => {
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
            // fontSize: "8px",
            fontWeight: "medium !important",
            fontFamily: "Poppins",
          },
        }}
      >
        <Box sx={{ fontSize: "9px !important", fontWeight: 700 }}>নিউ আমজাদিয়া ভান্ডার</Box>
        <Box sx={{ fontSize: "9px !important", fontWeight: 700 }}>০১৮৭২৫০০৬৪৫ , ০১৭০৯২০২৫৮১</Box>
        <Box sx={{ fontSize: "9px !important", fontWeight: 700 }}>{customer}</Box>
        <DoubleDivider />
        {products.map((product, i) => (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              p: "0px 12px",
            }}
            key={product._id}
          >
            <Box>
              <Box sx={{ fontSize: "8px !important", fontWeight: 700 }}>{product.name}</Box>
              <Box sx={{ fontSize: "8px !important", fontWeight: 700 }}>
                {product.qty} X ৳{product.sell_price}
              </Box>
            </Box>
            <Box sx={{ fontSize: "8px !important", fontWeight: 700 }}>৳{product.sell_price * product.qty}</Box>
          </Box>
        ))}
        <DoubleDivider />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "8px!important",
            fontWeight: 700,
            p: "3px 12px",
          }}
        >
          <Box>Discount</Box>
          <Box>৳{discount}</Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "8px!important",
            p: "3px 12px",
            fontWeight: 700
          }}
        >
          <Box>Total</Box>
          <Box>
            ৳
            {products.reduce(
              (acc, curr) => acc + curr.sell_price * curr.qty,
              0
            )}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "8px!important",
            p: "3px 12px",
            fontWeight: 700
          }}
        >
          <Box>{payment_method}</Box>
          <Box>৳{paid}</Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "8px!important",
            p: "3px 12px",
            fontWeight: 700
          }}
        >
          <Box>Due</Box>
          <Box>৳{to_be_paid}</Box>
        </Box>
        <DoubleDivider />
        <Box sx={{ fontSize: "7px !important", fontWeight: 700 }}>{createdDate}</Box>
      </Box>
    );
  }
);

const DoubleDivider = () => {
  return (
    <Fragment>
      <Box
        sx={{
          borderTop: "1px dashed black",
          width: "100%",
          padding: "1px 0",
          marginTop: "10px",
        }}
      />
      <Box
        sx={{
          borderTop: "1px dashed black",
          width: "100%",
          paddingBottom: "4px",
        }}
      />
    </Fragment>
  );
};
