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
import { useCustomer } from "../hooks/useCustomers";

type PaymentDetailsDialogProps = {
  cartItems: IProduct[];
  customerId: ICustomer;
  onSuccess: () => void;
};

export const totalAmount = (cartItems: IProduct[]) => {
  return cartItems.reduce((acc, curr) => acc + curr.sell_price * curr.qty, 0);
};

export const calculateNetTotal = (
  cartItems: IProduct[],
  discount: number = 0,
  previousDue: number = 0
) => {
  const total = totalAmount(cartItems);
  return total - discount + previousDue;
};

const PaymentDetailsDialog = ({
  cartItems,
  customerId,
  onSuccess,
}: PaymentDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: customerData, isLoading: customerDataLoading } = useCustomer(
    customerId?._id
  );

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
  const watchPaid = watch("paid");

  useEffect(() => {
    setValue(
      "paid",
      Number(
        calculateNetTotal(
          cartItems,
          watchDiscount,
          customerData?.data?.to_be_paid || 0
        ).toFixed(2)
      )
    );
  }, [watchDiscount, cartItems, setValue, customerData?.data?.to_be_paid]);

  const getTotalDue = (cartItems: IProduct[]) => {
    return Math.max(
      0,
      totalAmount(cartItems) -
        Number(getValues("discount")) -
        Number(getValues("paid"))
    );
  };

  const calculateTotalDueAmount = (
    cartItems: IProduct[],
    discount: number = 0,
    paid: number = 0,
    previousDue: number = 0
  ) => {
    const netTotal = calculateNetTotal(cartItems, discount, previousDue);
    return Math.max(0, netTotal - paid);
  };

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
      to_be_paid: Math.max(
        0,
        totalAmount(cartItems) -
          Number(getValues("discount")) -
          Number(getValues("paid"))
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
      customer: {
        id: customerId._id,
        to_be_paid: customerData?.data?.to_be_paid || 0,
      },
      converted_date: new Date(),
      createdDate: new Date().toDateString(),
      // createdDate: moment(new Date()).format("ddd MMM D YYYY"),
    };
    await mutateAsync(newOrder);
    handleClose();
  };

  const router = useRouter();
  const { setValue: setPrint } = useContext(PrintContext);

  const handlePrint = () => {
    setPrint({
      payment_method: getValues("payment_method"),
      discount: Number(getValues("discount")),
      paid: Number(getValues("paid")),
      to_be_paid: Math.max(
        0,
        totalAmount(cartItems) -
          Number(getValues("discount")) -
          Number(getValues("paid"))
      ),
      to_be_paid_total: calculateTotalDueAmount(
        cartItems,
        Number(getValues("discount")),
        Number(getValues("paid")),
        customerData?.data?.to_be_paid || 0
      ),
      previous_due: customerData?.data?.to_be_paid || 0,
      products: cartItems,
      netTotal: calculateNetTotal(
        cartItems,
        Number(getValues("discount")),
        customerData?.data?.to_be_paid || 0
      ),
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
                      rowSpan={5}
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
                                calculateNetTotal(
                                  cartItems,
                                  watchDiscount,
                                  customerData?.data?.to_be_paid || 0
                                )
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
                              max: calculateTotalDueAmount(
                                cartItems,
                                0,
                                0,
                                customerData?.data?.to_be_paid || 0
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
                    <TableCell colSpan={2}>Previous Due:</TableCell>
                    <TableCell>
                      {Math.max(0, customerData?.data?.to_be_paid || 0)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>Current Due:</TableCell>
                    <TableCell>
                      {Math.max(
                        0,
                        totalAmount(cartItems) - watchDiscount - watchPaid
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>Total Due:</TableCell>
                    <TableCell>
                      {calculateTotalDueAmount(
                        cartItems,
                        watchDiscount,
                        watchPaid,
                        customerData?.data?.to_be_paid || 0
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2}>Net Total :</TableCell>
                    <TableCell id="netSalePrice">
                      {parseFloat(
                        calculateNetTotal(
                          cartItems,
                          watchDiscount,
                          customerData?.data?.to_be_paid || 0
                        ).toString()
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
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
