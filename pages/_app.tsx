import { ThemeProvider } from "@mui/material";

import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { QueryClient, QueryClientProvider } from "react-query";

import ProtectedRoute from "../components/ProtectedRoute";
import { AuthContextProvider } from "../context/AuthContext";

import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

import { ToastContainer } from "react-toastify";
import { theme } from "../theme/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

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
          </ThemeProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
