import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InfiniteData, useInfiniteQuery, useMutation } from "react-query";
import { toast } from "react-toastify";
import { Brands, getBrands } from "../../apis/brand-service";
import { Categories, getCategories } from "../../apis/category-service";
import { createProduct } from "../../apis/product-service";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Create({}: Props) {
  const [brandName, setBrandName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const { mutateAsync, isLoading } = useMutation("createProduct", createProduct, {
    onSuccess: (data) => {
      toast.success(data.msg);
      reset();
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("brand", brandName);
    formData.append("category", categoryName);
    formData.append("reorder_limit", data.reorder_limit);
    formData.append("file", data.file[0]);

    await mutateAsync(formData);
  };

  const { data, status } = useInfiniteQuery(["brands", brandName], getBrands, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length === lastPage.totalPages) {
        return undefined;
      } else {
        return pages.length;
      }
    },
  });

  const { data: catData, status: catStatus } = useInfiniteQuery(["categories", categoryName], getCategories, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length === lastPage.totalPages) {
        return undefined;
      } else {
        return pages.length;
      }
    },
  });

  const getBrandFormattedData = (data: InfiniteData<Brands> | undefined) => {
    const brandName = data?.pages.flatMap((page) => page.brands.map((brand) => brand.brandtitle));
    return [...new Set(brandName)];
  };

  const getCategoryFormattedData = (data: InfiniteData<Categories> | undefined) => {
    const categoryName = data?.pages.flatMap((page) => page.categories.map((cat) => cat.categorytitle));
    return [...new Set(categoryName)];
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
              <TextField required id="productName" label="Product Name" fullWidth {...register("name")} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                loading={status === "loading"}
                options={getCategoryFormattedData(catData)}
                onInputChange={(e, value) => {
                  setCategoryName(value);
                }}
                renderInput={(params) => <TextField {...params} label="search category" required />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                loading={status === "loading"}
                options={getBrandFormattedData(data)}
                onInputChange={(e, value) => {
                  setBrandName(value);
                }}
                renderInput={(params) => <TextField {...params} label="search brand" required />}
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
            <Grid item xs={12} sm={6}>
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
                  required
                />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ButtonGroup>
                <LoadingButton color="success" variant="contained" type="submit" loading={isLoading}>
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
