export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "97");
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_TESTNET;

export const getRPC = () => {
  return RPC_URL;
};

export const SMART_CONTRACT_ADDRESS = {
  NFT: { 97: "0xDCc4FA7E99be2d224daA7b919E2386eBc28A755d", 56: "" },
  MARKET: { 97: "0x800C534A87390B3194713F6D1Bc9B6376CDE364C", 56: "" },
  NFT_MARKET: { 97: "0x8A52Ff7A8Ad2faD8b6242E43E0cc2839bF1DEE33", 56: "" },
  FLP: { 97: "0xB23CDfcDE6Ed8C8981c00E5ce137d9FD7219C1C9", 56: "" },
};

//hero 0xeFe14Edd8adb233784A3124F39B31367d7066E61
