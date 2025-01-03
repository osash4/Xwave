import React, { useState } from 'react';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { PaymentProcessor } from './PaymentProcessor';
import { TransactionStatus } from '../common/TransactionStatus';
import { ConfirmationScreen } from '../common/ConfirmationScreen';

export function NFTPurchaseFlow({ nft, onComplete }) {
  const { nftContract, account } = useBlockchain();
  const [step, setStep] = useState('payment');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentComplete = async (paymentDetails) => {
    try {
      const transaction = await nftContract.purchaseNFT(
        nft.id,
        account,
        paymentDetails
      );
      setTransactionHash(transaction.hash);
      setStep('confirmation');
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {step === 'payment' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Purchase NFT</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handlePaymentMethodSelect('crypto')}
                className={`p-4 border rounded-lg ${
                  paymentMethod === 'crypto' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                Cryptocurrency
              </button>
              <button
                onClick={() => handlePaymentMethodSelect('card')}
                className={`p-4 border rounded-lg ${
                  paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                Credit Card
              </button>
            </div>
          </div>

          {paymentMethod && (
            <PaymentProcessor
              method={paymentMethod}
              amount={nft.price}
              onComplete={handlePaymentComplete}
            />
          )}
        </div>
      )}

      {step === 'processing' && (
        <TransactionStatus
          hash={transactionHash}
          onComplete={() => setStep('confirmation')}
        />
      )}

      {step === 'confirmation' && (
        <ConfirmationScreen
          title="Purchase Complete!"
          message="Your NFT has been successfully purchased"
          transactionHash={transactionHash}
          onClose={onComplete}
        />
      )}
    </div>
  );
}