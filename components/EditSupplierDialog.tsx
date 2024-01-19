import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Supplier, updateSupplier } from "../apis/supplier-service";

interface EditSupplierDialogProps {
  supplier: Supplier;
  open: boolean;
  onClose: () => void;
}

function EditSupplierDialog({ onClose, open, supplier }: EditSupplierDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(updateSupplier, {
    onSuccess: (data) => {
      toast.success(data?.message || "Supplier updated successfully");
      queryClient.invalidateQueries(["suppliers"]);
      onClose();
    },
  });

  const notify = (msg: string) => {
    toast.success(msg);
  };

  const { register, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      name: supplier.name,
      address: supplier.address,
      phone: supplier.phone,
      email: supplier.email,
    },
  });

  const onSubmit = async (data: any) => {
<<<<<<< HEAD:components/Supplier/EditSupplierDialog.tsx
    // console.log(data);
    await mutateAsync({ id: supplier._id, input: data });
    reset();
=======
    await mutateAsync({ _id: supplier._id, ...data });
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c:components/EditSupplierDialog.tsx
  };

  return (
    <Dialog open={open} onClose={onClose} scroll="body">
      <DialogTitle>Update Supplier</DialogTitle>
      <DialogContent>
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
                <Button color="error" onClick={onClose}>
                  Cancel
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditSupplierDialog;
