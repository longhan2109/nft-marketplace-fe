import { Button, HStack, Image, Text } from "@chakra-ui/react";
import React from "react";
import { numberFormat, showSortAddress } from "../utils";

interface WalletInfoProps {
  address?: string;
  amount: number;
}

export default function WalletInfo({ address, amount }: WalletInfoProps) {
  return (
    <Button variant="outline" ml="10px">
      <HStack>
        <Text>{showSortAddress(address)}</Text>
        <Image src="/bnb.png" w="25px" alt="bnb" ml="20px" />
        <Text>{numberFormat(amount)}</Text>
      </HStack>
    </Button>
  );
}
