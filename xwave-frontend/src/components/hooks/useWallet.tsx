import { useState, useEffect } from 'react';

interface WalletHook {
  connect: () => void;
  disconnect: () => void;
  isConnecting: boolean;
  error: string | null;
  account: string | null;
}

export function useWallet(): WalletHook {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si ya hay una cuenta conectada al cargar el hook
    checkConnection();
  }, []);

  // Lógica personalizada para verificar si ya hay una cuenta conectada
  async function checkConnection() {
    try {
      const currentAccount = await getAccountFromPlatform();
      if (currentAccount) {
        setAccount(currentAccount); // Establecer la cuenta conectada si existe
      }
    } catch (err) {
      console.error('Error al verificar la conexión:', err);
    }
  }

  // Lógica para conectar a la billetera de la plataforma
  async function connect() {
    setIsConnecting(true);
    setError(null);
    try {
      const newAccount = await connectToPlatformWallet();
      setAccount(newAccount); // Establecer la nueva cuenta conectada
    } catch (err: any) {
      setError(err.message || 'Error al conectar a la billetera');
      console.error('Error al conectar:', err);
    } finally {
      setIsConnecting(false);
    }
  }

  // Lógica para desconectar de la billetera de la plataforma
  async function disconnect() {
    setIsConnecting(true);
    try {
      await disconnectFromPlatformWallet();
      setAccount(null); // Limpiar la cuenta después de desconectar
    } catch (err) {
      console.error('Error al desconectar:', err);
    } finally {
      setIsConnecting(false);
    }
  }

  return {
    connect,
    disconnect,
    isConnecting,
    error,
    account,
  };
}

// Función simulada para obtener la cuenta conectada desde la plataforma
async function getAccountFromPlatform(): Promise<string | null> {
  // Aquí implementas la lógica para consultar al backend de tu plataforma
  // si ya hay una sesión activa para el usuario.
  const response = await fetch('/api/wallet/session'); // Ajusta el endpoint según tu API
  if (!response.ok) {
    throw new Error('No se pudo verificar la sesión');
  }
  const data = await response.json();
  return data.account || null; // Retorna la cuenta si existe
}

// Función simulada para conectar a la billetera de la plataforma
async function connectToPlatformWallet(): Promise<string> {
  // Aquí implementas la lógica para iniciar sesión o conectar a la billetera
  const response = await fetch('/api/wallet/connect', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('No se pudo conectar a la billetera');
  }
  const data = await response.json();
  return data.account; // Retorna la cuenta conectada
}

// Función simulada para desconectar de la billetera de la plataforma
async function disconnectFromPlatformWallet(): Promise<void> {
  // Aquí implementas la lógica para cerrar sesión o desconectar
  const response = await fetch('/api/wallet/disconnect', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('No se pudo desconectar de la billetera');
  }
  console.log('Desconexión exitosa');
}
