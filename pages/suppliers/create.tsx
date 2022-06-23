import { LoadingButton } from "@mui/lab";
import { Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createSupplier } from "../../apis/supplier-service";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Create({}: Props) {
  const { mutateAsync, isLoading } = useMutation("createSupplier", createSupplier, {
    onSuccess: (data) => {
      toast.success(data.msg);
      reset();
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await mutateAsync(data);
  };

  return (
    <Layout>
      <Box maxWidth="800px">
        <Typography variant="h6" gutterBottom>
          Create New Supplier
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField required id="Supplier" {...register("name")} label="Supplier Name" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField required id="emailAddress" {...register("email")} label="Email Address" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required {...register("phone")} id="contactNo" label="Contact No" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("address")}
                required
                id="addressInformation"
                label="Address Information"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <ButtonGroup>
                <LoadingButton color="success" variant="contained" type="submit" loading={isLoading}>
                  Submit
                </LoadingButton>
                <Button color="error">
                  <Link href="/supplier">Cancel</Link>
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
