import { LoadingButton } from "@mui/lab";
import { Autocomplete, Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { InfiniteData, useInfiniteQuery, useMutation } from "react-query";
import { toast } from "react-toastify";
import { getAndSearchProduct, Products } from "../../apis/product-service";
import { createPurchase } from "../../apis/purchase-service";
import { getSupplier, Suppliers } from "../../apis/supplier-service";
import Layout from "../../components/Layout/Layout";

import useFormPersist from "react-hook-form-persist";
import usePurchaseStore from "../../store/purchaseStore";

const PurchaseCreate = () => {
  const { purchaseForm, setPurchaseForm } = usePurchaseStore((state) => ({
    purchaseForm: state.purchaseFrom,
    setPurchaseForm: state.setPurchaseForm,
  }));

  const { register, control, watch, handleSubmit, setValue, reset, getValues } = useForm({
    defaultValues: purchaseForm,
    mode: "onBlur",
  });

  useFormPersist("purchase-create", {
    watch,
    setValue,
    storage: window.localStorage,
  });

  watch();

  useEffect(() => {
    ///@ts-ignore-next-line
    watch((value, { name, type }) => setPurchaseForm(value));
  }, [watch, setPurchaseForm]);

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
      to_be_paid: 0,
      paid: 0,
      payment_method: "cash",
    });
    setValue("products", [{ name: "", qty: 1, buy_price: 0, sell_price: 0, _id: "" }]);
    setValue("supplier", "");
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
                  defaultValue={purchaseForm.supplier ? purchaseForm.supplier : ""}
                  value={purchaseForm.supplier ? purchaseForm.supplier : ""}
                  onChange={(e, value) => {
                    value
                      ? setPurchaseForm({
                          ...purchaseForm,
                          supplier: value,
                        })
                      : setPurchaseForm({ ...purchaseForm, supplier: "" });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="suppliers" {...register(`supplier`)} required />
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
                        onChange={(e, value) => {
                          if (value) {
                            setValue(`products.${index}.name`, value.name);
                            setValue(`products.${index}._id`, value._id);
                            setValue(`products.${index}.buy_price`, value.buy_price);
                            setValue(`products.${index}.sell_price`, value.sell_price);
                          }
                        }}
                        defaultValue={getValues(`products.${index}`)}
                        value={getValues(`products.${index}`)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            placeholder="search products"
                            {...register(`products.${index}.name`)}
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
                        {...register(`products.${index}.qty`)}
                        fullWidth
                        inputProps={{
                          step: "any",
                          min: 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                      <TextField
                        placeholder="value"
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
                        placeholder="value"
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
                <ButtonGroup>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setProductName("");
                      append({
                        name: "",
                        qty: 0,
                        sell_price: 0,
                        buy_price: 0,
                      });
                    }}
                  >
                    ADD PRODUCT
                  </Button>
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
