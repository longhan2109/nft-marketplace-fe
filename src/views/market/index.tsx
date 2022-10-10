import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  useBoolean,
  useDisclosure,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import Nft from "./components/Nft";
import ListModal from "./components/ListModal";
import TransferModal from "./components/TransferModal";
import { useAppSelector } from "../../redux/hooks";
import { ActionType, INftItem, ModalActionType } from "../../types";
import NftContract from "../../contracts/NftContract";
import ProcessingModal from "../../components/ProcessingModal";
import SuccessModal from "../../components/SuccessModal";
import MarketContract from "../../contracts/MarketContract";
import FLPContract from "../../contracts/FlpContract";
import { getToast } from "../../utils";
import { useRouter } from "next/router";

export default function MarketView() {
  const { web3Provider, wallet } = useAppSelector((state) => state.account);

  const [nfts, setNfts] = useState<INftItem[]>([]);
  const [nftsListed, setNftsListed] = useState<INftItem[]>([]);

  const [nft, setNft] = useState<INftItem>();
  const [action, setAction] = useState<ActionType>();

  const [isProcessing, setIsProcessing] = useBoolean();
  const [isOpen, setIsOpen] = useBoolean();
  const [txHash, setTxHash] = useState<string>();
  const [isUnlist, setIsUnList] = useBoolean();
  const [modalType, setModalType] = useState<ModalActionType>(
    ModalActionType.LISTING
  );

  const [isOpenTransferModal, setOpenTransferModal] = useState<boolean>(false);

  const {
    isOpen: isSuccess,
    onClose: onCloseSuccess,
    onOpen: onOpenSuccess,
  } = useDisclosure();
  const toast = useToast();

  const getListNft = async () => {
    if (!web3Provider || !wallet)
      return toast(getToast("Please connect the wallet"));
    setIsProcessing.on();
    const nftContract = new NftContract(web3Provider);
    const nfts = await nftContract.getListNFT(wallet.address);
    console.log(nfts);
    console.log("get owned nft done");
    setNfts(nfts);

    const marketContract = new MarketContract(web3Provider);
    const ids = await marketContract.getNFTListedOnMarketplace();
    const listedNfts = await nftContract.getNftInfo(ids);
    console.log("get listed nft done");

    setNftsListed(listedNfts);
    setIsProcessing.off();
  };

  const getListNftCallback = useCallback(getListNft, [web3Provider, wallet]);

  useEffect(() => {
    getListNftCallback();
  }, [getListNftCallback]);

  const selectAction = async (ac: ActionType, item: INftItem) => {
    if (!web3Provider) return;
    setNft(item);
    setAction(ac);
    setIsProcessing.off();
    switch (ac) {
      case "LIST": {
        setModalType(ModalActionType.LISTING);
        setIsOpen.on();
        break;
      }
      case "UNLIST": {
        handleUnListNft(item);
        break;
      }
      case "BUY": {
        handleBuy(item);
        break;
      }
      case "TRANSFER": {
        setOpenTransferModal(true);
      }
      default:
        break;
    }
  };

  const handleListNft = async (nft: INftItem, price: number) => {
    if (!price || !web3Provider || !wallet || !nft)
      return toast(getToast("Please connect the wallet"));
    console.log(nft);
    setIsProcessing.on();
    try {
      const nftContract = new NftContract(web3Provider);
      let tx = "";
      const marketContract = new MarketContract(web3Provider);
      await nftContract.approve(marketContract._contractAddress, nft.id);
      tx = await marketContract.listNft(nft.id, price);
      setTxHash(tx);
      onOpenSuccess();
      setAction(undefined);
      setNft(undefined);
      setIsOpen.off();
      await getListNft();
    } catch (er: any) {
      toast(getToast(er));
      setIsProcessing.off();
    }
  };

  const handleBuy = async (nft: INftItem) => {
    if (!web3Provider || !nft.price)
      return toast(getToast("Please connect the wallet"));
    setIsProcessing.on();
    try {
      const marketContract = new MarketContract(web3Provider);
      const flpContract = new FLPContract(web3Provider);
      await flpContract.approve(marketContract._contractAddress, nft.price);
      const tx = await marketContract.buyNft(nft.id, nft.price);
      setTxHash(tx);
      onOpenSuccess();
      await getListNft();
    } catch (er: any) {
      toast(getToast(er));
    } finally {
      setIsProcessing.off();
      setAction(undefined);
    }
  };

  const handleUnListNft = async (nft: INftItem) => {
    if (!web3Provider || !nft.price)
      return toast(getToast("Please connect the wallet"));
    setIsUnList.on();

    try {
      const marketContract = new MarketContract(web3Provider);
      const tx = await marketContract.unListNft(nft.id);
      setTxHash(tx);
      setAction(undefined);
      setNft(undefined);
      setIsUnList.off();
      onOpenSuccess();
      await getListNft();
    } catch (error: any) {
      return toast(getToast(error));
    }
  };

  const handleTransfer = async (toAddress: string) => {
    setIsProcessing.on();
    try {
      if (!web3Provider || !nft || !wallet)
        return toast(getToast("Please connect the wallet"));

      const nftContract = new NftContract(web3Provider);
      await nftContract.approve(toAddress, nft.id);
      const tx = await nftContract.safeTransferFrom(
        wallet.address,
        toAddress,
        nft.id
      );
      setTxHash(tx);
      setOpenTransferModal(false);
      onOpenSuccess();
      await getListNft();
    } catch (error) {
      console.log(error);
      toast(getToast("Error on transfer NFT"));
    }
    setIsProcessing.off();
  };

  return (
    <Flex w="full">
      <Tabs>
        <TabList borderBottomColor="#5A5A5A" borderBottomRadius={2} mx="15px">
          <Tab
            textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            Market NFT
          </Tab>
          <Tab
            textTransform="uppercase"
            color="#5A5A5A"
            _selected={{ borderBottomColor: "white", color: "white" }}
          >
            Owned NFT
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nftsListed.map((nft, index) => (
                <Nft
                  item={nft}
                  key={index}
                  index={index}
                  isUnList
                  isAuthor={nft.author === wallet?.address}
                  onAction={(a) => selectAction(a, nft)}
                />
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid w="full" columns={4} spacing={10}>
              {nfts.map((nft, index) => (
                <Nft
                  item={nft}
                  key={index}
                  index={index}
                  isList
                  isTransfer
                  isAuthor={!!nft.author && nft.author === wallet?.address}
                  onAction={(a) => selectAction(a, nft)}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ProcessingModal isOpen={isUnlist} onClose={() => {}} />
      <ListModal
        type={modalType}
        isOpen={isOpen}
        nft={nft}
        isListing={isProcessing}
        onClose={() => setIsOpen.off()}
        onList={handleListNft}
      />

      <TransferModal
        isOpen={isOpenTransferModal}
        nft={nft}
        isTransfer={isProcessing}
        onClose={() => setOpenTransferModal(false)}
        onTransfer={(toAddress) => handleTransfer(toAddress)}
      />

      <SuccessModal
        hash={txHash}
        title="SUCCESS"
        isOpen={isSuccess}
        onClose={onCloseSuccess}
      />
    </Flex>
  );
}
