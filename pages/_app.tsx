import type { AppProps } from "next/app";

import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "../assets/theme";
import SEO from "../components/common/SEO";
import PWA from "../components/common/PWA";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <>
      <PWA />
      <SEO />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
export default MyApp;
