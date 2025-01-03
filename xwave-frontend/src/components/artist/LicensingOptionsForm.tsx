import React, { useState } from 'react';
import { useBlockchain } from '../../contexts/BlockchainContext';

export function LicensingOptionsForm({ onSubmit }) {
  const [licenseType, setLicenseType] = useState('non-exclusive');
  const [duration, setDuration] = useState(365);
  const [commercialUse, setCommercialUse] = useState(false);
  const [transferable, setTransferable] = useState(false);
  const [restrictions, setRestrictions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type: licenseType,
      duration,
      commercialUse,
      transferable,
      restrictions
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          License Type
        </label>
        <select
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="non-exclusive">Non-Exclusive</option>
          <option value="exclusive">Exclusive</option>
          <option value="limited">Limited Use</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Duration (days)
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={commercialUse}
            onChange={(e) => setCommercialUse(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Allow Commercial Use
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={transferable}
            onChange={(e) => setTransferable(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Allow License Transfer
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save License Options
      </button>
    </form>
  );
}