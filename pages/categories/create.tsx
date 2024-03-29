import { LoadingButton } from "@mui/lab";
import {
  Button,
  ButtonGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { createCategory } from "../../apis/category-service";
import Layout from "../../components/Layout/Layout";
import { useCategories } from "../../hooks/useCategories";

type Props = {};

function Create({}: Props) {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation("categories", createCategory, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries("categories");
      reset();
      queryClient.invalidateQueries(["categories"]);
    },
    onError(error: any) {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await mutateAsync(data.categorytitle);
  };

  return (
    <Layout>
      <Box maxWidth="800px">
        <Typography variant="h6" gutterBottom>
          Create New Category
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="CategoryName"
                {...register("categorytitle")}
                label="Category Name"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <ButtonGroup>
                <LoadingButton
                  color="success"
                  variant="contained"
                  type="submit"
                  loading={isLoading}
                >
                  Submit
                </LoadingButton>
                <Button color="error">
                  <Link href="/categories">Cancel</Link>
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
