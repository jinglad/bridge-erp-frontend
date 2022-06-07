import { Autocomplete, Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Create({}: Props) {
  return (
    <Layout>
      <Box maxWidth="800px">
        <Typography variant="h6" gutterBottom>
          Register New Product
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField required id="productName" name="productName" label="Product Name" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField required id="shortDescription" name="shortDescription" label="Short Description" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField required id="longDescription" name="longDescription" label="Long Description" fullWidth />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Autocomplete
              disablePortal
              options={["Apple", "Banana", "Orange", "Apple", "Banana", "Orange"]}
              renderInput={(params) => <TextField {...params} label="Category" />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              disablePortal
              options={["Apple", "Banana", "Orange", "Apple", "Banana", "Orange"]}
              renderInput={(params) => <TextField {...params} label="Brand" />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button fullWidth variant="contained" component="label">
              Product Image
              <input type="file" hidden accept="image/*" />
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="barCode" name="barCode" label="BarCode" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              required
              type="number"
              id="reOrderLimit"
              name="reOrderLimit"
              label="ReOrder Limit"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ButtonGroup>
              <Button color="success">Submit</Button>
              <Button color="error">Cancel</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default Create;
