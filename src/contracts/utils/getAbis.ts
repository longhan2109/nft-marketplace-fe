import NFTMarketplaceAbi from "../abis/nft-marketplace.json";
import DefaultNFTAbi from "../abis/default-nft.json";
import NFTMarket from "../abis/nft-market.json";

const getNFTMarketplaceAbis = () => NFTMarketplaceAbi;
const getDefaultNFTAbis = () => DefaultNFTAbi;
const getNFTMarketAbis = () => NFTMarket;

export { getNFTMarketplaceAbis, getDefaultNFTAbis, getNFTMarketAbis };
