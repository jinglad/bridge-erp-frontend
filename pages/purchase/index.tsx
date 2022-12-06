import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { DesktopDatePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
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
import { useInfiniteQuery } from "react-query";
import { getPurchases, Purchase } from "../../apis/purchase-service";
import Layout from "../../components/Layout/Layout";
import ViewPurchase from "../../components/ViewPurchaseDialog";
import ViewReturnPurchase from "../../components/ViewReturnPurchase";

type Props = {};

const Purchase = (props: Props) => {
  const [saleOpen, setSaleOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | Purchase>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ["purchases", createdDate],
    getPurchases,
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
          <Button startIcon={<AddOutlinedIcon />} onClick={() => router.push("/purchase/create")}>
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
                renderInput={(params) => <TextField variant="outlined" fullWidth {...params} />}
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
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell>Paid Amount</TableCell>
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
                    {group?.purchase.map((row) => (
                      <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>{row.supplier}</TableCell>
                        <TableCell>{row.paid ? row.paid.toFixed(2) : null}</TableCell>
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
          {data?.pages[0].totalPurchase !== 0 && hasNextPage && (
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

      {selected && <ViewPurchase onClose={handleClose} open={open} purchase={selected} key={selected._id} />}
      {selected && (
        <ViewReturnPurchase onClose={handleSalesClose} open={saleOpen} purchase={selected} key={selected._id + 1} />
      )}
    </Layout>
  );
};

export default Purchase;
