import { LoadingButton } from "@mui/lab";
import {
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { createCustomer } from "../../apis/customer-service";

function AddCustomerDialog({}) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(
    "add-customer",
    createCustomer,
    {
      onSuccess: (data) => {
        toast.success(data?.message || "Customer added successfully")
        queryClient.invalidateQueries(["customers"]);
        reset();
        addCustomerDialogToggle();
      },
    }
  );


  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await mutateAsync(data.customerName);
  };

  const [openAddCustomer, setOpenAddCustomer] = useState(false);

  const addCustomerDialogToggle = () => {
    setOpenAddCustomer(!openAddCustomer);
  };

  return (
    <>
      <Button variant="contained" onClick={addCustomerDialogToggle}>
        Add Customer
      </Button>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={openAddCustomer}
        onClose={addCustomerDialogToggle}
      >
        <DialogTitle>Update Customer</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <TextField
                required
                id="CustomerName"
                label="Customer Name"
                fullWidth
                {...register("customerName")}
              />
              <ButtonGroup>
                <LoadingButton
                  color="success"
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                >
                  Submit
                </LoadingButton>
                <Button color="error" onClick={addCustomerDialogToggle}>
                  Cancel
                </Button>
              </ButtonGroup>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddCustomerDialog;
