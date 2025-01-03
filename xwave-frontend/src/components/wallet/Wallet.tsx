import React, { useState } from 'react';
import { Wallet as WalletIcon } from 'lucide-react';

interface WalletData {
  balance: number;
  address: string;
}

export const Wallet: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulación de la conexión con tu propia billetera
  const handleConnectWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      // Lógica para conectar a la blockchain
      // Aquí realizarás una solicitud al backend para obtener la dirección y saldo

      const response = await fetch('http://localhost:3001/balance/0x1234567890abcdef');  // Reemplaza con la dirección de tu API
      if (!response.ok) {
        throw new Error('No se pudo obtener los datos de la billetera.');
      }

      const data = await response.json();

      setWalletData({
        balance: data.balance,
        address: '0x1234567890abcdef',  // Aquí se debe obtener dinámicamente la dirección
      });
      setWalletConnected(true);
    } catch (error) {
      setError('Hubo un problema al conectar la billetera.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectWallet = () => {
    setWalletData(null);
    setWalletConnected(false);
  };

  return (
    <div>
      {/* Botón para conectar la billetera */}
      {!walletConnected ? (
        <button onClick={handleConnectWallet} className="btn-connect-wallet">
          Connect Wallet
        </button>
      ) : (
        <button onClick={handleDisconnectWallet} className="btn-disconnect-wallet">
          Disconnect Wallet
        </button>
      )}

      {/* Mostrar la billetera solo cuando está conectada */}
      {loading && <div className="text-sm text-gray-500">Connecting...</div>}

      {error && <div className="text-sm text-red-500">{error}</div>}

      {walletConnected && walletData && (
        <div className="wallet" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <WalletIcon size={40} color="white" />
          <div>
            <h2 className="text-lg font-semibold">Wallet Connected</h2>
            <div>{`Address: ${walletData.address}`}</div>
            <div>{`Balance: ${walletData.balance} XW`}</div>
          </div>
        </div>
      )}
    </div>
  );
};
