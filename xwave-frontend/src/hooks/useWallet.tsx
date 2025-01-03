import { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42] // Supported networks
});

export function useWallet() {
  const { activate, account, library, deactivate } = useWeb3React();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        const isAuthorized = await injected.isAuthorized();
        if (isAuthorized) {
          await connect();
        }
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  }

  async function connect() {
    setIsConnecting(true);
    setError(null);
    try {
      await activate(injected);
    } catch (error) {
      setError(error.message);
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {
    try {
      await deactivate();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }

  return {
    connect,
    disconnect,
    isConnecting,
    error,
    account,
    library
  };
}