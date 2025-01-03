//Este componente será una vista para listar NFTs disponibles en el mercado.
import React from 'react';

interface NFTItem {
  id: string;
  name: string;
  creator: string;
  price: string;
  imageUrl: string;
}

interface NFTMarketProps {
  nfts: NFTItem[];
  onBuy: (id: string) => void;
}

export const NFTMarket: React.FC<NFTMarketProps> = ({ nfts, onBuy }) => {
  return (
    <div className="grid grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <div
          key={nft.id}
          className="border rounded shadow-lg p-4"
        >
          <img src={nft.imageUrl} alt={nft.name} className="w-full h-40 object-cover rounded" />
          <h3 className="mt-2 text-lg font-bold">{nft.name}</h3>
          <p className="text-sm text-gray-500">By {nft.creator}</p>
          <p className="mt-2 text-md font-semibold">${nft.price}</p>
          <button
            onClick={() => onBuy(nft.id)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );
};
