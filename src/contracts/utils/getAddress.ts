import { CHAIN_ID, SMART_CONTRACT_ADDRESS } from "./common";

const getAddress = (address: any) => {
  return address[CHAIN_ID];
};

export const getNFTAddress = () => getAddress(SMART_CONTRACT_ADDRESS.NFT);
export const getMarketAddress = () => getAddress(SMART_CONTRACT_ADDRESS.MARKET);
export const getNftMarketAddress = () =>
  getAddress(SMART_CONTRACT_ADDRESS.NFT_MARKET);
export const getFlpAddress = () => getAddress(SMART_CONTRACT_ADDRESS.FLP);
