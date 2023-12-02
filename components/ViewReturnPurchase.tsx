import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  createReturnPurchase,
  deletePurchase,
  Purchase,
} from "../apis/purchase-service";
import { IPurchase } from "../interfaces/purchase";

interface ViewPurchaseProps {
  purchase: IPurchase;
  open: boolean;
  onClose: () => void;
}

function ViewReturnPurchase({ onClose, open, purchase }: ViewPurchaseProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteAsync } = useMutation(
    "deleteProduct",
    deletePurchase,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("purchases");
        toast.success("Return Successful");
      },
    }
  );

  const { mutateAsync, isLoading } = useMutation(createReturnPurchase, {
    onSuccess: (data) => {
      // toast.success(data?.msg);
      console.log(data);
      queryClient.invalidateQueries("orders");
    },
    onError: (error: any) => {
      toast.error(error.response.data.msg);
    },
  });

  const purchaseReturn = async () => {
    await mutateAsync(purchase._id);
    onClose();
  };

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">Purchase Details</Typography>
          <IconButton color="error" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table size="small" aria-label="simple table">
            <TableRow>
              <TableCell sx={{ maxWidth: "50px", fontWeight: "bold" }}>
                Supplier:
              </TableCell>
              <TableCell>{purchase?.supplier?.name}</TableCell>
            </TableRow>
          </Table>
        </TableContainer>

        <Typography
          sx={{ marginLeft: "16px", paddingTop: "10px" }}
          variant="h6"
        >
          Products
        </Typography>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Buy Price</TableCell>
                <TableCell>Sell Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchase.products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.qty}</TableCell>
                  <TableCell>{product.buy_price}</TableCell>
                  <TableCell>{product.sell_price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <DialogActions>
          <LoadingButton
            variant="contained"
            loading={isLoading}
            onClick={purchaseReturn}
          >
            Return
          </LoadingButton>
          <Button color="error" onClick={onClose}>
            close
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReturnPurchase;
