export interface IMenu {
  name: string;
  url: string;
}

export interface IWalletInfo {
  address: string;
  eth: number;
}

export interface IMarketItem {
  tokenId: number;
  seller: string;
  owner: string;
  price: string;
  tokenURI: string;
  description: string;
  image: string;
  name: string;
}
