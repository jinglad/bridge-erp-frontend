import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
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
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Customers, getCustomers } from "../apis/customer-service";
import { createOrder } from "../apis/order-service";
import { getAndSearchProduct, Product, Products } from "../apis/product-service";
import AddCustomerDialog from "../components/AddCustomerDialog";
import Layout from "../components/Layout/Layout";
import PaymentDetailsDialog from "../components/PaymentDetailsDialog";

type Props = {};

function Sales({}: Props) {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const addToCart = (product: Product) => {
    const item = cartItems.findIndex((item) => item._id === product._id);

    if (item !== -1) {
      const newCartItems = [...cartItems];
      newCartItems[item].qty += 1;
      setCartItems(newCartItems);

      return;
    }

    setCartItems([...cartItems, { ...product, sell_price: product.sell_price ?? 20, qty: product.qty ?? 20 }]);
  };

  const deleteItemFromCart = (id: string) => {
    const newCart = cartItems.filter((c) => c._id !== id);
    setCartItems(newCart);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } = useInfiniteQuery(
    ["searchedProducts", productName, brandName, categoryName],
    getAndSearchProduct,
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length === lastPage.totalPages) {
          return undefined;
        } else {
          return pages.length;
        }
      },
    }
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.refetchQueries("searchedProducts", { active: true });
  }, [queryClient, productName, brandName, categoryName]);

  const getBrandFormattedData = (data: InfiniteData<Products> | undefined) => {
    const brands = data?.pages.flatMap((page) => page.products.map((product) => product.brand));
    return [...new Set(brands)];
  };

  const getProductFormattedData = (data: InfiniteData<Products> | undefined) => {
    const productName = data?.pages.flatMap((page) => page.products.map((product) => product.name));
    return [...new Set(productName)];
  };

  const getCategoryFormattedData = (data: InfiniteData<Products> | undefined) => {
    const categoryName = data?.pages.flatMap((page) => page.products.map((product) => product.category));
    return [...new Set(categoryName)];
  };

  const [customerName, setCustomerName] = useState("");

  const { data: customerData, status: customerStatus } = useInfiniteQuery(["customers", customerName], getCustomers, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length === lastPage.totalPages) {
        return undefined;
      } else {
        return pages.length;
      }
    },
  });

  const getCustomerFormattedData = (data: InfiniteData<Customers> | undefined) => {
    const customers = data?.pages.flatMap((page) => page.customer.map((c) => c.customerName));
    return [...new Set(customers)];
  };

  const onPaymentSuccess = () => {
    setCartItems([]);
    setCustomerName("");
    queryClient.refetchQueries("searchedProducts", { active: true });
    queryClient.refetchQueries("customers", { active: true });
  };

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5}>
          <Stack spacing={2}>
            <Autocomplete
              sx={{ flex: 1 }}
              loading={customerStatus === "loading"}
              options={getCustomerFormattedData(customerData)}
              onInputChange={(e, value) => {
                setCustomerName(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  value={customerName.toLowerCase()}
                  placeholder="search customer"
                  variant="outlined"
                />
              )}
            />

            <AddCustomerDialog />
          </Stack>
          <Box mt={5}>
            <Paper sx={{ width: "100%", overflow: "hidden", maxWidth: "100%" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Cost</TableCell>
                      <TableCell>Dis</TableCell>
                      <TableCell>Sub</TableCell>
                      <TableCell>LP</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <IconButton size="small" onClick={() => deleteItemFromCart(product._id)}>
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <TextField
                            onChange={(e) => {
                              setCartItems(
                                cartItems.map((item) => {
                                  if (item._id === product._id) {
                                    item.qty = Number(e.target.value);
                                  }
                                  return item;
                                })
                              );
                            }}
                            sx={{ width: "100px" }}
                            variant="outlined"
                            type="number"
                            defaultValue={product.qty}
                            value={product.qty}
                          />
                        </TableCell>
                        <TableCell>{product.sell_price ? product.sell_price : "No"}</TableCell>
                        <TableCell>{product.sell_price * product.qty}</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>{product.sell_price * product.qty}</TableCell>
                        <TableCell>{product.sell_price * product.qty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <PaymentDetailsDialog onSuccess={onPaymentSuccess} customerName={customerName} cartItems={cartItems} />
            </Paper>
          </Box>
        </Grid>
        <Grid item container spacing={1} xs={12} sm={7}>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Autocomplete
              loading={status === "loading"}
              options={getProductFormattedData(data)}
              onInputChange={(e, value) => {
                setProductName(value);
              }}
              renderInput={(params) => <TextField {...params} placeholder="search products" variant="outlined" />}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Autocomplete
              loading={status === "loading"}
              options={getCategoryFormattedData(data)}
              onInputChange={(e, value) => {
                setCategoryName(value);
              }}
              renderInput={(params) => <TextField {...params} placeholder="search category" variant="outlined" />}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Autocomplete
              loading={status === "loading"}
              options={getBrandFormattedData(data)}
              onInputChange={(e, value) => {
                setBrandName(value);
              }}
              renderInput={(params) => <TextField {...params} placeholder="search brand" variant="outlined" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sales Product
            </Typography>
          </Grid>
          <Grid item container spacing={1} xs={12}>
            {status === "loading" ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              </Grid>
            ) : (
              <Fragment>
                {data?.pages.map((group, i) => (
                  <Fragment key={i}>
                    {group?.products.map((row) => (
                      <Grid key={row._id} item xs={12} sm={12} md={12} lg={6} xl={4}>
                        <Card
                          sx={{
                            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHw%3D&w=1000&q=80"
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                              {row.name}
                            </Typography>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="h6">BDT {row.sell_price}</Typography>
                              <Typography variant="h6">QTY : {row.qty}</Typography>
                            </Stack>
                          </CardContent>
                          <CardActions>
                            <Button disabled={row.qty === 0} size="small" onClick={() => addToCart({ ...row, qty: 1 })}>
                              Add
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Fragment>
                ))}
              </Fragment>
            )}
            <Grid
              item
              xs={12}
              container
              sx={{
                justifyContent: "center",
              }}
            >
              {hasNextPage && (
                <LoadingButton
                  variant="contained"
                  loading={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  Load More
                </LoadingButton>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Sales;
