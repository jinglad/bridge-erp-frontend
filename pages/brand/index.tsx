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
import React, { useState } from "react";
import { InfiniteData, useInfiniteQuery } from "react-query";
import { Brand, Brands, getBrands } from "../../apis/brand-service";
import EditBrandDialog from "../../components/EditBrandDialog";
import Layout from "../../components/Layout/Layout";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import useDebounce from "../../hooks/useDebounce";

type Props = {};

function Brand({}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [brandName, setBrandName] = useState("");
  const debouncedBrandNameSearchQuery = useDebounce(brandName, 500);

  const [selected, setSelected] = useState<null | Brand>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ["brands", debouncedBrandNameSearchQuery],
    getBrands,
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

  const getBrandFormattedData = (data: InfiniteData<Brands> | undefined) => {
    const brandName = data?.pages.flatMap((page) => page.brands.map((brand) => brand.brandtitle));
    return [...new Set(brandName)];
  };

  return (
    <Layout>
      <Stack spacing={2}>
        <Typography fontWeight="bold" variant="h5" textAlign="center">
          All Brand
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: ["column", "row", "row"],
          }}
        >
          <Autocomplete
            freeSolo={true}
            sx={{ flex: 1 }}
            loading={status === "loading"}
            options={getBrandFormattedData(data)}
            onInputChange={(e, value) => {
              setBrandName(value);
            }}
            renderInput={(params) => <TextField {...params} placeholder="search brands" variant="outlined" />}
          />
          <Button startIcon={<AddOutlinedIcon />} onClick={() => router.push("/brand/create")}>
            Add Brands
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Brand Name </TableCell>
                {/* <TableCell align="right">Actions</TableCell> */}
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
                    {group?.brands.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell>{row.brandtitle}</TableCell>
                        {/* <TableCell align="right">
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
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                ))}
              </>
            )}
          </Table>
        </TableContainer>
      </Stack>

      {selected && <EditBrandDialog onClose={handleClose} open={open} brand={selected} key={selected._id} />}
    </Layout>
  );
}

export default Brand;
