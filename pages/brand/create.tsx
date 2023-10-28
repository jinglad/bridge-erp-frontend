import { LoadingButton } from "@mui/lab";
import {
  Button,
  ButtonGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { createBrand } from "../../apis/brand-service";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Create({}: Props) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation("createBrand", createBrand, {
    onSuccess: (data) => {
      toast.success(data.message);
      reset();
      queryClient.invalidateQueries("brands");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong!");
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await mutateAsync(data.brandtitle);
  };

  return (
    <Layout>
      <Box maxWidth="800px">
        <Typography variant="h6" gutterBottom>
          Create New brand
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="brandName"
                {...register("brandtitle")}
                label="brand Name"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={3}>
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
                  <Link href="/brand">Cancel</Link>
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
