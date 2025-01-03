import React, { useState } from 'react';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { TransactionConfirmation } from '../common/TransactionConfirmation';

export function NFTMinting({ content, metadata, onComplete }) {
  const { nftContract, transactionManager } = useBlockchain();
  const [transactionHash, setTransactionHash] = useState(null);
  const [error, setError] = useState(null);

  const handleMinting = async () => {
    try {
      // Create NFT minting transaction
      const transaction = await nftContract.createMintTransaction(
        content,
        metadata
      );
      
      // Submit transaction
      const hash = await transactionManager.submitTransaction(transaction);
      setTransactionHash(hash);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleConfirmation = (status) => {
    if (onComplete) {
      onComplete(status);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {!transactionHash && (
        <button
          onClick={handleMinting}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Mint NFT
        </button>
      )}

      {transactionHash && (
        <TransactionConfirmation
          hash={transactionHash}
          onConfirmed={handleConfirmation}
        />
      )}
    </div>
  );
}