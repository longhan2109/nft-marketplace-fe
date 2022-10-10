import axios from "axios";
import { ethers } from "ethers";
import { uploadToWeb3Storage } from "../utils/storageHelper";
import { Erc721 } from "./interfaces";
import { getRPC } from "./utils/common";
import { getNftMarketAbi } from "./utils/getAbis";
import { getNftMarketAddress } from "./utils/getAddress";

export default class NftMarketContract extends Erc721 {
  constructor(provider?: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(getRPC());
    super(provider || rpcProvider, getNftMarketAddress(), getNftMarketAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  mintNft = async (
    name: string,
    description: string,
    image: string,
    price: number
  ) => {
    const blob = new Blob([JSON.stringify({ name, description, image })], {
      type: "application/json",
    });

    const files = [new File([blob], `nft-${name}.json`)];
    const nftAttributeUpdated = await uploadToWeb3Storage(files);
    await this.createOrResellNft(nftAttributeUpdated as string, price);
  };

  createOrResellNft = async (url: string, price: number, tokenId?: string) => {
    const formattedPrice = this._numberToEth(price);
    const tx = !tokenId
      ? await this._contract.createToken(url, formattedPrice)
      : await this._contract.resellToken(tokenId, formattedPrice);
    return this._handleTransactionResponse(tx);
  };

  buyNft = async (tokenId: string, price: number) => {
    const tx = await this._contract.createMarketSale(tokenId, {
      value: this._numberToEth(price),
    });
    return this._handleTransactionResponse(tx);
  };

  fetchNfts = async () => {
    const data = await this._contract.fetchMarketItems();
    const items = await Promise.all(
      data.map(
        async ({
          tokenId,
          seller,
          owner,
          price: unformattedPrice,
        }: {
          tokenId: string;
          seller: string;
          owner: string;
          price: number;
        }) => {
          const tokenURI = await this._contract.tokenURI(tokenId);

          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);

          return {
            price: this._numberToEth(unformattedPrice),
            tokenId: parseInt(tokenId),
            seller,
            owner,
            image,
            name,
            description,
            tokenURI,
          };
        }
      )
    );
    return items;
  };

  fetchOwnedOrListedNFTs = async (isOwned: boolean) => {
    const data = isOwned
      ? await this._contract.fetchMyNFTs()
      : await this._contract.fetchItemsListed();
    const items = await Promise.all(
      data.map(
        async ({
          tokenId,
          seller,
          owner,
          price: unformattedPrice,
        }: {
          tokenId: string;
          seller: string;
          owner: string;
          price: number;
        }) => {
          const tokenURI = await this._contract.tokenURI(tokenId);

          const {
            data: { image, name, description },
          } = await axios.get(tokenURI);

          return {
            price: this._numberToEth(unformattedPrice),
            tokenId: parseInt(tokenId),
            seller,
            owner,
            image,
            name,
            description,
            tokenURI,
          };
        }
      )
    );
    return items;
  };
}
