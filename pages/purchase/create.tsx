import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createPurchase } from "../../apis/purchase-service";
import { ISupplier } from "../../apis/supplier-service";
import Layout from "../../components/Layout/Layout";
import useDebounce from "../../hooks/useDebounce";
import { useProducts } from "../../hooks/useProducts";
import { useSuppliers } from "../../hooks/useSuppliers";
import { useTrackedPurchaseStore } from "../../store/purchaseStore";

const PurchaseCreate = () => {
  const [productName, setProductName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const debouncedSupplierName = useDebounce(supplierName, 500);
  const debouncedProductName = useDebounce(productName, 500);

  const { purchaseForm, setPurchaseForm, resetPurchaseForm } =
    useTrackedPurchaseStore();

  const { register, control, handleSubmit, setValue, watch, resetField } =
    useForm({
      defaultValues: purchaseForm,
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  // watch((data, { name, type }) => {
  //   //@ts-ignore-next-line
  //   setPurchaseForm(data);
  // });

  const { mutate, mutateAsync, isLoading } = useMutation(
    "createPurchase",
    createPurchase,
    {
      onSuccess: async (data) => {
        toast.success(data.msg);
        resetField("products", {
          defaultValue: [
            { name: "", purchase_qty: 0, sell_price: 0, buy_price: 0, _id: "" },
          ],
        });
        resetField("supplier", {
          defaultValue: "",
        });
        resetPurchaseForm();
      },
      onError: (error: any) => {
        toast.error(error.response.data.msg);
      },
    }
  );

  const onSubmit = async (data: any) => {
    const inputData = {
      ...data,
      supplier: data.supplier._id,
      to_be_paid: data.products.reduce(
        (acc: number, cur: any) => acc + cur.buy_price * cur.purchase_qty,
        0
      ),
      paid: 0,
      createdDate: new Date().toDateString(),
      converted_date: new Date().toISOString(),
      payment_method: "cash",
    };
    await mutateAsync(inputData);
  };

  const { data: productsData, isLoading: productsLoading } = useProducts({
    searchTerm: debouncedProductName,
  });

  const { data: spData, isLoading: spLoading } = useSuppliers({
    searchTerm: debouncedSupplierName,
  });

  return (
    <Layout>
      <Grid container spacing={3} columns={12}>
        <Grid item xs={12} sm={12} lg={6} md={12}>
          <Typography variant="h6" gutterBottom>
            Purchase Product From Here
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container item spacing={3}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  loading={spLoading}
                  options={spData?.data || []}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(e, value) => {
                    if (value) {
                      console.log(value);
                      setPurchaseForm({ ...purchaseForm, supplier: value });
                      setSupplierName("");
                    }
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    // if (reason === "clear") {
                    //   setPurchaseForm({ ...purchaseForm, supplier: "" });
                    // }
                    setSupplierName(newInputValue);
                  }}
                  value={
                    purchaseForm?.supplier !== undefined &&
                    purchaseForm?.supplier
                      ? purchaseForm?.supplier
                      : ({ name: "", _id: "" } as ISupplier)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="suppliers"
                      {...register(`supplier`)}
                      required
                    />
                  )}
                />
              </Grid>
              {fields.map((field, index) => {
                return (
                  <Grid item container key={field.id} spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Autocomplete
                        loading={productsLoading}
                        options={productsData?.data || []}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        onInputChange={(e, value) => {
                          setProductName(value);
                        }}
                        onChange={(e, value) => {
                          if (value) {
                            // setValue(`products.${index}.name`, value.name);
                            // setValue(`products.${index}._id`, value._id);
                            // setValue(
                            //   `products.${index}.buy_price`,
                            //   Number(value.buy_price)
                            // );
                            // setValue(
                            //   `products.${index}.sell_price`,
                            //   Number(value.sell_price)
                            // );
                            setPurchaseForm({
                              ...purchaseForm,
                              products: purchaseForm.products?.map((p, i) => {
                                if (i === index) {
                                  return {
                                    ...p,
                                    name: value.name,
                                    _id: value._id,
                                    buy_price: Number(value.buy_price),
                                    sell_price: Number(value.sell_price),
                                  };
                                }
                                return p;
                              }),
                            });
                            setProductName("");
                          }
                        }}
                        value={
                          purchaseForm.products !== undefined &&
                          purchaseForm.products[index]
                            ? purchaseForm.products[index]
                            : ({
                                name: "",
                                purchase_qty: 0,
                                sell_price: 0,
                                buy_price: 0,
                                _id: index.toString(),
                              } as any)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="search products"
                            {...register(`products.${index}.name`)}
                            required
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <TextField
                        placeholder="quantity"
                        label="Purchase Quantity"
                        type="number"
                        required
                        {...register(`products.${index}.purchase_qty`, {
                          valueAsNumber: true,
                        })}
                        fullWidth
                        inputProps={{
                          step: "any",
                          min: 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <TextField
                        type="number"
                        label="Purchase Per Unit"
                        required
                        {...register(`products.${index}.buy_price`)}
                        fullWidth
                        inputProps={{
                          step: "any",
                          min: 0,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <TextField
                        label="Sells Per Unit"
                        type="number"
                        required
                        {...register(`products.${index}.sell_price`)}
                        fullWidth
                        inputProps={{
                          step: "any",
                          min: 0,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <Button
                        fullWidth
                        color="error"
                        variant="contained"
                        onClick={() => remove(index)}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                );
              })}

              <Grid item xs={12} sm={12}>
                <TextField
                  label="Total Paid"
                  type="number"
                  required
                  sx={{
                    "*": {
                      color: "black !important",
                      WebkitTextFillColor: "black !important",
                    },
                  }}
                  disabled
                  value={watch("products").reduce((acc: number, cur: any) => {
                    return acc + cur.purchase_qty * cur.buy_price;
                  }, 0)}
                  fullWidth
                  inputProps={{
                    step: "any",
                    min: 0,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <ButtonGroup fullWidth>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setProductName("");
                      append(
                        {
                          name: "",
                          purchase_qty: 0,
                          sell_price: 0,
                          buy_price: 0,
                          _id: fields.length.toString(),
                        },
                        {
                          focusName: `products.${fields.length}.name`,
                        }
                      );
                    }}
                  >
                    ADD PRODUCT
                  </Button>
                  <LoadingButton
                    loading={isLoading}
                    type="submit"
                    variant="contained"
                    color="success"
                  >
                    Submit
                  </LoadingButton>
                </ButtonGroup>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default PurchaseCreate;
