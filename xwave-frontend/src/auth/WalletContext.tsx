import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (window.XWaveAPI) {
        const address = await window.XWaveAPI.getWalletAddress();
        if (address) {
          setWalletAddress(address);
          localStorage.setItem('walletAddress', address);
        } else {
          console.error("No se pudo obtener la dirección de la billetera");
        }
      } else {
        console.error("API de XWave no está disponible");
      }
    } catch (error) {
      console.error("Error al conectar la billetera: ", error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem('walletAddress');
  };

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet debe usarse dentro de WalletProvider');
  }
  return context;
};
