import { Autocomplete, Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { createProduct } from "../../apis/product-service";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Create({}: Props) {
  const { mutateAsync, isLoading } = useMutation("createProduct", createProduct, {
    onSuccess: () => {},
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
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
            {/* <Grid item xs={12}>
            <TextField required id="shortDescription" name="shortDescription" label="Short Description" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField required id="longDescription" name="longDescription" label="Long Description" fullWidth />
          </Grid> */}

            <Grid item xs={12} sm={4}>
              <Autocomplete
                disablePortal
                options={["Ata", "Moyda", "Suzi"]}
                renderInput={(params) => <TextField {...register("category")} {...params} label="Category" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                disablePortal
                options={["Apple", "Banana", "Orange", "Mango", "Lichi"]}
                renderInput={(params) => <TextField {...register("brand")} {...params} label="Brand" />}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
            <TextField required id="barCode" name="barCode" label="BarCode" fullWidth />
          </Grid> */}
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
                Product Image
                <input {...register("file")} type="file" hidden accept="image/*" />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ButtonGroup>
                <Button color="success" type="submit">
                  Submit
                </Button>
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
