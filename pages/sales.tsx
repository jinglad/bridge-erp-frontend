import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box } from "@mui/system";
import { Fragment, useEffect } from "react";
import { InfiniteData, useInfiniteQuery, useQueryClient } from "react-query";
import { Customers, getCustomers } from "../apis/customer-service";
import { getAndSearchProduct, Product, Products } from "../apis/product-service";
import AddCustomerDialog from "../components/AddCustomerDialog";
import Layout from "../components/Layout/Layout";
import PaymentDetailsDialog from "../components/PaymentDetailsDialog";
import useDebounce from "../hooks/useDebounce";
import useSalesStore from "../store/salesStore";

type Props = {};

function Sales({}: Props) {
  const {
    cartItems,
    setCartItems,
    deleteItemFromCart,
    customerName,
    addToCart,
    reset,
    setCustomerName,
    productName,
    setProductName,
    brandName,
    setBrandName,
    categoryName,
    setCategoryName,
  } = useSalesStore((state: any) => ({
    cartItems: state.cartItems,
    deleteItemFromCart: state.deleteItemFromCart,
    customerName: state.customerName,
    addToCart: state.addToCart,
    reset: state.reset,
    setCartItems: state.setCartItems,
    setCustomerName: state.setCustomerName,
    productName: state.productName,
    setProductName: state.setProductName,
    brandName: state.brandName,
    setBrandName: state.setBrandName,
    categoryName: state.categoryName,
    setCategoryName: state.setCategoryName,
  }));

  const debouncedBrandNameSearchQuery = useDebounce(brandName, 500);
  const debouncedProductNameSearchQuery = useDebounce(productName, 500);
  const debouncedCategoryNameSearchQuery = useDebounce(categoryName, 500);
  const debouncedCustomerNameSearchQuery = useDebounce(customerName, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } = useInfiniteQuery(
    [
      "searchedProducts",
      debouncedProductNameSearchQuery,
      debouncedBrandNameSearchQuery,
      debouncedCategoryNameSearchQuery,
    ],
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

  const { data: customerData, status: customerStatus } = useInfiniteQuery(
    ["customers", debouncedCustomerNameSearchQuery],
    getCustomers,
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

  const getCustomerFormattedData = (data: InfiniteData<Customers> | undefined) => {
    const customers = data?.pages.flatMap((page) => page.customer.map((c) => c.customerName));
    return [...new Set(customers)];
  };

  const onPaymentSuccess = () => {
    reset();
    queryClient.refetchQueries("searchedProducts", { active: true });
    queryClient.refetchQueries("customers", { active: true });
  };

  const isAvailable = (product: Product) => {
    const c = cartItems.find((item: any) => item._id === product._id);

    if (c) {
      return c.qty < product.qty;
    }

    return true;
  };

  // console.log(productName);

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5}>
          <Box sx={{ position: "sticky", top: 70 }}>
            <Stack spacing={2}>
              <Autocomplete
                freeSolo={true}
                loading={customerStatus === "loading"}
                options={getCustomerFormattedData(customerData)}
                defaultValue={customerName}
                value={customerName}
                onChange={(e, value) => {
                  value ? setCustomerName(value) : setCustomerName("");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="search customer"
                    variant="outlined"
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                )}
              />
              <AddCustomerDialog />
            </Stack>
            <Box mt={5} sx={{ width: "100%" }}>
              <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
                <Table size="small" stickyHeader aria-label="caption table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">#</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Sub</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems?.map((product: any) => (
                      <TableRow key={product._id} hover>
                        <TableCell align="left">
                          <IconButton size="small" onClick={() => deleteItemFromCart(product._id)}>
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <TextField
                            onChange={(e) => {
                              setCartItems(
                                cartItems.map((item: any) => {
                                  if (item._id === product._id) {
                                    item.qty = Number(e.target.value);
                                  }
                                  return item;
                                })
                              );
                            }}
                            sx={{ maxWidth: "100px", minWidth: "70px" }}
                            inputProps={{
                              min: 1,
                              max: product.available,
                            }}
                            variant="outlined"
                            type="number"
                            value={Number(product.qty).toString()}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            onChange={(e) => {
                              setCartItems(
                                cartItems.map((item: any) => {
                                  if (item._id === product._id) {
                                    item.sell_price = Number(e.target.value);
                                  }
                                  return item;
                                })
                              );
                            }}
                            sx={{ maxWidth: "100px", minWidth: "70px" }}
                            inputProps={{
                              min: 1,
                            }}
                            variant="outlined"
                            type="number"
                            value={Number(product.sell_price).toString()}
                          />
                        </TableCell>
                        <TableCell>{parseFloat((product.sell_price * product.qty).toString()).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <PaymentDetailsDialog onSuccess={onPaymentSuccess} customerName={customerName} cartItems={cartItems} />
            </Box>
          </Box>
        </Grid>
        <Grid item container spacing={1} xs={12} sm={7}>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Autocomplete
              freeSolo={true}
              loading={status === "loading"}
              options={getProductFormattedData(data)}
              disablePortal
              onChange={(e, value) => {
                value ? setProductName(value) : setProductName("");
              }}
              value={productName}
              renderInput={(params) => (
                <TextField
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="search product"
                  variant="outlined"
                  {...params}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Autocomplete
              freeSolo={true}
              loading={status === "loading"}
              options={getCategoryFormattedData(data)}
              disablePortal
              onChange={(e, value) => {
                value ? setCategoryName(value) : setCategoryName("");
              }}
              value={categoryName}
              renderInput={(params) => (
                <TextField
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="search category"
                  variant="outlined"
                  {...params}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Autocomplete
              loading={status === "loading"}
              options={getBrandFormattedData(data)}
              disablePortal
              onChange={(e, value) => {
                value ? setBrandName(value) : setBrandName("");
              }}
              value={brandName}
              renderInput={(params) => (
                <TextField
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="search brand"
                  variant="outlined"
                  {...params}
                />
              )}
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
                            cursor: row.qty <= 0 ? "not-allowed" : !isAvailable(row) ? "not-allowed" : "pointer",
                          }}
                          onClick={() =>
                            row.qty <= 0
                              ? null
                              : !isAvailable(row)
                              ? null
                              : addToCart({
                                  ...row,
                                  qty: 1,
                                  available: row.qty,
                                })
                          }
                        >
                          {/* {row.image ? (
                            <CardMedia
                              component="img"
                              height="200"
                              image={`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/${row.image}`}
                            />
                          ) : (
                            <CardMedia
                              component="img"
                              height="200"
                              image="/placeholder-image.png"
                            />
                          )} */}
                          <CardContent sx={{ padding: "8px" }}>
                            <Typography variant="h6" component="div">
                              {row.name}
                            </Typography>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography sx={{ lineHeight: 1 }} variant="h6">
                                ৳{row.sell_price}
                              </Typography>
                              <Typography sx={{ lineHeight: 1 }} variant="h6">
                                Qty {row.qty}
                              </Typography>
                            </Stack>
                          </CardContent>
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
