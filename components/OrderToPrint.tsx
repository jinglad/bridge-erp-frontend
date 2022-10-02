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
            // fontSize: "9px",
            fontWeight: "medium !important",
            fontFamily: "Poppins",
          },
        }}
      >
        <Box
          sx={{
            fontSize: "10px !important",
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            "@media print": {
              fontSize: "10px !important",
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
            },
          }}
        >
          নিউ আমজাদিয়া ভান্ডার
        </Box>
        <Box
          sx={{
            fontSize: "10px !important",
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            "@media print": {
              fontSize: "10px !important",
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
            },
          }}
        >
          ০১৮৭২৫০০৬৪৫ , ০১৭০৯২০২৫৮১
        </Box>
        <Box
          sx={{
            fontSize: "10px !important",
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            "@media print": {
              fontSize: "10px !important",
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
            },
          }}
        >
          {customer}
        </Box>
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
              <Box
                sx={{
                  fontSize: "10px !important",
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  "@media print": {
                    fontSize: "10px !important",
                    fontWeight: 700,
                    fontFamily: "'Poppins', sans-serif",
                  },
                }}
              >
                {product.name}
              </Box>
              <Box
                sx={{
                  fontSize: "10px !important",
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  "@media print": {
                    fontSize: "10px !important",
                    fontWeight: 700,
                    fontFamily: "'Poppins', sans-serif",
                  },
                }}
              >
                {product.qty} X ৳{product.sell_price}
              </Box>
            </Box>
            <Box
              sx={{
                fontSize: "10px !important",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                "@media print": {
                  fontSize: "10px !important",
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                },
              }}
            >
              ৳
              {parseFloat(
                (product.sell_price * product.qty).toString()
              ).toFixed(2)}
            </Box>
          </Box>
        ))}
        <DoubleDivider />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "9px!important",
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            p: "3px 12px",
          }}
        >
          <Box
            sx={{
              fontSize: "9px!important",
              fontWeight: 700,
              "@media print": {
                fontSize: "10px !important",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
              },
            }}
          >
            Discount
          </Box>
          <Box
            sx={{
              fontSize: "9px!important",
              fontWeight: 700,
              "@media print": {
                fontSize: "10px !important",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
              },
            }}
          >
            ৳{parseFloat(discount.toString()).toFixed(2)}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "9px!important",
            p: "3px 12px",
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <Box
            sx={{
              fontSize: "9px!important",
              fontWeight: 700,
              "@media print": {
                fontSize: "10px !important",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
              },
            }}
          >
            Total
          </Box>
          <Box
            sx={{
              fontSize: "9px!important",
              fontWeight: 700,
              "@media print": {
                fontSize: "10px !important",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
              },
            }}
          >
            ৳
            {parseFloat(
              products
                .reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)
                .toString()
            ).toFixed(2)}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "9px!important",
            p: "3px 12px",
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <Box
            sx={{
              fontSize: "9px!important",
              fontWeight: 700,
              "@media print": {
                fontSize: "10px !important",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
              },
            }}
          >
            {payment_method}
          </Box>
          <Box
            sx={{
              fontSize: "9px!important",
              fontWeight: 700,
              "@media print": {
                fontSize: "10px !important",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
              },
            }}
          >
            ৳{parseFloat(paid.toString()).toFixed(2)}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "9px!important",
            p: "3px 12px",
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <Box
            sx={{
              fontSize: "9px!important",
              fontWeight: 700,
              "@media print": {
                fontSize: "10px !important",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
              },
            }}
          >
            Due
          </Box>
          <Box
            sx={{
              fontSize: "9px!important",
              fontWeight: 700,
              "@media print": {
                fontSize: "10px !important",
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
              },
            }}
          >
            ৳{parseFloat(to_be_paid.toString()).toFixed(2)}
          </Box>
        </Box>
        <DoubleDivider />
        <Box
          sx={{
            fontSize: "10px !important",
            fontWeight: 700,
            "@media print": {
              fontSize: "10px !important",
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
            },
          }}
        >
          {createdDate}
        </Box>
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
