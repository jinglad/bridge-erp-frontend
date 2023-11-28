import { Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Box } from "@mui/system";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import {
  getMonthlyPurchases,
  getMonthlySales,
  getTodaySales,
} from "../apis/dashboard-service";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  // const { data: totalStock, isLoading: totalStockLoading } = useQuery(
  //   "total-stocks",
  //   getTotalStocks
  // );
  const { data: todaySale, isLoading: todaySaleLoading } = useQuery(
    "today-sales",
    getTodaySales
  );
  const { data: monthlySale, isLoading: monthlySaleLoading } = useQuery(
    "monthly-sales",
    getMonthlySales
  );

  const { data: monthlyPurchases, isLoading: monthlyPurchasesLoading } =
    useQuery("monthly-purchases", getMonthlyPurchases);

  return (
    <Layout>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>
        Welcome to Bridge ERP
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: [
            "1fr",
            "1fr 1fr",
            "1fr 1fr 1fr",
            "1fr 1fr 1fr 1fr",
          ],
          gap: "20px",
        }}
      >
        {!todaySaleLoading ? (
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 16 }} gutterBottom>
                Today Sales
              </Typography>
              <Typography
                variant="h5"
                component="div"
                fontWeight="bold"
                fontSize="18px"
              >
                ৳{todaySale?.data?.total?.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ) : null}
        {/* {!totalStockLoading ? (
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 16 }} gutterBottom>
                Total Stocks
              </Typography>
              <Typography
                variant="h5"
                component="div"
                fontWeight="bold"
                fontSize="18px"
              >
                ৳{totalStock?.total_stock.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ) : null} */}
        {!monthlySaleLoading ? (
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 16 }} gutterBottom>
                Monthly Sales
              </Typography>
              <Typography
                variant="h5"
                component="div"
                fontWeight="bold"
                fontSize="18px"
              >
                ৳{monthlySale?.data?.total.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </Box>
      <Grid container spacing={2} mt={4}>
        {!monthlyPurchasesLoading ? (
          <Grid item xs={12} md={4} lg={3}>
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: 16 }} gutterBottom>
                  Monthly Purchases
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  fontWeight="bold"
                  fontSize="18px"
                >
                  ৳{monthlyPurchases?.data?.total?.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : null}
      </Grid>
    </Layout>
  );
};

export default Home;
