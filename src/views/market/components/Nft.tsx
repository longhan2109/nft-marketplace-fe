import {
  Flex,
  Image,
  Box,
  Text,
  HStack,
  SimpleGrid,
  Button,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import { ActionType, Clarity, INftItem, ModalActionType } from "../../../types";
import { numberFormat } from "../../../utils";

interface IProps {
  item: INftItem;
  index: number;
  isTransfer?: boolean;
  isUnList?: boolean;
  isList?: boolean;
  isAuction?: boolean;
  isAuthor: boolean;
  onAction?: (action: ActionType) => void;
}

const fixNonImage =
  "https://bafybeics6xapuenralcaao33xyxhi5qppfjbh3fb7rwfle6n4q53e4wcim.ipfs.w3s.link/ape-2.png";

export default function Nft({
  item,
  index,
  isTransfer,
  isAuction,
  isList,
  isUnList,
  isAuthor,
  onAction,
}: IProps) {
  return (
    <VStack
      justify="space-between"
      bg="#151D14"
      px="10px"
      py="10px"
      borderRadius="10px"
    >
      <Box position="relative">
        <Image
          src={item.image || fixNonImage}
          alt={item.name}
          borderRadius="10px"
          boxSize="200px"
          objectFit="cover"
          height={200}
        />

        {item.id && (
          <HStack bg="rgba(0,0,0,0.4)" position="absolute" top={5} px="10px">
            <Text>ID: {item.id.toString().padStart(5, "0")}</Text>
          </HStack>
        )}
        <VStack w="full" alignItems="flex-start">
          <Text
            fontWeight="bold"
            py="10px"
            fontSize="20px"
            textTransform="uppercase"
            letterSpacing="5px"
          >
            {item.name}
          </Text>
          <Text py="8px">{item?.description || "Long NFT"}</Text>
        </VStack>
      </Box>

      <VStack w="full">
        <HStack w="full">
          <Text color="#fedf5680" fontWeight="bold" fontSize="14px">
            Price:
          </Text>
          <Spacer />
          <Text color="#fedf56" fontWeight="bold">
            {numberFormat(item.price || 0)} FLP
          </Text>
        </HStack>
        {isList && (
          <>
            <Button
              w="full"
              mt="10px"
              onClick={() => onAction && onAction("LIST")}
            >
              List
            </Button>
            <Button
              w="full"
              mt="10px"
              onClick={() => onAction && onAction("TRANSFER")}
            >
              Transfer
            </Button>
          </>
        )}
        {isUnList && (
          <Button
            w="full"
            mt="10px"
            onClick={() => onAction && onAction(isAuthor ? "UNLIST" : "BUY")}
          >
            {isAuthor ? "UnList" : "Buy"}
          </Button>
        )}
      </VStack>
    </VStack>
  );
}
