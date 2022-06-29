import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

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
import { Brand, deleteBrand, getBrands } from "../../apis/brand-service";
import EditBrandDialog from "../../components/EditBrandDialog";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Brand({}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [selected, setSelected] = useState<null | Brand>(null);

  const { isLoading, data } = useQuery("brand", getBrands);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation("deleteBrand", deleteBrand, {
    onSuccess: (data) => {
      toast.success(data.msg, {
        toastId: "delete-brand" + selected?._id,
      });
      queryClient.invalidateQueries("brand");
    },
  });

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
            disablePortal
            sx={{ flexGrow: 1 }}
            options={[]}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search Brand" size="small" variant="outlined" />
            )}
          />

          <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>
            Search
          </Button>
          <Button startIcon={<AddOutlinedIcon />} onClick={() => router.push("/brand/create")}>
            Add Brand
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ maxWidth: "100vw" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Brand Name </TableCell>
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
                {data?.map((row) => (
                  <TableRow key={row._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>{row.brandtitle}</TableCell>
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
                        {/* <Button
                          color="error"
                          variant="contained"
                          onClick={() => {
                            mutateAsync(row._id);
                          }}
                        >
                          <DeleteOutlineOutlinedIcon />
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

      {selected && <EditBrandDialog onClose={handleClose} open={open} brand={selected} key={selected._id} />}
    </Layout>
  );
}

export default Brand;
