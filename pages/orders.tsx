import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import Layout from "../components/Layout/Layout";
import SalesReturn from "../components/SalesReturn";
import DataTable from "../components/Table/DataTable";
import ViewOrder from "../components/ViewOrderDialog";
import { useOrders } from "../hooks/useOrders";
import { IColumn } from "../interfaces/common";
import { IOrder } from "../apis/order-service";

type Props = {};

const Order = (props: Props) => {
  const [date, setDate] = useState<Date | null>(null);
  const [createdDate, setCreatedDate] = useState<string | Date | null>(null);
  const [open, setOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [selected, setSelected] = useState<null | IOrder>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useOrders({
    page: page + 1,
    limit,
    createdDate,
    order_return: false,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickSalesOpen = () => {
    setSaleOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleSalesClose = () => {
    setSaleOpen(false);
    setSelected(null);
  };

  const handleChange = (newValue: Date | null) => {
    // console.log(newValue?.toISOString());
    setDate(newValue);
    if (newValue) {
      setCreatedDate(newValue.toDateString());
    }
  };

  const columns: IColumn[] = [
    {
      field: "supplier",
      label: "Supplier",
      align: "left",
      render: (row) => row.supplier?.name,
    },
    {
      field: "paid",
      label: "Paid",
    },
    {
      field: "to_be_paid",
      label: "To be paid",
    },
    {
      field: "actions",
      label: "Actions",
    },
  ];

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All Orders
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: ["column", "row", "row"],
          }}
        >
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
              </Button>
            )}
          </Box>
        </Box>
      </Stack>

      <DataTable
        isLoading={isLoading}
        rows={data?.data || []}
        columns={columns}
        total={data?.meta?.total}
        pagination
        paginationOptions={{
          page,
          limit,
          handleChangePage: (e, page) => setPage(page),
          handleChangePageSize: (e) => setLimit(+e.target.value),
        }}
      />

      {selected && (
        <ViewOrder
          onClose={handleClose}
          open={open}
          order={selected}
          key={selected._id}
        />
      )}
      {selected && (
        <SalesReturn
          onClose={handleSalesClose}
          open={saleOpen}
          order={selected}
          key={selected._id + 1}
        />
      )}
    </Layout>
  );
};

export default Order;

{
  /*
   *
   *
   * <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>To be paid</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {status === "loading" ? (
              <TableBody sx={{ display: "flex", m: "4rem", width: "100%" }}>
                <CircularProgress />
              </TableBody>
            ) : (
              <>
                {data?.pages.map((group, i) => (
                  <TableBody key={i}>
                    {group?.orders.map((row: any) => (
                      <TableRow
                        key={row._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{row.customer}</TableCell>
                        <TableCell>
                          {parseFloat(row.paid.toString()).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {parseFloat(row.to_be_paid.toString()).toFixed(2)}
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
   */
}
