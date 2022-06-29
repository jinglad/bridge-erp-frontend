import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createOrder } from "../apis/order-service";
import { Product } from "../apis/product-service";

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
      reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response.data.msg);
    },
  });

  const { register, handleSubmit, reset, setValue, getValues, watch } = useForm();
  const watchDiscount = watch("discount", false); // you can supply default value as second argument

  const onSubmit = async (data: any) => {
    await mutateAsync({ ...data, products: cartItems, customer: customerName });
    handleClose();
  };

  return (
    <>
      <Button
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
                            type="number"
                            label="Discount"
                            variant="outlined"
                            fullWidth
                            required
                            defaultValue={0}
                            {...register(`discount`)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            type="number"
                            defaultValue={cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)}
                            label="Paid"
                            variant="outlined"
                            fullWidth
                            required
                            {...register(`paid`)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            defaultValue={cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0)}
                            type="number"
                            label="To be paid"
                            variant="outlined"
                            fullWidth
                            {...register(`to_be_paid`)}
                            required
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            onInputChange={(e, value) => {
                              setValue("payment_method", value);
                            }}
                            fullWidth
                            defaultValue={getValues("payment_method")}
                            options={["Bkash", "Rocket", "Nagad", "IIBL"]}
                            renderInput={(params) => (
                              <TextField
                                required
                                {...params}
                                {...register(`payment_method`)}
                                label="Payment Method"
                                variant="outlined"
                              />
                            )}
                          />
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
