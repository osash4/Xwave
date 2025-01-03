import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Blockchain } from '../blockchain/Blockchain';
import { ContentManager } from '../content/ContentManager';
import { RoyaltyContract } from '../contracts/RoyaltyContract';
import { LicenseContract } from '../contracts/LicenseContract';
import { NFTContract } from '../contracts/NFTContract';

// Define types for the context value
interface BlockchainContextType {
  blockchain: Blockchain;
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  contentManager: ContentManager;
  royaltyContract: RoyaltyContract;
  licenseContract: LicenseContract;
  nftContract: NFTContract;
  balancesPallet: any;  // Cambiar `any` por el tipo correcto si lo tienes
  stakingPallet: any;   // Cambiar `any` por el tipo correcto si lo tienes
  nftPallet: any;       // Cambiar `any` por el tipo correcto si lo tienes
}

// Create a context with the proper type or null as default
const BlockchainContext = createContext<BlockchainContextType | null>(null);

interface BlockchainProviderProps {
  children: ReactNode;
}

export function BlockchainProvider({ children }: BlockchainProviderProps): JSX.Element {
  const [blockchain] = useState(() => new Blockchain());
  const [account, setAccount] = useState<string | null>(null);
  const [contentManager] = useState(() => new ContentManager(blockchain));
  const [royaltyContract] = useState(() => new RoyaltyContract(blockchain));
  const [licenseContract] = useState(() => new LicenseContract(blockchain));
  const [nftContract] = useState(() => new NFTContract(blockchain));

  useEffect(() => {
    const init = async () => {
      try {
        // Connect to blockchain network
        await blockchain.connect();

        // Load user account if available
        const savedAccount = localStorage.getItem('userAccount');
        if (savedAccount) {
          setAccount(savedAccount);
        }
      } catch (error) {
        console.error('Failed to initialize blockchain:', error);
      }
    };

    init();
  }, [blockchain]);

  const value: BlockchainContextType = {
    blockchain,
    account,
    setAccount,
    contentManager,
    royaltyContract,
    licenseContract,
    nftContract,
    balancesPallet: blockchain.balancesPallet, // Cambiar a un tipo válido si tienes uno
    stakingPallet: blockchain.stakingPallet,   // Cambiar a un tipo válido si tienes uno
    nftPallet: blockchain.nftPallet,           // Cambiar a un tipo válido si tienes uno
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain(): BlockchainContextType {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}
