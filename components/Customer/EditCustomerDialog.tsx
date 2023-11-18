import { LoadingButton } from "@mui/lab";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ICustomer, updateCustomer } from "../../apis/customer-service";

interface EditCustomerDialogProps {
  customer: ICustomer;
  open: boolean;
  onClose: () => void;
}

const EditCustomerDialog = ({
  open,
  onClose,
  customer,
}: EditCustomerDialogProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      customerName: customer?.customerName,
    },
  });

  const { mutateAsync, isLoading } = useMutation(updateCustomer, {
    onSuccess: (data) => {
      toast.success(data?.message || "Customer Updated successfully");
      queryClient.invalidateQueries(["customers"]);
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Something wen't wrong");
    },
  });

  const onSubmit = async (data: any) => {
    await mutateAsync({ id: customer?._id, customerName: data.customerName });
    reset();
  };
  return (
    <Dialog open={open} onClose={onClose} scroll="body">
      <DialogTitle>Update Customer</DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                required
                id="customerName"
                {...register("customerName")}
                label="customer Name"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <ButtonGroup>
                <LoadingButton
                  color="success"
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                >
                  Submit
                </LoadingButton>
                <Button color="error" onClick={onClose}>
                  <Link href="/customers">Cancel</Link>
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
