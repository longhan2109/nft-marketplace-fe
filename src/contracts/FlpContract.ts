import { ethers } from "ethers";
import { Erc20 } from "./interfaces";
import { getFlpAbi } from "./utils/getAbis";
import { getFlpAddress } from "./utils/getAddress";

export default class FLPContract extends Erc20 {
  constructor(provider: ethers.providers.Web3Provider) {
    super(provider, getFlpAddress(), getFlpAbi());
  }
}
