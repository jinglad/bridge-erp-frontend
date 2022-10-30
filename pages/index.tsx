import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Box } from "@mui/system";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import {
  getMonthlySales,
  getTodaySales,
  getTotalSales,
  getTotalStocks,
} from "../apis/dashboard-service";
import Layout from "../components/Layout/Layout";

const Home: NextPage = () => {
  // const { data, isLoading } = useQuery("total-sales", getTotalSales);
  const { data: totalStock, isLoading: totalStockLoading } = useQuery(
    "total-stocks",
    getTotalStocks
  );
  const { data: todaySale, isLoading: todaySaleLoading } = useQuery(
    "today-sales",
    getTodaySales
  );
  const { data: monthlySale, isLoading: monthlySaleLoading } = useQuery(
    "monthly-sales",
    getMonthlySales
  );

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
                ৳{todaySale?.today_sale}
              </Typography>
            </CardContent>
          </Card>
        ) : null}
        {!totalStockLoading ? (
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
                ৳{totalStock?.total_stock}
              </Typography>
            </CardContent>
          </Card>
        ) : null}
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
                ৳{monthlySale?.monthly_sales}
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </Box>
    </Layout>
  );
};

export default Home;
