import {
  ModeEditOutlineOutlined,
  AddOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IBrand } from "../../apis/brand-service";
import EditBrandDialog from "../../components/EditBrandDialog";
import Layout from "../../components/Layout/Layout";
import DataTable from "../../components/Table/DataTable";
import { useBrands } from "../../hooks/useBrands";
import { IColumn } from "../../interfaces/common";

type Props = {};

function Brand({}: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [brandName, setBrandName] = useState<string>("");
  const [selected, setSelected] = useState<null | IBrand>(null);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const { data, isLoading } = useBrands({
    page: page + 1,
    limit,
    searchTerm: brandName,
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
      field: "brandtitle",
      label: "Brand Name",
      align: "left",
    },
    {
      field: "actions",
      label: "Actions",
      align: "right",
      render: (row: IBrand) => (
        <ButtonGroup size="small">
          <Button
            color="info"
            onClick={() => {
              setSelected(row);
              handleClickOpen();
            }}
          >
            <ModeEditOutlineOutlined />
          </Button>

          <Button
            color="warning"
            onClick={() => {
              console.log("delete");
            }}
          >
            <DeleteOutline />
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  const rows = data?.data || [];

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
            startIcon={<AddOutlined />}
            onClick={() => router.push("/brand/create")}
          >
            Add Brands
          </Button>
        </Box>

        <DataTable
          isLoading={isLoading}
          columns={columns}
          rows={rows}
          pagination={true}
          total={data?.meta?.total}
          paginationOptions={{
            page,
            limit,
            handleChangePage: (e, page) => setPage(page),
            handleChangePageSize: (e) => setLimit(+e.target.value),
          }}
        />
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
