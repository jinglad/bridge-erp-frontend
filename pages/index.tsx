import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import { getTotalSales } from "../apis/dashboard-service";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  const { data, isLoading } = useQuery("total-sales", getTotalSales);

  return (
    <Layout>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>
        Welcome to Bridge ERP
      </Typography>
      {!isLoading ? (
        <Card sx={{ maxWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 18 }} gutterBottom>
              Total Sales
            </Typography>
            <Typography variant="h5" component="div" fontWeight="bold" fontSize="40px">
              {data?.total_sell}
            </Typography>
          </CardContent>
        </Card>
      ) : null}
    </Layout>
  );
};

export default Home;
