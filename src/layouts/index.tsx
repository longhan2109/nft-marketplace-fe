declare var window: any;
import { Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import Link from "next/link";
import React, { ReactNode, useState } from "react";

import { ConnectWallet } from "../components";
import WalletInfo from "../components/WalletInfo";
import { menus } from "../constants";
import { IWalletInfo } from "../types";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [wallet, setWallet] = useState<IWalletInfo>();
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();

  const onConnectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        undefined
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const bigBalance = await signer.getBalance();
      const ethBalance = Number.parseFloat(
        ethers.utils.formatEther(bigBalance)
      );
      setWallet({ address, eth: ethBalance });
      setWeb3Provider(provider);
    }
  };

  return (
    <Flex
      w={{ base: "full", lg: "70%" }}
      flexDirection="column"
      margin="50px auto"
    >
      <Flex w="full" alignItems="center" justifyContent="center">
        <Heading size="lg" fontWeight="bold">
          NFT Marketplace
        </Heading>
        <Spacer />
        {menus.map((menu) => (
          <Link href={menu.url} key={menu.url}>
            <a>
              <Text mx="20px" fontSize="20px">
                {menu.name}
              </Text>
            </a>
          </Link>
        ))}

        {wallet ? (
          <WalletInfo amount={wallet?.eth || 0} address={wallet?.address} />
        ) : (
          <ConnectWallet onConnectWallet={onConnectWallet} />
        )}
      </Flex>
      <Flex w="full" flexDirection="column" py="50px">
        {children}
      </Flex>
    </Flex>
  );
};

export default MainLayout;
