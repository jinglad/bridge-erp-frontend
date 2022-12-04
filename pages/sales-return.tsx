import { LoadingButton } from "@mui/lab";
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
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getSalesReturn, Order } from "../apis/order-service";
import Layout from "../components/Layout/Layout";
import ViewOrder from "../components/ViewOrderDialog";

type Props = {};

const Order = (props: Props) => {
  const [date, setDate] = useState<Date | null>(null);
  const [createdDate, setCreatedDate] = useState<string | Date | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | Order>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ["sales-return", createdDate],
    getSalesReturn,
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length === lastPage.totalPages) {
          return undefined;
        } else {
          return pages.length;
        }
      },
    }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleChange = (newValue: Date | null) => {
    // console.log(newValue?.toISOString());
    setDate(newValue);
    if (newValue) {
      setCreatedDate(newValue.toLocaleDateString());
    }
  };

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All Returns
        </Typography>

        <TableContainer component={Paper}>
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
                      <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>{row.customer}</TableCell>
                        <TableCell>{parseFloat(row.paid.toString()).toFixed(2)}</TableCell>
                        <TableCell>{parseFloat(row.to_be_paid.toString()).toFixed(2)}</TableCell>
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
        <Box textAlign="center">
          {data?.pages[0].totalOrder !== 0 && hasNextPage && (
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
      </Stack>

      {selected && <ViewOrder onClose={handleClose} open={open} order={selected} key={selected._id} />}
    </Layout>
  );
};

export default Order;
