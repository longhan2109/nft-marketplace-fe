import { ethers } from "ethers";
import { Erc721 } from "./interfaces";
import { RPC_URL } from "./utils/common";
import { getNFTMarketplaceAbis } from "./utils/getAbis";
import { getMarketAddress } from "./utils/getAddress";

export default class NftMarketplaceContract extends Erc721 {
  constructor(provider: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
    super(provider || rpcProvider, getMarketAddress(), getNFTMarketplaceAbis());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }
}
