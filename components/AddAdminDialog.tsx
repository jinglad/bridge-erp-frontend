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
import { createAdmin } from "../apis/admin-service";
import { createCustomer } from "../apis/customer-service";

function AddAdminDialog({setEmail}:any) {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation("add-admin", createAdmin, {
    onSuccess: (data) => {
      notify(data.msg);
      // queryClient.invalidateQueries("admins");
      reset();
      addAdminDialogToggle();
    },
  });

  const notify = (msg: string) => {
    toast.success(msg);
  };

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await mutateAsync(data.email);
  };

  const [openAddCustomer, setOpenAddCustomer] = useState(false);

  const addAdminDialogToggle = () => {
    setOpenAddCustomer(!openAddCustomer);
  };

  return (
    <>
      <Button variant="contained" onClick={addAdminDialogToggle}>
        Add New Admin
      </Button>
      <Dialog maxWidth="sm" fullWidth open={openAddCustomer} onClose={addAdminDialogToggle}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <TextField required id="email" label="Email" fullWidth {...register("email")} />
              <ButtonGroup>
                <LoadingButton color="success" variant="contained" type="submit" loading={isLoading}>
                  Submit
                </LoadingButton>
                <Button color="error" onClick={addAdminDialogToggle}>
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

export default AddAdminDialog;
