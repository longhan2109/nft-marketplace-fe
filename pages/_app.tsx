import "../styles/globals.css";
import { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";

import Header from "../components/Header";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <Header />
        <Component {...pageProps} />
      </MoralisProvider>
    </div>
  );
};

export default App;
