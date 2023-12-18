import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import router from "next/router";
import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import ViewPurchase from "../../components/Purchase/ViewPurchaseDialog";
import ViewReturnPurchase from "../../components/Purchase/ViewReturnPurchase";
import DataTable from "../../components/Table/DataTable";
import { usePurchase } from "../../hooks/usePurchase";
import { IColumn } from "../../interfaces/common";
import { IPurchase } from "../../interfaces/purchase";

type Props = {};

const Purchase = (props: Props) => {
  const [date, setDate] = useState<Date | null>(null);
  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | IPurchase>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(30);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);

  const { data: purchase, isLoading } = usePurchase({
    createdDate,
    limit,
    page: page + 1,
  });

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleChange = (newValue: Date | null) => {
    setDate(newValue);
    if (newValue) {
      setCreatedDate(newValue.toDateString());
      setPage(0);
    }
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
            View
          </Button>
          <Button
            color="warning"
            onClick={() => {
              setSelected(row);
              setReturnDialogOpen(true);
            }}
          >
            Return
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
          pagination={true}
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
          onClose={() => setReturnDialogOpen(false)}
          open={returnDialogOpen}
          purchase={selected}
          key={selected._id + 1}
        />
      )}
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
