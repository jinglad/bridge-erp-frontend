import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Router, useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthContextProvider } from "../context/AuthContext";
import NProgress from "nprogress";
import { ReactQueryDevtools } from "react-query/devtools";

import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "../styles/nprogress.css";

import { ToastContainer } from "react-toastify";
import { theme } from "../theme/theme";
import { PrintContextProvider } from "../context/PrintContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  const noAuthRequired = ["/login"];
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Bridge Erp</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <PrintContextProvider>
            <ThemeProvider theme={theme}>
              {router.pathname === "/login" ? (
                <Component {...pageProps} />
              ) : (
                <ProtectedRoute>
                  <Component {...pageProps} />
                </ProtectedRoute>
              )}
              <ToastContainer
                position="top-right"
                autoClose={8000}
                hideProgressBar={false}
                newestOnTop={false}
                draggable={false}
                closeOnClick
                pauseOnHover
              />
              <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
          </PrintContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
