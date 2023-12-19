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
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createOrder } from "../apis/order-service";
import { IProduct } from "../apis/product-service";
import { PrintContext } from "../context/PrintContext";
import { ICustomer } from "../apis/customer-service";

type PaymentDetailsDialogProps = {
  cartItems: IProduct[];
  customerId: ICustomer;
  onSuccess: () => void;
};

const PaymentDetailsDialog = ({
  cartItems,
  customerId,
  onSuccess,
}: PaymentDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { mutateAsync, isLoading } = useMutation("createOrder", createOrder, {
    onSuccess: (data) => {
      // toast.success(data.msg);
      handlePrint();
      reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response.data.msg);
    },
  });

  const { register, handleSubmit, reset, setValue, getValues, watch } = useForm(
    {
      defaultValues: {
        payment_method: "cash",
        discount: 0,
        paid: 0,
        to_be_paid: 0,
      },
    }
  );
  const watchDiscount = watch("discount"); // you can supply default value as second argument

  useEffect(() => {
    setValue(
      "paid",
      Number(
        (
          cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0) -
          watchDiscount
        ).toFixed(2)
      )
    );
  }, [watchDiscount, cartItems, setValue]);

  const onSubmit = async (data: any) => {
    //check if qty is available

    let isValid = true;

    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].qty > Number(cartItems[i]?.available)) {
        toast.error("Quantity not available for " + cartItems[i].name);
        isValid = false;
      }
    }

    if (!isValid) {
      handleClose();
      return;
    }

    const newOrder = {
      payment_method: data.payment_method,
      discount: Number(data.discount),
      paid: Number(parseFloat(data.paid).toFixed(2)),
      to_be_paid: Number(
        parseFloat(
          (
            cartItems.reduce(
              (acc, curr) => acc + curr.sell_price * curr.qty,
              0
            ) - Number(data.paid)
          ).toString()
        ).toFixed(2)
      ),
      buy_total: Number(
        parseFloat(
          cartItems
            .reduce((acc, curr) => acc + curr.buy_price * curr.qty, 0)
            .toString()
        ).toFixed(2)
      ),
      products: cartItems?.map((item) => ({
        ...item,
        category: item.category?._id,
        brand: item.brand?._id,
      })),
      customer: customerId?._id,
      converted_date: new Date(),
      createdDate: new Date().toDateString(),
      // createdDate: moment(new Date()).format("ddd MMM D YYYY"),
    };
    // console.log(newOrder);
    await mutateAsync(newOrder);
    handleClose();
  };

  const componentRef = useRef(null);

  const router = useRouter();
  const { setValue: setPrint } = useContext(PrintContext);

  const pageStyle = `
  @page {
    size: 80mm auto;
    margin: 0;
    padding: 10px 15px;
  }
`;

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef]);

  // const handlePrint = useReactToPrint({
  //   // content: reactToPrintContent,
  //   // documentTitle: "AwesomeFileName",
  //   // removeAfterPrint: true,
  //   // pageStyle: pageStyle,
  // });

  const handlePrint = () => {
    setPrint({
      payment_method: getValues("payment_method"),
      discount: Number(getValues("discount")),
      paid: Number(getValues("paid")),
      to_be_paid:
        cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0) -
        Number(getValues("paid")),
      products: cartItems,
      customer: customerId?.customerName,
      createdDate: moment(new Date()).format("ddd MMM D YYYY"),
    });
    router.push("/print-memo").then();
  };

  return (
    <>
      <Button
        sx={{ marginTop: ".5rem" }}
        onClick={() => {
          if (!customerId) {
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
                      <TableCell>
                        {parseFloat(
                          (product.sell_price * product.qty).toString()
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {parseFloat(
                          (product.sell_price * product.qty).toString()
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      rowSpan={4}
                      sx={{ maxWidth: "200px" }}
                    >
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
                              min: 0,
                              max: Math.ceil(
                                cartItems.reduce(
                                  (acc, curr) =>
                                    acc + curr.sell_price * curr.qty,
                                  0
                                ) - watchDiscount
                              ),
                              step: "any",
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
                              max: cartItems.reduce(
                                (acc, curr) => acc + curr.sell_price * curr.qty,
                                0
                              ),
                              step: "any",
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
                              {["Cash", "Bkash", "Rocket", "Nagad", "IIBL"].map(
                                (method: string) => (
                                  <MenuItem key={method} value={method}>
                                    {method}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </TableCell>

                    <TableCell colSpan={2}>GrandTotal : </TableCell>

                    <TableCell>
                      {parseFloat(
                        cartItems
                          .reduce(
                            (acc, curr) => acc + curr.sell_price * curr.qty,
                            0
                          )
                          .toString()
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>Discount:</TableCell>
                    <TableCell>{watchDiscount}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2}>Net Total :</TableCell>
                    <TableCell id="netSalePrice">
                      {parseFloat(
                        (watchDiscount
                          ? cartItems.reduce(
                              (acc, curr) => acc + curr.sell_price * curr.qty,
                              0
                            ) - watchDiscount
                          : cartItems.reduce(
                              (acc, curr) => acc + curr.sell_price * curr.qty,
                              0
                            )
                        ).toString()
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {/* <OrderToPrint
              ref={componentRef}
              payment_method={getValues("payment_method")}
              discount={Number(getValues("discount"))}
              paid={Number(getValues("paid"))}
              to_be_paid={
                cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0) - Number(getValues("paid"))
              }
              products={cartItems}
              customer={customerName}
              createdDate={moment(new Date()).format("ddd MMM D YYYY")}
            /> */}
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={isLoading}
              autoFocus
              type="submit"
              variant="contained"
            >
              Complete Transaction
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PaymentDetailsDialog;
