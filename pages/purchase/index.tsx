import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
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
import router from "next/router";
import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getPurchases, Purchase } from "../../apis/purchase-service";
import EditcategoryDialog from "../../components/EditCategoryDialog";
import Layout from "../../components/Layout/Layout";
import ViewPurchase from "../../components/ViewPurchaseDialog";

type Props = {};

const Purchase = (props: Props) => {
  const [purchaseDate, setPurchaseDate] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<null | Purchase>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ["purchases", purchaseDate],
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

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All Categories
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
        </Box>
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
                    {group?.purchase.map((row) => (
                      <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>{row.supplier}</TableCell>
                        <TableCell>{row.paid}</TableCell>
                        <TableCell>{row.to_be_paid}</TableCell>
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
      </Stack>

      {selected && <ViewPurchase onClose={handleClose} open={open} purchase={selected} key={selected._id} />}
    </Layout>
  );
};

export default Purchase;
