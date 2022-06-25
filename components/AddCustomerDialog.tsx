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
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { createCustomer } from "../apis/customer-service";

interface AddCustomerDialogProps {
  open: boolean;
  onToggle: () => void;
}

function AddCustomerDialog({ onToggle, open }: AddCustomerDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation("add-customer", createCustomer, {
    onSuccess: (data) => {
      notify(data.msg);
      queryClient.invalidateQueries("customers");
      reset();
      onToggle();
    },
  });

  const notify = (msg: string) => {
    toast.success(msg);
  };

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await mutateAsync(data.customerName);
  };

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onToggle}>
      <DialogTitle>Update Customer</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <TextField required id="CustomerName" label="Customer Name" fullWidth {...register("customerName")} />
            <ButtonGroup>
              <LoadingButton color="success" variant="contained" type="submit" loading={isLoading}>
                Submit
              </LoadingButton>
              <Button color="error" onClick={onToggle}>
                Cancel
              </Button>
            </ButtonGroup>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCustomerDialog;
