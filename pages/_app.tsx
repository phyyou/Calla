import type { AppProps } from "next/app";

import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "../assets/theme";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList?.remove("loading");
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp;
