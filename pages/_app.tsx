import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";

import MainLayout from "../src/layouts";
import store from "../src/redux/store";

import theme from "../src/themes";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ChakraProvider>
      </Provider>
    </div>
  );
};

export default App;
