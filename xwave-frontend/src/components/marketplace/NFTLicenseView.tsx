import { useBlockchain } from '../../contexts/BlockchainContext';
import { formatDate } from '../../../utils/dateUtils';

export function NFTLicenseView({ nft }) {
  const { licenseContract } = useBlockchain();
  
  if (!nft) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">License Details</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Terms & Conditions</h3>
          <div className="mt-2 space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Usage Rights:</span> {nft.license.terms.usage}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Duration:</span> {nft.license.terms.duration} days
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Transferable:</span> {nft.license.terms.transferable ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Restrictions</h3>
          <ul className="mt-2 list-disc list-inside text-gray-600">
            {nft.license.terms.restrictions.map((restriction, index) => (
              <li key={index}>{restriction}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Commercial Usage</h3>
          <p className="mt-2 text-gray-600">
            {nft.license.terms.commercialUse ? 
              'Allowed for commercial purposes' : 
              'Not available for commercial use'}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Validity</h3>
          <p className="mt-2 text-gray-600">
            Valid until: {formatDate(nft.license.expiryDate)}
          </p>
        </div>
      </div>
    </div>
  );
}