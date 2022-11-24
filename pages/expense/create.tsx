import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { createExpense, Expense } from "../../apis/profit-service";
import Layout from "../../components/Layout/Layout";

type Props = {};

function CreateExpensePage({}: Props) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation("createExpense", createExpense, {
    onSuccess: (data) => {
      toast.success(data.msg);
      reset();
      queryClient.invalidateQueries("searchedProducts");
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    let expenses: Expense[] = [];

    if (data.wages) {
      expenses.push({
        name: "wages",
        spent: Number(data.wages),
      });
    }
    if (data.rent) {
      expenses.push({
        name: "rent",
        spent: Number(data.rent),
      });
    }
    if (data.electricity) {
      expenses.push({
        name: "electricity",
        spent: Number(data.electricity),
      });
    }
    if (data.others) {
      expenses.push({
        name: "others",
        spent: Number(data.others),
      });
    }
    if (createdDate) {
      await mutateAsync({
        date: createdDate,
        expenses,
      });
    }
  };

  const [date, setDate] = useState<Date | null>(null);
  const [createdDate, setCreatedDate] = useState<string | null>(null);

  const handleChange = (newValue: Date | null) => {
    setDate(newValue);
    if (newValue) {
      setCreatedDate(newValue.toISOString().split("T")[0]);
    }
  };

  return (
    <Layout>
      <Box maxWidth="400px">
        <Typography variant="h6" mb={4} gutterBottom>
          Register Expenses
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Date"
                  inputFormat="MM/dd/yyyy"
                  value={date}
                  onChange={handleChange}
                  renderInput={(params) => <TextField required variant="outlined" fullWidth {...params} />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField type="number" id="wages" label="Wages" fullWidth {...register("wages")} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField type="number" id="electricity" label="Electricity" fullWidth {...register("electricity")} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField type="number" id="rent" label="Rent" fullWidth {...register("rent")} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField type="number" id="others" label="Others" fullWidth {...register("others")} />
            </Grid>

            <Grid item xs={12} sm={12}>
              <ButtonGroup>
                <LoadingButton color="success" variant="contained" type="submit" loading={isLoading}>
                  Submit
                </LoadingButton>
                <Button color="error">
                  <Link href="/expense">Cancel</Link>
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Layout>
  );
}

export default CreateExpensePage;
