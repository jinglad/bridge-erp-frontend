import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

type IProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  text: string;
  handleDelete: () => void;
  deleteLoading?: boolean;
};

const DeleteDialog = ({
  open,
  onClose,
  title,
  text,
  handleDelete,
  deleteLoading = false,
}: IProps) => {
  return (
    <>
      <Dialog open={open} onClose={onClose} scroll="body">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{text}</DialogContent>

        <DialogActions sx={{ m: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleteLoading}
            variant="contained"
            sx={{ alignItems: "center" }}
            startIcon={
              deleteLoading ? (
                <CircularProgress size={18} />
              ) : (
                <DeleteOutlinedIcon />
              )
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteDialog;
