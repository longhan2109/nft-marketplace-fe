import axios from "axios";
import { ethers } from "ethers";
import { IMarketItem } from "../types";

import { Erc721 } from "./interfaces";
import { RPC_URL } from "./utils/common";
import { getNFTMarketAbis } from "./utils/getAbis";
import { getNftMarketAddress } from "./utils/getAddress";

export default class NftMarketContract extends Erc721 {
  constructor(provider: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
    super(provider || rpcProvider, getNftMarketAddress(), getNFTMarketAbis());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  fetchMarketItems = async () => {
    const items = await this._contract.fetchMarketItems();
    const promises = items.map(async (item: any): Promise<IMarketItem> => {
      const { owner, tokenId, price: unformattedPrice, seller } = item;
      const tokenURI = await this._contract.tokenURI(tokenId);

      const {
        data: { image, name, description },
      } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(
        unformattedPrice.toString(),
        "ether"
      );

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    });
    const nfts = await Promise.all(promises);
    return nfts;
  };
}
