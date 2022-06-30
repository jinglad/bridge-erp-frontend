import { LoadingButton } from "@mui/lab";
import { Autocomplete, Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { InfiniteData, useInfiniteQuery, useMutation } from "react-query";
import { toast } from "react-toastify";
import { getAndSearchProduct, Products } from "../../apis/product-service";
import { createPurchase } from "../../apis/purchase-service";
import { getSupplier, Suppliers } from "../../apis/supplier-service";
import Layout from "../../components/Layout/Layout";

const PurchaseCreate = () => {
  const { register, control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      products: [{ name: undefined, qty: 1, buy_price: 0, sell_price: 0, _id: "" }],
      supplier: "",
      to_be_paid: 0,
      paid: 0,
      payment_method: "",
    },
    mode: "onBlur",
  });

  const {
    mutateAsync,
    isLoading,
    reset: resetQ,
  } = useMutation("createPurchase", createPurchase, {
    onSuccess: (data) => {
      toast.success(data.msg);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response.data.msg);
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "products",
    control,
  });
  const onSubmit = async (data: any) => {
    await mutateAsync({
      ...data,
      to_be_paid: Number(data.to_be_paid),
      paid: Number(data.paid),
    });
  };

  const [productName, setProductName] = useState("");

  const { data, status } = useInfiniteQuery(["searchedProducts", productName], getAndSearchProduct, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length === lastPage.totalPages) {
        return undefined;
      } else {
        return pages.length;
      }
    },
  });

  const [supplierName, setSupplierName] = useState("");

  const { data: spData, status: spStatus } = useInfiniteQuery(["suppliers", supplierName], getSupplier, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length === lastPage.totalPages) {
        return undefined;
      } else {
        return pages.length;
      }
    },
  });

  const getSupplierFormattedData = (data: InfiniteData<Suppliers> | undefined) => {
    const brands = data?.pages.flatMap((page) => page.supplier.map((sp) => sp.name));
    return [...new Set(brands)];
  };

  const getProductFormattedData = (data: InfiniteData<Products> | undefined) => {
    const productName = data?.pages.flatMap((page) => page.products);
    return productName || [];
  };

  const router = useRouter();

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
                  loading={spStatus === "loading"}
                  options={getSupplierFormattedData(spData)}
                  onInputChange={(e, value) => {
                    setSupplierName(value);
                  }}
                  renderInput={(params) => <TextField {...params} placeholder="suppliers" {...register(`supplier`)} />}
                />
              </Grid>
              {fields.map((field, index) => {
                return (
                  <Grid item container key={field.id} spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Autocomplete
                        loading={status === "loading"}
                        options={getProductFormattedData(data)}
                        getOptionLabel={(option) => option.name}
                        onInputChange={(e, value) => {
                          setProductName(value);
                          setProductName("");
                        }}
                        onChange={(e, value) => {
                          if (value) {
                            setValue(`products.${index}._id`, value._id);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="search products"
                            {...register(`products.${index}.name` as const, {
                              required: true,
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <TextField
                        placeholder="quantity"
                        label="Purchase Quantity"
                        type="number"
                        {...register(`products.${index}.qty` as const, {
                          valueAsNumber: true,
                          required: true,
                        })}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <TextField
                        placeholder="value"
                        type="number"
                        label="Purchase Per Unit"
                        {...register(`products.${index}.buy_price` as const, {
                          valueAsNumber: true,
                          required: true,
                        })}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <TextField
                        label="Sells Per Unit"
                        placeholder="value"
                        type="number"
                        {...register(`products.${index}.sell_price` as const, {
                          valueAsNumber: true,
                          required: true,
                        })}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <Button fullWidth color="error" variant="contained" onClick={() => remove(index)}>
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                );
              })}
              <Grid item xs={12} sm={12} justifySelf="start">
                <Button
                  variant="contained"
                  onClick={() => {
                    setProductName("");
                    append({
                      name: undefined,
                      qty: 0,
                      sell_price: 0,
                      buy_price: 0,
                    });
                  }}
                >
                  ADD PRODUCT
                </Button>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  {...register("to_be_paid")}
                  type="number"
                  required
                  id="to_be_paid"
                  label="Amount to be paid"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  {...register("paid")}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  required
                  type="number"
                  id="paid"
                  label="Paid Amount"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  disablePortal
                  onInputChange={(e, value) => {
                    setValue("payment_method", value);
                  }}
                  options={["Bkash", "Rocket", "Nagad", "IIBL"]}
                  renderInput={(params) => <TextField {...params} label="Payment Method" />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonGroup>
                  <LoadingButton loading={isLoading} type="submit" variant="contained" color="success">
                    Submit
                  </LoadingButton>
                  <Button
                    color="error"
                    onClick={() => {
                      resetQ();
                      router.push("/purchase");
                    }}
                  >
                    Cancel
                  </Button>
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
