import {
  Flex,
  Image,
  Box,
  Text,
  HStack,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { IMarketItem } from "../../../types";

interface IProps {
  item: IMarketItem;
}

const NFTItem = ({ item }: IProps) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      bg="#151D14"
      px="10px"
      py="10px"
      borderRadius="10px"
    >
      <Box position="relative">
        <Image
          src={item.image}
          alt={item.name}
          objectFit="cover"
          borderRadius="10px"
        />
        <HStack bg="rgba(0,0,0,0.4)" position="absolute" top={5} px="10px">
          <Text>ID: {item.tokenId}</Text>
        </HStack>
      </Box>
      <Text fontWeight="bold" py="10px">
        {item.name}
      </Text>
      <Text fontWeight="bold" py="10px">
        {item.description}
      </Text>
    </Flex>
  );
};

export default NFTItem;
