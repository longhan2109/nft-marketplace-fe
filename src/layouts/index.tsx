declare var window: any;
import { Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import Link from "next/link";
import React, { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ConnectWallet } from "../components";
import WalletInfo from "../components/WalletInfo";
import { menus } from "../constants";
import {
  setWalletInfo,
  setWeb3Provider,
} from "../redux/accounts/account.slices";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { IWalletInfo } from "../types";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { wallet } = useAppSelector((state) => state.account);

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
      const bnbBalance = Number.parseFloat(
        ethers.utils.formatEther(bigBalance)
      );
      dispatch(setWalletInfo({ address, bnb: bnbBalance }));
      dispatch(setWeb3Provider(provider));
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
          <WalletInfo amount={wallet?.bnb || 0} address={wallet?.address} />
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
