import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import Layout from "../components/Layout/Layout";
import SalesReturn from "../components/SalesReturn";
import DataTable from "../components/Table/DataTable";
import ViewOrder from "../components/ViewOrderDialog";
import { useOrders } from "../hooks/useOrders";
import { IColumn } from "../interfaces/common";
import { IOrder } from "../interfaces/order.interface";
import { useCustomers } from "../hooks/useCustomers";

type Props = {};

const Order = (props: Props) => {
  const [date, setDate] = useState<Date | null>(null);
  const [createdDate, setCreatedDate] = useState<string | Date | null>(null);
  const [open, setOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [selected, setSelected] = useState<null | IOrder>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(30);
  const [selectedCustomer, setSelectedCustomer] = useState<null | string>(null);

  const { data, isLoading } = useOrders({
    page: page + 1,
    limit,
    createdDate,
    order_return: false,
    customer: selectedCustomer,
  });

  const { data: customerData, isLoading: isLoadingCustomers } = useCustomers({
    page: 1,
    limit: -1, // Fetch all customers
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
      setPage(0);
    }
  };

  const columns: IColumn[] = [
    {
      field: "customer",
      label: "Customer",
      align: "left",
      render: (row: IOrder) => row?.customer?.customerName || row?.customerName,
    },
    {
      field: "paid",
      label: "Paid",
      render(row) {
        return row.paid?.toFixed(2);
      },
    },
    {
      field: "to_be_paid",
      label: "Due",
      render(row) {
        return row.to_be_paid?.toFixed(2);
      },
    },
    {
      field: "to_be_paid_total",
      label: "Total Due",
      render(row) {
        return row.to_be_paid_total?.toFixed(2);
      },
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (row: IOrder) => (
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
            color="warning"
            variant="contained"
            onClick={() => {
              setSelected(row);
              handleClickSalesOpen();
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
            <Autocomplete
              disablePortal
              options={customerData?.data ?? []}
              getOptionLabel={(option) => option.customerName}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Customer" variant="outlined" />
              )}
              value={
                selectedCustomer
                  ? customerData?.data?.find((c) => c._id === selectedCustomer)
                  : null
              }
              onChange={(e, value) => {
                setSelectedCustomer(value?._id || null);
              }}
            />
            {(createdDate || selectedCustomer) && (
              <Button
                color="error"
                onClick={() => {
                  setDate(null);
                  setCreatedDate(null);
                  setSelectedCustomer(null);
                }}
              >
                clear
              </Button>
            )}
          </Box>
        </Box>
      </Stack>

      <Box sx={{ mt: 4 }}>
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
      </Box>

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
