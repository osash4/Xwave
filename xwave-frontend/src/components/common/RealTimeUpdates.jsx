import React, { useEffect, useCallback } from 'react';
import { useBlockchain } from '../../contexts/BlockchainContext';

export function RealTimeUpdates({ onUpdate }) {
  const { blockchain } = useBlockchain();

  const handleUpdate = useCallback((event) => {
    switch (event.type) {
      case 'BALANCE_UPDATE':
        onUpdate({ type: 'balance', data: event.data });
        break;
      case 'NFT_TRANSFER':
        onUpdate({ type: 'nft', data: event.data });
        break;
      case 'ROYALTY_PAYMENT':
        onUpdate({ type: 'royalty', data: event.data });
        break;
      case 'LICENSE_UPDATE':
        onUpdate({ type: 'license', data: event.data });
        break;
    }
  }, [onUpdate]);

  useEffect(() => {
    if (blockchain) {
      blockchain.on('update', handleUpdate);
      return () => blockchain.off('update', handleUpdate);
    }
  }, [blockchain, handleUpdate]);

  return null;
}