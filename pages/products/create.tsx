import LoadingButton from "@mui/lab/LoadingButton";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { createProduct } from "../../apis/product-service";
import Layout from "../../components/Layout/Layout";
import { useBrands } from "../../hooks/useBrands";
import { useCategories } from "../../hooks/useCategories";
import useDebounce from "../../hooks/useDebounce";

type Props = {};

function Create({}: Props) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [brandName, setBrandName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const debouncedCategoryName = useDebounce(categoryName, 500);
  const debouncedBrandName = useDebounce(brandName, 500);
  const queryClient = useQueryClient();

  // Data
  const { data: brands, isLoading: brandLoading } = useBrands({
    searchTerm: debouncedBrandName,
  });
  const { data: categories, isLoading: categoryLoading } = useCategories({
    searchTerm: debouncedCategoryName,
  });

  // Create Product
  const { mutateAsync, isLoading } = useMutation(
    "createProduct",
    createProduct,
    {
      onSuccess: (data) => {
        toast.success(data?.message || "Product created successfully");
        reset();
        queryClient.invalidateQueries(["products"]);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Something wen't wrong");
      },
    }
  );

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    data.category = selectedCategory;
    data.brand = selectedBrand;
    data.qty = 0;
    data.buy_price = 0;
    data.sell_price = 0;

    await mutateAsync(data);
  };

  return (
    <Layout>
      <Box maxWidth="800px">
        <Typography variant="h6" gutterBottom>
          Register New Product
        </Typography>
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
            {/* <Grid item xs={12} sm={6}>
              <Button fullWidth variant="contained" component="label">
                <label htmlFor="files" style={{ width: "100%" }}>
                  Please choose a image
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
            <Grid item xs={12} sm={6}>
              <ButtonGroup>
                <LoadingButton
                  color="success"
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                >
                  Submit
                </LoadingButton>
                <Button color="error">
                  <Link href="/products">Cancel</Link>
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Layout>
  );
}

export default Create;
