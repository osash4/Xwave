
export function NFTTransferModal({ isOpen, nft, onClose, onTransfer }) {
  if (!isOpen) return null;

  const handleTransfer = () => {
    const toAddress = prompt("Enter the recipient's address:");
    if (toAddress) {
      onTransfer(toAddress);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Transfer NFT</h2>
        {nft ? (
          <div>
            <p>Are you sure you want to transfer the following NFT?</p>
            <div className="my-4">
              <img src={nft.image} alt={nft.name} className="w-full h-auto mb-2" />
              <div className="font-semibold">{nft.name}</div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleTransfer}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Transfer
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p>Loading NFT details...</p>
        )}
      </div>
    </div>
  );
}
