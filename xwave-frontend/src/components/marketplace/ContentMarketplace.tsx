import { useState, useEffect } from 'react';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { ContentGrid } from './ContentGrid';
import { NFTMarket } from './NFTMarket';
import { LicenseStore } from './LicenseStore';
import BottomNavBar from '../BottomNavBar/BottomNavBar';
import { FilterPanel } from '../common/FilterPanel';
import { ReviewSystem } from './ReviewSystem';
import { useTheme } from '../../contexts/ThemeContext';

// Definimos los tipos para los filtros y el contenido
interface FilterOptions {
  category: string;
  priceRange: string;
  contentType: string;
  rating: string;
}

interface Content {
  id: number;
  title: string;
  creator: string;
  category: string;
  type: string;
  price: number;
  rating: number;
  imageUrl: string; // Agregamos la propiedad imageUrl
}

interface NFT {
  id: number;
  name: string;
  price: number;
  imageUrl: string; // Aseguramos que tenga imageUrl
  creator: string; // Aseguramos que tenga creator
}

export function ContentMarketplace(): JSX.Element {
  const { contentManager, nftPallet } = useBlockchain();
  const { isDarkMode } = useTheme();
  const [contents, setContents] = useState<Content[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'nft' | 'licenses'>('content');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    priceRange: 'all',
    contentType: 'all',
    rating: 'all'
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  async function loadMarketplaceData() {
    const availableContent = await contentManager.listContent();
    const availableNFTs = await nftPallet.getAvailableTokens();

    // Mapeo explícito para asegurar que el tipo sea el correcto
    const formattedContent: Content[] = availableContent.map((item: Record<string, unknown>) => ({
      id: item.id as number,
      title: item.title as string,
      creator: item.creator as string,
      category: item.category as string,
      type: item.type as string,
      price: item.price as number,
      rating: item.rating as number,
      imageUrl: item.imageUrl ? item.imageUrl as string : 'default-image-url.jpg', // Establecemos una URL predeterminada
    }));

    setContents(formattedContent); // Ahora `formattedContent` es del tipo `Content[]`

    // Mapeo de los NFTs para asegurarnos que contengan las propiedades `creator` e `imageUrl`
    const formattedNFTs: NFT[] = availableNFTs.map((nft: Record<string, unknown>) => ({
      id: nft.id as number,
      name: nft.name as string,
      price: nft.price as number,
      creator: nft.creator as string,
      imageUrl: nft.imageUrl ? nft.imageUrl as string : 'default-nft-image-url.jpg', // Establecemos una URL predeterminada
    }));

    setNfts(formattedNFTs);
  }

  const filteredContent = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category === 'all' || content.category === filters.category;
    const matchesType = filters.contentType === 'all' || content.type === filters.contentType;
    const matchesPrice = filters.priceRange === 'all' || 
                        (filters.priceRange === 'high' ? content.price > 100 : content.price <= 100);
    const matchesRating = filters.rating === 'all' || content.rating >= parseInt(filters.rating);
    
    return matchesSearch && matchesCategory && matchesType && matchesPrice && matchesRating;
  });

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Content Marketplace</h1>

      <div className="mb-8 space-y-4">
        <BottomNavBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search content..." onNavigateToSettings={function (): void {
            throw new Error('Function not implemented.');
          } } onNavigateToProfile={function (): void {
            throw new Error('Function not implemented.');
          } } onNavigateToAccount={function (): void {
            throw new Error('Function not implemented.');
          } } onConnectWallet={function (): void {
            throw new Error('Function not implemented.');
          } } onLogout={function (): void {
            throw new Error('Function not implemented.');
          } }        />

        <FilterPanel
          filters={filters}
          onChange={setFilters}
          options={{
            category: ['all', 'music', 'video', 'game'],
            priceRange: ['all', 'low', 'high'],
            contentType: ['all', 'stream', 'download'],
            rating: ['all', '1', '2', '3', '4', '5']
          }}
        />
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('content')}
            className={`${
              activeTab === 'content'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('nft')}
            className={`${
              activeTab === 'nft'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            NFT Market
          </button>
          <button
            onClick={() => setActiveTab('licenses')}
            className={`${
              activeTab === 'licenses'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Licenses
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'content' && (
          <>
            <ContentGrid 
              contents={filteredContent}
              onContentSelect={setSelectedContent}
            />
            {selectedContent && (
              <ReviewSystem
                contentId={selectedContent.id}
                onReviewSubmitted={loadMarketplaceData}
              />
            )}
          </>
        )}
        {activeTab === 'nft' && <NFTMarket nfts={nfts} />}
        {activeTab === 'licenses' && <LicenseStore licenses={[]} onPurchase={function (_id: string): void {
          throw new Error('Function not implemented.');
        } } />}
      </div>
    </div>
  );
}
