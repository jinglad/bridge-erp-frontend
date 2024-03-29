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
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { IBrand, updateBrand } from "../../apis/brand-service";

interface EditBrandDialogProps {
  brand: IBrand;
  open: boolean;
  onClose: () => void;
}

function EditBrandDialog({ onClose, open, brand }: EditBrandDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(updateBrand, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["brands"]);
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Something wen't wrong");
    },
  });

  const { register, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      brandtitle: brand.brandtitle,
    },
  });

  const onSubmit = async (data: any) => {
    await mutateAsync({
      id: brand._id,
      brandtitle: data.brandtitle,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} scroll="body">
      <DialogTitle>Update Brand</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                id="BrandName"
                label="Brand Name"
                fullWidth
                {...register("brandtitle")}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
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

export default EditBrandDialog;
