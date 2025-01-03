import { useState, useEffect, useMemo } from 'react';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { WalletBalance } from './WalletBalance';
import { NFTGallery } from '../nft/NFTGalery';
import { TransactionHistory } from './TransactionHistory';
import { NFTTransferModal } from '../nft/NFTTransferModal';
import BottomNavBar from '../BottomNavBar/BottomNavBar';
import { FilterPanel } from '../common/FilterPanel';
import { Spinner } from '../common/Spinner'; // Importar Spinner




// Definir los tipos de las funciones de los pallets
type BalancesPallet = {
  getBalance: (account: string) => Promise<number>;
  getTransactionHistory: (account: string) => Promise<Transaction[]>;
};

type NFTPallet = {
  getTokensByOwner: (account: string) => Promise<NFT[]>;
  transferNFT: (from: string, to: string, nftId: string) => Promise<void>;
};

type Transaction = {
  hash: string;
  type: string;
  amount: number;
};

type NFT = {
  id: string | null | undefined;
  imageUrl: string;  // Image URL should be a string
  name: string | number | boolean | React.ReactNode | null | undefined;
};

type FilterOption = {
  type: string;
  dateRange: string;
  amount: string;
};

export function WalletDashboard() {
  const { account, balancesPallet, nftPallet } = useBlockchain();
  const [, setBalance] = useState(0);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOption>({
    type: 'all',
    dateRange: 'all',
    amount: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);  // Indicador de carga
  const [error, setError] = useState<string | null>(null);      // Para manejar errores
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Mensaje de éxito

  useEffect(() => {
    if (account) {
      loadWalletData();
    }
  }, [account]);

  async function loadWalletData() {
    setLoading(true);
    setError(null); // Resetear el error antes de hacer la llamada
    setSuccessMessage(null); // Resetear mensaje de éxito
    try {
      // Asegurarse de que las funciones están correctamente definidas
      const userBalance = await balancesPallet.getBalance(account);
      const userNFTs = await nftPallet.getTokensByOwner(account);
      const txHistory = await balancesPallet.getTransactionHistory(account);

      setBalance(userBalance);
      setNfts(userNFTs);
      setTransactions(txHistory);
    } catch (err) {
      setError('Error al cargar los datos de la billetera');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filtrado de transacciones con `useMemo` para evitar recalculos innecesarios
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.hash.includes(searchQuery) || 
                            tx.type.includes(searchQuery);
      const matchesType = filters.type === 'all' || tx.type === filters.type;
      const matchesAmount = filters.amount === 'all' || 
                            (filters.amount === 'high' ? tx.amount > 1000 : tx.amount <= 1000);

      return matchesSearch && matchesType && matchesAmount;
    });
  }, [transactions, searchQuery, filters]);

  const handleNFTTransfer = async (toAddress: string) => {
    if (selectedNFT) {
      try {
        await nftPallet.transferNFT(account, toAddress, selectedNFT.id);
        await loadWalletData();
        setIsTransferModalOpen(false);
        setSelectedNFT(null);
        setSuccessMessage('NFT transferido correctamente');
      } catch (err) {
        setError('Error al transferir el NFT');
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Wallet Dashboard</h1>
      
      {loading && <div className="text-center"><Spinner /> Cargando...</div>} {/* Indicador de carga */}

      {error && <div className="text-red-500 text-center">{error}</div>} {/* Mensaje de error */}
      
      {successMessage && <div className="text-green-500 text-center">{successMessage}</div>} {/* Mensaje de éxito */}

      {!loading && !error && !successMessage && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <WalletBalance walletAddress={account}  /> {/* Pasando balance al componente WalletBalance */}

            <div className="space-y-4">
              <BottomNavBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar transacciones..." 
                onNavigateToSettings={() => {}}
                onNavigateToProfile={() => {}}
                onNavigateToAccount={() => {}}
                onConnectWallet={() => {}}
                onLogout={() => {}}
              />
              
              <FilterPanel
                selectedFilters={filters} // Pasa todo el estado de los filtros
                onFilterSelect={(newFilterOption: FilterOption) => {
                  setFilters(prevFilters => ({
                    ...prevFilters, // Mantén los otros valores de los filtros
                    ...newFilterOption, // Actualiza el filtro que cambió
                  }));
                }}
                options={{
                  type: ['all', 'transfer', 'stake', 'reward'],
                  dateRange: ['all', 'today', 'week', 'month'],
                  amount: ['all', 'high', 'low']
                }}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <NFTGallery 
              nfts={nfts}
              onTransfer={(nft) => {
                setSelectedNFT(nft);
                setIsTransferModalOpen(true);
              }}
            />
            
            <TransactionHistory 
              transactions={filteredTransactions}
              filters={filters}
            />
          </div>

          <NFTTransferModal
            isOpen={isTransferModalOpen}
            nft={selectedNFT}
            onClose={() => {
              setIsTransferModalOpen(false);
              setSelectedNFT(null);
            }}
            onTransfer={handleNFTTransfer}
          />
        </>
      )}
    </div>
  );
}
