import { LoadingButton } from "@mui/lab";
import { Button, ButtonGroup, Container, Dialog, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Brand, updateBrand } from "../apis/brand-service";

interface EditBrandDialogProps {
  brand: Brand;
  open: boolean;
  onClose: () => void;
}

function EditBrandDialog({ onClose, open, brand }: EditBrandDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(updateBrand, {
    onSuccess: (data) => {
      notify(data.msg);
      queryClient.invalidateQueries("brand");
      reset();
      onClose();
    },
  });

  const notify = (msg: string) => {
    toast.success(msg);
  };

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
    <Dialog open={open} onClose={onClose} scroll="body" fullScreen>
      <Container maxWidth="md">
        <DialogTitle>Update Brand</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField required id="BrandName" label="Brand Name" fullWidth {...register("brandtitle")} />
              </Grid>

              <Grid item xs={12} sm={6}>
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
      </Container>
    </Dialog>
  );
}

export default EditBrandDialog;
