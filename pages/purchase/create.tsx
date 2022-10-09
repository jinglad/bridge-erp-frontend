import { LoadingButton } from "@mui/lab";
import { Autocomplete, Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { InfiniteData, useInfiniteQuery, useMutation } from "react-query";
import { toast } from "react-toastify";
import { getAndSearchProduct, Products } from "../../apis/product-service";
import { createPurchase } from "../../apis/purchase-service";
import { getSupplier, Suppliers } from "../../apis/supplier-service";
import Layout from "../../components/Layout/Layout";
import { useTrackedPurchaseStore } from "../../store/purchaseStore";

const PurchaseCreate = () => {
  const { purchaseForm, setPurchaseForm, resetPurchaseForm } = useTrackedPurchaseStore();

  const { register, control, handleSubmit, setValue, watch, resetField } = useForm({
    defaultValues: purchaseForm,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  watch((data, { name, type }) => {
    //@ts-ignore-next-line
    setPurchaseForm(data);
  });

  const [productName, setProductName] = useState("");

  const { mutate, mutateAsync, isLoading } = useMutation("createPurchase", createPurchase, {
    onSuccess: async (data) => {
      toast.success(data.msg);
      resetField("products", {
        defaultValue: [{ name: "", qty: 0, sell_price: 0, buy_price: 0, _id: "" }],
      });
      resetField("supplier", {
        defaultValue: "",
      });
      resetPurchaseForm();
    },
    onError: (error: any) => {
      toast.error(error.response.data.msg);
    },
  });

  const onSubmit = async (data: any) => {
    await mutateAsync({
      ...data,
      to_be_paid: 0,
      paid: 0,
      payment_method: "cash",
    });
  };

  const { data, status } = useInfiniteQuery(["searchedProducts", productName], getAndSearchProduct, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length === lastPage.totalPages) {
        return undefined;
      } else {
        return pages.length;
      }
    },
  });

  const { data: spData, status: spStatus } = useInfiniteQuery(["suppliers", purchaseForm.supplier], getSupplier, {
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
                  onChange={(e, value) => {
                    if (value) {
                      setPurchaseForm({ ...purchaseForm, supplier: value });
                    }
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === "clear") {
                      setPurchaseForm({ ...purchaseForm, supplier: "" });
                    }
                    return;
                  }}
                  value={purchaseForm.supplier}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="suppliers"
                      {...register(`supplier`, {
                        onChange: (e) => {
                          setPurchaseForm({ ...purchaseForm, supplier: e.target.value });
                        },
                      })}
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
                        loading={status === "loading"}
                        options={getProductFormattedData(data)}
                        getOptionLabel={(option) => option.name}
                        onInputChange={(e, value) => {
                          setProductName(value);
                        }}
                        onChange={(e, value) => {
                          if (value) {
                            setValue(`products.${index}.name`, value.name);
                            setValue(`products.${index}._id`, value._id);
                            setValue(`products.${index}.buy_price`, Number(value.buy_price));
                            setValue(`products.${index}.sell_price`, Number(value.sell_price));
                            setProductName("");
                          }
                        }}
                        value={
                          purchaseForm.products !== undefined && purchaseForm.products[index]
                            ? purchaseForm.products[index]
                            : {
                                name: "",
                                qty: 0,
                                sell_price: 0,
                                buy_price: 0,
                                _id: index.toString(),
                              }
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
                        {...register(`products.${index}.qty`, {
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
                      <Button fullWidth color="error" variant="contained" onClick={() => remove(index)}>
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                );
              })}

              <Grid item xs={12} sm={12}>
                <ButtonGroup fullWidth>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setProductName("");
                      append(
                        {
                          name: "",
                          qty: 0,
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
                  <LoadingButton loading={isLoading} type="submit" variant="contained" color="success">
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
