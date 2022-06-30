import { LoadingButton } from "@mui/lab";
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
import { Categories, Category, getCategories } from "../../apis/category-service";
import EditcategoryDialog from "../../components/EditCategoryDialog";
import Layout from "../../components/Layout/Layout";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

type Props = {};

function Categories({}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selected, setSelected] = useState<null | Category>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ["categories", categoryName],
    getCategories,
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

  const getCategoryFormattedData = (data: InfiniteData<Categories> | undefined) => {
    const categoryName = data?.pages.flatMap((page) => page.categories.map((cat) => cat.categorytitle));
    return [...new Set(categoryName)];
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
          <Autocomplete
            sx={{ flex: 1 }}
            loading={status === "loading"}
            options={getCategoryFormattedData(data)}
            onInputChange={(e, value) => {
              setCategoryName(value);
            }}
            renderInput={(params) => <TextField {...params} placeholder="search category" variant="outlined" />}
          />

          <Button startIcon={<AddOutlinedIcon />} onClick={() => router.push("/categories/create")}>
            Add Category
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Category Name </TableCell>
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
                    {group?.categories.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell>{row.categorytitle}</TableCell>
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
                              <ModeEditOutlineOutlinedIcon />
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
          {hasNextPage && (
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

      {selected && <EditcategoryDialog onClose={handleClose} open={open} category={selected} key={selected._id} />}
    </Layout>
  );
}

export default Categories;
