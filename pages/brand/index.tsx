import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
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
import { IBrand } from "../../apis/brand-service";
import EditBrandDialog from "../../components/EditBrandDialog";
import Layout from "../../components/Layout/Layout";
import { useBrands } from "../../hooks/useBrands";

type Props = {};

function Brand({}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [brandName, setBrandName] = useState<string>("");
  const [selected, setSelected] = useState<null | IBrand>(null);

  const { data, isLoading } = useBrands({
    page: 1,
    limit: 20,
    searchTerm: brandName,
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
            freeSolo={true}
            sx={{ flex: 1 }}
            loading={isLoading}
            options={data?.data?.map((brand) => brand.brandtitle) || []}
            onChange={(e, value) => {
              setBrandName(value || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="search brands"
                variant="outlined"
              />
            )}
          />
          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={() => router.push("/brand/create")}
          >
            Add Brands
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Brand Name </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {isLoading ? (
              <TableBody sx={{ display: "flex", m: "4rem", width: "100%" }}>
                <CircularProgress />
              </TableBody>
            ) : (
              <>
                {data?.data?.map((brand, i) => (
                  <TableBody key={i}>
                    <TableRow key={brand._id}>
                      <TableCell>{brand.brandtitle}</TableCell>
                      <TableCell align="right">
                        <ButtonGroup size="small">
                          <Button
                            color="info"
                            variant="contained"
                            onClick={() => {
                              setSelected(brand);
                              handleClickOpen();
                            }}
                          >
                            <ModeEditOutlineOutlinedIcon />
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}
              </>
            )}
          </Table>
        </TableContainer>
      </Stack>

      {selected && (
        <EditBrandDialog
          onClose={handleClose}
          open={open}
          brand={selected}
          key={selected._id}
        />
      )}
    </Layout>
  );
}

export default Brand;
