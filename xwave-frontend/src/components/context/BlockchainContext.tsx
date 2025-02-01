import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Blockchain } from '../../blockchain/Blockchain'; // Asegúrate de que el path sea correcto
import { ContentManager } from '../../content/ContentManager';
import { RoyaltyContract } from '../../contracts/RoyaltyContract';
import { LicenseContract } from '../../contracts/LicenseContract';
import { NFTContract } from '../../contracts/NFTContract';
import { BalancesPallet } from '../pallets/balances';
import { StakingPallet } from '../pallets/staking';
import { NFTPallet } from '../pallets/nft';
import { useWallet } from '../hooks/useWallet';

interface BlockchainContextType {
  blockchain: Blockchain;
  account: string | null;
  setAccount: (account: string | null) => void;
  contentManager: ContentManager;
  royaltyContract: RoyaltyContract;
  licenseContract: LicenseContract;
  nftContract: NFTContract;
  balancesPallet: BalancesPallet;
  stakingPallet: StakingPallet;
  nftPallet: NFTPallet;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  walletAddress: string | null; 
}

const BlockchainContext = createContext<BlockchainContextType | null>(null);

interface BlockchainProviderProps {
  children: ReactNode;
}

export function BlockchainProvider({ children }: BlockchainProviderProps) {
  const { walletAddress } = useWallet();
  const [blockchain] = useState(() => new Blockchain());
  const [account, setAccount] = useState<string | null>(null);
  const [contentManager] = useState(() => new ContentManager(blockchain));
  const [royaltyContract] = useState(() => new RoyaltyContract(blockchain));
  const [licenseContract] = useState(() => new LicenseContract(blockchain));
  const [nftContract] = useState(() => new NFTContract(blockchain));
  const [balancesPallet] = useState(() => new BalancesPallet(blockchain));
  const [stakingPallet] = useState(() => new StakingPallet(blockchain));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initBlockchain = async () => {
      if (!walletAddress) return;

      try {
        if (typeof blockchain.connect === 'function') {
          await blockchain.connect();
        }

        setAccount(walletAddress);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al inicializar la blockchain:', error);
      }
    };

    initBlockchain();
  }, [blockchain, walletAddress]);

  useEffect(() => {
    const handleDisconnect = () => {
      console.log('Billetera desconectada');
      setAccount(null);
      setIsAuthenticated(false);
    };

    blockchain.on('disconnect', handleDisconnect);

    return () => {
      blockchain.off('disconnect', handleDisconnect);
    };
  }, [blockchain]);

  const value = {
    blockchain,
    account,
    setAccount,
    contentManager,
    royaltyContract,
    licenseContract,
    nftContract,
    balancesPallet,
    stakingPallet,
    nftPallet: blockchain.nftPallet,
    isAuthenticated,
    setIsAuthenticated,
    walletAddress,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain debe usarse dentro de un BlockchainProvider');
  }
  return context;
}
