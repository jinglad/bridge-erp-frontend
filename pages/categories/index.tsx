import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Category, deleteCategory, getCategories } from "../../apis/category-service";
import EditcategoryDialog from "../../components/EditCategoryDialog";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Categories({}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [selected, setSelected] = useState<null | Category>(null);

  const { isLoading, data } = useQuery("categories", getCategories, {
    onSuccess: (data) => {
      setRows(data);
    },
  });
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation("deleteCategory", deleteCategory, {
    onSuccess: (data) => {
      toast.success(data.msg, {
        toastId: "delete-product" + selected?._id,
      });
      queryClient.invalidateQueries("products");
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const formatAutoCompleteData = (data2: Category[] | undefined) => {
    const arr: any = [];

    data2 && data2?.map((d) => arr.push({ label: d.categorytitle }));
    return arr;
  };

  const [rows, setRows] = useState<Category[]>([]);

  const requestSearch = (searchedVal: string) => {
    if (data) {
      const filteredRows = data?.filter((row) => {
        return row.categorytitle.toLowerCase().includes(searchedVal.toLowerCase());
      });
      setRows(filteredRows);
    }
  };

  function handleInputChange(event: any, value: any) {
    requestSearch(value);
  }

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
            disablePortal
            sx={{ flexGrow: 1 }}
            options={formatAutoCompleteData(data)}
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search category" size="small" variant="outlined" />
            )}
          />

          <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>
            Search
          </Button>
          <Button startIcon={<AddOutlinedIcon />} onClick={() => router.push("/categories/create")}>
            Add Category
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: "100vw" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Category Name </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {isLoading ? (
              <TableBody sx={{ display: "flex", m: "4rem", width: "100%" }}>
                <TableRow>
                  <TableCell>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {rows?.map((row) => (
                  <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
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
                        {/* <Button color="success" variant="contained">
                          <CheckOutlinedIcon />
                        </Button> */}
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Stack>

      {selected && <EditcategoryDialog onClose={handleClose} open={open} category={selected} key={selected._id} />}
    </Layout>
  );
}

export default Categories;
