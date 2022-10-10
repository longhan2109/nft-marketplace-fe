import NftAbis from "../abis/nft.json";
import MarketAbis from "../abis/market.json";
import NftMarketAbis from "../abis/nft-market.json";
import FlpAbis from "../abis/flp.json";

const getNFTAbi = () => NftAbis;
const getMarketAbi = () => MarketAbis;
const getNftMarketAbi = () => NftMarketAbis;
const getFlpAbi = () => FlpAbis;

export { getNFTAbi, getMarketAbi, getNftMarketAbi, getFlpAbi };
