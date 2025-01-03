import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Blockchain } from '../../blockchain/Blockchain';  // Asegúrate de que el path sea correcto
import { ContentManager } from '../../content/ContentManager';
import { RoyaltyContract } from '../../contracts/RoyaltyContract';
import { LicenseContract } from '../../contracts/LicenseContract';
import { NFTContract } from '../../contracts/NFTContract';

// Definir el tipo para el contexto Blockchain
interface BlockchainContextType {
  blockchain: Blockchain;
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  contentManager: ContentManager;
  royaltyContract: RoyaltyContract;
  licenseContract: LicenseContract;
  nftContract: NFTContract;
  balancesPallet: any;  // Define el tipo según sea necesario
  stakingPallet: any;   // Define el tipo según sea necesario
  nftPallet: any;       // Define el tipo según sea necesario
  isAuthenticated: boolean;   // Nuevo estado para la autenticación
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;  // Función para actualizar la autenticación
}

// Crear el contexto con el tipo adecuado
const BlockchainContext = createContext<BlockchainContextType | null>(null);

interface BlockchainProviderProps {
  children: ReactNode;
}

export function BlockchainProvider({ children }: BlockchainProviderProps) {
  const [blockchain] = useState(() => new Blockchain());
  const [account, setAccount] = useState<string | null>(null);
  const [contentManager] = useState(() => new ContentManager(blockchain));
  const [royaltyContract] = useState(() => new RoyaltyContract(blockchain));
  const [licenseContract] = useState(() => new LicenseContract(blockchain));
  const [nftContract] = useState(() => new NFTContract(blockchain));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);  // Estado de autenticación

  useEffect(() => {
    const init = async () => {
      try {
        // Verificar si blockchain tiene el método 'connect' y llamarlo
        if (typeof blockchain.connect === 'function') {
          await blockchain.connect();  // Conectando a la blockchain
        } else {
          console.error('El método "connect" no está definido en Blockchain');
        }

        // Cargar cuenta de usuario si está disponible
        const savedAccount = localStorage.getItem('userAccount');
        if (savedAccount) {
          setAccount(savedAccount);
          setIsAuthenticated(true);  // El usuario está autenticado si se encuentra la cuenta
        } else {
          // Si no hay cuenta guardada, establecer una cuenta predeterminada o manejar la lógica de conexión
          const userAccount = await blockchain.getAccount(); // Método para obtener cuenta desde la wallet
          if (userAccount) {
            setAccount(userAccount);
            setIsAuthenticated(true);  // El usuario está autenticado
            localStorage.setItem('userAccount', userAccount);  // Guardamos la cuenta en localStorage
          }
        }
      } catch (error) {
        console.error('Failed to initialize blockchain:', error);
      }
    };

    init();
  }, [blockchain]);

  const value = {
    blockchain,
    account,
    setAccount,
    contentManager,
    royaltyContract,
    licenseContract,
    nftContract,
    balancesPallet: blockchain.balancesPallet,
    stakingPallet: blockchain.stakingPallet,
    nftPallet: blockchain.nftPallet,
    isAuthenticated,  // Nuevo estado para la autenticación
    setIsAuthenticated,  // Función para cambiar la autenticación
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
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}
