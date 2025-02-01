import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Blockchain } from '../blockchain/Blockchain';
import { ContentManager } from '../content/ContentManager';
import { RoyaltyContract } from '../contracts/RoyaltyContract';
import { LicenseContract } from '../contracts/LicenseContract';
import { NFTContract } from '../contracts/NFTContract';

// Define tipos para los pallets
interface BalancesPallet {
  getBalance: (account: string) => Promise<number>;
  getTransactionHistory: (account: string) => Promise<any[]>; // Ajusta el tipo según lo necesario
}

interface StakingPallet {
  stakeAmount: (amount: number) => Promise<void>;
  getStakingHistory: (account: string) => Promise<any[]>;
}

interface NFTPallet {
  getTokensByOwner(account: string | null): unknown;
  transferNFT(account: string, toAddress: string, id: string): unknown;
  getNFTs: (account: string) => Promise<any[]>;
  mintNFT: (data: any) => Promise<void>;
}

// Define tipos para el contexto
interface BlockchainContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  blockchain: Blockchain;
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  contentManager: ContentManager;
  royaltyContract: RoyaltyContract;
  licenseContract: LicenseContract;
  nftContract: NFTContract;
  balancesPallet: BalancesPallet;
  stakingPallet: StakingPallet;
  nftPallet: NFTPallet;
}

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Define las funciones de los pallets
  const balancesPallet: BalancesPallet = {
    getBalance: async (account: string) => {
      console.log(`Obteniendo balance para la cuenta: ${account}`);
      return 100; // Valor de ejemplo
    },
    getTransactionHistory: async (account: string) => {
      console.log(`Obteniendo historial de transacciones para: ${account}`);
      return []; // Valor de ejemplo
    },
  };

  const stakingPallet: StakingPallet = {
    stakeAmount: async (amount: number) => {
      console.log(`Haciendo stake de: ${amount}`);
    },
    getStakingHistory: async (account: string) => {
      console.log(`Obteniendo historial de staking para: ${account}`);
      return []; // Valor de ejemplo
    },
  };

  const nftPallet: NFTPallet = {
    getNFTs: async (account: string) => {
      console.log(`Obteniendo NFTs para la cuenta: ${account}`);
      return []; // Valor de ejemplo
    },
    mintNFT: async (data: any) => {
      console.log(`Minteando NFT con datos:`, data);
    },
    getTokensByOwner: function (_account: string | null): unknown {
      throw new Error('Function not implemented.');
    },
    transferNFT: function (_account: string, _toAddress: string, _id: string): unknown {
      throw new Error('Function not implemented.');
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await blockchain.connect();
        const accounts = await blockchain.getAccounts();

        if (accounts.length > 0) {
          const selectedAccount = accounts[0];
          setAccount(selectedAccount);
          localStorage.setItem('userAccount', selectedAccount);
          setIsAuthenticated(true); // Marca la cuenta como autenticada
        } else {
          setIsAuthenticated(false); // Si no hay cuenta, no autenticado
        }
      } catch (error) {
        console.error('Failed to initialize blockchain:', error);
        setIsAuthenticated(false);
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
    balancesPallet,
    stakingPallet,
    nftPallet,
    isAuthenticated,
    setIsAuthenticated,
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
