import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  Textarea,
  useBoolean,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ProcessingModal from "../../components/ProcessingModal";
import NftContract from "../../contracts/NftContract";
import { useAppSelector } from "../../redux/hooks";
import img from "../../../public/usdt.png";

import { uploadToWeb3Storage } from "../../utils/storageHelper";
import { getToast } from "../../utils";

const CreateNftView = () => {
  const { web3Provider, wallet } = useAppSelector((state) => state.account);
  const [isProcessing, setIsProcessing] = useBoolean();
  const router = useRouter();
  const toast = useToast();

  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onDrop = async (acceptedFile: any) => {
    if (!web3Provider || !wallet) {
      return toast(getToast("Please connect the wallet"));
    }
    setPreview(window.URL.createObjectURL(acceptedFile[0]));
  };

  const handleName = (e: any) => {
    const inputValue = e.target.value;
    setName(inputValue);
  };

  const handleDescription = (e: any) => {
    const inputValue = e.target.value;
    setDescription(inputValue);
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*" as any,
  });

  const handleCreateNft = async () => {
    if (!web3Provider || !wallet) {
      return toast(getToast("Please connect the wallet"));
    }
    setIsProcessing.on();
    try {
      const imageUrl = await uploadToWeb3Storage(acceptedFiles);
      if (!imageUrl) {
        return toast(getToast("Error on upload NFT to storage"));
      }
      toast(getToast("Uploaded to storage", "success", "Notice"));
      const nftContract = new NftContract(web3Provider);
      await nftContract.mintNft(name, description, imageUrl);
      toast(getToast("Minted successfully", "success", "Notice"));
      router.push("/market");
    } catch (error) {
      console.log(error);
    }
    setIsProcessing.off();
  };

  return (
    <Flex direction="column" w="full">
      <Heading size="md" marginBottom={10}>
        Create NFT
      </Heading>

      {preview ? (
        <Stack spacing={8} marginTop={8} w="full" direction="row">
          <Box p={5} borderWidth="1px">
            <VStack>
              <Image
                src={preview}
                alt="nft image"
                width={300}
                height={300} // Revoke data uri after image is loaded
                onLoad={() => {
                  window.URL.revokeObjectURL(preview);
                }}
              />
              <Text>{acceptedFiles[0].name}</Text>
            </VStack>
          </Box>
          <Box w="100%" p={5} borderWidth="1px">
            <VStack align="flex-start">
              <Heading size="sm">Attributes</Heading>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={name} onChange={handleName} type="text" />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={handleDescription}
                  placeholder="Here is a sample placeholder"
                  size="sm"
                />
              </FormControl>
              <Button onClick={handleCreateNft}>Create NFT</Button>
            </VStack>
          </Box>
        </Stack>
      ) : (
        <div {...getRootProps({ className: "dropzone" })}>
          <Box shadow={1} className="mb-3" w={"100%"} p={5} borderWidth="1px">
            <VStack
              justify="center"
              boxShadow={1}
              shouldWrapChildren
              height={200}
              className="mt-3"
              w="full"
            >
              <input {...getInputProps()} />
              <Heading justifyContent="center" textAlign="center" fontSize="xl">
                Chose file of drop here
              </Heading>
            </VStack>
          </Box>
        </div>
      )}
      <ProcessingModal isOpen={isProcessing} onClose={() => {}} />
    </Flex>
  );
};

export default CreateNftView;
