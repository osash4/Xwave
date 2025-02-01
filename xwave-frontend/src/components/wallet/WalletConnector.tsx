import { useWallet } from '../../hooks/useWallet';
import { WalletBalance } from './WalletBalance'; // Importa WalletBalance

export function WalletConnector() {
  const { connect, disconnect, isConnecting, error, account } = useWallet();

  return (
    <div className="flex items-center space-x-4">
      {account ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </span>
          <button
            onClick={disconnect}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={isConnecting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
      
      {/* Mostrar el balance de la billetera cuando la cuenta esté conectada */}
      {account && <WalletBalance walletAddress={account} balance={0} />} 

      {error && (
        <span className="text-sm text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
