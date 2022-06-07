import {
  Autocomplete,
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Layout from "../../../components/Layout/Layout";

type Props = {};

function EditCategory({}: Props) {
  return (
    <Layout>
      <Box maxWidth="800px">
        <Typography variant="h6" gutterBottom>
          Edit Category
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField required id="CategoryName" name="CategoryName" label="Category Name" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              options={["Apple", "Banana", "Orange", "Apple", "Banana", "Orange"]}
              renderInput={(params) => <TextField {...params} label="Select Root Category" />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Expirable" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel control={<Checkbox />} label="Warrantiable" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel control={<Checkbox />} label="Status" />
          </Grid>
          <Grid item xs={12}>
            <TextField required id="createdBy" name="createdBy" label="Created By" fullWidth />
          </Grid>
          <Grid item xs={12} sm={3}>
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

export default EditCategory;
