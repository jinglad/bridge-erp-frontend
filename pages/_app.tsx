import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthContextProvider } from "../context/AuthContext";
import "../styles/globals.css";
import { theme } from "../theme/theme";

function MyApp({ Component, pageProps }: AppProps) {
  const noAuthRequired = ["/login"];
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Bridge Erp</title>
      </Head>
      <AuthContextProvider>
        <ThemeProvider theme={theme}>
          {noAuthRequired.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </ThemeProvider>
      </AuthContextProvider>
    </>
  );
}

export default MyApp;
