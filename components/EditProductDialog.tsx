import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { IProduct, updateProduct } from "../apis/product-service";
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useBrands } from "../hooks/useBrands";
import { useCategories } from "../hooks/useCategories";

interface EditProductDialogProps {
  product: IProduct;
  open: boolean;
  onClose: () => void;
}

function EditProductDialog({ onClose, open, product }: EditProductDialogProps) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [brandName, setBrandName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const debouncedCategoryName = useDebounce(categoryName, 500);
  const debouncedBrandName = useDebounce(brandName, 500);

  // Data
  const { data: brands, isLoading: brandLoading } = useBrands({
    searchTerm: debouncedBrandName,
  });
  const { data: categories, isLoading: categoryLoading } = useCategories({
    searchTerm: debouncedCategoryName,
  });

  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(updateProduct, {
    onSuccess: (data) => {
      toast.success(data?.message || "Product updated successfully");
      queryClient.invalidateQueries(["products"]);
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something wen't wrong");
    },
  });

  const { register, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      name: product.name,
      brand: product.brand,
      category: product.category,
      reorder_limit: product.reorder_limit,
      file: "",
      sell_price: product.sell_price,
      buy_price: product.buy_price,
      qty: product.qty,
    },
  });

  const onSubmit = async (data: any) => {
    data.category = selectedCategory;
    data.brand = selectedBrand;

    await mutateAsync({
      id: product._id,
      info: data,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} scroll="body" fullScreen>
      <Container maxWidth="md">
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="productName"
                  label="Product Name"
                  fullWidth
                  {...register("name")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  loading={categoryLoading}
                  options={categories?.data || []}
                  getOptionLabel={(category) => category?.categorytitle}
                  defaultValue={product?.category}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onInputChange={(e, value) => {
                    setCategoryName(value);
                  }}
                  onChange={(e, value) => {
                    if (value) {
                      setSelectedCategory(value._id);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Search category" required />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  loading={brandLoading}
                  options={brands?.data || []}
                  getOptionLabel={(brand) => brand?.brandtitle}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onInputChange={(e, value) => {
                    setBrandName(value);
                  }}
                  onChange={(e, value) => {
                    if (value) {
                      setSelectedBrand(value._id);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Search brand" required />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  required
                  type="number"
                  id="reOrderLimit"
                  label="ReOrder Limit"
                  fullWidth
                  {...register("reorder_limit")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  label="Buy price"
                  required
                  {...register("buy_price")}
                  fullWidth
                  inputProps={{
                    step: "any",
                    min: 0,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  label="Sell price"
                  required
                  {...register("sell_price")}
                  fullWidth
                  inputProps={{
                    step: "any",
                    min: 0,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  required
                  type="number"
                  label="Qty"
                  fullWidth
                  {...register("qty")}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <Button fullWidth variant="contained" component="label">
                  <label htmlFor="files" style={{ width: "100%" }}>
                    {getValues("file")[0]
                      ? (getValues("file")[0] as any).name
                      : "Please choose a image"}
                  </label>
                  <input
                    id="files"
                    style={{
                      opacity: 0,
                    }}
                    {...register("file")}
                    type="file"
                    accept="image/*"
                  />
                </Button>
              </Grid> */}
              <Grid item xs={12} sm={6} sx={{ textAlign: "start" }}>
                <ButtonGroup>
                  <LoadingButton
                    color="success"
                    variant="contained"
                    type="submit"
                    loading={isLoading}
                  >
                    Submit
                  </LoadingButton>
                  <Button color="error" onClick={onClose}>
                    Cancel
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Container>
    </Dialog>
  );
}

export default EditProductDialog;
