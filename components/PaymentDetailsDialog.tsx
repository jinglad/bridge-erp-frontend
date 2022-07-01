import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
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
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { createOrder } from "../apis/order-service";
import { Product } from "../apis/product-service";
import { OrderToPrint } from "./OrderToPrint";

type PaymentDetailsDialogProps = {
  cartItems: Product[];
  customerName: string;
  onSuccess: () => void;
};

const PaymentDetailsDialog = ({ cartItems, customerName, onSuccess }: PaymentDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { mutateAsync, isLoading } = useMutation("createOrder", createOrder, {
    onSuccess: (data) => {
      toast.success(data.msg);
      // handlePrint();
      reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response.data.msg);
    },
  });

  const { register, handleSubmit, reset, setValue, getValues, watch } = useForm({
    defaultValues: {
      payment_method: "cash",
      discount: 0,
      paid: 0,
      to_be_paid: 0,
    },
  });
  const watchDiscount = watch("discount"); // you can supply default value as second argument

  useEffect(() => {
    setValue("paid", cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0) - watchDiscount);
  }, [watchDiscount, cartItems, setValue]);

  const onSubmit = async (data: any) => {
    await mutateAsync({
      payment_method: data.payment_method,
      discount: Number(data.discount),
      paid: Number(data.paid),
      to_be_paid: cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0) - Number(data.paid),
      products: cartItems,
      customer: customerName,
    });
    handleClose();
  };

  const componentRef = useRef(null);

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

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    removeAfterPrint: true,
    pageStyle: pageStyle,
  });

  return (
    <>
      <Button
        sx={{ marginTop: ".5rem" }}
        onClick={() => {
          if (!customerName) {
            toast.error("Please select a customer");
          } else {
            handleOpen();
          }
        }}
        fullWidth
        disabled={cartItems.length === 0}
      >
        Pay Now
      </Button>
      <Dialog maxWidth="md" onClose={handleClose} fullWidth open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    <TableCell>Sub</TableCell>
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
                      <TableCell>{product.sell_price * product.qty}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} rowSpan={4} sx={{ maxWidth: "200px" }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            {...register(`paid`)}
                            type="number"
                            label="Paid"
                            variant="outlined"
                            fullWidth
                            required
                            inputProps={{
                              defaultValue: cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0),
                              min: 0,
                              max: cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0) - watchDiscount,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            type="number"
                            label="Discount"
                            variant="outlined"
                            fullWidth
                            required
                            defaultValue={0}
                            inputProps={{
                              min: 0,
                              max: cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0),
                            }}
                            {...register(`discount`)}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                              {...register(`payment_method`)}
                              defaultValue="Cash"
                              size="small"
                              label="Payment Method"
                            >
                              {["Cash", "Bkash", "Rocket", "Nagad", "IIBL"].map((method: string) => (
                                <MenuItem key={method} value={method}>
                                  {method}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </TableCell>

                    <TableCell colSpan={2}>GrandTotal : </TableCell>

                    <TableCell>{cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>Discount:</TableCell>
                    <TableCell>{watchDiscount}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2}>Net Total :</TableCell>
                    <TableCell id="netSalePrice">
                      {watchDiscount
                        ? cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0) - watchDiscount
                        : cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <OrderToPrint
              ref={componentRef}
              payment_method={getValues("payment_method")}
              discount={Number(getValues("discount"))}
              paid={Number(getValues("paid"))}
              to_be_paid={
                cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0) - Number(getValues("paid"))
              }
              products={cartItems}
              customer={customerName}
            />
          </DialogContent>
          <DialogActions>
            <LoadingButton loading={isLoading} autoFocus type="submit" variant="contained">
              Complete Transaction
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PaymentDetailsDialog;
