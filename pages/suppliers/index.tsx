import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteSupplier, getSupplier, Supplier } from "../../apis/supplier-service";
import EditSupplierDialog from "../../components/EditSupplierDialog";
import Layout from "../../components/Layout/Layout";
type Props = {};

function createData(SL: number, supplierName: string, email: string, contactNo: number, fullAddress: string) {
  return {
    SL,
    supplierName,
    email,
    contactNo,
    fullAddress,
  };
}

function Suppliers({}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [selected, setSelected] = useState<null | Supplier>(null);

  const { isLoading, data } = useQuery("suppliers", getSupplier);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation("deleteSupplier", deleteSupplier, {
    onSuccess: (data) => {
      toast.success(data.msg, {
        toastId: "delete-supplier" + selected?._id,
      });
      queryClient.invalidateQueries("products");
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const formatAutoCompleteData = (suppliers: Supplier[] | undefined) => {
    const arr: any = [];

    suppliers && suppliers?.map((d) => arr.push({ label: d.name }));
    return arr;
  };

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All Suppliers
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: ["column", "row", "row"],
          }}
        >
          <Autocomplete
            disablePortal
            sx={{ flexGrow: 1 }}
            options={formatAutoCompleteData(data)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search Products" size="small" variant="outlined" />
            )}
          />

          <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>
            Search
          </Button>
          <Button startIcon={<AddOutlinedIcon />} onClick={() => router.push("/suppliers/create")}>
            Add Supplier
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid #dee2e6",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Supplier Name</TableCell>
                <TableCell>Email </TableCell>
                <TableCell>Contact No.</TableCell>
                <TableCell>Full Address</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {isLoading ? (
              <TableBody sx={{ display: "flex", m: "4rem", width: "100%" }}>
                <TableRow>
                  <TableCell>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {data?.map((row) => (
                  <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell align="right">
                      <ButtonGroup size="small">
                        <Button
                          color="info"
                          variant="contained"
                          onClick={() => {
                            setSelected(row);
                            handleClickOpen();
                          }}
                        >
                          <ModeEditOutlineOutlinedIcon />
                        </Button>
                        {/* <Button
                          color="error"
                          variant="contained"
                          onClick={() => {
                            mutateAsync(row._id);
                          }}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </Button> */}
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Stack>
      {selected && <EditSupplierDialog onClose={handleClose} open={open} supplier={selected} key={selected._id} />}
    </Layout>
  );
}

export default Suppliers;
