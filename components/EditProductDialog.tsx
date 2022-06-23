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
import { Product, updateProduct } from "../apis/product-service";

interface EditProductDialogProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

function EditProductDialog({ onClose, open, product }: EditProductDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(updateProduct, {
    onSuccess: (data) => {
      notify(data.msg);
      queryClient.invalidateQueries("products");

      queryClient.refetchQueries("products");

      reset();
      onClose();
    },
  });

  const notify = (msg: string) => {
    toast.success(msg);
  };

  const { register, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      name: product.name,
      brand: product.brand,
      category: product.category,
      reorder_limit: product.reorder_limit,
      file: "",
    },
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("brand", data.brand);
    formData.append("category", data.category);
    formData.append("reorder_limit", data.reorder_limit);
    formData.append("file", data.file[0]);

    await mutateAsync({
      formData,
      id: product._id,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} scroll="body" fullScreen>
      <Container maxWidth="md">
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField required id="productName" label="Product Name" fullWidth {...register("name")} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  disablePortal
                  options={["Ata", "Moyda", "Suzi"]}
                  defaultValue={product.category}
                  renderInput={(params) => (
                    <TextField defaultValue={product.category} {...register("category")} {...params} label="Category" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  disablePortal
                  options={["Apple", "Banana", "Orange", "Mango", "Lichi"]}
                  defaultValue={product.brand}
                  renderInput={(params) => <TextField {...register("brand")} {...params} label="Brand" />}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  required
                  type="number"
                  id="reOrderLimit"
                  label="ReOrder Limit"
                  fullWidth
                  {...register("reorder_limit")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button fullWidth variant="contained" component="label">
                  <label htmlFor="files" style={{ width: "100%" }}>
                    {getValues("file")[0] ? (getValues("file")[0] as any).name : "Please choose a image"}
                  </label>
                  <input
                    id="files"
                    style={{
                      opacity: 0,
                    }}
                    {...register("file")}
                    type="file"
                    accept="image/*"
                    required
                  />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: "end" }}>
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

export default EditProductDialog;
