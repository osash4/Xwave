import { useState, useEffect, useMemo } from 'react';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { WalletBalance } from './WalletBalance';
import { NFTGallery } from '../nft/NFTGalery';
import { TransactionHistory } from './TransactionHistory';
import { NFTTransferModal } from '../nft/NFTTransferModal';
import BottomNavBar from '../BottomNavBar/BottomNavBar';
import { FilterPanel } from '../common/FilterPanel';
import { Spinner } from '../common/Spinner';
import { format, isThisWeek, isThisMonth } from 'date-fns';

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
  timestamp: string;
};

type NFT = {
  id: string | null | undefined;
  imageUrl: string;
  name: string | null | undefined;
};

type FilterOption = {
  type: string;
  dateRange: string;
  amount: string;
};

export function WalletDashboard() {
  const { account, balancesPallet, nftPallet } = useBlockchain() as {
    account: string | null;
    balancesPallet: BalancesPallet;
    nftPallet: NFTPallet;
  };

  const [balance, setBalance] = useState<number>(0);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!account) {
      setError('No se ha detectado una billetera conectada.');
     return;
    }

    const websocketUrl = 'ws://127.0.0.1:8083/ws/'; // URL del WebSocket
    const socket = new WebSocket(websocketUrl);

    socket.onopen = () => {
      console.log('Conexión WebSocket abierta');
      socket.send(JSON.stringify({ type: 'subscribe', account }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'balanceUpdate') {
        setBalance(data.newBalance);
      } else if (data.type === 'nftUpdate') {
        setNfts(data.newNFTs);
      }
    };

    socket.onerror = (error) => {
      console.error('Error en WebSocket:', error);
      setError('Error al conectarse al servidor en tiempo real.');
    };

    socket.onclose = () => {
      console.log('Conexión WebSocket cerrada.');
    };

    return () => {
      socket.close();
    };
  }, [account]);

  async function loadWalletData() {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!balancesPallet || !nftPallet) {
        throw new Error('Los pallets de blockchain no están disponibles.');
      }

      const [userBalance, userNFTs, txHistory] = await Promise.all([
        balancesPallet.getBalance(account!),
        nftPallet.getTokensByOwner(account!),
        balancesPallet.getTransactionHistory(account!),
      ]);

      setBalance(userBalance);
      setNfts(userNFTs);
      setTransactions(txHistory);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos de la billetera.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (account) {
      loadWalletData();
    }
  }, [account]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = tx.hash.includes(searchQuery) || tx.type.includes(searchQuery);
      const matchesType = filters.type === 'all' || tx.type === filters.type;
      const matchesAmount =
        filters.amount === 'all' ||
        (filters.amount === 'high' ? tx.amount > 1000 : tx.amount <= 1000);
      const matchesDate =
        filters.dateRange === 'all' ||
        (filters.dateRange === 'today' && isToday(tx.timestamp)) ||
        (filters.dateRange === 'week' && isThisWeek(new Date(tx.timestamp))) ||
        (filters.dateRange === 'month' && isThisMonth(new Date(tx.timestamp)));

      return matchesSearch && matchesType && matchesAmount && matchesDate;
    });
  }, [transactions, searchQuery, filters]);

  const isToday = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  };

  const handleNFTTransfer = async (toAddress: string) => {
    if (selectedNFT && selectedNFT.id) {
      try {
        await nftPallet.transferNFT(account!, toAddress, selectedNFT.id);
        await loadWalletData();
        setIsTransferModalOpen(false);
        setSelectedNFT(null);
        setSuccessMessage('NFT transferido correctamente');
      } catch (err: any) {
        setError('Error al transferir el NFT.');
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Wallet Dashboard</h1>
      {loading && (
        <div className="text-center">
          <Spinner /> Cargando...
        </div>
      )}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <WalletBalance walletAddress={account!} balance={balance} />
            <FilterPanel
              selectedFilters={filters}
              onFilterSelect={(newFilterOption: FilterOption) => {
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  ...newFilterOption,
                }));
              }}
              options={{
                type: ['all', 'transfer', 'stake', 'reward'],
                dateRange: ['all', 'today', 'week', 'month'],
                amount: ['all', 'high', 'low'],
              }}
            />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <NFTGallery
              nfts={nfts}
              onTransfer={(nft: NFT) => {
                setSelectedNFT(nft);
                setIsTransferModalOpen(true);
              }}
            />
            <TransactionHistory transactions={filteredTransactions} filters={filters} />
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