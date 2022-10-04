import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { DoubleDivider } from "../components/OrderToPrint";
import { PrintContext } from "../context/PrintContext";

const PrintMemoPage = () => {
  const { value, setValue } = useContext(PrintContext);
  const {
    customer,
    paid,
    discount,
    payment_method,
    products,
    to_be_paid,
    createdDate,
  } = value;

  const router = useRouter();

  useEffect(() => {
    if (value.customer) {
      window.print();
      router.push("/orders").then();
    }
    setValue({});
  }, []);

  return (
    <Box
      sx={{
        "@page": {
          size: "80mm",
          margin: "0px",
        },
        padding: "2mm .6mm",
        display: "flex",
        flexDirection: "column",
        width: "75mm",
        // maxWidth: "78mm",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Noto Sans Bengali', sans-serif!important",
      }}
    >
      <Box
        sx={{
          fontSize: "14px !important",
          fontWeight: 900,
          // fontFamily: "'Poppins', sans-serif",
          fontFamily: "'Noto Sans Bengali', sans-serif!important",
        }}
      >
        নিউ আমজাদিয়া ভান্ডার
      </Box>
      <Box
        sx={{
          fontSize: "14px !important",
          fontWeight: 900,
        }}
      >
        ০১৮৭২৫০০৬৪৫ , ০১৭০৯২০২৫৮১
      </Box>
      <Box
        sx={{
          fontSize: "14px !important",
          fontWeight: 900,
          fontFamily: "'Noto Sans Bengali', sans-serif!important",
        }}
      >
        {customer}
      </Box>
      <DoubleDivider />
      {products?.map((product: any, i: number) => (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            p: "0px 12px",
          }}
          key={product?._id}
        >
          <Box>
            <Box
              sx={{
                fontSize: "14px !important",
                fontWeight: 900,
                fontFamily: "'Noto Sans Bengali', sans-serif!important",
              }}
            >
              {product?.name}
            </Box>
            <Box
              sx={{
                fontSize: "14px !important",
                fontWeight: 900,
                fontFamily: "'Noto Sans Bengali', sans-serif!important",
              }}
            >
              {product?.qty} X ৳{product?.sell_price}
            </Box>
          </Box>
          <Box
            sx={{
              fontSize: "14px !important",
              fontWeight: 900,
              fontFamily: "'Noto Sans Bengali', sans-serif!important",
              // "@media print": {
              //   fontSize: "14px !important",
              //   fontWeight: 900,
              //   fontFamily: "'Noto Sans Bengali', sans-serif!important",
              // },
            }}
          >
            ৳
            {parseFloat(
              (product?.sell_price * product?.qty).toString()
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
          fontSize: "14px!important",
          fontWeight: 900,
          fontFamily: "'Noto Sans Bengali', sans-serif!important",
          p: "3px 12px",
        }}
      >
        <Box
          sx={{
            fontSize: "14px!important",
            fontWeight: 900,
          }}
        >
          Discount
        </Box>
        <Box
          sx={{
            fontSize: "14px!important",
            fontWeight: 900,
          }}
        >
          ৳{parseFloat(discount?.toString()).toFixed(2)}
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px!important",
          p: "3px 12px",
          fontWeight: 900,
          fontFamily: "'Noto Sans Bengali', sans-serif!important",
        }}
      >
        <Box
          sx={{
            fontSize: "14px!important",
            fontWeight: 900,
          }}
        >
          Total
        </Box>
        <Box
          sx={{
            fontSize: "14px!important",
            fontWeight: 900,
          }}
        >
          ৳
          {parseFloat(
            products
              ?.reduce(
                (acc: any, curr: any) => acc + curr.sell_price * curr.qty,
                0
              )
              .toString()
          ).toFixed(2)}
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px!important",
          p: "3px 12px",
          fontWeight: 900,
          fontFamily: "'Noto Sans Bengali', sans-serif!important",
        }}
      >
        <Box
          sx={{
            fontSize: "14px!important",
            fontWeight: 900,
          }}
        >
          {payment_method}
        </Box>
        <Box
          sx={{
            fontSize: "14px!important",
            fontWeight: 900,
          }}
        >
          ৳{parseFloat(paid?.toString()).toFixed(2)}
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px!important",
          p: "3px 12px",
          fontWeight: 900,
          fontFamily: "'Noto Sans Bengali', sans-serif!important",
        }}
      >
        <Box
          sx={{
            fontSize: "14px!important",
            fontWeight: 900,
          }}
        >
          Due
        </Box>
        <Box
          sx={{
            fontSize: "14px!important",
            fontWeight: 900,
          }}
        >
          ৳{parseFloat(to_be_paid?.toString()).toFixed(2)}
        </Box>
      </Box>
      <DoubleDivider />
      <Box
        sx={{
          fontSize: "14px !important",
          fontWeight: 900,
        }}
      >
        {createdDate}
      </Box>
    </Box>
  );
};

export default PrintMemoPage;
