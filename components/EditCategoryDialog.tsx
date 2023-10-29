import { LoadingButton } from "@mui/lab";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ICategory, updateCategory } from "../apis/category-service";

interface EditCategoryDialogProps {
  category: ICategory;
  open: boolean;
  onClose: () => void;
}

function EditcategoryDialog({
  onClose,
  open,
  category,
}: EditCategoryDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(updateCategory, {
    onSuccess: (data) => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries("categories");
      reset();
      onClose();
    },
    onError(error: any) {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      categorytitle: category.categorytitle,
    },
  });

  const onSubmit = async (data: any) => {
    await mutateAsync({
      id: category._id,
      categorytitle: data.categorytitle,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} scroll="body">
      <DialogTitle>Update category</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                id="categorytitle"
                label="Category Title"
                fullWidth
                {...register("categorytitle")}
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

export default EditcategoryDialog;
