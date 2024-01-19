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
import useDebounce from "../../hooks/useDebounce";

type Props = {};

function Categories({}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
<<<<<<< HEAD
  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: ICategory | null;
  }>({
    open: false,
    data: null,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
=======
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c
  const [categoryName, setCategoryName] = useState("");
  const [selected, setSelected] = useState<null | Category>(null);
  const debouncedCategoryNameSearchQuery = useDebounce(categoryName, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ["categories", debouncedCategoryNameSearchQuery],
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

<<<<<<< HEAD
  const columns: IColumn[] = [
    {
      field: "categorytitle",
      label: "Category Name",
      align: "left",
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (row: ICategory) => (
        <ButtonGroup size="small">
          <Button
            color="info"
            onClick={() => {
              setSelected(row);
              // setOpen(true);
              setEditModal({
                open: true,
                data: row,
              });
            }}
          >
            <ModeEditOutlineOutlined />
          </Button>
          <Button
            color="warning"
            onClick={() => {
              setSelected(row);
              setDeleteDialogOpen(true);
            }}
          >
            <DeleteOutline />
          </Button>
        </ButtonGroup>
      ),
    },
  ];

=======
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c
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
            freeSolo={true}
            sx={{ flex: 1 }}
            loading={status === "loading"}
            options={getCategoryFormattedData(data)}
            onInputChange={(e, value) => {
              setCategoryName(value);
              setPage(0);
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
                    {group?.categories.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell>{row.categorytitle}</TableCell>
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

<<<<<<< HEAD
      {editModal.open && (
        <EditcategoryDialog
          onClose={() => setEditModal({ open: false, data: null })}
          open={editModal.open}
          category={editModal.data as ICategory}
        />
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Category"
        text="Are you sure you want to delete this category?"
        handleDelete={handleDelete}
        deleteLoading={deleteLoading}
      />
=======
      {selected && <EditcategoryDialog onClose={handleClose} open={open} category={selected} key={selected._id} />}
>>>>>>> 3608fb80dcf57a98b0f021a5445f16e4321f5b1c
    </Layout>
  );
}

export default Categories;
