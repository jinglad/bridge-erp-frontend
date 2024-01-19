import { LoadingButton } from "@mui/lab";
import { Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createCustomer } from "../../apis/customer-service";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Create({}: Props) {
<<<<<<< HEAD
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(createCustomer, {
    onSuccess: (data) => {
      toast.success(data?.message || "Customer created successfully");

=======
  const { mutateAsync, isLoading } = useMutation("createCustomer", createCustomer, {
    onSuccess: (data) => {
      toast.success(data.msg);
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c
      reset();
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await mutateAsync(data.customerName);
  };

  return (
    <Layout>
      <Box maxWidth="800px">
        <Typography variant="h6" gutterBottom>
          Create New customer
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField required id="customerName" {...register("customerName")} label="customer Name" fullWidth />
            </Grid>

            <Grid item xs={12} sm={3}>
              <ButtonGroup>
                <LoadingButton color="success" variant="contained" type="submit" loading={isLoading}>
                  Submit
                </LoadingButton>
                <Button color="error">
                  <Link href="/customers">Cancel</Link>
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
