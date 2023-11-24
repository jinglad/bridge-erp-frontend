import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Layout from "../components/Layout/Layout";
import DataTable from "../components/Table/DataTable";
import ViewPurchase from "../components/ViewPurchaseDialog";
import { usePurchase } from "../hooks/usePurchase";
import { IColumn } from "../interfaces/common";
import { IPurchase } from "../interfaces/purchase";

const Purchase = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | IPurchase>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = usePurchase({
    page: page + 1,
    limit,
    purchase_return: true,
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
          All Return Purchase
        </Typography>
      </Stack>

      <Box sx={{ mt: 4 }}>
        <DataTable
          isLoading={isLoading}
          rows={data?.data || []}
          columns={columns}
          total={data?.meta?.total}
          pagination={true}
          paginationOptions={{
            page,
            limit,
            handleChangePage: (e, page) => setPage(page),
            handleChangePageSize: (e) => setLimit(+e.target.value),
          }}
        />
      </Box>

      {selected && (
        <ViewPurchase
          onClose={handleClose}
          open={open}
          purchase={selected}
          key={selected._id}
        />
      )}
    </Layout>
  );
};

export default Purchase;

{
  /*
  *
  *
  *  <TableContainer component={Paper}>
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
                {data?.data?.map((item, i) => (
                  <TableBody key={i}>
                    <TableRow
                      key={item._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{item?.supplier?.name}</TableCell>
                      <TableCell>{item?.paid ? item?.paid : null}</TableCell>
                      <TableCell align="right">
                        <ButtonGroup size="small">
                          <Button
                            color="info"
                            variant="contained"
                            onClick={() => {
                              setSelected(item);
                              handleClickOpen();
                            }}
                          >
                            View
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}
              </>
            )}
          </Table>
        </TableContainer> */
}
