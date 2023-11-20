import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  DesktopDatePicker,
  LoadingButton,
  LocalizationProvider,
} from "@mui/lab";
import {
  Box,
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import router from "next/router";
import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { deletePurchase, getPurchases } from "../../apis/purchase-service";
import Layout from "../../components/Layout/Layout";
import ViewPurchase from "../../components/ViewPurchaseDialog";
import ViewReturnPurchase from "../../components/ViewReturnPurchase";
import { usePurchase } from "../../hooks/usePurchase";
import { IColumn } from "../../interfaces/common";
import { IPurchase } from "../../interfaces/purchase";
import { DeleteOutline, ModeEditOutlineOutlined } from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
import DeleteDialog from "../../components/DeleteDialog";
import { toast } from "react-toastify";

type Props = {};

const Purchase = (props: Props) => {
  const [saleOpen, setSaleOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | IPurchase>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: purchase,
    isLoading,
    isError,
    error,
    status,
  } = usePurchase({
    createdDate,
    limit: 10,
    page: page,
  });

  const { mutateAsync, isLoading: deleteLoading } = useMutation(
    deletePurchase,
    {
      onSuccess: (data) => {
        toast.success("Purchase deleted successfully");
        queryClient.invalidateQueries(["purchases"]);
      },
      onError: (error: any) => {
        toast.error(error.message || "Something wen't wrong");
      },
    }
  );

  const handleDelete = async () => {
    await mutateAsync(selected?._id as string);
    setDeleteDialogOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleChange = (newValue: Date | null) => {
    setDate(newValue);
    if (newValue) {
      setCreatedDate(newValue.toDateString());
    }
  };

  const handleClickSalesOpen = () => {
    setSaleOpen(true);
  };

  const handleSalesClose = () => {
    setSaleOpen(false);
    setSelected(null);
  };

  const columns: IColumn[] = [
    {
      field: "supplier",
      label: "Supplier",
      align: "left",
      render: (row: IPurchase) => <>{row.supplier?.name}</>,
    },
    {
      field: "paid",
      label: "Paid Amount",
      align: "center",
      render: (row: IPurchase) => <>{row.paid?.toFixed(2)}</>,
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (row: IPurchase) => (
        <ButtonGroup size="small">
          <Button
            color="info"
            onClick={() => {
              setSelected(row);
              setOpen(true);
            }}
          >
            <ModeEditOutlineOutlined />
          </Button>
          <Button
            color="warning"
            onClick={() => {
              setSelected(row);
              setDeleteDialogOpen(true);
            }}
          >
            <DeleteOutline />
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All Purchase
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: ["column", "row", "row"],
          }}
        >
          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => router.push("/purchase/create")}
          >
            New purchase
          </Button>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Filter by date"
                inputFormat="MM/dd/yyyy"
                value={date}
                onChange={handleChange}
                // disableCloseOnSelect={true}
                renderInput={(params) => (
                  <TextField variant="outlined" fullWidth {...params} />
                )}
              />
            </LocalizationProvider>
            {createdDate && (
              <Button
                color="error"
                onClick={() => {
                  setDate(null);
                  setCreatedDate(null);
                }}
              >
                clear
                {/* <CloseIcon /> */}
              </Button>
            )}
          </Box>
        </Box>

        <DataTable
          isLoading={isLoading}
          columns={columns}
          rows={purchase?.data || []}
          pagination={purchase?.meta?.page! > 1}
          total={purchase?.meta?.total}
          paginationOptions={{
            page,
            limit,
            handleChangePage: (e, page) => setPage(page),
            handleChangePageSize: (e) => setLimit(+e.target.value),
          }}
        />
      </Stack>

      {selected && (
        <ViewPurchase
          onClose={handleClose}
          open={open}
          purchase={selected}
          key={selected._id}
        />
      )}
      {selected && (
        <ViewReturnPurchase
          onClose={handleSalesClose}
          open={saleOpen}
          purchase={selected}
          key={selected._id + 1}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Purchase"
        text="Are you sure you want to delete this purchase?"
        handleDelete={handleDelete}
        deleteLoading={deleteLoading}
      />
    </Layout>
  );
};

export default Purchase;

/**
 * 
 * <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {isLoading ? (
              <TableBody sx={{ display: "flex", m: "4rem", width: "100%" }}>
                <CircularProgress />
              </TableBody>
            ) : (
              <>
                {purchase?.data?.map((item, i) => (
                  <TableBody key={i}>
                      <TableRow
                        key={row._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{row.supplier}</TableCell>
                        <TableCell>
                          {row.paid ? row.paid.toFixed(2) : null}
                        </TableCell>
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
                              View
                            </Button>
                            <Button
                              color="info"
                              variant="contained"
                              onClick={() => {
                                setSelected(row);
                                handleClickSalesOpen();
                              }}
                            >
                              Return
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ))}
              </>
            )}
          </Table>
        </TableContainer>
        <Box textAlign="center">
          {/* {data?.pages[0].totalPurchase !== 0 && hasNextPage && (
            <LoadingButton
              variant="contained"
              loading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              Load More
            </LoadingButton>
          )} 
          </Box>
 */
