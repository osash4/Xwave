import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useWallet } from '../../hooks/useWallet';  // Mantener el hook, ya que se puede utilizar en el futuro

interface NFTTransferModalProps {
  isOpen: boolean;
  nft: { id: string; title: string } | null;
  onClose: () => void;
  onTransfer: (recipientAddress: string) => Promise<void>;
}

export const NFTTransferModal: React.FC<NFTTransferModalProps> = ({ isOpen, nft, onClose, onTransfer }) => {
  const { account } = useWallet();  // Mantener el hook para obtener la cuenta del usuario
  const [recipientAddress, setRecipientAddress] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = async () => {
    if (!recipientAddress) {
      setError('Please enter a recipient address');
      return;
    }

    try {
      await onTransfer(recipientAddress);
      setRecipientAddress('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Transfer NFT
          </Dialog.Title>

          {nft && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900">{nft.title}</h3>
              <p className="text-sm text-gray-500">ID: {nft.id}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="0x..."
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleTransfer}
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Transfer
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
