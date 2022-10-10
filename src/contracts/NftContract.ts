import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { IAuctionInfo, INftItem } from "../types";
import { uploadToWeb3Storage } from "../utils/storageHelper";
import { Erc721 } from "./interfaces";
import { getRPC } from "./utils/common";
import { getNFTAbi } from "./utils/getAbis";
import { getNFTAddress } from "./utils/getAddress";

export default class NftContract extends Erc721 {
  constructor(provider?: ethers.providers.Web3Provider) {
    const rpcProvider = new ethers.providers.JsonRpcProvider(getRPC());
    super(provider || rpcProvider, getNFTAddress(), getNFTAbi());
    if (!provider) {
      this._contract = new ethers.Contract(
        this._contractAddress,
        this._abis,
        rpcProvider
      );
    }
  }

  private _listTokenIds = async (address: string) => {
    const urls: BigNumber[] = await this._contract.listTokenIds(address);
    const ids = await Promise.all(urls.map((id) => this._toNumber(id)));
    return ids;
  };

  mintNft = async (name: string, description: string, image: string) => {
    const blob = new Blob([JSON.stringify({ name, description, image })], {
      type: "application/json",
    });

    const files = [new File([blob], `${new Date().getTime()} ${name}.json`)];
    const tokenURI = await uploadToWeb3Storage(files);
    const tx = await this._contract.mint(tokenURI);
    return this._handleTransactionResponse(tx);
  };

  getListNFT = async (address: string): Promise<INftItem[]> => {
    const ids = await this._listTokenIds(address);

    return Promise.all(
      ids.map(async (id) => {
        const tokenUrl = await this._contract.tokenURI(id);
        const obj = await (await fetch(tokenUrl)).json();

        const item: INftItem = { ...obj, id };
        return item;
      })
    );
  };

  getNftInfo = async (nfts: Array<any>) => {
    return Promise.all(
      nfts.map(async (o: any) => {
        const tokenUrl = await this._contract.tokenURI(o.tokenId);
        const {
          data: { image, name, description },
        } = await axios.get(tokenUrl);

        const item: INftItem = {
          image,
          description,
          name,
          id: o.tokenId,
          author: o.author,
          price: o.price,
        };
        return item;
      })
    );
  };

  getNftAuctionInfo = async (nftsAuctions: IAuctionInfo[]) => {
    return Promise.all(
      nftsAuctions.map(async (o: IAuctionInfo) => {
        const tokenUrl = await this._contract.tokenURI(o.tokenId);
        const { data } = await axios.get(tokenUrl);
        const item: IAuctionInfo = { ...o, ...data, id: o.tokenId };
        return item;
      })
    );
  };
}
