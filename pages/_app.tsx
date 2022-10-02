import { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";

import Header from "../components/Header";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Header />
      <Component {...pageProps} />
    </MoralisProvider>
  );
};

export default App;
