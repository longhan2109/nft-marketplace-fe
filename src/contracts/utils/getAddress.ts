import { CHAIN_ID, SMART_CONTRACT_ADDRESS } from "./common";

const getAddress = (address: any) => {
  return address[CHAIN_ID];
};

export const getNFTAddress = () =>
  getAddress(SMART_CONTRACT_ADDRESS.DEFAULT_NFT);
export const getMarketAddress = () =>
  getAddress(SMART_CONTRACT_ADDRESS.NFT_MARKETPLACE);

export const getNftMarketAddress = () =>
  getAddress(SMART_CONTRACT_ADDRESS.NFT_MARKET);
