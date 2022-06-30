import { Typography } from "@mui/material";
import type { NextPage } from "next";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Typography variant="h4" component="h1" fontWeight="bold">
        Welcome to Bridge ERP
      </Typography>
    </Layout>
  );
};

export default Home;
