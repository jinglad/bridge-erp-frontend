import { Button, ButtonGroup, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Layout from "../../components/Layout/Layout";

type Props = {};

function Create({}: Props) {
  return (
    <Layout>
      <Box maxWidth="800px">
        <Typography variant="h6" gutterBottom>
          Create New Supplier
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField required id="Supplier" name="Supplier" label="Supplier Name" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField required id="emailAddress" name="emailAddress" label="Email Address" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required id="contactNo" name="contactNo" label="Contact No" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="addressInformation"
              name="addressInformation"
              label="Address Information"
              fullWidth
            />
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

export default Create;
