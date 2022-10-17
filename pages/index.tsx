import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Box } from "@mui/system";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import { getTotalSales, getTotalStocks } from "../apis/dashboard-service";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  const { data, isLoading } = useQuery("total-sales", getTotalSales);
  const { data: totalStock, isLoading: totalStockLoading } = useQuery("total-stocks", getTotalStocks);

  return (
    <Layout>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>
        Welcome to Bridge ERP
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: ["1fr", "1fr 1fr", "1fr 1fr 1fr", "1fr 1fr 1fr 1fr"],
          gap: "20px",
        }}
      >
        {!isLoading ? (
          <Card>
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
        {!totalStockLoading ? (
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 18 }} gutterBottom>
                Total Stocks
              </Typography>
              <Typography variant="h5" component="div" fontWeight="bold" fontSize="40px">
                {totalStock?.total_stock}
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </Box>
    </Layout>
  );
};

export default Home;
