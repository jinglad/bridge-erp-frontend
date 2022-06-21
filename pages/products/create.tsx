import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createProduct } from "../../apis/product-service";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Create({}: Props) {
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
    formData.append("brand", data.brand);
    formData.append("category", data.category);
    formData.append("reorder_limit", data.reorder_limit);
    formData.append("file", data.file[0]);

    await mutateAsync(formData);
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
                disablePortal
                defaultValue="Suzi"
                options={["Ata", "Moyda", "Suzi"]}
                renderInput={(params) => <TextField {...register("category")} {...params} label="Category" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                disablePortal
                defaultValue="Apple"
                options={["Apple", "Banana", "Orange", "Mango", "Lichi"]}
                renderInput={(params) => <TextField {...register("brand")} {...params} label="Brand" />}
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
