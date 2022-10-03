import { Button } from "@chakra-ui/react";
import React from "react";

interface ConnectWalletProps {
  onConnectWallet: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnectWallet }) => {
  return (
    <Button colorScheme="teal" variant="solid" onClick={onConnectWallet}>
      Connect Wallet
    </Button>
  );
};

export default ConnectWallet;
