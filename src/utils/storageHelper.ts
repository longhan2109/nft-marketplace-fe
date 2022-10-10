import { Web3Storage } from "web3.storage";

export const W3S_DOMAIN = "https://w3s.link/ipfs";
// Construct with token and endpoint

export const makeStorageClient = () => {
  return new Web3Storage({
    token: `${process.env.NEXT_PUBLIC_WEB3_STORAGE_API_TOKEN}`,
  });
};

export const uploadToWeb3Storage = async (files: any) => {
  const client = makeStorageClient();
  const filename = files[0].name;
  try {
    const cid = await client.put(files);
    return `${W3S_DOMAIN}/${cid}/${filename}`;
  } catch (error) {
    console.log(error);
  }
};
