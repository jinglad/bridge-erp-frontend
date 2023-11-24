import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { Router, useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import { PrintContext } from "../context/PrintContext";
import { OrderToPrint } from "./OrderToPrint";
import { IOrder } from "../interfaces/order.interface";

interface ViewOrderProps {
  order: IOrder;
  open: boolean;
  onClose: () => void;
}

function ViewOrder({ onClose, open, order }: ViewOrderProps) {
  const componentRef = useRef(null);
  const [printOpen, setPrintOpen] = useState(false);
  const router = useRouter();
  const { setValue } = useContext(PrintContext);

  const pageStyle = `
  @page {
    size: 80mm auto;
    margin: 0;
    padding: 0;
  }
`;

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef]);

  // const handlePrint = useReactToPrint({
  //   content: reactToPrintContent,
  //   documentTitle: "AwesomeFileName",
  //   removeAfterPrint: true,
  //   pageStyle: pageStyle,
  // });

  const handlePrint = () => {
    setValue({
      payment_method: order.payment_method,
      discount: Number(order.discount),
      paid: Number(order.paid),
      to_be_paid: order.to_be_paid,
      products: order.products,
      customer: order?.customer?.customerName,
      createdDate: moment(order.createdDate).format("ddd MMM D YYYY"),
    });
    router.push("/print-memo").then();
  };

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">Order Details</Typography>
          <IconButton color="error" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table size="small" aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell sx={{ maxWidth: "50px", fontWeight: "bold" }}>
                  Customer:
                </TableCell>
                <TableCell>{order?.customer?.customerName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ maxWidth: "50px", fontWeight: "bold" }}>
                  Payment method:
                </TableCell>
                <TableCell>{order.payment_method}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ maxWidth: "50px", fontWeight: "bold" }}>
                  Paid:
                </TableCell>
                <TableCell>{order.paid}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ maxWidth: "50px", fontWeight: "bold" }}>
                  Buy_Price_Total:
                </TableCell>
                <TableCell>{order?.buy_total}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ maxWidth: "50px", fontWeight: "bold" }}>
                  To be paid:
                </TableCell>
                <TableCell>{order.to_be_paid}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ maxWidth: "50px", fontWeight: "bold" }}>
                  Discount:
                </TableCell>
                <TableCell>{order.discount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          sx={{ marginLeft: "16px", paddingTop: "10px" }}
          variant="h6"
        >
          Products
        </Typography>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Buy Price</TableCell>
                <TableCell>Sell Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.qty}</TableCell>
                  <TableCell>{product.buy_price}</TableCell>
                  <TableCell>{product.sell_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <DialogActions>
          <Button onClick={handlePrint}>Print</Button>
          <Button color="error" onClick={onClose}>
            close
          </Button>
        </DialogActions>
      </DialogContent>
      {/* <OrderToPrint
        ref={componentRef}
        payment_method={order.payment_method}
        discount={Number(order.discount)}
        paid={Number(order.paid)}
        to_be_paid={order.to_be_paid}
        products={order.products}
        customer={order.customer}
        createdDate={moment(order.createdDate).format("ddd MMM D YYYY")}
      /> */}
    </Dialog>
  );
}

export default ViewOrder;
