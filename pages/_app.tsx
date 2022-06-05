import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bridge Erp</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
