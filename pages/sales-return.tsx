import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Layout from "../components/Layout/Layout";
import DataTable from "../components/Table/DataTable";
import ViewOrder from "../components/ViewOrderDialog";
import { useOrders } from "../hooks/useOrders";
import { IColumn } from "../interfaces/common";
import { IOrder } from "../interfaces/order.interface";

const Order = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | IOrder>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(30);

  const { data, isLoading } = useOrders({
    order_return: true,
    page: page + 1,
    limit,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
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
    },
    {
      field: "to_be_paid",
      label: "To be paid",
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
        </ButtonGroup>
      ),
    },
  ];

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All Returns
        </Typography>
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
                    {group?.salesReturns.map((row: any) => (
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
