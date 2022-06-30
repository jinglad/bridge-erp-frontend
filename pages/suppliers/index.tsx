import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { LoadingButton } from "@mui/lab";
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
import React, { Fragment, useState } from "react";
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteSupplier, getSupplier, Supplier, Suppliers } from "../../apis/supplier-service";
import EditSupplierDialog from "../../components/EditSupplierDialog";
import Layout from "../../components/Layout/Layout";
type Props = {};

function Suppliers({}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = useState<null | Supplier>(null);
  const [supplierName, setSupplierName] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ["suppliers", supplierName],
    getSupplier,
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length === lastPage.totalPages) {
          return undefined;
        } else {
          return pages.length;
        }
      },
      onSuccess: () => {},
    }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const getSupplierFormattedData = (data: InfiniteData<Suppliers> | undefined) => {
    const brands = data?.pages.flatMap((page) => page.supplier.map((sp) => sp.name));
    return [...new Set(brands)];
  };

  return (
    <Layout>
      <Stack spacing={2} sx={{ width: "100%" }}>
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
            sx={{ flex: 1 }}
            loading={status === "loading"}
            options={getSupplierFormattedData(data)}
            onInputChange={(e, value) => {
              setSupplierName(value);
            }}
            renderInput={(params) => <TextField {...params} placeholder="search products" variant="outlined" />}
          />

          <Button startIcon={<AddOutlinedIcon />} onClick={() => router.push("/suppliers/create")}>
            Add Supplier
          </Button>
        </Box>
        <TableContainer sx={{ width: "100%", overflow: "hidden" }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier Name</TableCell>
                <TableCell>Email </TableCell>
                <TableCell sx={{ minWidth: "200px" }}>Contact No.</TableCell>
                <TableCell>Full Address</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {status === "loading" ? (
              <TableBody sx={{ display: "flex", m: "4rem", width: "100%" }}>
                <CircularProgress />
              </TableBody>
            ) : (
              <Fragment>
                {data?.pages.map((group, i) => (
                  <TableBody key={i}>
                    {group?.supplier.map((row) => (
                      <TableRow key={row._id}>
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
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ))}
              </Fragment>
            )}
          </Table>
        </TableContainer>
        {data?.pages[0].totalProducts !== 0 && hasNextPage && (
          <LoadingButton
            variant="contained"
            loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            Load More
          </LoadingButton>
        )}
      </Stack>
      {selected && <EditSupplierDialog onClose={handleClose} open={open} supplier={selected} key={selected._id} />}
    </Layout>
  );
}

export default Suppliers;
