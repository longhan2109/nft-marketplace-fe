import { Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { ReactNode } from "react";
import { ConnectWallet } from "../components";

import { menus } from "../constants";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const onConnectWallet = async () => {};

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
              <Text mx="20px" fontSize="20px" textDecoration="underline">
                {menu.name}
              </Text>
            </a>
          </Link>
        ))}

        <ConnectWallet onConnectWallet={onConnectWallet} />
      </Flex>
      <Flex w="full" flexDirection="column" py="50px">
        {children}
      </Flex>
    </Flex>
  );
};

export default MainLayout;
