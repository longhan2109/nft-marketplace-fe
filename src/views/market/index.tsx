import { Flex, SimpleGrid } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";

import NftMarketContract from "../../contracts/NFTMarket";
import { useAppSelector } from "../../redux/hooks";
import { IMarketItem } from "../../types";
import NFTItem from "./components/NFTItem";

const MarketView = () => {
  const { wallet, web3Provider } = useAppSelector((state) => state.account);

  const [nfts, setNfts] = useState<IMarketItem[]>([]);

  const getListNft = useCallback(async () => {
    if (!web3Provider || !wallet) return;
    const marketContract = new NftMarketContract(web3Provider);
    const nfts = await marketContract.fetchMarketItems();
    setNfts(nfts);
  }, [web3Provider, wallet]);

  useEffect(() => {
    getListNft();
  }, [web3Provider, wallet]);

  return (
    <Flex w="full">
      <SimpleGrid w="full" columns={4} spacing={10}>
        {nfts.map((nft, index) => (
          <NFTItem item={nft} key={index} />
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default MarketView;
